import { describe, expect, it } from "vitest";

import type { MealVisibilityPreferences } from "@/domain/preferences/types";
import type { NutritionDatabase } from "@/server/infrastructure/database/client";
import { userPreferences } from "@/server/infrastructure/database/schema";

import { PostgresUserPreferencesRepository } from "./postgres-user-preferences-repository";

function createDatabaseDouble(selectedRows: unknown[] = []) {
  const calls: { selectWhere: unknown[]; insertValues: unknown[]; upserts: unknown[] } = {
    selectWhere: [],
    insertValues: [],
    upserts: [],
  };

  const database = {
    select() {
      return {
        from(table: unknown) {
          return {
            where(condition: unknown) {
              calls.selectWhere.push({ table, condition });
              return { limit: async () => selectedRows };
            },
          };
        },
      };
    },
    insert(table: unknown) {
      return {
        values(values: unknown) {
          calls.insertValues.push({ table, values });
          return {
            async onConflictDoUpdate(options: unknown) {
              calls.upserts.push(options);
            },
          };
        },
      };
    },
  };

  return {
    calls,
    database: database as unknown as NutritionDatabase,
  };
}

const preferences: MealVisibilityPreferences = {
  breakfast: false,
  midMorning: true,
  lunch: false,
  snack: true,
  dinner: false,
};
const userId = "00000000-0000-4000-8000-000000000001";

describe("PostgresUserPreferencesRepository", () => {
  it("returns the default without inserting when a user has no row", async () => {
    const databaseDouble = createDatabaseDouble();
    const repository = new PostgresUserPreferencesRepository(() => databaseDouble.database);

    await expect(repository.read(userId)).resolves.toEqual({
      breakfast: true,
      midMorning: true,
      lunch: true,
      snack: true,
      dinner: true,
    });
    expect(databaseDouble.calls.selectWhere).toHaveLength(1);
    expect(databaseDouble.calls.insertValues).toHaveLength(0);
  });

  it("maps SQL columns and upserts all five fields under the supplied user ID", async () => {
    const databaseDouble = createDatabaseDouble([
      {
        userId,
        breakfast: false,
        midMorning: true,
        lunch: false,
        snack: true,
        dinner: false,
      },
    ]);
    const repository = new PostgresUserPreferencesRepository(() => databaseDouble.database);

    await expect(repository.read(userId)).resolves.toEqual(preferences);
    await expect(repository.save(userId, preferences)).resolves.toEqual(preferences);

    expect(databaseDouble.calls.insertValues).toEqual([
      {
        table: userPreferences,
        values: { userId, ...preferences },
      },
    ]);
    expect(databaseDouble.calls.upserts).toHaveLength(1);
  });
});
