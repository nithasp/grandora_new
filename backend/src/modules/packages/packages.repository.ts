import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { Queryable } from '../../database/pool';

export type PackageGrant = 'MYGG' | 'GRANDO';

export interface Package {
  id: number;
  code: string;
  name: string;
  description: string;
  grantCurrency: PackageGrant;
  grantAmount: number;
  bonusTickets: number;
  priceSatang: number;
  priceCoins: number | null;
  image: string | null;
  badge: string | null;
  savePercent: number | null;
  theme: string;
  featured: boolean;
  game: string;
  sortOrder: number;
}

const FIELDS = `id, code, name, description, grant_currency, grant_amount, bonus_tickets, price_satang, price_coins,
  image, badge, save_percent, theme, featured, game, sort_order`;

@Injectable()
export class PackagesRepository {
  constructor(private readonly db: DatabaseService) {}

  async listActive(grantCurrency: PackageGrant | null): Promise<Package[]> {
    const { rows } = await this.db.query(
      `SELECT ${FIELDS} FROM packages
       WHERE active AND ($1::text IS NULL OR grant_currency = $1)
       ORDER BY grant_currency, sort_order, id`,
      [grantCurrency],
    );
    return rows.map(toPackage);
  }

  async findActive(id: number, db: Queryable = this.db): Promise<Package | null> {
    const { rows } = await db.query(`SELECT ${FIELDS} FROM packages WHERE id = $1 AND active`, [id]);
    return rows[0] ? toPackage(rows[0]) : null;
  }
}

function toPackage(row: Record<string, unknown>): Package {
  return {
    id: row.id as number,
    code: row.code as string,
    name: row.name as string,
    description: row.description as string,
    grantCurrency: row.grant_currency as PackageGrant,
    grantAmount: row.grant_amount as number,
    bonusTickets: row.bonus_tickets as number,
    priceSatang: row.price_satang as number,
    priceCoins: (row.price_coins as number | null) ?? null,
    image: (row.image as string | null) ?? null,
    badge: (row.badge as string | null) ?? null,
    savePercent: (row.save_percent as number | null) ?? null,
    theme: row.theme as string,
    featured: row.featured as boolean,
    game: row.game as string,
    sortOrder: row.sort_order as number,
  };
}
