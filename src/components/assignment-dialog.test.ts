import { describe, expect, it } from "vitest";

import { getAssignmentTagItems } from "./assignment-dialog";

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
});
