import "server-only";

import { randomUUID } from "node:crypto";

import { and, eq } from "drizzle-orm";
import type { BatchItem } from "drizzle-orm/batch";

import type {
  LocalAccountCreation,
  LocalAccountCredentials,
  LocalAccountProfile,
} from "@/domain/auth/types";
import {
  getDatabase,
  type NutritionDatabase,
} from "@/server/infrastructure/database/client";
import {
  authVerificationTokens,
  userCredentials,
  users,
} from "@/server/infrastructure/database/schema";
import { buildDefaultRecipeLibrarySeed } from "@/server/infrastructure/default-recipe-library";
import type { LocalAccountRepository } from "@/server/repositories/local-account-repository";
import { ConflictError } from "@/server/services/errors";

function isUniqueConstraintError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const databaseError = error as { code?: unknown; cause?: { code?: unknown } };
  return databaseError.code === "23505" || databaseError.cause?.code === "23505";
}

/** Persistencia de las cuentas de email/contraseña en PostgreSQL. */
export class PostgresLocalAccountRepository implements LocalAccountRepository {
  constructor(
    private readonly databaseFactory: () => NutritionDatabase = getDatabase,
  ) {}

  async create(input: LocalAccountCreation): Promise<LocalAccountProfile> {
    const id = randomUUID();
    const now = new Date();
    const database = this.databaseFactory();
    const defaultLibrary = buildDefaultRecipeLibrarySeed(database, id, now);
    const statements: BatchItem<"pg">[] = [
      database
        .insert(users)
        .values({
          id,
          name: input.displayName,
          email: input.email,
          createdAt: now,
        }),
      database
        .insert(userCredentials)
        .values({
          userId: id,
          passwordHash: input.passwordHash,
          passwordUpdatedAt: now,
          createdAt: now,
        }),
      ...defaultLibrary.statements,
    ];

    try {
      await database.batch(
        statements as [BatchItem<"pg">, ...BatchItem<"pg">[]],
      );
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new ConflictError("Ya existe una cuenta con este correo electrónico.");
      }

      throw error;
    }

    return {
      id,
      displayName: input.displayName,
      email: input.email,
    };
  }

  async findCredentialsByEmail(email: string): Promise<LocalAccountCredentials | null> {
    const database = this.databaseFactory();
    const [account] = await database
      .select({
        id: users.id,
        displayName: users.name,
        email: users.email,
        passwordHash: userCredentials.passwordHash,
        emailVerified: users.emailVerified,
      })
      .from(users)
      .innerJoin(userCredentials, eq(userCredentials.userId, users.id))
      .where(eq(users.email, email))
      .limit(1);

    if (!account || !account.displayName || !account.email) {
      return null;
    }

    return {
      id: account.id,
      displayName: account.displayName,
      email: account.email,
      passwordHash: account.passwordHash,
      emailVerified: account.emailVerified,
    };
  }

  async findCredentialsByUserId(userId: string): Promise<LocalAccountCredentials | null> {
    const database = this.databaseFactory();
    const [account] = await database
      .select({
        id: users.id,
        displayName: users.name,
        email: users.email,
        passwordHash: userCredentials.passwordHash,
        emailVerified: users.emailVerified,
      })
      .from(users)
      .innerJoin(userCredentials, eq(userCredentials.userId, users.id))
      .where(eq(users.id, userId))
      .limit(1);

    if (!account || !account.displayName || !account.email) {
      return null;
    }

    return {
      id: account.id,
      displayName: account.displayName,
      email: account.email,
      passwordHash: account.passwordHash,
      emailVerified: account.emailVerified,
    };
  }

  async updatePasswordHash(
    userId: string,
    passwordHash: string,
  ): Promise<LocalAccountProfile | null> {
    const database = this.databaseFactory();
    const now = new Date();
    await database
      .update(userCredentials)
      .set({
        passwordHash,
        passwordUpdatedAt: now,
      })
      .where(eq(userCredentials.userId, userId));

    const account = await this.findCredentialsByUserId(userId);

    if (!account) {
      return null;
    }

    return {
      id: account.id,
      displayName: account.displayName,
      email: account.email,
      emailVerified: account.emailVerified,
    };
  }

  async issueVerificationToken(
    email: string,
    token: string,
    expiresAt: Date,
  ): Promise<string> {
    const database = this.databaseFactory();
    await database.insert(authVerificationTokens).values({
      identifier: email,
      token,
      expires: expiresAt,
    });

    return token;
  }

  async ensureVerificationToken(
    email: string,
    token: string,
    expiresAt: Date,
  ): Promise<string> {
    return this.issueVerificationToken(email, token, expiresAt);
  }

  async consumeVerificationToken(email: string, token: string): Promise<boolean> {
    const database = this.databaseFactory();
    const [verificationToken] = await database
      .select()
      .from(authVerificationTokens)
      .where(and(eq(authVerificationTokens.identifier, email), eq(authVerificationTokens.token, token)))
      .limit(1);

    if (!verificationToken) {
      return false;
    }

    const isExpired = verificationToken.expires.getTime() < Date.now();

    if (isExpired) {
      await database
        .delete(authVerificationTokens)
        .where(and(eq(authVerificationTokens.identifier, email), eq(authVerificationTokens.token, token)));
      return false;
    }

    await database
      .delete(authVerificationTokens)
      .where(and(eq(authVerificationTokens.identifier, email), eq(authVerificationTokens.token, token)));

    return true;
  }

  async markEmailVerified(userId: string): Promise<LocalAccountProfile | null> {
    const database = this.databaseFactory();
    const now = new Date();
    await database
      .update(users)
      .set({ emailVerified: now })
      .where(eq(users.id, userId));

    const account = await this.findCredentialsByUserId(userId);

    if (!account) {
      return null;
    }

    return {
      id: account.id,
      displayName: account.displayName,
      email: account.email,
      emailVerified: account.emailVerified,
    };
  }
}
