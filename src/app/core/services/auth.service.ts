import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Router } from '@angular/router';
import { SignInForm, SignUpForm } from '../models';

export const SIGN_IN = gql`
  mutation ($email: String!, $password: String!) {
    LoginEmail(email: $email, password: $password) {
      token
      profile {
        name
        country
        description
        exp
      }
    }
  }
`;

export const SIGN_UP = gql`
  mutation ($email: String!, $password: String!) {
    RegisterEmail(email: $email, password: $password) {
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

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLogin = new BehaviorSubject<boolean>(false);
  userInfo = new BehaviorSubject<any>(undefined);

  constructor(
    private http: HttpClient,
    private apollo: Apollo,
    private router: Router
  ) {}

  getAccessToken() {
    return localStorage.getItem("accessToken");
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

  signUp({ email, password }: SignUpForm) {
    return this.apollo.mutate<any>({
      mutation: SIGN_UP,
      variables: {
        email: email,
        password: password,
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
    localStorage.removeItem('accessToken');
    this.isLogin.next(false);
    this.router.navigate(['/']);

    setTimeout(() => {
      window.location.reload();
    }, 10);
  }

  getIsLogin() {
    return this.isLogin.asObservable();
  }
  getUserInfo() {
    return this.userInfo.asObservable();
  }
}
