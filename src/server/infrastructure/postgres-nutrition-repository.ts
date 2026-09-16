import "server-only";

import { and, asc, eq, inArray } from "drizzle-orm";
import type { BatchItem } from "drizzle-orm/batch";

import {
  MEAL_TYPES,
  SLOT_DEFAULT_TIMES,
  WEEKDAYS,
  createSlotId,
} from "@/domain/nutrition/constants";
import { validateStoreData } from "@/domain/nutrition/schemas";
import type {
  Ingredient,
  MealSlot,
  Recipe,
  StoreData,
  User,
  WeeklyPlan,
} from "@/domain/nutrition/types";
import { getDatabase, type NutritionDatabase } from "@/server/infrastructure/database/client";
import {
  mealSlots,
  mealSlotRecipeAssignments,
  recipeIngredients,
  recipes,
  users,
  weeklyPlans,
} from "@/server/infrastructure/database/schema";
import type { NutritionRepository } from "@/server/repositories/nutrition-repository";
import { NotFoundError } from "@/server/services/errors";

type DatabaseUser = typeof users.$inferSelect;
type DatabaseRecipe = typeof recipes.$inferSelect;
type DatabaseIngredient = typeof recipeIngredients.$inferSelect;
type DatabasePlan = typeof weeklyPlans.$inferSelect;
type DatabaseSlot = typeof mealSlots.$inferSelect;
type DatabaseSlotRecipeAssignment = typeof mealSlotRecipeAssignments.$inferSelect;

function toIsoString(value: Date) {
  return value.toISOString();
}

function toDomainUser(row: DatabaseUser): User {
  const displayName = (row.name?.trim() || row.email?.split("@")[0] || "Tu espacio").slice(
    0,
    120,
  );

  return {
    id: row.id,
    displayName,
    email: row.email,
    role: "owner",
    createdAt: toIsoString(row.createdAt),
  };
}

function toDomainRecipe(
  row: DatabaseRecipe,
  ingredientsByRecipeId: Map<string, Ingredient[]>,
): Recipe {
  return {
    id: row.id,
    ownerId: row.ownerId,
    name: row.name,
    description: row.description,
    instructions: row.instructions,
    imageUrl: row.imageUrl,
    ingredients: ingredientsByRecipeId.get(row.id) ?? [],
    createdAt: toIsoString(row.createdAt),
    updatedAt: toIsoString(row.updatedAt),
  };
}

function toDomainPlan(
  row: DatabasePlan,
  slotsById: Map<string, DatabaseSlot>,
  recipeIdsBySlotId: Map<string, string[]>,
): WeeklyPlan {
  const slots: MealSlot[] = [];

  for (const day of WEEKDAYS) {
    for (const meal of MEAL_TYPES) {
      const slot = slotsById.get(createSlotId(day.id, meal.id));

      if (!slot) {
        continue;
      }

      slots.push({
        id: slot.id,
        day: day.id,
        meal: meal.id,
        time: slot.time,
        recipeIds: recipeIdsBySlotId.get(slot.id) ?? [],
      });
    }
  }

  return {
    id: row.id,
    ownerId: row.ownerId,
    name: row.name,
    kind: "repeating",
    startsOn: row.startsOn,
    endsOn: row.endsOn,
    slots,
    createdAt: toIsoString(row.createdAt),
    updatedAt: toIsoString(row.updatedAt),
  };
}

function asDate(value: string) {
  return new Date(value);
}

/**
 * Adaptador PostgreSQL por usuario. Hidrata el agregado que usa el servicio
 * y lo sincroniza dentro de una transacción HTTP de Neon al terminar cada
 * mutación, sin exponer datos de otros usuarios.
 */
export class PostgresNutritionRepository implements NutritionRepository {
  constructor(
    private readonly databaseFactory: () => NutritionDatabase = getDatabase,
  ) {}

  async ensureWorkspace(userId: string): Promise<void> {
    const database = this.databaseFactory();
    const [user] = await database
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      throw new NotFoundError("No se ha encontrado el espacio de usuario.");
    }

