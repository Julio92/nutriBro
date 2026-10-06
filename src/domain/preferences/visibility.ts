import type { MealTypeId } from "@/domain/nutrition/types";

import type { MealVisibilityPreferences } from "./types";

export function filterVisibleMealSlots<T extends { meal: MealTypeId }>(
  slots: readonly T[],
  preferences: MealVisibilityPreferences,
): T[] {
  return slots.filter((slot) => preferences[slot.meal]);
}
