import type {
  LocalAccountCreation,
  LocalAccountCredentials,
  LocalAccountProfile,
} from "@/domain/auth/types";

export interface LocalAccountRepository {
  create(input: LocalAccountCreation): Promise<LocalAccountProfile>;
  findCredentialsByEmail(email: string): Promise<LocalAccountCredentials | null>;
  findCredentialsByUserId(userId: string): Promise<LocalAccountCredentials | null>;
  updatePasswordHash(userId: string, passwordHash: string): Promise<LocalAccountProfile | null>;
  issueVerificationToken(email: string, token: string, expiresAt: Date): Promise<string>;
  ensureVerificationToken(
    email: string,
    token: string,
    expiresAt: Date,
  ): Promise<string>;
  consumeVerificationToken(email: string, token: string): Promise<boolean>;
  markEmailVerified(userId: string): Promise<LocalAccountProfile | null>;
}
