import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { GqlContextType } from '@nestjs/graphql';
import { ThrottlerException } from '@nestjs/throttler';
import { Response } from 'express';
import { GraphQLError } from 'graphql';
import { AppError, ErrorCode, HandledError } from './errors';

interface PostgresError {
  code?: unknown;
  constraint?: string;
  detail?: string;
}

const UNIQUE_MESSAGES: Record<string, string> = {
  users_email_key: 'An account with this email already exists',
  users_username_key: 'That username is already taken',
  user_items_user_item_key: 'You already own this item',
  redeem_code_uses_code_user_key: 'You have already redeemed this code',
};

const CODE_BY_STATUS: Record<number, ErrorCode> = {
  400: 'bad_request',
  401: 'token_invalid',
  403: 'forbidden',
  404: 'not_found',
  409: 'conflict',
  413: 'payload_too_large',
  415: 'unsupported_media_type',
  429: 'rate_limited',
  503: 'service_unavailable',
};

const GRAPHQL_CODE_BY_STATUS: Record<number, string> = {
  400: 'BAD_USER_INPUT',
  401: 'UNAUTHENTICATED',
  402: 'PAYMENT_FAILED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  409: 'CONFLICT',
  413: 'PAYLOAD_TOO_LARGE',
  415: 'UNSUPPORTED_MEDIA_TYPE',
  429: 'TOO_MANY_REQUESTS',
  503: 'SERVICE_UNAVAILABLE',
};

function fromPostgres(err: PostgresError): HandledError | null {
  if (typeof err.code !== 'string' || !/^[0-9A-Z]{5}$/.test(err.code)) return null;

  switch (err.code) {
    case '23505':
      return {
        statusCode: 409,
        code: 'conflict',
        message: UNIQUE_MESSAGES[err.constraint ?? ''] ?? 'A record with that value already exists',
      };
    case '23503':
      return err.detail?.includes('is still referenced')
        ? {
            statusCode: 409,
            code: 'conflict',
            message: 'This record is used elsewhere and cannot be deleted',
          }
        : { statusCode: 400, code: 'invalid_request', message: 'A referenced record does not exist' };
    case '23514':
      return { statusCode: 400, code: 'invalid_request', message: 'A value is not allowed here' };
    case '22001':
      return { statusCode: 400, code: 'invalid_request', message: 'A value is too long' };
    case '22003':
      return { statusCode: 400, code: 'invalid_request', message: 'A number is out of range' };
    case '22007':
    case '22008':
      return { statusCode: 400, code: 'invalid_request', message: 'A date is not valid' };
    case '22P02':
      return { statusCode: 400, code: 'invalid_request', message: 'A value has an invalid format' };
    case '40001':
    case '40P01':
      return {
        statusCode: 409,
        code: 'conflict',
        message: 'The request collided with another one, please try again',
      };
    default:
      return null;
  }
}

function fromHttpException(err: HttpException): HandledError {
  const statusCode = err.getStatus();
  const response = err.getResponse();
  const raw =
    typeof response === 'string' ? response : ((response as { message?: unknown }).message ?? err.message);
  const message = Array.isArray(raw) ? raw.join(', ') : String(raw);
  return { statusCode, message, code: CODE_BY_STATUS[statusCode] ?? 'bad_request' };
}

export function handle(exception: unknown): HandledError {
  if (exception instanceof AppError) {
    return { statusCode: exception.statusCode, message: exception.message, code: exception.code };
  }
  if (exception instanceof ThrottlerException) {
    return {
      statusCode: 429,
      code: 'rate_limited',
      message: 'Too many requests. Please wait a moment and try again.',
    };
  }
  if (exception instanceof HttpException) return fromHttpException(exception);

  const db = exception && typeof exception === 'object' ? fromPostgres(exception as PostgresError) : null;
  if (db) return db;

  const bodyError = exception as { type?: string; status?: number };
  if (bodyError?.type === 'entity.parse.failed') {
    return { statusCode: 400, code: 'invalid_request', message: 'Request body must be valid JSON' };
  }
  if (bodyError?.type === 'entity.too.large') {
    return { statusCode: 413, code: 'payload_too_large', message: 'Request body is too large' };
  }
  return { statusCode: 500, code: 'internal_error', message: 'Internal Server Error' };
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('Exceptions');

  catch(exception: unknown, host: ArgumentsHost): GraphQLError | void {
    if (exception instanceof GraphQLError) return exception;

    const handled = handle(exception);
    if (handled.statusCode === 503) {
      this.logger.warn({ reason: handled.message }, 'service unavailable');
    } else if (handled.statusCode >= 500) {
      this.logger.error({ err: exception }, 'request failed');
    }

    if (host.getType<GqlContextType>() === 'graphql') {
      return new GraphQLError(handled.message, {
        extensions: {
          code: GRAPHQL_CODE_BY_STATUS[handled.statusCode] ?? 'INTERNAL_SERVER_ERROR',
          reason: handled.code,
          status: handled.statusCode,
        },
      });
    }

    const res = host.switchToHttp().getResponse<Response>();
    res.status(handled.statusCode).json({
      status: handled.statusCode,
      message: handled.message,
      data: null,
      code: handled.code,
    });
  }
}
