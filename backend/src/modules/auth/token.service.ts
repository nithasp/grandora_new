import { Injectable, Logger } from '@nestjs/common';
import { AppError } from '../../common/errors';
import { UserRole } from '../../common/http';
import { config } from '../../config/config';
import { DatabaseService } from '../../database/database.service';
import { User, UsersRepository } from '../users/users.repository';
import { signAccessToken } from './jwt';
import { RefreshTokenRepository } from './refresh-token.repository';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export type Session = TokenPair & { user: User };

const INVALID_REFRESH_TOKEN = 'Invalid or expired refresh token';

// A replay this soon after the token's own rotation is two tabs refreshing at once and is renewed;
// past the window a second use means the token was copied, and the whole session is revoked
const REUSE_GRACE_MS = 10_000;

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);

  constructor(
    private readonly refreshTokens: RefreshTokenRepository,
    private readonly users: UsersRepository,
    private readonly db: DatabaseService,
  ) {}

  async issueSession(user: { id: number; role: UserRole }): Promise<TokenPair> {
    const refreshToken = await this.refreshTokens.create(user.id, config.auth.refreshTokenExpiryMs);
    this.refreshTokens
      .deleteExpired()
      .catch((err: unknown) => this.logger.warn({ err }, 'could not clear expired refresh tokens'));
    return { accessToken: signAccessToken(user), refreshToken };
  }

  async rotateRefreshToken(token: string): Promise<Session> {
    const rotated = await this.db.transaction(async (tx) => {
      const consumed = await this.refreshTokens.consume(token, tx);
      if (!consumed) return null;

      const user = await this.users.findById(consumed.userId, tx);
      if (!user) throw new AppError(INVALID_REFRESH_TOKEN, 401, 'token_invalid');

      const refreshToken = await this.refreshTokens.create(
        user.id,
        config.auth.refreshTokenExpiryMs,
        consumed.familyId,
        tx,
      );
      return { user, accessToken: signAccessToken(user), refreshToken };
    });
    if (rotated) return rotated;

    const reused = await this.refreshTokens.findUsed(token);
    if (!reused) throw new AppError(INVALID_REFRESH_TOKEN, 401, 'token_invalid');

    const now = Date.now();
    const withinGrace = reused.usedAt !== null && now - reused.usedAt.getTime() <= REUSE_GRACE_MS;

    if (withinGrace && reused.expiresAt.getTime() > now) {
      const renewed = await this.db.transaction(async (tx) => {
        const user = await this.users.findById(reused.userId, tx);
        if (!user) return null;
        const refreshToken = await this.refreshTokens.create(
          user.id,
          config.auth.refreshTokenExpiryMs,
          reused.familyId,
          tx,
        );
        return { user, accessToken: signAccessToken(user), refreshToken };
      });
      if (renewed) return renewed;
    }

    await this.refreshTokens.deleteFamily(reused.familyId);
    this.logger.warn(
      { event: 'auth.refresh_token_reuse', userId: reused.userId },
      'refresh token reuse detected',
    );
    throw new AppError(INVALID_REFRESH_TOKEN, 401, 'token_invalid');
  }

  revokeSession(refreshToken: string): Promise<number | null> {
    return this.refreshTokens.deleteFamilyOf(refreshToken);
  }

  async revokeAllSessions(userId: number): Promise<void> {
    await this.refreshTokens.deleteAllForUser(userId);
  }
}
