export interface SignInForm {
  email: string;
  password: string;
}

export interface SignUpForm {
  email: string;
  password: string;
  gender?: string | null;
  dateOfBirth?: string | null;
}

export interface Profile {
  id: number;
  email: string;
  name: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  description: string | null;
  country: string | null;
  city: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  age: number | null;
  exp: number;
  avatarUrl: string | null;
  coverUrl: string | null;
  facebook: string | null;
  twitter: string | null;
  instagram: string | null;
  isDemo: boolean;
  isFrozen: boolean;
}

/** What the API returns on sign-in, the demo entry and a token refresh. */
export interface LoginResult {
  token: string;
  profile: Partial<Profile> & { isDemo?: boolean };
}
