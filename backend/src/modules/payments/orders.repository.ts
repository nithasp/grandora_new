import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { Queryable } from '../../database/pool';
import { PackageGrant } from '../packages/packages.repository';

export type OrderStatus = 'pending' | 'paid' | 'failed' | 'expired' | 'refunded' | 'disputed';

export interface Order {
  id: string;
  userId: number;
  packageId: number;
  packageName: string;
  method: string;
  amountSatang: number;
  amountCoins: number;
  currency: string;
  grantCurrency: PackageGrant;
  grantAmount: number;
  bonusTickets: number;
  status: OrderStatus;
  omiseChargeId: string | null;
  authorizeUri: string | null;
  qrCodeUri: string | null;
  failureCode: string | null;
  failureMessage: string | null;
  expiresAt: Date | null;
  paidAt: Date | null;
  createdAt: Date;
}

export interface NewOrder {
  userId: number;
  packageId: number;
  method: string;
  amountSatang: number;
  amountCoins: number;
  grantCurrency: PackageGrant;
  grantAmount: number;
  bonusTickets: number;
  status: 'pending' | 'paid';
}

const withPackage = (statement: string): string => `
  WITH o AS (${statement})
  SELECT o.*, p.name AS package_name FROM o JOIN packages p ON p.id = o.package_id`;

@Injectable()
export class OrdersRepository {
  constructor(private readonly db: DatabaseService) {}

  async create(input: NewOrder, db: Queryable = this.db): Promise<Order> {
    const { rows } = await db.query(
      withPackage(`
        INSERT INTO orders (user_id, package_id, method, amount_satang, amount_coins, grant_currency,
                            grant_amount, bonus_tickets, status, paid_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::varchar, CASE WHEN $9::varchar = 'paid' THEN NOW() END)
        RETURNING *`),
      [
        input.userId,
        input.packageId,
        input.method,
        input.amountSatang,
        input.amountCoins,
        input.grantCurrency,
        input.grantAmount,
        input.bonusTickets,
        input.status,
      ],
    );
    return toOrder(rows[0]!);
  }

  async findById(id: string, db: Queryable = this.db): Promise<Order | null> {
    const { rows } = await db.query(withPackage('SELECT * FROM orders WHERE id = $1'), [id]);
    return rows[0] ? toOrder(rows[0]) : null;
  }

  async findForUser(id: string, userId: number): Promise<Order | null> {
    const { rows } = await this.db.query(withPackage('SELECT * FROM orders WHERE id = $1 AND user_id = $2'), [
      id,
      userId,
    ]);
    return rows[0] ? toOrder(rows[0]) : null;
  }

  async listForUser(userId: number, limit: number): Promise<Order[]> {
    const { rows } = await this.db.query(
      withPackage('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2'),
      [userId, limit],
    );
    return rows.map(toOrder);
  }

  async lock(id: string, db: Queryable): Promise<Order | null> {
    const { rows } = await db.query(withPackage('SELECT * FROM orders WHERE id = $1 FOR UPDATE'), [id]);
    return rows[0] ? toOrder(rows[0]) : null;
  }

  async lockByChargeId(chargeId: string, db: Queryable): Promise<Order | null> {
    const { rows } = await db.query(
      withPackage('SELECT * FROM orders WHERE omise_charge_id = $1 FOR UPDATE'),
      [chargeId],
    );
    return rows[0] ? toOrder(rows[0]) : null;
  }

  async attachCharge(
    id: string,
    charge: {
      chargeId: string;
      authorizeUri: string | null;
      qrCodeUri: string | null;
      expiresAt: string | null;
    },
    db: Queryable = this.db,
  ): Promise<void> {
    await db.query(
      `UPDATE orders SET omise_charge_id = $2, authorize_uri = $3, qr_code_uri = $4, expires_at = $5,
              last_checked_at = NOW(), updated_at = NOW()
       WHERE id = $1`,
      [id, charge.chargeId, charge.authorizeUri, charge.qrCodeUri, charge.expiresAt],
    );
  }

