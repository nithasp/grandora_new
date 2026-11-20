import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { Queryable } from '../../database/pool';
import { SpendableCurrency } from '../wallet/currency';

export type StoreCategory = 'avatars' | 'accessories' | 'equipments';

export interface StoreItem {
  id: number;
  code: string;
  name: string;
  description: string;
  category: StoreCategory;
  image: string;
  priceGrando: number | null;
  priceMygg: number | null;
  promoted: boolean;
  owned: boolean;
}

const FIELDS = `i.id, i.code, i.name, i.description, i.category, i.image, i.price_grando, i.price_mygg, i.promoted`;

@Injectable()
export class StoreRepository {
  constructor(private readonly db: DatabaseService) {}

  async list(userId: number, category: StoreCategory | null): Promise<StoreItem[]> {
    const { rows } = await this.db.query(
      `SELECT ${FIELDS}, (u.id IS NOT NULL) AS owned
       FROM store_items i
       LEFT JOIN user_items u ON u.item_id = i.id AND u.user_id = $1
       WHERE i.active AND ($2::text IS NULL OR i.category = $2)
       ORDER BY i.category, i.sort_order, i.id`,
      [userId, category],
    );
    return rows.map(toItem);
  }

  async findActive(id: number, db: Queryable = this.db): Promise<StoreItem | null> {
    const { rows } = await db.query(
      `SELECT ${FIELDS}, FALSE AS owned FROM store_items i WHERE i.id = $1 AND i.active`,
      [id],
    );
    return rows[0] ? toItem(rows[0]) : null;
  }

  async addOwnership(
    userId: number,
    itemId: number,
    currency: SpendableCurrency,
    amount: number,
    db: Queryable,
  ): Promise<boolean> {
    const { rowCount } = await db.query(
      `INSERT INTO user_items (user_id, item_id, paid_currency, paid_amount) VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, item_id) DO NOTHING`,
      [userId, itemId, currency, amount],
    );
    return (rowCount ?? 0) > 0;
  }

  async trimOwnership(userId: number, keep: number, db: Queryable = this.db): Promise<void> {
    await db.query(
      `DELETE FROM user_items WHERE user_id = $1 AND id NOT IN (
         SELECT id FROM user_items WHERE user_id = $1 ORDER BY acquired_at DESC, id DESC LIMIT $2
       )`,
      [userId, keep],
    );
  }
}

function toItem(row: Record<string, unknown>): StoreItem {
  return {
    id: row.id as number,
    code: row.code as string,
    name: row.name as string,
    description: row.description as string,
    category: row.category as StoreCategory,
    image: row.image as string,
    priceGrando: (row.price_grando as number | null) ?? null,
    priceMygg: (row.price_mygg as number | null) ?? null,
    promoted: row.promoted as boolean,
    owned: row.owned as boolean,
  };
}
