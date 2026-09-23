import "server-only";

import { randomUUID } from "node:crypto";

import { and, asc, eq, inArray, sql } from "drizzle-orm";
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
  recipeTags,
  recipes,
  userRecipeTags,
  users,
  weeklyPlans,
} from "@/server/infrastructure/database/schema";
import type { NutritionRepository } from "@/server/repositories/nutrition-repository";
import { NotFoundError } from "@/server/services/errors";

type DatabaseUser = typeof users.$inferSelect;
type DatabaseRecipe = typeof recipes.$inferSelect;
type DatabaseIngredient = typeof recipeIngredients.$inferSelect;
type DatabaseUserTag = typeof userRecipeTags.$inferSelect;
type DatabaseRecipeTag = typeof recipeTags.$inferSelect;
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
  tagsByRecipeId: Map<string, string[]>,
): Recipe {
  return {
    id: row.id,
    ownerId: row.ownerId,
    name: row.name,
    description: row.description,
    instructions: row.instructions,
    imageUrl: row.imageUrl,
    tags: tagsByRecipeId.get(row.id) ?? [],
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

  private async ensureRecipeTagTables(database: NutritionDatabase): Promise<void> {
    const rows = await database.execute(sql`
      SELECT
        to_regclass('public.user_recipe_tags') AS user_recipe_tags,
        to_regclass('public.recipe_tags') AS recipe_tags;
    `);

    const firstRow = Array.isArray(rows) ? rows[0] : null;
    const hasUserRecipeTags = Boolean((firstRow as { user_recipe_tags?: string } | null)?.user_recipe_tags);
    const hasRecipeTags = Boolean((firstRow as { recipe_tags?: string } | null)?.recipe_tags);

    if (!hasUserRecipeTags) {
      await database.execute(sql`
        CREATE TABLE IF NOT EXISTS "user_recipe_tags" (
          "id" uuid PRIMARY KEY NOT NULL,
          "owner_id" uuid NOT NULL,
          "value" text NOT NULL,
          "created_at" timestamp with time zone DEFAULT now() NOT NULL,
          CONSTRAINT "user_recipe_tags_owner_id_users_id_fk"
            FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action
        );
      `);
      await database.execute(sql`
        CREATE UNIQUE INDEX IF NOT EXISTS "user_recipe_tags_owner_value_idx"
          ON "user_recipe_tags" USING btree ("owner_id","value");
      `);
    }

    if (!hasRecipeTags) {
      await database.execute(sql`
        CREATE TABLE IF NOT EXISTS "recipe_tags" (
          "recipe_id" uuid NOT NULL,
          "tag_id" uuid NOT NULL,
          "position" integer NOT NULL,
          PRIMARY KEY ("recipe_id", "tag_id"),
          CONSTRAINT "recipe_tags_recipe_id_recipes_id_fk"
            FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action,
          CONSTRAINT "recipe_tags_tag_id_user_recipe_tags_id_fk"
            FOREIGN KEY ("tag_id") REFERENCES "public"."user_recipe_tags"("id") ON DELETE cascade ON UPDATE no action
        );
      `);
      await database.execute(sql`
        CREATE UNIQUE INDEX IF NOT EXISTS "recipe_tags_recipe_position_idx"
          ON "recipe_tags" USING btree ("recipe_id","position");
      `);
      await database.execute(sql`
        CREATE INDEX IF NOT EXISTS "recipe_tags_tag_id_idx"
          ON "recipe_tags" USING btree ("tag_id");
      `);
    }
  }

  private async readStore(userId: string): Promise<StoreData> {
    const database = this.databaseFactory();
    await this.ensureRecipeTagTables(database);

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

    const recipeIds = recipeRows.map((recipe) => recipe.id);

    const [slotRows, ingredientRows, assignmentRows, tagRows, recipeTagRows] = await Promise.all([
      database
        .select()
        .from(mealSlots)
        .where(eq(mealSlots.weeklyPlanId, plan.id)),
      recipeIds.length > 0
        ? database
            .select()
            .from(recipeIngredients)
            .where(inArray(recipeIngredients.recipeId, recipeIds))
            .orderBy(asc(recipeIngredients.position))
        : Promise.resolve([] as DatabaseIngredient[]),
      database
        .select()
        .from(mealSlotRecipeAssignments)
        .where(eq(mealSlotRecipeAssignments.weeklyPlanId, plan.id))
        .orderBy(asc(mealSlotRecipeAssignments.position)),
      database
        .select()
        .from(userRecipeTags)
        .where(eq(userRecipeTags.ownerId, userId)),
      recipeIds.length > 0
        ? database
            .select()
            .from(recipeTags)
            .where(inArray(recipeTags.recipeId, recipeIds))
            .orderBy(asc(recipeTags.position))
        : Promise.resolve([] as DatabaseRecipeTag[]),
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

    const tagValuesById = new Map<string, string>();
    for (const tag of tagRows as DatabaseUserTag[]) {
      tagValuesById.set(tag.id, tag.value);
    }

    const tagsByRecipeId = new Map<string, string[]>();
    for (const relation of recipeTagRows as DatabaseRecipeTag[]) {
      const tagValue = tagValuesById.get(relation.tagId);
      if (!tagValue) {
        continue;
      }

      const tags = tagsByRecipeId.get(relation.recipeId) ?? [];
      tags.push(tagValue);
      tagsByRecipeId.set(relation.recipeId, tags);
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
      recipes: recipeRows.map((recipe) =>
        toDomainRecipe(recipe, ingredientsByRecipeId, tagsByRecipeId),
      ),
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
        database.delete(recipeTags).where(inArray(recipeTags.recipeId, deletedRecipeIds)),
      );
      statements.push(
        database.delete(recipes).where(
          and(eq(recipes.ownerId, userId), inArray(recipes.id, deletedRecipeIds)),
        ),
      );
    }

    if (draft.recipes.length > 0) {
      statements.push(
        database.delete(recipeTags).where(
          inArray(
            recipeTags.recipeId,
            draft.recipes.map((recipe) => recipe.id),
          ),
        ),
      );
      statements.push(
        database.delete(recipeIngredients).where(
          inArray(
            recipeIngredients.recipeId,
            draft.recipes.map((recipe) => recipe.id),
          ),
        ),
      );

      const tagRowsToInsert: Array<{
        id: string;
        ownerId: string;
        value: string;
        createdAt: Date;
      }> = [];
      const recipeTagRows: Array<{ recipeId: string; tagId: string; position: number }> = [];
      const tagValuesByKey = new Map(
        (await database.select().from(userRecipeTags).where(eq(userRecipeTags.ownerId, userId))).map((tag) => [
          tag.value.toLocaleLowerCase("en-US"), tag,
        ]),
      );

      for (const recipe of draft.recipes) {
        const seenTagValues = new Set<string>();

        for (const [position, tagValue] of recipe.tags.entries()) {
          const normalizedTag = tagValue.trim();
          if (!normalizedTag) {
            continue;
          }

          const key = normalizedTag.toLocaleLowerCase("en-US");
          if (seenTagValues.has(key)) {
            continue;
          }
          seenTagValues.add(key);

          let persistedTag = tagValuesByKey.get(key) as DatabaseUserTag | undefined;
          if (!persistedTag) {
            persistedTag = {
              id: randomUUID(),
              ownerId: userId,
              value: normalizedTag,
              createdAt: new Date(),
            };
            tagValuesByKey.set(key, persistedTag);
            tagRowsToInsert.push(persistedTag);
          }

          recipeTagRows.push({
            recipeId: recipe.id,
            tagId: persistedTag.id,
            position,
          });
        }
      }

      if (tagRowsToInsert.length > 0) {
        statements.push(
          database.insert(userRecipeTags).values(tagRowsToInsert).onConflictDoNothing({
            target: [userRecipeTags.ownerId, userRecipeTags.value],
          }),
        );
      }

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

      if (recipeTagRows.length > 0) {
        statements.push(database.insert(recipeTags).values(recipeTagRows));
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
