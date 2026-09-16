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
}

export interface AuthFormState {
  error?: string;
  fields?: Record<string, string[]>;
}
