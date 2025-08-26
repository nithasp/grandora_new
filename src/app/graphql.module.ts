import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { environment } from './environments/environment';

export function createApolloFactory(httpLink: HttpLink) {
  return {
    link: httpLink.create({ uri: environment.graphqlURL }),  // HERE WE WILL PUT OUR GRAPHQL URL
    cache: new InMemoryCache(),
  };
}