    const [existingPlan] = await database
      .select({ id: weeklyPlans.id })
      .from(weeklyPlans)
      .where(eq(weeklyPlans.ownerId, userId))
      .limit(1);

    if (existingPlan) {
      return;
    }

    const now = new Date();
    const planId = userId;
    const defaultSlots = WEEKDAYS.flatMap((day) =>
      MEAL_TYPES.map((meal) => ({
        weeklyPlanId: planId,
        id: createSlotId(day.id, meal.id),
        day: day.id,
        meal: meal.id,
        time: SLOT_DEFAULT_TIMES[meal.id],
      })),
    );

    await database.batch([
      database
        .insert(weeklyPlans)
        .values({
          id: planId,
          ownerId: userId,
          name: "Mi menú recurrente",
          kind: "repeating",
          startsOn: null,
          endsOn: null,
          createdAt: now,
          updatedAt: now,
        })
        .onConflictDoNothing({ target: weeklyPlans.ownerId }),
      database
        .insert(mealSlots)
        .values(defaultSlots)
        .onConflictDoNothing({ target: [mealSlots.weeklyPlanId, mealSlots.id] }),
    ]);
  }

  async read(userId: string): Promise<StoreData> {
    return this.readStore(userId);
  }

  async update<T>(
    userId: string,
    mutator: (data: StoreData) => T | Promise<T>,
  ): Promise<T> {
    const before = await this.readStore(userId);
    const draft = structuredClone(before);
    const result = await mutator(draft);

    validateStoreData(draft);
    await this.synchronize(userId, before, draft);
    return result;
  }

  private async readStore(userId: string): Promise<StoreData> {
    const database = this.databaseFactory();
    const [[user], [plan], recipeRows] = await Promise.all([
      database.select().from(users).where(eq(users.id, userId)).limit(1),
      database
        .select()
        .from(weeklyPlans)
        .where(eq(weeklyPlans.ownerId, userId))
        .limit(1),
      database.select().from(recipes).where(eq(recipes.ownerId, userId)),
    ]);

    if (!user) {
      throw new NotFoundError("No se ha encontrado el espacio de usuario.");
    }

    if (!plan) {
      throw new NotFoundError("No se ha encontrado el menú semanal.");
    }

    const [slotRows, ingredientRows, assignmentRows] = await Promise.all([
      database
        .select()
        .from(mealSlots)
        .where(eq(mealSlots.weeklyPlanId, plan.id)),
      recipeRows.length > 0
        ? database
            .select()
            .from(recipeIngredients)
            .where(inArray(recipeIngredients.recipeId, recipeRows.map((recipe) => recipe.id)))
            .orderBy(asc(recipeIngredients.position))
        : Promise.resolve([] as DatabaseIngredient[]),
      database
        .select()
        .from(mealSlotRecipeAssignments)
        .where(eq(mealSlotRecipeAssignments.weeklyPlanId, plan.id))
        .orderBy(asc(mealSlotRecipeAssignments.position)),
    ]);

    const ingredientsByRecipeId = new Map<string, Ingredient[]>();
    for (const ingredient of ingredientRows) {
      const ingredients = ingredientsByRecipeId.get(ingredient.recipeId) ?? [];
      ingredients.push({
        id: ingredient.id,
        name: ingredient.name,
        quantity: ingredient.quantity,
      });
      ingredientsByRecipeId.set(ingredient.recipeId, ingredients);
    }

    const recipeIdsBySlotId = new Map<string, string[]>();
    for (const assignment of assignmentRows as DatabaseSlotRecipeAssignment[]) {
      const recipeIds = recipeIdsBySlotId.get(assignment.slotId) ?? [];
      recipeIds.push(assignment.recipeId);
      recipeIdsBySlotId.set(assignment.slotId, recipeIds);
    }

    return validateStoreData({
      schemaVersion: 1,
      users: [toDomainUser(user)],
      recipes: recipeRows.map((recipe) => toDomainRecipe(recipe, ingredientsByRecipeId)),
      weeklyPlans: [
        toDomainPlan(
          plan,
          new Map(slotRows.map((slot) => [slot.id, slot])),
          recipeIdsBySlotId,
        ),
      ],
    });
  }

  private async synchronize(
    userId: string,
    before: StoreData,
    draft: StoreData,
  ): Promise<void> {
    const database = this.databaseFactory();
    const beforeRecipeIds = new Set(before.recipes.map((recipe) => recipe.id));
    const nextRecipeIds = new Set(draft.recipes.map((recipe) => recipe.id));
    const deletedRecipeIds = [...beforeRecipeIds].filter((id) => !nextRecipeIds.has(id));
    const plan = draft.weeklyPlans.find((item) => item.ownerId === userId);

    if (!plan) {
      throw new NotFoundError("No se ha encontrado el menú semanal.");
    }

    const statements: BatchItem<"pg">[] = [];

    statements.push(
      database
        .delete(mealSlotRecipeAssignments)
        .where(eq(mealSlotRecipeAssignments.weeklyPlanId, plan.id)),
    );

    if (deletedRecipeIds.length > 0) {
      statements.push(
        database.delete(recipes).where(
          and(eq(recipes.ownerId, userId), inArray(recipes.id, deletedRecipeIds)),
        ),
      );
    }

    if (draft.recipes.length > 0) {
      statements.push(
        database.delete(recipeIngredients).where(
          inArray(
            recipeIngredients.recipeId,
            draft.recipes.map((recipe) => recipe.id),
          ),
        ),
      );

      for (const recipe of draft.recipes) {
        statements.push(
          database
            .insert(recipes)
            .values({
              id: recipe.id,
              ownerId: recipe.ownerId,
              name: recipe.name,
              description: recipe.description,
              instructions: recipe.instructions,
              imageUrl: recipe.imageUrl,
              createdAt: asDate(recipe.createdAt),
              updatedAt: asDate(recipe.updatedAt),
            })
            .onConflictDoUpdate({
              target: recipes.id,
              set: {
                ownerId: recipe.ownerId,
                name: recipe.name,
                description: recipe.description,
                instructions: recipe.instructions,
                imageUrl: recipe.imageUrl,
                updatedAt: asDate(recipe.updatedAt),
              },
            }),
        );
      }

      for (const recipe of draft.recipes) {
        if (recipe.ingredients.length === 0) {
          continue;
        }

        statements.push(
          database.insert(recipeIngredients).values(
            recipe.ingredients.map((ingredient, position) => ({
              id: ingredient.id,
              recipeId: recipe.id,
              name: ingredient.name,
              quantity: ingredient.quantity,
              position,
            })),
          ),
        );
      }
    }

    statements.push(
      database
        .update(weeklyPlans)
        .set({
          name: plan.name,
          kind: plan.kind,
          startsOn: plan.startsOn,
          endsOn: plan.endsOn,
          updatedAt: asDate(plan.updatedAt),
        })
        .where(and(eq(weeklyPlans.id, plan.id), eq(weeklyPlans.ownerId, userId))),
    );

    for (const slot of plan.slots) {
      statements.push(
        database
          .insert(mealSlots)
          .values({
            weeklyPlanId: plan.id,
            id: slot.id,
            day: slot.day,
            meal: slot.meal,
            time: slot.time,
          })
          .onConflictDoUpdate({
            target: [mealSlots.weeklyPlanId, mealSlots.id],
            set: {
              day: slot.day,
              meal: slot.meal,
              time: slot.time,
            },
          }),
      );
    }

    const slotRecipeAssignments = plan.slots.flatMap((slot) =>
      slot.recipeIds.map((recipeId, position) => ({
        weeklyPlanId: plan.id,
        slotId: slot.id,
        recipeId,
        position,
      })),
    );

    if (slotRecipeAssignments.length > 0) {
      statements.push(
        database.insert(mealSlotRecipeAssignments).values(slotRecipeAssignments),
      );
    }

    if (statements.length === 0) {
      return;
    }

    await database.batch(
      statements as [BatchItem<"pg">, ...BatchItem<"pg">[]],
    );
  }
}
