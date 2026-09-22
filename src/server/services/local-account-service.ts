import "server-only";

import { randomUUID } from "node:crypto";

import {
  fieldErrorsFromAuthSchema,
  localAccountEmailVerificationSchema,
  localAccountPasswordChangeSchema,
  localAccountPasswordRecoverySchema,
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

function normalizePasswordChangeInput(rawInput: unknown) {
  if (!rawInput || typeof rawInput !== "object") {
    throw new ValidationError("La solicitud de cambio de contraseña no es válida.");
  }

  const candidate = rawInput as Record<string, unknown>;
  const userId =
    typeof candidate.userId === "string"
      ? candidate.userId
      : typeof candidate.id === "string"
        ? candidate.id
        : null;
  const currentPassword =
    typeof candidate.currentPassword === "string"
      ? candidate.currentPassword
      : typeof candidate.oldPassword === "string"
        ? candidate.oldPassword
        : null;
  const newPassword =
    typeof candidate.newPassword === "string"
      ? candidate.newPassword
      : typeof candidate.password === "string"
        ? candidate.password
        : null;

  const result = localAccountPasswordChangeSchema.safeParse({
    userId,
    currentPassword,
    newPassword,
  });

  if (!result.success) {
    throw new ValidationError(
      "Revisa la contraseña actual y la nueva contraseña.",
      fieldErrorsFromAuthSchema(result.error),
    );
  }

  return result.data;
}

function normalizePasswordRecoveryInput(rawInput: unknown) {
  if (!rawInput || typeof rawInput !== "object") {
    throw new ValidationError("La solicitud de recuperación no es válida.");
  }

  const candidate = rawInput as Record<string, unknown>;
  const email =
    typeof candidate.email === "string" ? candidate.email : typeof candidate.identifier === "string" ? candidate.identifier : null;
  const token =
    typeof candidate.token === "string"
      ? candidate.token
      : typeof candidate.resetToken === "string"
        ? candidate.resetToken
        : null;
  const password =
    typeof candidate.password === "string"
      ? candidate.password
      : typeof candidate.newPassword === "string"
        ? candidate.newPassword
        : null;

  const result = localAccountPasswordRecoverySchema.safeParse({ email, token, password });

  if (!result.success) {
    throw new ValidationError(
      "Revisa la dirección de correo y la nueva contraseña.",
      fieldErrorsFromAuthSchema(result.error),
    );
  }

  return result.data;
}

function normalizeEmailVerificationInput(rawInput: unknown) {
  if (!rawInput || typeof rawInput !== "object") {
    throw new ValidationError("La solicitud de verificación no es válida.");
  }

  const candidate = rawInput as Record<string, unknown>;
  const email =
    typeof candidate.email === "string" ? candidate.email : typeof candidate.identifier === "string" ? candidate.identifier : null;
  const token =
    typeof candidate.token === "string"
      ? candidate.token
      : typeof candidate.verificationToken === "string"
        ? candidate.verificationToken
        : null;

  const result = localAccountEmailVerificationSchema.safeParse({ email, token });

  if (!result.success) {
    throw new ValidationError(
      "Revisa el token de verificación y el correo electrónico.",
      fieldErrorsFromAuthSchema(result.error),
    );
  }

  return result.data;
}

function normalizeRecoveryRequestInput(rawInput: unknown) {
  const emailResult = localAccountSignInSchema.pick({ email: true }).safeParse(rawInput);

  if (!emailResult.success) {
    throw new ValidationError(
      "Revisa el correo electrónico para recuperar la cuenta.",
      fieldErrorsFromAuthSchema(emailResult.error),
    );
  }

  return emailResult.data;
}

/** Casos de uso para alta y validación de cuentas locales. */
export class LocalAccountService {
  constructor(private readonly repository: LocalAccountRepository) {}

  async register(rawInput: unknown): Promise<LocalAccountProfile> {
    const input = normalizeRegistrationInput(rawInput);
    const passwordHash = await hashPassword(input.password);

    const account = await this.repository.create({
      displayName: input.displayName,
      email: input.email,
      passwordHash,
    });

    return {
      ...account,
      emailVerified: account.emailVerified ?? null,
    };
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
      emailVerified: account.emailVerified ?? null,
    };
  }

  async changePassword(rawInput: unknown): Promise<LocalAccountProfile | null> {
    const input = normalizePasswordChangeInput(rawInput);
    const account = await this.repository.findCredentialsByUserId(input.userId);

    if (!account) {
      return null;
    }

    const isValid = await verifyPasswordHash(account.passwordHash, input.currentPassword);

    if (!isValid) {
      throw new ValidationError("La contraseña actual no es válida.", {
        currentPassword: ["La contraseña actual no es válida."],
      });
    }

    const passwordHash = await hashPassword(input.newPassword);
    return this.repository.updatePasswordHash(account.id, passwordHash);
  }

  async requestPasswordRecovery(rawInput: unknown): Promise<string | null> {
    const input = normalizeRecoveryRequestInput(rawInput);
    const account = await this.repository.findCredentialsByEmail(input.email);

    if (!account) {
      return null;
    }

    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await this.repository.issueVerificationToken(input.email, token, expiresAt);
    return token;
  }

  async requestPasswordReset(rawInput: unknown): Promise<string | null> {
    return this.requestPasswordRecovery(rawInput);
  }

  async recoverPassword(rawInput: unknown): Promise<LocalAccountProfile | null> {
    const input = normalizePasswordRecoveryInput(rawInput);
    const isValidToken = await this.repository.consumeVerificationToken(input.email, input.token);

    if (!isValidToken) {
      return null;
    }

    const account = await this.repository.findCredentialsByEmail(input.email);

    if (!account) {
      return null;
    }

    const passwordHash = await hashPassword(input.password);
    return this.repository.updatePasswordHash(account.id, passwordHash);
  }

  async resetPassword(rawInput: unknown): Promise<LocalAccountProfile | null> {
    return this.recoverPassword(rawInput);
  }

  async requestEmailVerification(rawInput: unknown): Promise<string | null> {
    const input = normalizeRecoveryRequestInput(rawInput);
    const account = await this.repository.findCredentialsByEmail(input.email);

    if (!account) {
      return null;
    }

    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await this.repository.issueVerificationToken(input.email, token, expiresAt);
    return token;
  }

  async sendVerificationEmail(rawInput: unknown): Promise<string | null> {
    return this.requestEmailVerification(rawInput);
  }

  async verifyEmail(rawInput: unknown): Promise<LocalAccountProfile | null> {
    const input = normalizeEmailVerificationInput(rawInput);
    const isValidToken = await this.repository.consumeVerificationToken(input.email, input.token);

    if (!isValidToken) {
      return null;
    }

    const account = await this.repository.findCredentialsByEmail(input.email);

    if (!account) {
      return null;
    }

    return this.repository.markEmailVerified(account.id);
  }

  async verifyAccount(rawInput: unknown): Promise<LocalAccountProfile | null> {
    return this.verifyEmail(rawInput);
  }
}