  /** Only a pending order can become paid, which is what stops a repeated webhook crediting twice. */
  async markPaid(id: string, chargeId: string, db: Queryable): Promise<Order | null> {
    const { rows } = await db.query(
      withPackage(`
        UPDATE orders
        SET status = 'paid', paid_at = NOW(), omise_charge_id = COALESCE(omise_charge_id, $2), updated_at = NOW()
        WHERE id = $1 AND status = 'pending'
        RETURNING *`),
      [id, chargeId],
    );
    return rows[0] ? toOrder(rows[0]) : null;
  }

  async close(
    id: string,
    status: 'failed' | 'expired',
    failureCode: string | null,
    failureMessage: string | null,
    db: Queryable = this.db,
  ): Promise<Order | null> {
    const { rows } = await db.query(
      withPackage(`
        UPDATE orders SET status = $2, failure_code = $3, failure_message = $4, updated_at = NOW()
        WHERE id = $1 AND status = 'pending'
        RETURNING *`),
      [id, status, failureCode?.slice(0, 100) ?? null, failureMessage?.slice(0, 500) ?? null],
    );
    return rows[0] ? toOrder(rows[0]) : null;
  }

  async markReversed(id: string, status: 'refunded' | 'disputed', db: Queryable): Promise<Order | null> {
    const { rows } = await db.query(
      withPackage(`
        UPDATE orders SET status = $2, updated_at = NOW()
        WHERE id = $1 AND status = 'paid'
        RETURNING *`),
      [id, status],
    );
    return rows[0] ? toOrder(rows[0]) : null;
  }

  async claimStatusCheck(id: string, minIntervalSeconds: number): Promise<boolean> {
    const { rowCount } = await this.db.query(
      `UPDATE orders SET last_checked_at = NOW()
       WHERE id = $1 AND status = 'pending'
         AND (last_checked_at IS NULL OR last_checked_at < NOW() - make_interval(secs => $2))`,
      [id, minIntervalSeconds],
    );
    return (rowCount ?? 0) > 0;
  }

  async listStalePending(limit: number): Promise<{ id: string; omiseChargeId: string }[]> {
    const { rows } = await this.db.query(
      `SELECT id, omise_charge_id FROM orders
       WHERE status = 'pending' AND omise_charge_id IS NOT NULL
         AND created_at BETWEEN NOW() - INTERVAL '7 days' AND NOW() - INTERVAL '2 minutes'
         AND (last_checked_at IS NULL OR last_checked_at < NOW() - INTERVAL '5 minutes')
       ORDER BY created_at
       LIMIT $1`,
      [limit],
    );
    return rows.map((row) => ({ id: row.id as string, omiseChargeId: row.omise_charge_id as string }));
  }
}

function toOrder(row: Record<string, unknown>): Order {
  return {
    id: row.id as string,
    userId: row.user_id as number,
    packageId: row.package_id as number,
    packageName: row.package_name as string,
    method: row.method as string,
    amountSatang: row.amount_satang as number,
    amountCoins: row.amount_coins as number,
    currency: (row.currency as string).trim(),
    grantCurrency: row.grant_currency as PackageGrant,
    grantAmount: row.grant_amount as number,
    bonusTickets: row.bonus_tickets as number,
    status: row.status as OrderStatus,
    omiseChargeId: (row.omise_charge_id as string | null) ?? null,
    authorizeUri: (row.authorize_uri as string | null) ?? null,
    qrCodeUri: (row.qr_code_uri as string | null) ?? null,
    failureCode: (row.failure_code as string | null) ?? null,
    failureMessage: (row.failure_message as string | null) ?? null,
    expiresAt: (row.expires_at as Date | null) ?? null,
    paidAt: (row.paid_at as Date | null) ?? null,
    createdAt: row.created_at as Date,
  };
}
