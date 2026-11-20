import { Injectable } from '@nestjs/common';
import { UserRole } from '../../common/http';
import { DatabaseService } from '../../database/database.service';
import { Queryable } from '../../database/pool';

export type Gender = 'male' | 'female' | 'unspecified';
export type ImageSlot = 'avatar' | 'cover';

export interface User {
  id: number;
  email: string;
  role: UserRole;
  isDemo: boolean;
  isFrozen: boolean;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  description: string | null;
  country: string | null;
  city: string | null;
  gender: Gender | null;
  dateOfBirth: string | null;
  exp: number;
  avatarUrl: string | null;
  avatarKey: string | null;
  coverUrl: string | null;
  coverKey: string | null;
  facebook: string | null;
  twitter: string | null;
  instagram: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCredentials extends User {
  passwordHash: string;
  passwordVersion: number;
}

export interface NewUser {
  email: string;
  passwordHash: string;
  passwordVersion: number;
  isDemo?: boolean;
  gender?: Gender | null;
  dateOfBirth?: string | null;
}

export interface ProfileChanges {
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  description?: string | null;
  country?: string | null;
  city?: string | null;
  gender?: Gender | null;
  dateOfBirth?: string | null;
  facebook?: string | null;
  twitter?: string | null;
  instagram?: string | null;
}

// Only these columns can be written from a profile update, whatever else a request carries
const PROFILE_COLUMNS: Record<keyof ProfileChanges, string> = {
  username: 'username',
  firstName: 'first_name',
  lastName: 'last_name',
  description: 'description',
  country: 'country',
  city: 'city',
  gender: 'gender',
  dateOfBirth: 'date_of_birth',
  facebook: 'facebook',
  twitter: 'twitter',
  instagram: 'instagram',
};

const IMAGE_COLUMNS: Record<ImageSlot, { url: string; key: string }> = {
  avatar: { url: 'avatar_url', key: 'avatar_key' },
  cover: { url: 'cover_url', key: 'cover_key' },
};

const USER_FIELDS = `id, email, role, is_demo, is_frozen, username, first_name, last_name, description, country,
  city, gender, date_of_birth, exp, avatar_url, avatar_key, cover_url, cover_key, facebook, twitter, instagram,
  created_at, updated_at`;

@Injectable()
export class UsersRepository {
  constructor(private readonly db: DatabaseService) {}

  async findById(id: number, db: Queryable = this.db): Promise<User | null> {
    const { rows } = await db.query(`SELECT ${USER_FIELDS} FROM users WHERE id = $1`, [id]);
    return rows[0] ? toUser(rows[0]) : null;
  }

  async findByEmail(email: string, db: Queryable = this.db): Promise<User | null> {
    const { rows } = await db.query(`SELECT ${USER_FIELDS} FROM users WHERE LOWER(email) = LOWER($1)`, [
      email,
    ]);
    return rows[0] ? toUser(rows[0]) : null;
  }

  async findCredentials(email: string, db: Queryable = this.db): Promise<UserCredentials | null> {
    const { rows } = await db.query(
      `SELECT ${USER_FIELDS}, password_hash, password_version FROM users WHERE LOWER(email) = LOWER($1)`,
      [email],
    );
    const row = rows[0];
    if (!row) return null;
    return {
      ...toUser(row),
      passwordHash: row.password_hash as string,
      passwordVersion: Number(row.password_version),
    };
  }

  async create(input: NewUser, db: Queryable = this.db): Promise<User> {
    const { rows } = await db.query(
      `INSERT INTO users (email, password_hash, password_version, is_demo, gender, date_of_birth)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING ${USER_FIELDS}`,
      [
        input.email,
        input.passwordHash,
        input.passwordVersion,
        input.isDemo ?? false,
        input.gender ?? null,
        input.dateOfBirth ?? null,
      ],
    );
    return toUser(rows[0]!);
  }

  async updatePassword(
    id: number,
    passwordHash: string,
    version: number,
    db: Queryable = this.db,
  ): Promise<void> {
    await db.query(
      'UPDATE users SET password_hash = $2, password_version = $3, updated_at = NOW() WHERE id = $1',
      [id, passwordHash, version],
    );
  }

  async updateProfile(id: number, changes: ProfileChanges, db: Queryable = this.db): Promise<User | null> {
    const sets: string[] = [];
    const values: unknown[] = [id];
    for (const [field, column] of Object.entries(PROFILE_COLUMNS) as [keyof ProfileChanges, string][]) {
      if (changes[field] === undefined) continue;
      values.push(changes[field]);
      sets.push(`${column} = $${values.length}`);
    }
    if (sets.length === 0) return this.findById(id, db);

    const { rows } = await db.query(
      `UPDATE users SET ${sets.join(', ')}, updated_at = NOW() WHERE id = $1 RETURNING ${USER_FIELDS}`,
      values,
    );
    return rows[0] ? toUser(rows[0]) : null;
  }

  async lockImageKey(id: number, slot: ImageSlot, db: Queryable): Promise<string | null | undefined> {
    const { key } = IMAGE_COLUMNS[slot];
    const { rows } = await db.query(`SELECT ${key} AS key FROM users WHERE id = $1 FOR UPDATE`, [id]);
    return rows[0] ? ((rows[0].key as string | null) ?? null) : undefined;
  }

  async setImage(
    id: number,
    slot: ImageSlot,
    image: { url: string; key: string | null } | null,
    db: Queryable = this.db,
  ): Promise<User | null> {
    const { url, key } = IMAGE_COLUMNS[slot];
    const { rows } = await db.query(
      `UPDATE users SET ${url} = $2, ${key} = $3, updated_at = NOW() WHERE id = $1 RETURNING ${USER_FIELDS}`,
      [id, image?.url ?? null, image?.key ?? null],
    );
    return rows[0] ? toUser(rows[0]) : null;
  }

  async setFrozen(id: number, frozen: boolean, db: Queryable = this.db): Promise<void> {
    await db.query('UPDATE users SET is_frozen = $2, updated_at = NOW() WHERE id = $1', [id, frozen]);
  }
}

function toUser(row: Record<string, unknown>): User {
  return {
    id: row.id as number,
    email: row.email as string,
    role: row.role as UserRole,
    isDemo: row.is_demo as boolean,
    isFrozen: row.is_frozen as boolean,
    username: (row.username as string | null) ?? null,
    firstName: (row.first_name as string | null) ?? null,
    lastName: (row.last_name as string | null) ?? null,
    description: (row.description as string | null) ?? null,
    country: (row.country as string | null) ?? null,
    city: (row.city as string | null) ?? null,
    gender: (row.gender as Gender | null) ?? null,
    dateOfBirth: (row.date_of_birth as string | null) ?? null,
    exp: row.exp as number,
    avatarUrl: (row.avatar_url as string | null) ?? null,
    avatarKey: (row.avatar_key as string | null) ?? null,
    coverUrl: (row.cover_url as string | null) ?? null,
    coverKey: (row.cover_key as string | null) ?? null,
    facebook: (row.facebook as string | null) ?? null,
    twitter: (row.twitter as string | null) ?? null,
    instagram: (row.instagram as string | null) ?? null,
    createdAt: row.created_at as Date,
    updatedAt: row.updated_at as Date,
  };
}
