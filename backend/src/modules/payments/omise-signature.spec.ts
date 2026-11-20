import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { describe, it } from 'node:test';
import { verifyOmiseSignature } from './omise-signature';

const secret = Buffer.from('a-webhook-secret-for-the-tests-only').toString('base64');
const otherSecret = Buffer.from('the-previous-webhook-secret').toString('base64');
const rawBody = Buffer.from(
  JSON.stringify({
    object: 'event',
    id: 'evnt_test_1',
    key: 'charge.complete',
    data: { object: 'charge', id: 'chrg_test_1' },
  }),
);
const timestamp = '1760000000';
const nowSeconds = Number(timestamp) + 30;

const sign = (body: Buffer, ts: string, key = secret): string =>
  crypto.createHmac('sha256', Buffer.from(key, 'base64')).update(`${ts}.`).update(body).digest('hex');

describe('verifyOmiseSignature', () => {
  it('accepts a signature made with the webhook secret', () => {
    assert.equal(
      verifyOmiseSignature({ rawBody, timestamp, signature: sign(rawBody, timestamp), secret, nowSeconds }),
      true,
    );
  });

  it('accepts either signature while the secret is rotated', () => {
    const signature = `${sign(rawBody, timestamp, otherSecret)},${sign(rawBody, timestamp)}`;
    assert.equal(verifyOmiseSignature({ rawBody, timestamp, signature, secret, nowSeconds }), true);
  });

  it('rejects a body changed after signing', () => {
    const tampered = Buffer.from(rawBody.toString().replace('chrg_test_1', 'chrg_test_2'));
    assert.equal(
      verifyOmiseSignature({
        rawBody: tampered,
        timestamp,
        signature: sign(rawBody, timestamp),
        secret,
        nowSeconds,
      }),
      false,
    );
  });

  it('rejects a signature made with another secret', () => {
    assert.equal(
      verifyOmiseSignature({
        rawBody,
        timestamp,
        signature: sign(rawBody, timestamp, otherSecret),
        secret,
        nowSeconds,
      }),
      false,
    );
  });

  it('rejects a replay outside the time window', () => {
    assert.equal(
      verifyOmiseSignature({
        rawBody,
        timestamp,
        signature: sign(rawBody, timestamp),
        secret,
        nowSeconds: Number(timestamp) + 60 * 60,
      }),
      false,
    );
  });

  it('rejects missing or malformed headers', () => {
    assert.equal(
      verifyOmiseSignature({ rawBody, timestamp, signature: undefined, secret, nowSeconds }),
      false,
    );
    assert.equal(
      verifyOmiseSignature({ rawBody, timestamp: 'soon', signature: 'abc', secret, nowSeconds }),
      false,
    );
    assert.equal(
      verifyOmiseSignature({ rawBody, timestamp, signature: 'not-hex!', secret, nowSeconds }),
      false,
    );
  });
});
