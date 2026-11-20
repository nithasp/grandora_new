// Set this to the deployed backend URL before building for production
const apiUrl = 'https://api.grandora.example.com';

export const environment = {
  production: true,
  apiUrl,
  graphqlURL: `${apiUrl}/api/v1/graph`,
  autoDemoLogin: true,
  afterLoginRoute: '/setting',
};
