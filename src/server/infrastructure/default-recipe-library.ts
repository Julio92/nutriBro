import { randomUUID } from "node:crypto";

import { eq } from "drizzle-orm";
import type { BatchItem } from "drizzle-orm/batch";

import {
  DEFAULT_RECIPE_LIBRARY_VERSION,
  createDefaultRecipeLibrary,
} from "@/domain/nutrition/default-recipe-library";
import type { NutritionDatabase } from "@/server/infrastructure/database/client";
import {
  recipeIngredients,
  recipes,
  userDefaultRecipeLibraries,
} from "@/server/infrastructure/database/schema";

export interface DefaultRecipeLibrarySeed {
  recipeCount: number;
  statements: BatchItem<"pg">[];
}

export interface DefaultRecipeLibrarySeedResult {
  seeded: boolean;
  recipeCount: number;
}

function isUniqueConstraintError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const databaseError = error as { code?: unknown; cause?: { code?: unknown } };
  return databaseError.code === "23505" || databaseError.cause?.code === "23505";
}

/** Construye la copia aislada de la biblioteca inicial para una cuenta. */
export function buildDefaultRecipeLibrarySeed(
  database: NutritionDatabase,
  userId: string,
  now = new Date(),
): DefaultRecipeLibrarySeed {
  const library = createDefaultRecipeLibrary(userId, now, randomUUID);
  const recipeRows = library.map(({ recipe }) => ({
    id: recipe.id,
    ownerId: recipe.ownerId,
    name: recipe.name,
    description: recipe.description,
    instructions: recipe.instructions,
    imageUrl: recipe.imageUrl,
    createdAt: new Date(recipe.createdAt),
    updatedAt: new Date(recipe.updatedAt),
  }));
  const ingredientRows = library.flatMap(({ recipe }) =>
    recipe.ingredients.map((ingredient, position) => ({
      id: ingredient.id,
      recipeId: recipe.id,
      name: ingredient.name,
      quantity: ingredient.quantity,
      position,
    })),
  );

  return {
    recipeCount: library.length,
    statements: [
      database.insert(recipes).values(recipeRows),
      database.insert(recipeIngredients).values(ingredientRows),
      database.insert(userDefaultRecipeLibraries).values({
        userId,
        version: DEFAULT_RECIPE_LIBRARY_VERSION,
        seededAt: now,
      }),
    ],
  };
}

/**
 * Añade la biblioteca inicial a una cuenta existente una única vez. La marca
 * de versión evita duplicados y permite que las recetas resultantes sigan
 * siendo completamente privadas y editables por su propietaria.
 */
export async function seedDefaultRecipeLibrary(
  database: NutritionDatabase,
  userId: string,
): Promise<DefaultRecipeLibrarySeedResult> {
  const [existingSeed] = await database
    .select({ version: userDefaultRecipeLibraries.version })
    .from(userDefaultRecipeLibraries)
    .where(eq(userDefaultRecipeLibraries.userId, userId))
    .limit(1);

  if (existingSeed?.version === DEFAULT_RECIPE_LIBRARY_VERSION) {
    return { seeded: false, recipeCount: 0 };
  }

  if (existingSeed) {
    throw new Error(
      `La cuenta ya tiene una versión incompatible de la biblioteca inicial (${existingSeed.version}).`,
    );
  }

  const seed = buildDefaultRecipeLibrarySeed(database, userId);

  try {
    await database.batch(
      seed.statements as [BatchItem<"pg">, ...BatchItem<"pg">[]],
    );
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      const [concurrentSeed] = await database
        .select({ version: userDefaultRecipeLibraries.version })
        .from(userDefaultRecipeLibraries)
        .where(eq(userDefaultRecipeLibraries.userId, userId))
        .limit(1);

      if (concurrentSeed?.version === DEFAULT_RECIPE_LIBRARY_VERSION) {
        return { seeded: false, recipeCount: 0 };
      }
    }

    throw error;
  }

  return { seeded: true, recipeCount: seed.recipeCount };
}
