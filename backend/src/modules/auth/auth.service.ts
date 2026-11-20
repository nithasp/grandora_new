import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { AppError } from '../../common/errors';
import { parse } from '../../common/validation';
import { config } from '../../config/config';
import { DatabaseService } from '../../database/database.service';
import { UsersRepository } from '../users/users.repository';
import { BalanceChange, CURRENCIES } from '../wallet/currency';
import { WalletService } from '../wallet/wallet.service';
import { CURRENT_PASSWORD_VERSION, hashPassword, spendVerifyTime, verifyPassword } from './password';
import { Session, TokenService } from './token.service';

export const WELCOME_BONUS: BalanceChange = { GRANDO: 100, TICKET: 1 };

const DEMO_REFILL_BELOW = { MYGG: 1_000, GRANDO: 2_000, TICKET: 5 };
const DEMO_REFILL_TO = { MYGG: 6_140, GRANDO: 29_600, TICKET: 38 };

const INVALID_CREDENTIALS = 'The email or password is incorrect.';

const email = z.string().trim().toLowerCase().pipe(z.email('must be a valid email address').max(254));

const loginSchema = z.object({
  email,
  password: z.string().min(1, 'is required').max(128),
});

const registerSchema = z.object({
  email,
  password: z
    .string()
    .min(8, 'must be at least 8 characters')
    .max(64, 'must be at most 64 characters')
    .regex(/[0-9]/, 'must contain a number')
    .regex(/[^A-Za-z0-9]/, 'must contain a special character'),
  gender: z.enum(['male', 'female', 'unspecified']).nullish(),
  dateOfBirth: z.iso
    .date()
    .refine(
      (value) => value >= '1900-01-01' && value <= new Date().toISOString().slice(0, 10),
      'must be a real birthday',
    )
    .nullish(),
});

const demoUnavailable = () => new AppError('Demo access is not available', 404, 'not_found');

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersRepository,
    private readonly tokens: TokenService,
    private readonly wallet: WalletService,
    private readonly db: DatabaseService,
  ) {}

  async register(input: unknown): Promise<{ message: string; success: boolean }> {
    const data = parse(registerSchema, input);
    const passwordHash = await hashPassword(data.password);

    await this.db.transaction(async (tx) => {
      const user = await this.users.create(
        {
          email: data.email,
          passwordHash,
          passwordVersion: CURRENT_PASSWORD_VERSION,
          gender: data.gender ?? null,
          dateOfBirth: data.dateOfBirth ?? null,
        },
        tx,
      );
      await this.wallet.move(tx, {
        userId: user.id,
        changes: WELCOME_BONUS,
        reason: 'bonus',
        description: 'Welcome bonus',
      });
    });

    return { message: 'Account created successfully.', success: true };
  }

  async login(input: unknown): Promise<Session> {
    const { email: address, password } = parse(loginSchema, input);

    const stored = await this.users.findCredentials(address);
    if (!stored) {
      await spendVerifyTime();
      throw new AppError(INVALID_CREDENTIALS, 401, 'invalid_credentials');
    }
    if (!(await verifyPassword(password, stored.passwordHash))) {
      throw new AppError(INVALID_CREDENTIALS, 401, 'invalid_credentials');
    }

    const { passwordHash: _hash, passwordVersion: _version, ...user } = stored;
    return { user, ...(await this.tokens.issueSession(user)) };
  }

  async demo(): Promise<Session> {
    if (!config.demo.loginEnabled) throw demoUnavailable();
    const user = await this.users.findByEmail(config.demo.email);
    if (!user || !user.isDemo || user.role !== 'player') throw demoUnavailable();

    await this.refillDemoWallet(user.id);
    return { user, ...(await this.tokens.issueSession(user)) };
  }

  async refresh(refreshToken: string | null): Promise<Session> {
    if (!refreshToken) throw new AppError('Invalid or expired refresh token', 401, 'token_invalid');
    const session = await this.tokens.rotateRefreshToken(refreshToken);
    if (session.user.isDemo) await this.refillDemoWallet(session.user.id);
    return session;
  }

  async logout(refreshToken: string | null): Promise<void> {
    if (refreshToken) await this.tokens.revokeSession(refreshToken);
  }

  private async refillDemoWallet(userId: number): Promise<void> {
    await this.db.transaction(async (tx) => {
      const balances = await this.wallet.balances(userId, tx);
      const changes: BalanceChange = {};
      for (const currency of CURRENCIES) {
        if (balances[currency] < DEMO_REFILL_BELOW[currency]) {
          changes[currency] = DEMO_REFILL_TO[currency] - balances[currency];
        }
      }
      if (Object.keys(changes).length === 0) return;
      await this.wallet.move(tx, { userId, changes, reason: 'bonus', description: 'Demo balance refill' });
    });
  }
}
