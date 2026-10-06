import { describe, expect, it } from "vitest";

import { filterVisibleMealSlots } from "./visibility";
import type { MealVisibilityPreferences } from "./types";

const allVisible: MealVisibilityPreferences = {
  breakfast: true,
  midMorning: true,
  lunch: true,
  snack: true,
  dinner: true,
};

const slots = [
  { id: "monday-breakfast", meal: "breakfast" },
  { id: "monday-lunch", meal: "lunch" },
  { id: "monday-dinner", meal: "dinner" },
] as const;

describe("filterVisibleMealSlots", () => {
  it("preserves all present slots when every meal is visible", () => {
    expect(filterVisibleMealSlots(slots, allVisible)).toEqual(slots);
  });

  it("filters hidden meal types without adding missing slots", () => {
    expect(
      filterVisibleMealSlots(slots, { ...allVisible, lunch: false }),
    ).toEqual([slots[0], slots[2]]);
    expect(filterVisibleMealSlots([], allVisible)).toEqual([]);
  });

  it("supports hiding every meal", () => {
    const noneVisible: MealVisibilityPreferences = {
      breakfast: false,
      midMorning: false,
      lunch: false,
      snack: false,
      dinner: false,
    };

    expect(filterVisibleMealSlots(slots, noneVisible)).toEqual([]);
  });
});
