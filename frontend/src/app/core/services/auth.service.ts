import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { LoginResult, SignInForm, SignUpForm } from '../models';
import { SessionService } from './session.service';

export const SIGN_IN = gql`
  mutation ($email: String!, $password: String!) {
    LoginEmail(email: $email, password: $password) {
      token
      profile {
        name
        country
        description
        exp
        isDemo
      }
    }
  }
`;

export const SIGN_UP = gql`
  mutation ($email: String!, $password: String!, $gender: String, $dateOfBirth: String) {
    RegisterEmail(email: $email, password: $password, gender: $gender, dateOfBirth: $dateOfBirth) {
      message
      success
      __typename
    }
  }
`;

export const SIGN_UP_CLOSE_BETA = gql`
  mutation (
    $favorite_game: String
    $last_name: String
    $favorite_game_genre: [String]
    $first_name: String
    $region: String
    $channel_name: String
    $event_name: String
    $age: Int
    $email: String
  ) {
    Register(
      favorite_game: $favorite_game
      last_name: $last_name
      favorite_game_genre: $favorite_game_genre
      first_name: $first_name
      region: $region
      channel_name: $channel_name
      event_name: $event_name
      age: $age
      email: $email
    ) {
      success
    }
  }
`;

/** Headers for an API call; a signed-out visitor sends none instead of "Authorization: null". */
export function authHeaders(token: string | null): Record<string, string> {
  return token ? { Authorization: token } : {};
}

const ENTRY_PATHS = ['/', '/home', '/sign-in', '/sign-up'];

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLogin: BehaviorSubject<boolean>;
  isDemo: BehaviorSubject<boolean>;
  userInfo = new BehaviorSubject<any>(undefined);

  constructor(
    private http: HttpClient,
    private apollo: Apollo,
    private router: Router,
    private session: SessionService,
  ) {
    this.isLogin = session.isLogin;
    this.isDemo = session.isDemo;
  }

  getAccessToken() {
    return this.session.getAccessToken();
  }

  /**
   * Runs before the first page renders. A player who signed in keeps their session; anyone else
   * opening the site in a new tab is signed in to the demo account and lands on the page a sign-in
   * leads to. After signing out, the rest of that tab shows the normal sign-in and sign-up forms.
   */
  async initSession(): Promise<void> {
    const newTab = this.session.isNewTab;

    if (this.session.getAccessToken()) {
      const demo = this.session.isDemoSession();
      // A live session is reused, so opening many tabs does not create a demo login for each one
      if (this.session.hasValidToken() || (await this.session.refresh())) {
        this.session.markSignedIn();
        if (demo && newTab && this.session.canEnterDemo()) this.openAfterLoginPage();
        return;
      }
      this.session.clearSession();
    }

    if (this.session.canEnterDemo()) {
      try {
        const result = await this.session.enterDemo();
        this.userInfo.next(result);
        if (newTab) this.openAfterLoginPage();
        return;
      } catch {
      }
    }
    this.session.clearSession();
  }

  /** The initial navigation has not started yet, so swapping the URL is enough to change where it goes. */
  private openAfterLoginPage(): void {
    const path = window.location.pathname.replace(/\/+$/, '') || '/';
    if (ENTRY_PATHS.includes(path)) {
      history.replaceState(history.state, '', environment.afterLoginRoute);
    }
  }

  async enterDemo(): Promise<void> {
    const result = await this.session.enterDemo();
    this.userInfo.next(result);
    await this.router.navigateByUrl(environment.afterLoginRoute);
  }

  completeSignIn(result: LoginResult) {
    this.session.storeSession(result);
    this.userInfo.next(result);
    this.router.navigateByUrl(environment.afterLoginRoute);
  }

  signIn({ email, password }: SignInForm) {
    return this.apollo.mutate<any>({
      mutation: SIGN_IN,
      variables: {
        email: email,
        password: password,
      },
      errorPolicy: 'all',
    });
  }

  signUp({ email, password, gender, dateOfBirth }: SignUpForm) {
    return this.apollo.mutate<any>({
      mutation: SIGN_UP,
      variables: {
        email: email,
        password: password,
        gender: gender ?? null,
        dateOfBirth: dateOfBirth ?? null,
      },
      errorPolicy: 'all',
    });
  }

  signUpCloseBeta({
    favorite_game,
    last_name,
    favorite_game_genre,
    first_name,
    region,
    channel_name,
    event_name,
    age,
    email,
  }: any) {
    return this.apollo.use('grandoraEndPoint').mutate<any>({
      mutation: SIGN_UP_CLOSE_BETA,
      variables: {
        favorite_game,
        last_name,
        favorite_game_genre,
        first_name,
        region,
        channel_name,
        event_name,
        age,
        email,
      },
      errorPolicy: 'all',
    });
  }

  signOut() {
    this.session.logout().finally(() => {
      this.router.navigate(['/']);

      setTimeout(() => {
        window.location.reload();
      }, 10);
    });
  }

  getIsLogin() {
    return this.isLogin.asObservable();
  }
  getUserInfo() {
    return this.userInfo.asObservable();
  }
}
