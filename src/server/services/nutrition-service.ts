import "server-only";

import { randomUUID } from "node:crypto";

import {
  fieldErrorsFromZod,
  parseAssignmentInput,
  parseRecipeId,
  parseRecipeInput,
  parseSlotId,
} from "@/domain/nutrition/schemas";
import type {
  AssignedSlotReference,
  DashboardData,
  MealSlotView,
  Recipe,
  RecipeDetail,
  RecipeInput,
  RecipeListItem,
  RecipeSummary,
  StoreData,
  WeeklyPlan,
  WeeklyPlanView,
} from "@/domain/nutrition/types";
import type { NutritionRepository } from "@/server/repositories/nutrition-repository";
import { NotFoundError, ValidationError } from "@/server/services/errors";
import { ZodError } from "zod";

function toRecipeSummary(recipe: Recipe): RecipeSummary {
  return {
    id: recipe.id,
    name: recipe.name,
    description: recipe.description,
    imageUrl: recipe.imageUrl,
    tags: recipe.tags,
    ingredientCount: recipe.ingredients.length,
  };
}

function assertUserExists(data: StoreData, userId: string) {
  if (!data.users.some((user) => user.id === userId)) {
    throw new NotFoundError("No se ha encontrado el espacio de usuario.");
  }
}

function getOwnedPlan(data: StoreData, userId: string): WeeklyPlan {
  const plan = data.weeklyPlans.find((item) => item.ownerId === userId);

  if (!plan) {
    throw new NotFoundError("No se ha encontrado el menú semanal.");
  }

  return plan;
}

function getOwnedRecipe(data: StoreData, userId: string, recipeId: string): Recipe {
  const recipe = data.recipes.find(
    (item) => item.id === recipeId && item.ownerId === userId,
  );

  if (!recipe) {
    throw new NotFoundError("No se ha encontrado la receta solicitada.");
  }

  return recipe;
}

function recipeAssignmentCounts(data: StoreData, userId: string) {
  const counts = new Map<string, number>();

  for (const plan of data.weeklyPlans.filter((item) => item.ownerId === userId)) {
    for (const slot of plan.slots) {
      for (const recipeId of slot.recipeIds) {
        counts.set(recipeId, (counts.get(recipeId) ?? 0) + 1);
      }
    }
  }

  return counts;
}

function toRecipeListItem(recipe: Recipe, assignedSlotCount: number): RecipeListItem {
  return {
    ...toRecipeSummary(recipe),
    updatedAt: recipe.updatedAt,
    assignedSlotCount,
  };
}

function toRecipeDetail(
  recipe: Recipe,
  data: StoreData,
  userId: string,
): RecipeDetail {
  const assignedSlots: AssignedSlotReference[] = data.weeklyPlans
    .filter((plan) => plan.ownerId === userId)
    .flatMap((plan) => plan.slots)
    .filter((slot) => slot.recipeIds.includes(recipe.id))
    .map((slot) => ({
      slotId: slot.id,
      day: slot.day,
      meal: slot.meal,
      time: slot.time,
    }));

  return {
    ...toRecipeSummary(recipe),
    ingredients: recipe.ingredients.map((ingredient) => ({ ...ingredient })),
    instructions: recipe.instructions,
    createdAt: recipe.createdAt,
    updatedAt: recipe.updatedAt,
    assignedSlots,
  };
}

function toPlanView(plan: WeeklyPlan, recipes: Recipe[]): WeeklyPlanView {
  const recipeMap = new Map(recipes.map((recipe) => [recipe.id, recipe]));
  const slots: MealSlotView[] = plan.slots.map((slot) => {
    return {
      id: slot.id,
      day: slot.day,
      meal: slot.meal,
      time: slot.time,
      recipes: slot.recipeIds.flatMap((recipeId) => {
        const recipe = recipeMap.get(recipeId);
        return recipe ? [toRecipeSummary(recipe)] : [];
      }),
    };
  });

  return {
    id: plan.id,
    ownerId: plan.ownerId,
    name: plan.name,
    kind: plan.kind,
    startsOn: plan.startsOn,
    endsOn: plan.endsOn,
    createdAt: plan.createdAt,
    updatedAt: plan.updatedAt,
    slots,
  };
}

function normalizeRecipeInput(rawInput: unknown): RecipeInput {
  try {
    return parseRecipeInput(rawInput);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ValidationError("Revisa los campos marcados de la receta.", fieldErrorsFromZod(error));
    }

    throw error;
  }
}

function normalizeRecipeId(rawRecipeId: unknown) {
  try {
    return parseRecipeId(rawRecipeId);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ValidationError("El identificador de receta no es válido.");
    }

    throw error;
  }
}

function normalizeSlotAssignment(rawSlotId: unknown, rawInput: unknown) {
  try {
    return {
      slotId: parseSlotId(rawSlotId),
      input: parseAssignmentInput(rawInput),
    };
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ValidationError("La asignación de la comida no es válida.", fieldErrorsFromZod(error));
    }

    throw error;
  }
}

export class NutritionService {
  constructor(private readonly repository: NutritionRepository) {}

  private async readForUser(userId: string) {
    await this.repository.ensureWorkspace(userId);
    return this.repository.read(userId);
  }

