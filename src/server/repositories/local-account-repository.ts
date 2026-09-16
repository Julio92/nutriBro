import type {
  LocalAccountCreation,
  LocalAccountCredentials,
  LocalAccountProfile,
} from "@/domain/auth/types";

export interface LocalAccountRepository {
  create(input: LocalAccountCreation): Promise<LocalAccountProfile>;
  findCredentialsByEmail(email: string): Promise<LocalAccountCredentials | null>;
}
