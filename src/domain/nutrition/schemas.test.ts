import { readFile } from "node:fs/promises";

import { describe, expect, it } from "vitest";

import { createEmptyStoreData } from "./factories";
import { parseAssignmentInput, parseRecipeInput, validateStoreData } from "./schemas";

describe("recipe input validation", () => {
  it("accepts a minimal valid recipe", () => {
    const recipe = parseRecipeInput({
      name: "Sopa de verduras",
      description: "",
      instructions: "Cocer todos los ingredientes y triturar.",
      imageUrl: "",
      ingredients: [{ name: "Calabacín", quantity: "1 unidad" }],
    });

    expect(recipe.name).toBe("Sopa de verduras");
    expect(recipe.ingredients).toHaveLength(1);
  });

  it("accepts recipe tags and normalizes them to unique values", () => {
    const recipe = parseRecipeInput({
      name: "Sopa de verduras",
      description: "",
      instructions: "Cocer todos los ingredientes y triturar.",
      imageUrl: "",
      tags: ["Desayuno", " desayuno ", "Cena", "Cena"],
      ingredients: [{ name: "Calabacín", quantity: "1 unidad" }],
    });

    expect(recipe.tags).toEqual(["Desayuno", "Cena"]);
  });

  it("rejects image URLs that are not HTTPS", () => {
    expect(() =>
      parseRecipeInput({
        name: "Sopa de verduras",
        description: "",
        instructions: "Cocer todos los ingredientes y triturar.",
        imageUrl: "http://inseguro.test/imagen.jpg",
        ingredients: [{ name: "Calabacín", quantity: "1 unidad" }],
      }),
    ).toThrow();
  });
});

describe("stored nutrition data", () => {
  it("accepts a newly created empty weekly plan", () => {
    const data = createEmptyStoreData();

    expect(validateStoreData(data).weeklyPlans[0].slots).toHaveLength(35);
  });

  it("rejects a meal assignment to an unknown recipe", () => {
    const data = createEmptyStoreData();
    data.weeklyPlans[0].slots[0].recipeIds = [
      "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    ];

    expect(() => validateStoreData(data)).toThrow("receta inexistente");
  });

  it("normalizes one-recipe legacy slots to recipe arrays", () => {
    const data = createEmptyStoreData();
    const recipeId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
    const legacySlot: Record<string, unknown> = { ...data.weeklyPlans[0].slots[0] };
    delete legacySlot.recipeIds;

    data.recipes.push({
      id: recipeId,
      ownerId: data.users[0].id,
      name: "Receta heredada",
      description: "",
      instructions: "Preparar.",
      imageUrl: null,
      ingredients: [
        {
          id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
          name: "Ingrediente",
          quantity: "1 unidad",
        },
      ],
      tags: [],
      createdAt: data.users[0].createdAt,
      updatedAt: data.users[0].createdAt,
    });

    const legacyData = {
      ...data,
      weeklyPlans: [
        {
          ...data.weeklyPlans[0],
          slots: [{ ...legacySlot, recipeId }, ...data.weeklyPlans[0].slots.slice(1)],
        },
      ],
    };

    expect(validateStoreData(legacyData).weeklyPlans[0].slots[0].recipeIds).toEqual([
      recipeId,
    ]);
  });

  it("rejects duplicate recipes in the same slot payload", () => {
    const recipeId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";

    expect(() => parseAssignmentInput({ recipeIds: [recipeId, recipeId] })).toThrow(
      "solo puede añadirse una vez",
    );
  });

  it("keeps the ordered recipe list from the reproducible demo", async () => {
    const rawDemo = await readFile(
      new URL("../../../data/demo-nutrition-data.json", import.meta.url),
      "utf8",
    );
    const demo = validateStoreData(JSON.parse(rawDemo) as unknown);

    expect(
      demo.weeklyPlans[0].slots.find((slot) => slot.id === "monday-breakfast")
        ?.recipeIds,
    ).toEqual([
      "11111111-1111-4111-8111-111111111111",
      "22222222-2222-4222-8222-222222222222",
    ]);
  });
});
