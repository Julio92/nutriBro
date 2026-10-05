import { describe, expect, it } from "vitest";

import {
  getAssignmentTagItems,
  getAssignmentTagOptions,
  matchesAssignmentRecipe,
  matchesAssignmentRecipeTags,
} from "./assignment-dialog";

describe("assignment dialog recipe metadata", () => {
  it("returns the first three tags for a recipe when tag data is available", () => {
    expect(getAssignmentTagItems(["Desayuno", "Cena", "Vegetariano", "Pescado"])).toEqual([
      "Desayuno",
      "Cena",
      "Vegetariano",
    ]);
  });

  it("returns an empty list when no tags are available", () => {
    expect(getAssignmentTagItems([])).toEqual([]);
  });

  it("returns unique, normalized tag values for the assignment filter", () => {
    expect(
      getAssignmentTagOptions(["  Desayuno  ", "desayuno", "Cena", "", "Cena", "Vegetariano", "  "]),
    ).toEqual(["Cena", "Desayuno", "Vegetariano"]);
  });

  it("matches a recipe when it includes every selected tag, ignoring blank entries", () => {
    expect(matchesAssignmentRecipeTags(["Cena", "Vegetariano"], ["Cena", "Vegetariano", ""])).toBe(true);

    expect(matchesAssignmentRecipeTags(["Cena"], ["Cena", "Vegetariano"])).toBe(false);
  });

  it("matches selected tags without depending on their letter case", () => {
    expect(matchesAssignmentRecipeTags(["Desayuno"], ["desayuno"])).toBe(true);
  });

  it("combines the recipe-name query with the selected tag filters", () => {
    const recipe = { name: "Salmón al horno", description: "Cena ligera", tags: ["Cena", "Pescado"] };

    expect(matchesAssignmentRecipe(recipe, "salmón", ["Pescado"])).toBe(true);
    expect(matchesAssignmentRecipe(recipe, "salmón", ["Vegetariano"])).toBe(false);
    expect(matchesAssignmentRecipe(recipe, "pollo", ["Pescado"])).toBe(false);
  });
});
