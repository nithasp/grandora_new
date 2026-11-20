import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { Queryable } from '../../database/pool';
import { BalanceChange, Balances, CURRENCIES, Currency, WALLET_COLUMN } from './currency';

export type LedgerReason =
  'topup' | 'package' | 'store_purchase' | 'redeem' | 'refund' | 'chargeback' | 'bonus';

export interface LedgerInsert {
  entryGroup: string;
  userId: number;
  currency: Currency;
  amount: number;
  balanceAfter: number;
  reason: LedgerReason;
  orderId: string | null;
  description: string;
  createdAt?: Date;
}

export interface TransactionGroupRow {
  entry_group: string;
  created_at: Date;
  reason: LedgerReason;
  description: string;
  order_id: string | null;
  lines: { currency: Currency; amount: number }[];
  method: string | null;
  amount_satang: number | null;
  amount_coins: number | null;
}

export function toBalances(row: Record<string, unknown> | undefined): Balances {
  return {
    MYGG: Number(row?.mygg_coins ?? 0),
    GRANDO: Number(row?.grando ?? 0),
    TICKET: Number(row?.tickets ?? 0),
  };
}

@Injectable()
export class WalletRepository {
  constructor(private readonly db: DatabaseService) {}

  async ensure(userId: number, db: Queryable = this.db): Promise<void> {
    await db.query('INSERT INTO wallets (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING', [userId]);
  }

  async balances(userId: number, db: Queryable = this.db): Promise<Balances> {
    const { rows } = await db.query('SELECT mygg_coins, grando, tickets FROM wallets WHERE user_id = $1', [
      userId,
    ]);
    return toBalances(rows[0]);
  }

  /**
   * One UPDATE applies every change. With requireFunds the WHERE clause also demands enough of each
   * debited currency (e.g. `mygg_coins >= 620`), so two purchases racing for the same coins cannot
   * both succeed: the loser updates 0 rows and gets null back.
   */
  async apply(
    userId: number,
    changes: BalanceChange,
    requireFunds: boolean,
    db: Queryable,
  ): Promise<Balances | null> {
    const sets: string[] = [];
    const conditions = ['user_id = $1'];
    const values: unknown[] = [userId];

    for (const currency of CURRENCIES) {
      const delta = changes[currency];
      if (!delta) continue;
      const column = WALLET_COLUMN[currency];
      values.push(delta);
      sets.push(`${column} = ${column} + $${values.length}`);
      if (requireFunds && delta < 0) {
        values.push(-delta);
        conditions.push(`${column} >= $${values.length}`);
      }
    }
    if (sets.length === 0) return this.balances(userId, db);

    const { rows } = await db.query(
      `UPDATE wallets SET ${sets.join(', ')}, updated_at = NOW()
       WHERE ${conditions.join(' AND ')}
       RETURNING mygg_coins, grando, tickets`,
      values,
    );
    return rows[0] ? toBalances(rows[0]) : null;
  }

  async insertLedger(entries: LedgerInsert[], db: Queryable): Promise<void> {
    if (entries.length === 0) return;
    const values: unknown[] = [];
    const tuples = entries.map((entry) => {
      values.push(
        entry.entryGroup,
        entry.userId,
        entry.currency,
        entry.amount,
        entry.balanceAfter,
        entry.reason,
        entry.orderId,
        entry.description,
        entry.createdAt ?? null,
      );
      const base = values.length - 9;
      const params = Array.from({ length: 8 }, (_, i) => `$${base + i + 1}`);
      return `(${params.join(', ')}, COALESCE($${base + 9}::timestamptz, NOW()))`;
    });

    await db.query(
      `INSERT INTO ledger (entry_group, user_id, currency, amount, balance_after, reason, order_id, description, created_at)
       VALUES ${tuples.join(', ')}`,
      values,
    );
  }

  async listGroups(
    userId: number,
    reasons: LedgerReason[] | null,
    limit: number,
    offset: number,
  ): Promise<TransactionGroupRow[]> {
    const { rows } = await this.db.query<TransactionGroupRow & { last_id: number }>(
      `WITH groups AS (
         SELECT entry_group,
                MAX(created_at) AS created_at,
                MIN(reason) AS reason,
                MIN(description) AS description,
                MIN(order_id::text) AS order_id,
                json_agg(json_build_object('currency', currency, 'amount', amount) ORDER BY id) AS lines,
                MAX(id) AS last_id
         FROM ledger
         WHERE user_id = $1 AND ($2::text[] IS NULL OR reason = ANY($2::text[]))
         GROUP BY entry_group
         ORDER BY last_id DESC
         LIMIT $3 OFFSET $4
       )
       SELECT g.*, o.method, o.amount_satang, o.amount_coins
       FROM groups g
       LEFT JOIN orders o ON o.id = g.order_id::uuid
       ORDER BY g.last_id DESC`,
      [userId, reasons, limit, offset],
    );
    return rows;
  }

  async countGroups(userId: number, reasons: LedgerReason[] | null): Promise<number> {
    const { rows } = await this.db.query(
      `SELECT COUNT(DISTINCT entry_group) AS total FROM ledger
       WHERE user_id = $1 AND ($2::text[] IS NULL OR reason = ANY($2::text[]))`,
      [userId, reasons],
    );
    return Number(rows[0]?.total ?? 0);
  }
}
