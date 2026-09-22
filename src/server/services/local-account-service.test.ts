import { describe, expect, it } from "vitest";

import type {
  LocalAccountCreation,
  LocalAccountCredentials,
  LocalAccountProfile,
} from "@/domain/auth/types";
import { ConflictError } from "@/server/services/errors";
import type { LocalAccountRepository } from "@/server/repositories/local-account-repository";

import { LocalAccountService } from "./local-account-service";

class InMemoryLocalAccountRepository implements LocalAccountRepository {
  private readonly accounts = new Map<string, LocalAccountCredentials>();
  private readonly verificationTokens = new Map<string, { expiresAt: Date; usedAt?: Date }>();

  async create(input: LocalAccountCreation): Promise<LocalAccountProfile> {
    if (this.accounts.has(input.email)) {
      throw new ConflictError("Ya existe una cuenta con este correo electrónico.");
    }

    const account: LocalAccountCredentials = {
      id: "00000000-0000-4000-8000-000000000001",
      displayName: input.displayName,
      email: input.email,
      passwordHash: input.passwordHash,
      emailVerified: null,
    };
    this.accounts.set(input.email, account);

    return {
      id: account.id,
      displayName: account.displayName,
      email: account.email,
      emailVerified: null,
    };
  }

  async findCredentialsByEmail(email: string) {
    return this.accounts.get(email) ?? null;
  }

  async findCredentialsByUserId(userId: string) {
    return [...this.accounts.values()].find((account) => account.id === userId) ?? null;
  }

  async updatePasswordHash(userId: string, passwordHash: string) {
    const account = await this.findCredentialsByUserId(userId);

    if (!account) {
      return null;
    }

    const updated = { ...account, passwordHash };
    this.accounts.set(account.email, updated);
    return {
      id: updated.id,
      displayName: updated.displayName,
      email: updated.email,
      emailVerified: updated.emailVerified,
    };
  }

  async issueVerificationToken(email: string, token: string, expiresAt: Date) {
    this.verificationTokens.set(`${email}:${token}`, { expiresAt });
    return token;
  }

  async ensureVerificationToken(email: string, token: string, expiresAt: Date) {
    return this.issueVerificationToken(email, token, expiresAt);
  }

  async consumeVerificationToken(email: string, token: string) {
    const key = `${email}:${token}`;
    const record = this.verificationTokens.get(key);

    if (!record || record.usedAt || record.expiresAt.getTime() < Date.now()) {
      return false;
    }

    record.usedAt = new Date();
    return true;
  }

  async markEmailVerified(userId: string) {
    const account = await this.findCredentialsByUserId(userId);

    if (!account) {
      return null;
    }

    const updated = { ...account, emailVerified: new Date() };
    this.accounts.set(account.email, updated);
    return {
      id: updated.id,
      displayName: updated.displayName,
      email: updated.email,
      emailVerified: updated.emailVerified,
    };
  }

  getPasswordHash(email: string) {
    return this.accounts.get(email)?.passwordHash;
  }
}

it("allows a signed-in user to change their password and then recover it with a reset token", async () => {
  const repository = new InMemoryLocalAccountRepository();
  const service = new LocalAccountService(repository);

  const account = await service.register({
    displayName: "Ada Lovelace",
    email: "ada@example.com",
    password: "una-contraseña-segura",
  });

  await expect(
    service.changePassword({
      userId: account.id,
      currentPassword: "una-contraseña-segura",
      newPassword: "otra-contraseña-segura",
    }),
  ).resolves.toMatchObject({ id: account.id, email: "ada@example.com" });

  const recoveryToken = await service.requestPasswordRecovery({
    email: "ada@example.com",
  });

  expect(recoveryToken).toBeTruthy();

  await expect(
    service.recoverPassword({
      email: "ada@example.com",
      token: recoveryToken,
      password: "otra-contraseña-segura",
    }),
  ).resolves.toMatchObject({ id: account.id, email: "ada@example.com" });
});

it("issues and consumes an email verification token for a new account", async () => {
  const repository = new InMemoryLocalAccountRepository();
  const service = new LocalAccountService(repository);

  const account = await service.register({
    displayName: "Grace Hopper",
    email: "grace@example.com",
    password: "otra-contraseña-segura",
  });

  const verificationToken = await service.requestEmailVerification({
    email: "grace@example.com",
  });

  expect(verificationToken).toBeTruthy();

  await expect(
    service.verifyEmail({
      email: "grace@example.com",
      token: verificationToken,
    }),
  ).resolves.toMatchObject({
    id: account.id,
    email: "grace@example.com",
    emailVerified: expect.any(Date),
  });
});

describe("LocalAccountService", () => {
  it("registers a password as a hash and authenticates it", async () => {
    const repository = new InMemoryLocalAccountRepository();
    const service = new LocalAccountService(repository);

    const account = await service.register({
      displayName: "Ada Lovelace",
      email: " ADA@EXAMPLE.COM ",
      password: "una-contraseña-segura",
    });

    expect(account).toMatchObject({
      displayName: "Ada Lovelace",
      email: "ada@example.com",
    });
    expect(repository.getPasswordHash("ada@example.com")).not.toBe(
      "una-contraseña-segura",
    );

    await expect(
      service.authenticate({
        email: "ada@example.com",
        password: "una-contraseña-segura",
      }),
    ).resolves.toEqual(account);
  });

  it("does not authenticate unknown emails or an incorrect password", async () => {
    const service = new LocalAccountService(new InMemoryLocalAccountRepository());

    await expect(
      service.authenticate({
        email: "nadie@example.com",
        password: "una-contraseña-segura",
      }),
    ).resolves.toBeNull();

    await service.register({
      displayName: "Ada",
      email: "ada@example.com",
      password: "una-contraseña-segura",
    });

    await expect(
      service.authenticate({
        email: "ada@example.com",
        password: "otra-contraseña-segura",
      }),
    ).resolves.toBeNull();
  });

  it("rejects duplicate email registrations", async () => {
    const service = new LocalAccountService(new InMemoryLocalAccountRepository());
    const input = {
      displayName: "Ada",
      email: "ada@example.com",
      password: "una-contraseña-segura",
    };

    await service.register(input);
    await expect(service.register(input)).rejects.toBeInstanceOf(ConflictError);
  });
});
