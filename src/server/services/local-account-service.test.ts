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

  async create(input: LocalAccountCreation): Promise<LocalAccountProfile> {
    if (this.accounts.has(input.email)) {
      throw new ConflictError("Ya existe una cuenta con este correo electrónico.");
    }

    const account: LocalAccountCredentials = {
      id: "00000000-0000-4000-8000-000000000001",
      displayName: input.displayName,
      email: input.email,
      passwordHash: input.passwordHash,
    };
    this.accounts.set(input.email, account);

    return {
      id: account.id,
      displayName: account.displayName,
      email: account.email,
    };
  }

  async findCredentialsByEmail(email: string) {
    return this.accounts.get(email) ?? null;
  }

  getPasswordHash(email: string) {
    return this.accounts.get(email)?.passwordHash;
  }
}

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
