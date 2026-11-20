import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { notFound } from '../../common/errors';
import { parse } from '../../common/validation';
import { DatabaseService } from '../../database/database.service';
import { IncomingFile, StorageService } from '../storage/storage.service';
import { ProfileModel } from './user.models';
import { ImageSlot, ProfileChanges, User, UsersRepository } from './users.repository';

const blankToNull = (value: unknown) => (typeof value === 'string' && value.trim() === '' ? null : value);

const text = (max: number) => z.preprocess(blankToNull, z.string().trim().max(max).nullable().optional());

const today = () => new Date().toISOString().slice(0, 10);

const profileSchema = z
  .object({
    username: z.preprocess(
      blankToNull,
      z
        .string()
        .trim()
        .min(3)
        .max(30)
        .regex(/^[A-Za-z0-9_.]+$/, 'may only contain letters, numbers, dots and underscores')
        .nullable()
        .optional(),
    ),
    firstName: text(60),
    lastName: text(60),
    description: text(500),
    country: text(60),
    city: text(60),
    gender: z.preprocess(blankToNull, z.enum(['male', 'female', 'unspecified']).nullable().optional()),
    dateOfBirth: z.preprocess(
      blankToNull,
      z.iso
        .date()
        .refine((value) => value >= '1900-01-01' && value <= today(), 'must be a real birthday')
        .nullable()
        .optional(),
    ),
    facebook: text(100),
    twitter: text(100),
    instagram: text(100),
  })
  .strict();

export function displayName(user: Pick<User, 'firstName' | 'lastName' | 'username' | 'email'>): string {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
  return fullName || user.username || user.email.split('@')[0] || 'Player';
}

export function ageOn(dateOfBirth: string | null, now = new Date()): number | null {
  if (!dateOfBirth) return null;
  const [year, month, day] = dateOfBirth.split('-').map(Number);
  if (!year || !month || !day) return null;
  let age = now.getUTCFullYear() - year;
  const birthdayPassed =
    now.getUTCMonth() + 1 > month || (now.getUTCMonth() + 1 === month && now.getUTCDate() >= day);
  if (!birthdayPassed) age -= 1;
  return age >= 0 ? age : null;
}

export function toProfile(user: User): ProfileModel {
  return {
    id: user.id,
    email: user.email,
    name: displayName(user),
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    description: user.description,
    country: user.country,
    city: user.city,
    gender: user.gender,
    dateOfBirth: user.dateOfBirth,
    age: ageOn(user.dateOfBirth),
    exp: user.exp,
    avatarUrl: user.avatarUrl,
    coverUrl: user.coverUrl,
    facebook: user.facebook,
    twitter: user.twitter,
    instagram: user.instagram,
    isDemo: user.isDemo,
    isFrozen: user.isFrozen,
    createdAt: user.createdAt.toISOString(),
  };
}

@Injectable()
export class UsersService {
  constructor(
    private readonly users: UsersRepository,
    private readonly db: DatabaseService,
    private readonly storage: StorageService,
  ) {}

  findById(id: number): Promise<User | null> {
    return this.users.findById(id);
  }

  async requireUser(id: number): Promise<User> {
    const user = await this.users.findById(id);
    if (!user) throw notFound('User');
    return user;
  }

  async getProfile(id: number): Promise<ProfileModel> {
    return toProfile(await this.requireUser(id));
  }

  async updateProfile(id: number, input: unknown): Promise<ProfileModel> {
    const changes: ProfileChanges = parse(profileSchema, input);
    const updated = await this.users.updateProfile(id, changes);
    if (!updated) throw notFound('User');
    return toProfile(updated);
  }

  async replaceImage(id: number, slot: ImageSlot, file: IncomingFile | undefined): Promise<ProfileModel> {
    const stored = await this.storage.putImage(`${slot}s/${id}`, file);

    let previousKey: string | null = null;
    let updated: User | null;
    try {
      updated = await this.db.transaction(async (tx) => {
        const locked = await this.users.lockImageKey(id, slot, tx);
        if (locked === undefined) throw notFound('User');
        previousKey = locked;
        return this.users.setImage(id, slot, stored, tx);
      });
    } catch (err) {
      await this.storage.remove(stored.key);
      throw err;
    }

    await this.storage.remove(previousKey);
    return toProfile(updated!);
  }

  async removeImage(id: number, slot: ImageSlot): Promise<ProfileModel> {
    let previousKey: string | null = null;
    const updated = await this.db.transaction(async (tx) => {
      const locked = await this.users.lockImageKey(id, slot, tx);
      if (locked === undefined) throw notFound('User');
      previousKey = locked;
      return this.users.setImage(id, slot, null, tx);
    });

    await this.storage.remove(previousKey);
    return toProfile(updated!);
  }
}
