import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { AppError, notFound } from '../../common/errors';
import { parse } from '../../common/validation';
import { DatabaseService } from '../../database/database.service';
import { Tx } from '../../database/pool';
import { UsersRepository } from '../users/users.repository';
import { Currency, CURRENCY_INFO } from '../wallet/currency';
import { toBalancesModel, WalletService } from '../wallet/wallet.service';
import { RedeemResultModel } from './redeem.models';

const codeSchema = z
  .string()
  .trim()
  .min(3, 'must be at least 3 characters')
  .max(40)
  .regex(/^[A-Za-z0-9_-]+$/, 'may only contain letters, numbers, - and _');

interface RedeemCodeRow {
  id: number;
  code: string;
  grant_currency: Currency;
  grant_amount: number;
  max_uses: number | null;
  uses: number;
}

const invalidCode = () => new AppError('This code is invalid or has expired', 404, 'not_found');

@Injectable()
export class RedeemService {
  constructor(
    private readonly db: DatabaseService,
    private readonly users: UsersRepository,
    private readonly wallet: WalletService,
  ) {}

  async redeem(userId: number, input: unknown): Promise<RedeemResultModel> {
    const code = parse(codeSchema, input);
    const user = await this.users.findById(userId);
    if (!user) throw notFound('User');
    if (user.isFrozen)
      throw new AppError('This account is frozen. Please contact support.', 403, 'account_frozen');

    return this.db.transaction(async (tx) => {
      const row = await this.lockCode(code, tx);
      if (!row) throw invalidCode();

      if (!user.isDemo) {
        const { rowCount } = await tx.query(
          `INSERT INTO redeem_code_uses (code_id, user_id) VALUES ($1, $2)
           ON CONFLICT (code_id, user_id) DO NOTHING`,
          [row.id, user.id],
        );
        if (!rowCount) throw new AppError('You have already redeemed this code', 409, 'conflict');

        const { rowCount: counted } = await tx.query(
          `UPDATE redeem_codes SET uses = uses + 1 WHERE id = $1 AND (max_uses IS NULL OR uses < max_uses)`,
          [row.id],
        );
        if (!counted) throw new AppError('This code has been fully redeemed', 409, 'conflict');
      }

      const balances = await this.wallet.move(tx, {
        userId: user.id,
        changes: { [row.grant_currency]: row.grant_amount },
        reason: 'redeem',
        description: `Code ${row.code}`,
      });

      const name = CURRENCY_INFO[row.grant_currency].name;
      return {
        code: row.code,
        currency: row.grant_currency,
        amount: row.grant_amount,
        message: `Redeemed ${row.grant_amount.toLocaleString('en-US')} ${name}`,
        balances: toBalancesModel(balances),
      };
    });
  }

  private async lockCode(code: string, tx: Tx): Promise<RedeemCodeRow | null> {
    const { rows } = await tx.query<RedeemCodeRow>(
      `SELECT id, code, grant_currency, grant_amount, max_uses, uses FROM redeem_codes
       WHERE UPPER(code) = UPPER($1) AND active AND (expires_at IS NULL OR expires_at > NOW())
       FOR UPDATE`,
      [code],
    );
    return rows[0] ?? null;
  }
}
