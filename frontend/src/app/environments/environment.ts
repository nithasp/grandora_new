const apiUrl = 'http://localhost:3000';

export const environment = {
  production: false,
  apiUrl,
  graphqlURL: `${apiUrl}/api/v1/graph`,
  // Every new browser tab signs a visitor in to the shared demo account and opens afterLoginRoute,
  // so the site can be explored without registering. Signing out brings back the normal forms.
  autoDemoLogin: true,
  afterLoginRoute: '/setting',
};
