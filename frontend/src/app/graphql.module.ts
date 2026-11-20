import { HttpHeaders } from '@angular/common/http';
import { ApolloLink, InMemoryCache, Observable, from } from '@apollo/client/core';
import { onError } from '@apollo/client/link/error';
import { NamedOptions } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { SessionService } from './core/services/session.service';
import { environment } from './environments/environment';

const RECOVERABLE_REASONS = ['token_expired', 'token_invalid'];

function toHeaders(value: unknown): HttpHeaders {
  if (value instanceof HttpHeaders) return value;
  let headers = new HttpHeaders();
  if (value && typeof value === 'object') {
    for (const [name, header] of Object.entries(value)) {
      if (typeof header === 'string' && header) headers = headers.set(name, header);
    }
  }
  return headers;
}

function accessTokenLink(session: SessionService): ApolloLink {
  return new ApolloLink((operation, forward) => {
    let headers = toHeaders(operation.getContext()['headers']);
    const token = session.getAccessToken();
    if (token && !headers.has('Authorization')) headers = headers.set('Authorization', token);
    operation.setContext({ headers });
    return forward(operation);
  });
}

function sessionRecoveryLink(session: SessionService): ApolloLink {
  return onError(({ graphQLErrors, operation, forward }) => {
    const stale = graphQLErrors?.some(
      (error) =>
        error.extensions?.['code'] === 'UNAUTHENTICATED' &&
        RECOVERABLE_REASONS.includes(String(error.extensions?.['reason'])),
    );
    if (!stale || operation.getContext()['sessionRetried']) return;

    return new Observable((observer) => {
      let subscription: { unsubscribe(): void } | undefined;
      session.recoverSession().then((token) => {
        if (!token) {
          observer.error(new Error('Your session has ended. Please sign in again.'));
          return;
        }
        operation.setContext({
          headers: toHeaders(operation.getContext()['headers']).set('Authorization', token),
          sessionRetried: true,
        });
        subscription = forward(operation).subscribe(observer);
      });
      return () => subscription?.unsubscribe();
    });
  });
}

// withCredentials lets LoginEmail store the HttpOnly refresh cookie
export function createApolloClients(httpLink: HttpLink, session: SessionService): NamedOptions {
  const client = () => ({
    cache: new InMemoryCache(),
    link: from([
      sessionRecoveryLink(session),
      accessTokenLink(session),
      httpLink.create({ uri: environment.graphqlURL, withCredentials: true }),
    ]),
  });

  return {
    default: client(),
    grandoraEndPoint: client(),
    packageEndPoint: client(),
  };
}
