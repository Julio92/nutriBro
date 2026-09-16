import { config } from "dotenv";

import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { neon } from "@neondatabase/serverless";
import { and, eq } from "drizzle-orm";
import type { BatchItem } from "drizzle-orm/batch";
import { drizzle } from "drizzle-orm/neon-http";

import { DEFAULT_OWNER_ID } from "../src/domain/nutrition/constants";
import { validateStoreData } from "../src/domain/nutrition/schemas";
import type { WeeklyPlan } from "../src/domain/nutrition/types";
import {
  mealSlots,
  mealSlotRecipeAssignments,
  recipeIngredients,
  recipes,
  users,
  weeklyPlans,
} from "../src/server/infrastructure/database/schema";

config({ path: ".env.local", quiet: true });

const confirmation = process.env.NUTRITION_IMPORT_CONFIRM;
const targetUserId = process.env.NUTRITION_IMPORT_USER_ID?.trim();
const sourceOwnerId = process.env.NUTRITION_IMPORT_SOURCE_OWNER_ID?.trim() || DEFAULT_OWNER_ID;
const sourceFile = resolve(
  process.cwd(),
  process.env.NUTRITION_IMPORT_FILE?.trim() || "data/nutrition-data.json",
);
const databaseUrl = process.env.DATABASE_URL?.trim();

if (!databaseUrl) {
  throw new Error("Falta DATABASE_URL.");
}

if (!targetUserId) {
  throw new Error("Falta NUTRITION_IMPORT_USER_ID con el UUID de un usuario de Auth.js.");
}

if (confirmation !== "replace") {
  throw new Error(
    "La importación reemplaza las recetas y el menú del usuario destino. Define NUTRITION_IMPORT_CONFIRM=replace.",
  );
}

const source = validateStoreData(JSON.parse(await readFile(sourceFile, "utf8")) as unknown);
const sourcePlan = source.weeklyPlans.find((plan) => plan.ownerId === sourceOwnerId);
const sourceRecipes = source.recipes.filter((recipe) => recipe.ownerId === sourceOwnerId);

if (!sourcePlan) {
  throw new Error("No se ha encontrado el plan del propietario de origen en el JSON.");
}

const database = drizzle({
  client: neon(databaseUrl),
  schema: {
    users,
    recipes,
    recipeIngredients,
    weeklyPlans,
    mealSlots,
    mealSlotRecipeAssignments,
  },
});
const [targetUser] = await database
  .select({ id: users.id })
  .from(users)
  .where(eq(users.id, targetUserId))
  .limit(1);

if (!targetUser) {
  throw new Error("El usuario destino no existe todavía. Inicia sesión una vez antes de importar.");
}

const [existingPlan] = await database
  .select({ id: weeklyPlans.id })
  .from(weeklyPlans)
  .where(eq(weeklyPlans.ownerId, targetUserId))
  .limit(1);
const targetPlanId = existingPlan?.id ?? randomUUID();
const recipeIds = new Map(sourceRecipes.map((recipe) => [recipe.id, randomUUID()]));
const statements: BatchItem<"pg">[] = [
  database.delete(mealSlots).where(eq(mealSlots.weeklyPlanId, targetPlanId)),
  database.delete(recipes).where(eq(recipes.ownerId, targetUserId)),
];

if (existingPlan) {
  statements.push(
    database
      .update(weeklyPlans)
      .set(toPlanValues(sourcePlan))
      .where(and(eq(weeklyPlans.id, targetPlanId), eq(weeklyPlans.ownerId, targetUserId))),
  );
} else {
  statements.push(
    database.insert(weeklyPlans).values({
      id: targetPlanId,
      ownerId: targetUserId,
      ...toPlanValues(sourcePlan),
    }),
  );
}

for (const recipe of sourceRecipes) {
  const recipeId = recipeIds.get(recipe.id);

  if (!recipeId) {
    throw new Error("No se ha podido asignar un identificador a una receta importada.");
  }

  statements.push(
    database.insert(recipes).values({
      id: recipeId,
      ownerId: targetUserId,
      name: recipe.name,
      description: recipe.description,
      instructions: recipe.instructions,
      imageUrl: recipe.imageUrl,
      createdAt: new Date(recipe.createdAt),
      updatedAt: new Date(recipe.updatedAt),
    }),
  );
  statements.push(
    database.insert(recipeIngredients).values(
      recipe.ingredients.map((ingredient, position) => ({
        id: randomUUID(),
        recipeId,
        name: ingredient.name,
        quantity: ingredient.quantity,
        position,
      })),
    ),
  );
}

statements.push(
  database.insert(mealSlots).values(
    sourcePlan.slots.map((slot) => ({
      weeklyPlanId: targetPlanId,
      id: slot.id,
      day: slot.day,
      meal: slot.meal,
      time: slot.time,
    })),
  ),
);

const slotRecipeAssignments = sourcePlan.slots.flatMap((slot) =>
  slot.recipeIds.map((sourceRecipeId, position) => {
    const recipeId = recipeIds.get(sourceRecipeId);

    if (!recipeId) {
      throw new Error("Una comida del JSON apunta a una receta no importada.");
    }

    return {
      weeklyPlanId: targetPlanId,
      slotId: slot.id,
      recipeId,
      position,
    };
  }),
);

if (slotRecipeAssignments.length > 0) {
  statements.push(
    database.insert(mealSlotRecipeAssignments).values(slotRecipeAssignments),
  );
}

await database.batch(
  statements as [BatchItem<"pg">, ...BatchItem<"pg">[]],
);

console.log(
  `Importadas ${sourceRecipes.length} recetas y ${sourcePlan.slots.length} comidas en la cuenta destino.`,
);

function toPlanValues(plan: WeeklyPlan) {
  return {
    name: plan.name,
    kind: plan.kind,
    startsOn: plan.startsOn,
    endsOn: plan.endsOn,
    createdAt: new Date(plan.createdAt),
    updatedAt: new Date(plan.updatedAt),
  };
}
