import crypto from 'crypto';

export interface SignatureCheck {
  rawBody: Buffer;
  signature: string | undefined;
  timestamp: string | undefined;
  secret: string;
  toleranceSeconds?: number;
  nowSeconds?: number;
}

const DEFAULT_TOLERANCE_SECONDS = 5 * 60;

/**
 * Omise signs `${timestamp}.${rawBody}` with HMAC-SHA256 and sends the hex digest in Omise-Signature.
 * While a secret is being rotated the header carries two comma-separated signatures; either may match.
 */
export function verifyOmiseSignature(check: SignatureCheck): boolean {
  const { rawBody, signature, timestamp, secret } = check;
  if (!signature || !timestamp || !/^\d{1,12}$/.test(timestamp)) return false;

  const tolerance = check.toleranceSeconds ?? DEFAULT_TOLERANCE_SECONDS;
  const now = check.nowSeconds ?? Math.floor(Date.now() / 1000);
  if (Math.abs(now - Number(timestamp)) > tolerance) return false;

  const expected = crypto
    .createHmac('sha256', Buffer.from(secret, 'base64'))
    .update(`${timestamp}.`)
    .update(rawBody)
    .digest();

  return signature
    .split(',')
    .map((candidate) => candidate.trim())
    .some((candidate) => {
      if (!/^[0-9a-f]+$/i.test(candidate) || candidate.length !== expected.length * 2) return false;
      return crypto.timingSafeEqual(Buffer.from(candidate, 'hex'), expected);
    });
}
