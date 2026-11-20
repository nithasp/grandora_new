export type ErrorCode =
  | 'bad_request'
  | 'invalid_request'
  | 'invalid_credentials'
  | 'no_token'
  | 'token_expired'
  | 'token_invalid'
  | 'forbidden'
  | 'account_frozen'
  | 'not_found'
  | 'conflict'
  | 'insufficient_funds'
  | 'payment_failed'
  | 'payload_too_large'
  | 'unsupported_media_type'
  | 'rate_limited'
  | 'service_unavailable'
  | 'internal_error';

export interface HandledError {
  statusCode: number;
  message: string;
  code: ErrorCode;
}

export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 400,
    public readonly code: ErrorCode = 'bad_request',
  ) {
    super(message);
  }
}

export const notFound = (what: string): AppError => new AppError(`${what} not found`, 404, 'not_found');
