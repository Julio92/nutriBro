import { describe, expect, it } from "vitest";

import { getCreatedRecipeTag, getRecipeTagOptions } from "./recipe-tags";

describe("recipe tag options", () => {
  it("trims, deduplicates case-insensitively, and sorts existing tags", () => {
    expect(getRecipeTagOptions([" Desayuno ", "cena", "DESAYUNO", "", "Pescado"])).toEqual([
      "cena",
      "Desayuno",
      "Pescado",
    ]);
  });

  it("trims a new tag query and allows tags up to 32 characters", () => {
    expect(getCreatedRecipeTag([], "  Comida casera  ")).toBe("Comida casera");
    expect(getCreatedRecipeTag([], "x".repeat(32))).toBe("x".repeat(32));
  });

  it("does not create empty, overlong, or case-insensitive duplicate tags", () => {
    expect(getCreatedRecipeTag(["Desayuno"], "desayuno")).toBeUndefined();
    expect(getCreatedRecipeTag([], "   ")).toBeUndefined();
    expect(getCreatedRecipeTag([], "x".repeat(33))).toBeUndefined();
  });
});