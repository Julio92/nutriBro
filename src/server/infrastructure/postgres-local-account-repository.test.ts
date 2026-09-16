import { describe, expect, it } from "vitest";

import { DEFAULT_RECIPE_LIBRARY_VERSION } from "@/domain/nutrition/default-recipe-library";
import type { NutritionDatabase } from "@/server/infrastructure/database/client";
import {
  recipeIngredients,
  recipes,
  userCredentials,
  userDefaultRecipeLibraries,
  users,
} from "@/server/infrastructure/database/schema";

import { PostgresLocalAccountRepository } from "./postgres-local-account-repository";

interface RecordedInsert {
  table: unknown;
  values: unknown;
}

function createDatabaseDouble() {
  const batches: RecordedInsert[][] = [];

  const database = {
    insert(table: unknown) {
      return {
        values(values: unknown): RecordedInsert {
          return { table, values };
        },
      };
    },
    async batch(statements: RecordedInsert[]) {
      batches.push(statements);
    },
  };

  return { batches, database: database as unknown as NutritionDatabase };
}

describe("PostgresLocalAccountRepository", () => {
  it("creates the account and its 21-recipe default library in one batch", async () => {
    const databaseDouble = createDatabaseDouble();
    const repository = new PostgresLocalAccountRepository(() => databaseDouble.database);

    const account = await repository.create({
      displayName: "Ada",
      email: "ada@example.com",
      passwordHash: "argon2id-hash",
    });

    expect(account).toMatchObject({
      displayName: "Ada",
      email: "ada@example.com",
    });
    expect(databaseDouble.batches).toHaveLength(1);

    const [batch] = databaseDouble.batches;
    const accountInsert = batch.find((statement) => statement.table === users);
    const credentialsInsert = batch.find((statement) => statement.table === userCredentials);
    const recipesInsert = batch.find((statement) => statement.table === recipes);
    const ingredientsInsert = batch.find((statement) => statement.table === recipeIngredients);
    const libraryInsert = batch.find(
      (statement) => statement.table === userDefaultRecipeLibraries,
    );

    expect(accountInsert).toBeDefined();
    expect(credentialsInsert).toBeDefined();
    expect(recipesInsert?.values).toHaveLength(21);
    expect(ingredientsInsert?.values).not.toHaveLength(0);
    expect(libraryInsert?.values).toMatchObject({
      userId: account.id,
      version: DEFAULT_RECIPE_LIBRARY_VERSION,
    });
  });
});
