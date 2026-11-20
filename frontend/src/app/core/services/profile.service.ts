import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, catchError, from, map, switchMap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Profile } from '../models';
import { SessionService } from './session.service';

const PROFILE_FIELDS = `
  id email name username firstName lastName description country city gender dateOfBirth age exp
  avatarUrl coverUrl facebook twitter instagram isDemo isFrozen
`;

const MY_PROFILE = gql`
  query {
    MyProfile { ${PROFILE_FIELDS} }
  }
`;

const UPDATE_PROFILE = gql`
  mutation ($input: ProfileInput!) {
    UpdateProfile(input: $input) { ${PROFILE_FIELDS} }
  }
`;

export type ImageSlot = 'avatar' | 'cover';
export type ProfileInput = Partial<
  Pick<
    Profile,
    'username' | 'firstName' | 'lastName' | 'description' | 'country' | 'city' | 'gender' | 'dateOfBirth' | 'facebook' | 'twitter' | 'instagram'
  >
>;

interface ApiEnvelope<T> {
  status: number;
  message: string;
  data: T;
}

export function apiErrorMessage(err: any, fallback = 'Something went wrong. Please try again.'): string {
  if (err instanceof HttpErrorResponse) return err.error?.message || fallback;
  return err?.graphQLErrors?.[0]?.message || err?.message || fallback;
}

@Injectable({ providedIn: 'root' })
export class ProfileService {
  constructor(
    private apollo: Apollo,
    private http: HttpClient,
    private session: SessionService,
  ) {}

  getProfile(): Observable<Profile> {
    return this.apollo
      .query<any>({ query: MY_PROFILE, fetchPolicy: 'network-only' })
      .pipe(map((res) => res.data.MyProfile as Profile));
  }

  updateProfile(input: ProfileInput): Observable<Profile> {
    return this.apollo
      .mutate<any>({ mutation: UPDATE_PROFILE, variables: { input } })
      .pipe(map((res) => res.data.UpdateProfile as Profile));
  }

  uploadImage(slot: ImageSlot, file: File): Observable<Profile> {
    const form = new FormData();
    form.append('file', file);
    return this.withSession((token) =>
      this.http.put<ApiEnvelope<Profile>>(`${environment.apiUrl}/api/v1/profile/${slot}`, form, {
        headers: { Authorization: token },
      }),
    ).pipe(map((res) => res.data));
  }

  removeImage(slot: ImageSlot): Observable<Profile> {
    return this.withSession((token) =>
      this.http.delete<ApiEnvelope<Profile>>(`${environment.apiUrl}/api/v1/profile/${slot}`, {
        headers: { Authorization: token },
      }),
    ).pipe(map((res) => res.data));
  }

  private withSession<T>(request: (token: string) => Observable<T>): Observable<T> {
    return request(this.session.getAccessToken() ?? '').pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status !== 401 || !['token_expired', 'token_invalid'].includes(err.error?.code)) {
          return throwError(() => err);
        }
        return from(this.session.recoverSession()).pipe(
          switchMap((token) => (token ? request(token) : throwError(() => err))),
        );
      }),
    );
  }
}
