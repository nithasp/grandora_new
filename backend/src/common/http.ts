import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { Request, Response } from 'express';
import { AppError } from './errors';

export type UserRole = 'player' | 'admin';

export interface AuthUser {
  userId: number;
  role: UserRole;
}

export type AppRequest = Request & { user?: AuthUser };

export interface GqlContext {
  req: AppRequest;
  res: Response;
}

export interface ApiEnvelope<T> {
  status: number;
  message: string;
  data: T;
}

export function envelope<T>(data: T, message: string, status = 200): ApiEnvelope<T> {
  return { status, message, data };
}

export function httpOf(context: ExecutionContext): GqlContext {
  if (context.getType<GqlContextType>() === 'graphql') {
    return GqlExecutionContext.create(context).getContext<GqlContext>();
  }
  const http = context.switchToHttp();
  return { req: http.getRequest<AppRequest>(), res: http.getResponse<Response>() };
}

export const IS_PUBLIC = 'isPublic';

export const Public = () => SetMetadata(IS_PUBLIC, true);

export const CurrentUser = createParamDecorator((_data: unknown, context: ExecutionContext): AuthUser => {
  const user = httpOf(context).req.user;
  if (!user) throw new AppError('Access denied. No token provided.', 401, 'no_token');
  return user;
});

export const CurrentUserId = createParamDecorator((_data: unknown, context: ExecutionContext): number => {
  const user = httpOf(context).req.user;
  if (!user) throw new AppError('Access denied. No token provided.', 401, 'no_token');
  return user.userId;
});
