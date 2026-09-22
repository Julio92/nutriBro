export interface LocalAccountRegistrationInput {
  displayName: string;
  email: string;
  password: string;
}

export interface LocalAccountSignInInput {
  email: string;
  password: string;
}

export interface LocalAccountCredentials {
  id: string;
  displayName: string;
  email: string;
  passwordHash: string;
  emailVerified?: Date | null;
}

export interface LocalAccountCreation {
  displayName: string;
  email: string;
  passwordHash: string;
}

export interface LocalAccountProfile {
  id: string;
  displayName: string;
  email: string;
  emailVerified?: Date | null;
}

export interface AuthFormState {
  error?: string;
  success?: string;
  fields?: Record<string, string[]>;
  email?: string;
  token?: string;
}
