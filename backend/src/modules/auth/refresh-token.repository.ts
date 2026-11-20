import { Injectable } from '@nestjs/common';
import crypto from 'crypto';
import { DatabaseService } from '../../database/database.service';
import { Queryable } from '../../database/pool';

export interface StoredRefreshToken {
  id: number;
  userId: number;
  familyId: string;
  expiresAt: Date;
  usedAt: Date | null;
}

// Only a hash is stored, so a copy of the table cannot be replayed as live sessions
const hashToken = (token: string): string => crypto.createHash('sha256').update(token).digest('hex');

@Injectable()
export class RefreshTokenRepository {
  constructor(private readonly db: DatabaseService) {}

  async create(
    userId: number,
    expiresInMs: number,
    familyId: string = crypto.randomUUID(),
    db: Queryable = this.db,
  ): Promise<string> {
    const token = crypto.randomBytes(40).toString('hex');
    await db.query(
      'INSERT INTO refresh_tokens (user_id, token_hash, family_id, expires_at) VALUES ($1, $2, $3, $4)',
      [userId, hashToken(token), familyId, new Date(Date.now() + expiresInMs)],
    );
    return token;
  }

  // One conditional UPDATE, so when two requests race with the same token only one gets the row
  async consume(token: string, db: Queryable = this.db): Promise<StoredRefreshToken | null> {
    const { rows } = await db.query(
      `UPDATE refresh_tokens SET used_at = NOW()
       WHERE token_hash = $1 AND used_at IS NULL AND expires_at > NOW()
       RETURNING *`,
      [hashToken(token)],
    );
    return rows[0] ? toRefreshToken(rows[0]) : null;
  }

  async findUsed(token: string, db: Queryable = this.db): Promise<StoredRefreshToken | null> {
    const { rows } = await db.query(
      'SELECT * FROM refresh_tokens WHERE token_hash = $1 AND used_at IS NOT NULL',
      [hashToken(token)],
    );
    return rows[0] ? toRefreshToken(rows[0]) : null;
  }

  async deleteFamily(familyId: string, db: Queryable = this.db): Promise<void> {
    await db.query('DELETE FROM refresh_tokens WHERE family_id = $1', [familyId]);
  }

  async deleteFamilyOf(token: string, db: Queryable = this.db): Promise<number | null> {
    const { rows } = await db.query(
      `DELETE FROM refresh_tokens
       WHERE family_id = (SELECT family_id FROM refresh_tokens WHERE token_hash = $1)
       RETURNING user_id`,
      [hashToken(token)],
    );
    return rows[0] ? (rows[0].user_id as number) : null;
  }

  async deleteAllForUser(userId: number, db: Queryable = this.db): Promise<void> {
    await db.query('DELETE FROM refresh_tokens WHERE user_id = $1', [userId]);
  }

  async deleteExpired(db: Queryable = this.db): Promise<void> {
    await db.query('DELETE FROM refresh_tokens WHERE expires_at <= NOW()');
  }
}

function toRefreshToken(row: Record<string, unknown>): StoredRefreshToken {
  return {
    id: row.id as number,
    userId: row.user_id as number,
    familyId: row.family_id as string,
    expiresAt: row.expires_at as Date,
    usedAt: (row.used_at as Date | null) ?? null,
  };
}