  private async updateForUser<T>(
    userId: string,
    mutator: (data: StoreData) => T | Promise<T>,
  ) {
    await this.repository.ensureWorkspace(userId);
    return this.repository.update(userId, mutator);
  }

  async getDashboard(userId: string): Promise<DashboardData> {
    const data = await this.readForUser(userId);
    assertUserExists(data, userId);

    const plan = getOwnedPlan(data, userId);
    const recipes = data.recipes.filter((recipe) => recipe.ownerId === userId);
    const assignmentCounts = recipeAssignmentCounts(data, userId);
    const recipeItems = recipes
      .map((recipe) => toRecipeListItem(recipe, assignmentCounts.get(recipe.id) ?? 0))
      .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));

    return {
      plan: toPlanView(plan, recipes),
      recipes: recipeItems,
      stats: {
        assignedMeals: plan.slots.filter((slot) => slot.recipeIds.length > 0).length,
        totalMeals: plan.slots.length,
        recipeCount: recipes.length,
      },
    };
  }

  async listRecipes(userId: string): Promise<RecipeListItem[]> {
    const data = await this.readForUser(userId);
    assertUserExists(data, userId);
    const assignmentCounts = recipeAssignmentCounts(data, userId);

    return data.recipes
      .filter((recipe) => recipe.ownerId === userId)
      .map((recipe) => toRecipeListItem(recipe, assignmentCounts.get(recipe.id) ?? 0))
      .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
  }

  async getRecipe(userId: string, rawRecipeId: unknown): Promise<RecipeDetail> {
    const recipeId = normalizeRecipeId(rawRecipeId);
    const data = await this.readForUser(userId);
    assertUserExists(data, userId);

    return toRecipeDetail(getOwnedRecipe(data, userId, recipeId), data, userId);
  }

  async createRecipe(userId: string, rawInput: unknown): Promise<RecipeDetail> {
    const input = normalizeRecipeInput(rawInput);

    return this.updateForUser(userId, (data) => {
      assertUserExists(data, userId);
      const now = new Date().toISOString();
      const recipe: Recipe = {
        id: randomUUID(),
        ownerId: userId,
        name: input.name,
        description: input.description,
        instructions: input.instructions,
        imageUrl: input.imageUrl || null,
        tags: input.tags ?? [],
        ingredients: input.ingredients.map((ingredient) => ({
          id: randomUUID(),
          name: ingredient.name,
          quantity: ingredient.quantity,
        })),
        createdAt: now,
        updatedAt: now,
      };

      data.recipes.unshift(recipe);
      return toRecipeDetail(recipe, data, userId);
    });
  }

  async updateRecipe(
    userId: string,
    rawRecipeId: unknown,
    rawInput: unknown,
  ): Promise<RecipeDetail> {
    const recipeId = normalizeRecipeId(rawRecipeId);
    const input = normalizeRecipeInput(rawInput);

    return this.updateForUser(userId, (data) => {
      assertUserExists(data, userId);
      const recipe = getOwnedRecipe(data, userId, recipeId);
      recipe.name = input.name;
      recipe.description = input.description;
      recipe.instructions = input.instructions;
      recipe.imageUrl = input.imageUrl || null;
      recipe.tags = input.tags ?? [];
      recipe.ingredients = input.ingredients.map((ingredient) => ({
        id: randomUUID(),
        name: ingredient.name,
        quantity: ingredient.quantity,
      }));
      recipe.updatedAt = new Date().toISOString();

      return toRecipeDetail(recipe, data, userId);
    });
  }

  async deleteRecipe(userId: string, rawRecipeId: unknown) {
    const recipeId = normalizeRecipeId(rawRecipeId);

    return this.updateForUser(userId, (data) => {
      assertUserExists(data, userId);
      getOwnedRecipe(data, userId, recipeId);
      data.recipes = data.recipes.filter((recipe) => recipe.id !== recipeId);

      let clearedAssignments = 0;
      for (const plan of data.weeklyPlans.filter((item) => item.ownerId === userId)) {
        for (const slot of plan.slots) {
          const recipeIds = slot.recipeIds.filter((id) => id !== recipeId);
          if (recipeIds.length !== slot.recipeIds.length) {
            slot.recipeIds = recipeIds;
            clearedAssignments += 1;
          }
        }

        plan.updatedAt = new Date().toISOString();
      }

      return { deletedRecipeId: recipeId, clearedAssignments };
    });
  }

  async setSlotRecipes(
    userId: string,
    rawSlotId: unknown,
    rawInput: unknown,
  ): Promise<DashboardData> {
    const { slotId, input } = normalizeSlotAssignment(rawSlotId, rawInput);

    await this.updateForUser(userId, (data) => {
      assertUserExists(data, userId);
      const plan = getOwnedPlan(data, userId);
      const slot = plan.slots.find((item) => item.id === slotId);

      if (!slot) {
        throw new NotFoundError("No se ha encontrado la comida seleccionada.");
      }

      for (const recipeId of input.recipeIds) {
        getOwnedRecipe(data, userId, recipeId);
      }

      slot.recipeIds = input.recipeIds;
      plan.updatedAt = new Date().toISOString();
    });

    return this.getDashboard(userId);
  }
}
