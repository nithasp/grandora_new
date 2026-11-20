import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, catchError, map, shareReplay, throwError } from 'rxjs';
import { CheckoutResult, Order, PaymentConfig } from '../models';

const ORDER_FIELDS = `
  id status method packageId packageName amountSatang amount amountCoins currency grantCurrency grantAmount
  bonusTickets authorizeUri qrCodeUri failureCode failureMessage expiresAt paidAt createdAt
`;

const PAYMENT_CONFIG = gql`
  query {
    PaymentConfig {
      enabled
      testMode
      publicKey
      currency
      minAmountSatang
      methods {
        type
        label
        group
        online
        mobileOnly
        requiresPhone
        maxAmountSatang
      }
    }
  }
`;

const CHECKOUT = gql`
  mutation ($input: CheckoutInput!) {
    Checkout(input: $input) {
      nextAction
      authorizeUri
      qrCodeUri
      order { ${ORDER_FIELDS} }
    }
  }
`;

const ORDER = gql`
  query ($id: ID!) {
    Order(id: $id) { ${ORDER_FIELDS} }
  }
`;

const SIMULATE = gql`
  mutation ($id: ID!, $result: String) {
    SimulatePayment(id: $id, result: $result) { ${ORDER_FIELDS} }
  }
`;

export interface CardDetails {
  name: string;
  number: string;
  expirationMonth: number;
  expirationYear: number;
  securityCode: string;
}

declare global {
  interface Window {
    Omise?: {
      setPublicKey(key: string): void;
      createToken(
        type: 'card',
        card: Record<string, string | number>,
        callback: (statusCode: number, response: { id?: string; message?: string }) => void,
      ): void;
    };
  }
}

const OMISE_JS = 'https://cdn.omise.co/omise.js';

export function errorMessage(err: any, fallback = 'Something went wrong. Please try again.'): string {
  return err?.graphQLErrors?.[0]?.message || err?.networkError?.error?.message || err?.message || fallback;
}

/**
 * Omise moves the money; the backend decides what the player gets. The browser only ever sends a
 * package id and a payment method, never a price, and card numbers go straight to Omise as a token.
 */
@Injectable({ providedIn: 'root' })
export class PaymentService {
  private config$?: Observable<PaymentConfig>;
  private omiseScript?: Promise<void>;

  constructor(private apollo: Apollo) {}

  getConfig(): Observable<PaymentConfig> {
    this.config$ ??= this.apollo
      .query<any>({ query: PAYMENT_CONFIG })
      .pipe(
        map((res) => res.data.PaymentConfig as PaymentConfig),
        catchError((err) => {
          this.config$ = undefined;
          return throwError(() => err);
        }),
        shareReplay({ bufferSize: 1, refCount: false }),
      );
    return this.config$;
  }

  checkout(input: {
    packageId: number;
    method: string;
    cardToken?: string | null;
    phoneNumber?: string | null;
  }): Observable<CheckoutResult> {
    return this.apollo
      .mutate<any>({ mutation: CHECKOUT, variables: { input } })
      .pipe(map((res) => res.data.Checkout as CheckoutResult));
  }

  getOrder(id: string): Observable<Order> {
    return this.apollo
      .query<any>({ query: ORDER, variables: { id }, fetchPolicy: 'network-only' })
      .pipe(map((res) => res.data.Order as Order));
  }

  simulate(id: string, result: 'paid' | 'failed' = 'paid'): Observable<Order> {
    return this.apollo
      .mutate<any>({ mutation: SIMULATE, variables: { id, result } })
      .pipe(map((res) => res.data.SimulatePayment as Order));
  }

  async createCardToken(publicKey: string, card: CardDetails): Promise<string> {
    await this.loadOmise();
    const omise = window.Omise!;
    omise.setPublicKey(publicKey);
    return new Promise((resolve, reject) => {
      omise.createToken(
        'card',
        {
          name: card.name,
          number: card.number.replace(/\s+/g, ''),
          expiration_month: card.expirationMonth,
          expiration_year: card.expirationYear,
          security_code: card.securityCode,
        },
        (statusCode, response) => {
          if (statusCode === 200 && response.id) resolve(response.id);
          else reject(new Error(response.message || 'The card could not be verified.'));
        },
      );
    });
  }

  private loadOmise(): Promise<void> {
    if (window.Omise) return Promise.resolve();
    this.omiseScript ??= new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = OMISE_JS;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        this.omiseScript = undefined;
        reject(new Error('Could not load the Omise card form. Check your connection and try again.'));
      };
      document.head.appendChild(script);
    });
    return this.omiseScript;
  }
}
