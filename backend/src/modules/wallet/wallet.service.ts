import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { z } from 'zod';
import { AppError } from '../../common/errors';
import { parse } from '../../common/validation';
import { Tx } from '../../database/pool';
import {
  BalanceChange,
  Balances,
  CURRENCIES,
  CURRENCY_INFO,
  Currency,
  formatBaht,
  formatCount,
  signedAmount,
} from './currency';
import { BalancesModel, PlayerItemModel, TransactionModel, TransactionPageModel } from './wallet.models';
import { LedgerReason, TransactionGroupRow, WalletRepository } from './wallet.repository';

export interface MoveFunds {
  userId: number;
  changes: BalanceChange;
  reason: LedgerReason;
  description: string;
  orderId?: string | null;
  requireFunds?: boolean;
  createdAt?: Date;
}

const TRANSACTION_TYPES: Record<string, LedgerReason[] | null> = {
  all: null,
  package: ['topup', 'package'],
  store: ['store_purchase'],
  redeem: ['redeem'],
  refund: ['refund', 'chargeback'],
  bonus: ['bonus'],
  subscription: [],
};

const TITLES: Record<LedgerReason, string> = {
  topup: 'Top up',
  package: 'Grando Package',
  store_purchase: 'Purchase',
  redeem: 'Redeem',
  refund: 'Refund',
  chargeback: 'Chargeback',
  bonus: 'Bonus',
};

const DEBIT_REASONS: LedgerReason[] = ['store_purchase', 'refund', 'chargeback'];

const listSchema = z.object({
  type: z.enum(Object.keys(TRANSACTION_TYPES) as [string, ...string[]]),
  page: z.number().int().min(1).max(10_000),
  pageSize: z.number().int().min(1).max(50),
});

const DISPLAY_TIME_ZONE = 'Asia/Bangkok';
const timeFormat = new Intl.DateTimeFormat('en-US', {
  timeZone: DISPLAY_TIME_ZONE,
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
});
const dateFormat = new Intl.DateTimeFormat('en-GB', {
  timeZone: DISPLAY_TIME_ZONE,
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

export const formatTimestamp = (date: Date): string =>
  `${timeFormat.format(date)} ${dateFormat.format(date)}`;

export function toBalancesModel(balances: Balances): BalancesModel {
  return { myggCoins: balances.MYGG, grando: balances.GRANDO, tickets: balances.TICKET };
}

export function toInventory(balances: Balances): PlayerItemModel[] {
  return CURRENCIES.map((currency) => ({
    item_id: currency,
    category: CURRENCY_INFO[currency].category,
    amount: balances[currency],
    name: CURRENCY_INFO[currency].name,
  }));
}

function toTransaction(row: TransactionGroupRow): TransactionModel {
  const lines = row.lines.map((line) => ({
    currency: line.currency,
    amount: Number(line.amount),
    name: CURRENCY_INFO[line.currency].name,
  }));
  const debit = DEBIT_REASONS.includes(row.reason);
  const main =
    lines.find((line) => line.currency !== 'TICKET' && (debit ? line.amount < 0 : line.amount > 0)) ??
    lines[0];
  const tickets = lines.find((line) => line.currency === 'TICKET' && line !== main);

  let point = main ? signedAmount(main.amount, main.currency as Currency) : '';
  if (tickets) point += ` · ${signedAmount(tickets.amount, 'TICKET')}`;

  let paid = '';
  if (row.amount_satang) paid = `(${formatBaht(row.amount_satang)})`;
  else if (row.amount_coins) paid = `(${formatCount(row.amount_coins)} MYGG)`;

  const createdAt = new Date(row.created_at);
  return {
    id: row.entry_group,
    type: row.reason,
    title: TITLES[row.reason],
    description: row.description,
    point,
    currency: paid,
    date: formatTimestamp(createdAt),
    createdAt: createdAt.toISOString(),
    lines,
    orderId: row.order_id,
    method: row.method,
  };
}

@Injectable()
export class WalletService {
  constructor(private readonly wallets: WalletRepository) {}

  ensureWallet(userId: number, tx?: Tx): Promise<void> {
    return this.wallets.ensure(userId, tx);
  }

  balances(userId: number, tx?: Tx): Promise<Balances> {
    return this.wallets.balances(userId, tx);
  }

  /**
   * Changes balances and writes the matching ledger rows. It must run inside the caller's
   * transaction, so the money movement and its audit trail commit or roll back together.
   */
  async move(tx: Tx, input: MoveFunds): Promise<Balances> {
    await this.wallets.ensure(input.userId, tx);
    const applied = await this.wallets.apply(input.userId, input.changes, input.requireFunds ?? false, tx);
    if (!applied) {
      const short = CURRENCIES.filter((currency) => (input.changes[currency] ?? 0) < 0)
        .map((currency) => CURRENCY_INFO[currency].name)
        .join(' and ');
      throw new AppError(`Not enough ${short || 'balance'}`, 400, 'insufficient_funds');
    }

    const entryGroup = randomUUID();
    await this.wallets.insertLedger(
      CURRENCIES.filter((currency) => input.changes[currency]).map((currency) => ({
        entryGroup,
        userId: input.userId,
        currency,
        amount: input.changes[currency]!,
        balanceAfter: applied[currency],
        reason: input.reason,
        orderId: input.orderId ?? null,
        description: input.description,
        ...(input.createdAt ? { createdAt: input.createdAt } : {}),
      })),
      tx,
    );
    return applied;
  }

  async transactions(
    userId: number,
    input: { type: string; page: number; pageSize: number },
  ): Promise<TransactionPageModel> {
    const { type, page, pageSize } = parse(listSchema, input);
    const reasons = TRANSACTION_TYPES[type] ?? null;
    if (reasons && reasons.length === 0) return { items: [], total: 0, page, pageSize };

    const [rows, total] = await Promise.all([
      this.wallets.listGroups(userId, reasons, pageSize, (page - 1) * pageSize),
      this.wallets.countGroups(userId, reasons),
    ]);
    return { items: rows.map(toTransaction), total, page, pageSize };
  }
}
