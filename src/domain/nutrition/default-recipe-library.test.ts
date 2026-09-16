import { describe, expect, it } from "vitest";

import {
  DEFAULT_RECIPE_LIBRARY_VERSION,
  DEFAULT_RECIPE_TEMPLATES,
  createDefaultRecipeLibrary,
} from "./default-recipe-library";
import { parseRecipeInput } from "./schemas";

function createTestIdFactory() {
  let sequence = 0;

  return () => {
    sequence += 1;
    return `00000000-0000-4000-8000-${sequence.toString(16).padStart(12, "0")}`;
  };
}

describe("DEFAULT_RECIPE_TEMPLATES", () => {
  it("contains the 21 extracted recipes with valid recipe input", () => {
    expect(DEFAULT_RECIPE_LIBRARY_VERSION).toBe(1);
    expect(DEFAULT_RECIPE_TEMPLATES).toHaveLength(21);
    expect(new Set(DEFAULT_RECIPE_TEMPLATES.map((recipe) => recipe.key)).size).toBe(21);

    for (const { key, ...recipe } of DEFAULT_RECIPE_TEMPLATES) {
      expect(key).not.toHaveLength(0);
      expect(parseRecipeInput(recipe)).toEqual(recipe);
    }
  });

  it("creates independent owned copies with fresh recipe and ingredient IDs", () => {
    const library = createDefaultRecipeLibrary(
      "00000000-0000-4000-8000-000000000001",
      new Date("2026-09-16T12:00:00.000Z"),
      createTestIdFactory(),
    );
    const recipeIds = library.map(({ recipe }) => recipe.id);
    const ingredientIds = library.flatMap(({ recipe }) =>
      recipe.ingredients.map((ingredient) => ingredient.id),
    );

    expect(library).toHaveLength(21);
    expect(new Set(recipeIds).size).toBe(recipeIds.length);
    expect(new Set(ingredientIds).size).toBe(ingredientIds.length);
    expect(library.every(({ recipe }) => recipe.ownerId === "00000000-0000-4000-8000-000000000001")).toBe(true);
    expect(library.every(({ recipe }) => recipe.imageUrl === null)).toBe(true);
  });
});
