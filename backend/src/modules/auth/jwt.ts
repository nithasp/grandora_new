import jwt from 'jsonwebtoken';
import { AuthUser, UserRole } from '../../common/http';
import { config } from '../../config/config';

// Pinned when signing and when verifying, so a token can't pick the algorithm it is checked with
const JWT_ALGORITHM: jwt.Algorithm = 'HS256';

export function signAccessToken(user: { id: number; role: UserRole }): string {
  return jwt.sign({ userId: user.id, role: user.role }, config.auth.tokenSecret, {
    algorithm: JWT_ALGORITHM,
    expiresIn: config.auth.accessTokenExpiry as NonNullable<jwt.SignOptions['expiresIn']>,
  });
}

export function verifyAccessToken(token: string): AuthUser {
  const decoded = jwt.verify(token, config.auth.tokenSecret, {
    algorithms: [JWT_ALGORITHM],
  }) as jwt.JwtPayload;
  if (typeof decoded.userId !== 'number') throw new jwt.JsonWebTokenError('token has no numeric userId');
  return { userId: decoded.userId, role: decoded.role === 'admin' ? 'admin' : 'player' };
}

/** The website sends the bare token, as the original API expected; "Bearer <token>" is accepted too. */
export function readAccessToken(header: string | undefined): string | null {
  if (!header) return null;
  const parts = header.trim().split(/\s+/);
  let token: string | undefined;
  if (parts.length === 2 && parts[0]?.toLowerCase() === 'bearer') token = parts[1];
  else if (parts.length === 1) token = parts[0];
  if (!token || token === 'null' || token === 'undefined') return null;
  return token;
}
