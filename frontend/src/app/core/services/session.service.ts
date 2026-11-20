import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, map, timeout } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginResult } from '../models';

const TOKEN_KEY = 'accessToken';
const DEMO_SESSION_KEY = 'demoSession';
const DEMO_DECLINED_KEY = 'demoEntryDeclined';
const REQUEST_TIMEOUT_MS = 10_000;

interface ApiEnvelope<T> {
  status: number;
  message: string;
  data: T;
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const part = token.split('.')[1];
  if (!part) return null;
  try {
    // JWT segments are base64url without padding, which atob() rejects as-is
    const base64 = part.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    return JSON.parse(atob(padded)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/** A browser restores sessionStorage for a reopened tab too, so only the navigation type proves a reload. */
function isTabReload(): boolean {
  try {
    return performance
      .getEntriesByType('navigation')
      .some((entry) => (entry as PerformanceNavigationTiming).type === 'reload');
  } catch {
    return false;
  }
}

@Injectable({ providedIn: 'root' })
export class SessionService {
  readonly isLogin = new BehaviorSubject<boolean>(false);
  readonly isDemo = new BehaviorSubject<boolean>(false);
  readonly isNewTab = !isTabReload();

  private recovering: Promise<string | null> | null = null;
  private demoUnavailable = false;

  constructor(private http: HttpClient) {
    // A tab that was opened rather than reloaded starts over as a visitor, so the demo greets them again
    if (this.isNewTab) this.setDemoDeclined(false);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  hasValidToken(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;
    const exp = decodeJwtPayload(token)?.['exp'];
    return typeof exp === 'number' && exp * 1000 > Date.now() + 5_000;
  }

  isDemoSession(): boolean {
    return localStorage.getItem(DEMO_SESSION_KEY) === '1';
  }

  storeSession(result: LoginResult): void {
    const demo = !!result.profile?.isDemo;
    localStorage.setItem(TOKEN_KEY, result.token);
    localStorage.setItem(DEMO_SESSION_KEY, demo ? '1' : '0');
    if (!demo) this.setDemoDeclined(false);
    this.isDemo.next(demo);
    this.isLogin.next(true);
  }

  markSignedIn(): void {
    this.isDemo.next(this.isDemoSession());
    this.isLogin.next(true);
  }

  clearSession(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(DEMO_SESSION_KEY);
    this.isDemo.next(false);
    this.isLogin.next(false);
  }

  canEnterDemo(): boolean {
    return environment.autoDemoLogin && !this.demoUnavailable && !this.demoDeclined();
  }

  async enterDemo(): Promise<LoginResult> {
    try {
      const result = await this.post<LoginResult>('demo');
      this.demoUnavailable = false;
      this.storeSession(result);
      return result;
    } catch (err) {
      this.demoUnavailable = true;
      throw err;
    }
  }

  async refresh(): Promise<string | null> {
    try {
      const result = await this.post<LoginResult>('refresh');
      this.storeSession(result);
      return result.token;
    } catch {
      return null;
    }
  }

  recoverSession(): Promise<string | null> {
    this.recovering ??= (async () => {
      const wasDemo = this.isDemoSession();
      const token = await this.refresh();
      if (token) return token;
      if (wasDemo && this.canEnterDemo()) {
        try {
          return (await this.enterDemo()).token;
        } catch {
        }
      }
      this.clearSession();
      return null;
    })().finally(() => (this.recovering = null));
    return this.recovering;
  }

  async logout(): Promise<void> {
    // Declined first: the reload that follows must not sign the visitor straight back in to the demo
    this.setDemoDeclined(true);
    this.clearSession();
    await this.post('logout').catch(() => undefined);
  }

  private post<T>(path: string): Promise<T> {
    return firstValueFrom(
      this.http
        .post<ApiEnvelope<T>>(`${environment.apiUrl}/api/v1/auth/${path}`, {}, { withCredentials: true })
        .pipe(
          timeout(REQUEST_TIMEOUT_MS),
          map((res) => res.data),
        ),
    );
  }

  private demoDeclined(): boolean {
    try {
      return sessionStorage.getItem(DEMO_DECLINED_KEY) !== null;
    } catch {
      return false;
    }
  }

  private setDemoDeclined(declined: boolean): void {
    try {
      if (declined) sessionStorage.setItem(DEMO_DECLINED_KEY, '1');
      else sessionStorage.removeItem(DEMO_DECLINED_KEY);
    } catch {
    }
  }
}
