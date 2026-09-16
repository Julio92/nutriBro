import "server-only";

import { randomUUID } from "node:crypto";

import { eq } from "drizzle-orm";
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
    };
  }
}
