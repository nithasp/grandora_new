import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { readAccessToken, verifyAccessToken } from '../modules/auth/jwt';
import { AppError } from './errors';
import { httpOf, IS_PUBLIC } from './http';

/** Every query, mutation and route needs a valid access token unless it is marked @Public(). */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const { req } = httpOf(context);
    const token = readAccessToken(req.headers.authorization);
    if (!token) throw new AppError('Access denied. No token provided.', 401, 'no_token');

    try {
      req.user = verifyAccessToken(token);
    } catch (err) {
      if ((err as Error).name === 'TokenExpiredError') {
        throw new AppError('Access token has expired.', 401, 'token_expired');
      }
      throw new AppError('Invalid token.', 401, 'token_invalid');
    }
    return true;
  }
}

@Injectable()
export class AppThrottlerGuard extends ThrottlerGuard {
  protected override getRequestResponse(context: ExecutionContext) {
    const { req, res } = httpOf(context);
    return { req, res };
  }
}
