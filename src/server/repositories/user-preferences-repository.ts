import type { MealVisibilityPreferences } from "@/domain/preferences/types";

export interface UserPreferencesRepository {
  read(userId: string): Promise<MealVisibilityPreferences>;
  save(
    userId: string,
    preferences: MealVisibilityPreferences,
  ): Promise<MealVisibilityPreferences>;
}
