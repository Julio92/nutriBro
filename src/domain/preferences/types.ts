import type { MealTypeId } from "@/domain/nutrition/types";

export type MealVisibilityPreferences = Record<MealTypeId, boolean>;

export const DEFAULT_MEAL_VISIBILITY_PREFERENCES: MealVisibilityPreferences = {
  breakfast: true,
  midMorning: true,
  lunch: true,
  snack: true,
  dinner: true,
};
