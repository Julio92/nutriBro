import { describe, expect, it } from "vitest";

import { DEFAULT_OWNER_ID } from "@/domain/nutrition/constants";
import { createEmptyStoreData } from "@/domain/nutrition/factories";
import type { RecipeInput, StoreData } from "@/domain/nutrition/types";
import type { NutritionRepository } from "@/server/repositories/nutrition-repository";

import { NutritionService } from "./nutrition-service";

class InMemoryNutritionRepository implements NutritionRepository {
  constructor(private data: StoreData) {}

  async ensureWorkspace(): Promise<void> {}

  async read() {
    return structuredClone(this.data);
  }

  async update<T>(
    userId: string,
    mutator: (data: StoreData) => T | Promise<T>,
  ) {
    void userId;
    const draft = structuredClone(this.data);
    const result = await mutator(draft);
    this.data = draft;
    return result;
  }
}

const input: RecipeInput = {
  name: "Arroz con verduras",
  description: "Una receta de prueba.",
  instructions: "Sofríe las verduras. Añade el arroz y cocina.",
  imageUrl: "",
  ingredients: [
    { name: "Arroz", quantity: "80 g" },
    { name: "Verduras", quantity: "200 g" },
  ],
};

describe("NutritionService", () => {
  it("creates, assigns multiple recipes and deletes one without clearing the slot", async () => {
    const service = new NutritionService(
      new InMemoryNutritionRepository(createEmptyStoreData()),
    );

    const recipe = await service.createRecipe(DEFAULT_OWNER_ID, input);
    const secondRecipe = await service.createRecipe(DEFAULT_OWNER_ID, {
      ...input,
      name: "Ensalada de acompañamiento",
    });
    expect(recipe.ingredients).toHaveLength(2);

    const assignedDashboard = await service.setSlotRecipes(
      DEFAULT_OWNER_ID,
      "monday-breakfast",
      { recipeIds: [recipe.id, secondRecipe.id] },
    );
    expect(assignedDashboard.stats.assignedMeals).toBe(1);
    expect(
      assignedDashboard.plan.slots
        .find((slot) => slot.id === "monday-breakfast")
        ?.recipes.map((item) => item.name),
    ).toEqual(["Arroz con verduras", "Ensalada de acompañamiento"]);

    const detail = await service.getRecipe(DEFAULT_OWNER_ID, recipe.id);
    expect(detail.assignedSlots).toHaveLength(1);

    const result = await service.deleteRecipe(DEFAULT_OWNER_ID, recipe.id);
    expect(result.clearedAssignments).toBe(1);

    const afterDeleting = await service.getDashboard(DEFAULT_OWNER_ID);
    expect(afterDeleting.stats.recipeCount).toBe(1);
    expect(afterDeleting.stats.assignedMeals).toBe(1);
    expect(
      afterDeleting.plan.slots
        .find((slot) => slot.id === "monday-breakfast")
        ?.recipes.map((item) => item.id),
    ).toEqual([secondRecipe.id]);

    await service.setSlotRecipes(DEFAULT_OWNER_ID, "monday-breakfast", { recipeIds: [] });
    const afterClearing = await service.getDashboard(DEFAULT_OWNER_ID);
    expect(afterClearing.stats.assignedMeals).toBe(0);
  });

  it("does not expose recipes from another owner", async () => {
    const data = createEmptyStoreData();
    const otherOwnerId = "00000000-0000-4000-8000-000000000002";
    const defaultPlan = data.weeklyPlans[0];

    data.users.push({
      id: otherOwnerId,
      displayName: "Otra persona",
      email: "otra@example.com",
      role: "owner",
      createdAt: new Date().toISOString(),
    });
    data.weeklyPlans.push({
      ...structuredClone(defaultPlan),
      id: "00000000-0000-4000-8000-000000000011",
      ownerId: otherOwnerId,
    });

    const service = new NutritionService(new InMemoryNutritionRepository(data));
    const recipe = await service.createRecipe(DEFAULT_OWNER_ID, input);

    await expect(service.getRecipe(otherOwnerId, recipe.id)).rejects.toMatchObject({
      code: "NOT_FOUND",
    });
    await expect(service.listRecipes(otherOwnerId)).resolves.toEqual([]);
  });
});
