import "server-only";

import { eq } from "drizzle-orm";

import { DEFAULT_MEAL_VISIBILITY_PREFERENCES, type MealVisibilityPreferences } from "@/domain/preferences/types";
import { getDatabase, type NutritionDatabase } from "@/server/infrastructure/database/client";
import { userPreferences } from "@/server/infrastructure/database/schema";
import type { UserPreferencesRepository } from "@/server/repositories/user-preferences-repository";

function toDomainPreferences(
  row: typeof userPreferences.$inferSelect,
): MealVisibilityPreferences {
  return {
    breakfast: row.breakfast,
    midMorning: row.midMorning,
    lunch: row.lunch,
    snack: row.snack,
    dinner: row.dinner,
  };
}

export class PostgresUserPreferencesRepository implements UserPreferencesRepository {
  constructor(
    private readonly databaseFactory: () => NutritionDatabase = getDatabase,
  ) {}

  async read(userId: string): Promise<MealVisibilityPreferences> {
    const database = this.databaseFactory();
    const [row] = await database
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId))
      .limit(1);

    return row ? toDomainPreferences(row) : { ...DEFAULT_MEAL_VISIBILITY_PREFERENCES };
  }

  async save(
    userId: string,
    preferences: MealVisibilityPreferences,
  ): Promise<MealVisibilityPreferences> {
    const database = this.databaseFactory();
    const values = {
      breakfast: preferences.breakfast,
      midMorning: preferences.midMorning,
      lunch: preferences.lunch,
      snack: preferences.snack,
      dinner: preferences.dinner,
    };

    await database
      .insert(userPreferences)
      .values({ userId, ...values })
      .onConflictDoUpdate({
        target: userPreferences.userId,
        set: values,
      });

    return { ...preferences };
  }
}
