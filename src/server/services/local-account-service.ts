import "server-only";

import {
  fieldErrorsFromAuthSchema,
  localAccountRegistrationSchema,
  localAccountSignInSchema,
} from "@/domain/auth/schemas";
import type {
  LocalAccountProfile,
  LocalAccountRegistrationInput,
  LocalAccountSignInInput,
} from "@/domain/auth/types";
import { hashPassword, verifyPasswordHash } from "@/server/auth/password";
import type { LocalAccountRepository } from "@/server/repositories/local-account-repository";

import { ValidationError } from "./errors";

function normalizeRegistrationInput(rawInput: unknown): LocalAccountRegistrationInput {
  const result = localAccountRegistrationSchema.safeParse(rawInput);

  if (!result.success) {
    throw new ValidationError(
      "Revisa los campos marcados para crear tu cuenta.",
      fieldErrorsFromAuthSchema(result.error),
    );
  }

  return result.data;
}

function normalizeSignInInput(rawInput: unknown): LocalAccountSignInInput | null {
  const result = localAccountSignInSchema.safeParse(rawInput);
  return result.success ? result.data : null;
}

/** Casos de uso para alta y validación de cuentas locales. */
export class LocalAccountService {
  constructor(private readonly repository: LocalAccountRepository) {}

  async register(rawInput: unknown): Promise<LocalAccountProfile> {
    const input = normalizeRegistrationInput(rawInput);
    const passwordHash = await hashPassword(input.password);

    return this.repository.create({
      displayName: input.displayName,
      email: input.email,
      passwordHash,
    });
  }

  async authenticate(rawInput: unknown): Promise<LocalAccountProfile | null> {
    const input = normalizeSignInInput(rawInput);

    if (!input) {
      return null;
    }

    const account = await this.repository.findCredentialsByEmail(input.email);

    if (!account) {
      // Igualar el coste aproximado de una cuenta existente reduce la señal de
      // temporización que podría revelar si un correo está registrado.
      await hashPassword(input.password);
      return null;
    }

    const isValid = await verifyPasswordHash(account.passwordHash, input.password);

    if (!isValid) {
      return null;
    }

    return {
      id: account.id,
      displayName: account.displayName,
      email: account.email,
    };
  }
}
