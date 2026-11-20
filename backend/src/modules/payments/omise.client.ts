import { Injectable } from '@nestjs/common';
import { AppError } from '../../common/errors';
import { config } from '../../config/config';

export type OmiseChargeStatus = 'pending' | 'successful' | 'failed' | 'expired' | 'reversed';

export interface OmiseCharge {
  object: 'charge';
  id: string;
  livemode: boolean;
  amount: number;
  currency: string;
  status: OmiseChargeStatus;
  paid: boolean;
  authorize_uri: string | null;
  failure_code: string | null;
  failure_message: string | null;
  refunded_amount?: number;
  expires_at?: string | null;
  metadata?: Record<string, unknown> | null;
  source?: {
    id: string;
    type: string;
    scannable_code?: { image?: { download_uri?: string } | null } | null;
  } | null;
  dispute?: { id: string } | null;
}

export interface OmiseDispute {
  object: 'dispute';
  id: string;
  charge: string | { id: string };
  status: string;
}

export interface OmiseEvent {
  object: 'event';
  id: string;
  key: string;
  livemode?: boolean;
  data: { object?: string; id?: string; charge?: string | { id: string } | null } & Record<string, unknown>;
}

export class OmiseError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code: string,
  ) {
    super(message);
  }
}

const TIMEOUT_MS = 20_000;

@Injectable()
export class OmiseClient {
  createCharge(params: Record<string, string>): Promise<OmiseCharge> {
    return this.request<OmiseCharge>('POST', '/charges', params);
  }

  retrieveCharge(id: string): Promise<OmiseCharge> {
    return this.request<OmiseCharge>('GET', `/charges/${encodeURIComponent(id)}`);
  }

  retrieveDispute(id: string): Promise<OmiseDispute> {
    return this.request<OmiseDispute>('GET', `/disputes/${encodeURIComponent(id)}`);
  }

  markCharge(id: string, result: 'paid' | 'failed'): Promise<OmiseCharge> {
    return this.request<OmiseCharge>('POST', `/charges/${encodeURIComponent(id)}/mark_as_${result}`);
  }

  private async request<T>(method: 'GET' | 'POST', path: string, form?: Record<string, string>): Promise<T> {
    const { secretKey, apiVersion, apiUrl } = config.omise;
    if (!secretKey) throw new AppError('Online payments are not configured', 503, 'service_unavailable');

    let response: Response;
    try {
      response = await fetch(`${apiUrl}${path}`, {
        method,
        headers: {
          Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString('base64')}`,
          'Omise-Version': apiVersion,
          Accept: 'application/json',
          ...(form ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {}),
        },
        ...(form ? { body: new URLSearchParams(form).toString() } : {}),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch (err) {
      throw new OmiseError(`Could not reach Omise: ${(err as Error).message}`, 503, 'omise_unreachable');
    }

    const body = (await response.json().catch(() => null)) as
      (T & { object?: string; code?: string; message?: string }) | null;
    if (!response.ok || !body || body.object === 'error') {
      throw new OmiseError(
        body?.message ?? `Omise request failed with status ${response.status}`,
        response.status,
        body?.code ?? 'omise_error',
      );
    }
    return body;
  }
}
