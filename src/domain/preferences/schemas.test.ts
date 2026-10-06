import { describe, expect, it } from "vitest";

import { parseMealVisibilityPreferences } from "./schemas";

const allVisible = {
  breakfast: true,
  midMorning: true,
  lunch: true,
  snack: true,
  dinner: true,
};

describe("mealVisibilityPreferencesSchema", () => {
  it("accepts a complete boolean snapshot", () => {
    expect(parseMealVisibilityPreferences(allVisible)).toEqual(allVisible);
  });

  it("rejects missing fields, non-boolean values, and extra keys", () => {
    expect(() => parseMealVisibilityPreferences({ breakfast: true })).toThrow();
    expect(() =>
      parseMealVisibilityPreferences({ ...allVisible, lunch: "true" }),
    ).toThrow();
    expect(() =>
      parseMealVisibilityPreferences({ ...allVisible, userId: "other-user" }),
    ).toThrow();
  });
});
