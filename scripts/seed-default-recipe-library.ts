import { config } from "dotenv";

import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { z } from "zod";

import { seedDefaultRecipeLibrary } from "../src/server/infrastructure/default-recipe-library";
import {
  databaseSchema,
  users,
} from "../src/server/infrastructure/database/schema";

config({ path: ".env.local", quiet: true });

const confirmation = process.env.NUTRITION_DEFAULT_RECIPES_CONFIRM;
const explicitUserId = process.env.NUTRITION_DEFAULT_RECIPES_USER_ID?.trim();
const useSoleUser = process.env.NUTRITION_DEFAULT_RECIPES_USE_SOLE_USER === "1";
const databaseUrl = process.env.DATABASE_URL?.trim();

if (!databaseUrl) {
  throw new Error("Falta DATABASE_URL.");
}

if (confirmation !== "add") {
  throw new Error(
    "La operación añade la biblioteca predeterminada. Define NUTRITION_DEFAULT_RECIPES_CONFIRM=add.",
  );
}

if (!explicitUserId && !useSoleUser) {
  throw new Error(
    "Define NUTRITION_DEFAULT_RECIPES_USER_ID o NUTRITION_DEFAULT_RECIPES_USE_SOLE_USER=1.",
  );
}

const database = drizzle({
  client: neon(databaseUrl),
  schema: databaseSchema,
});

const targetUserId = explicitUserId
  ? z.string().uuid().parse(explicitUserId)
  : await resolveSoleUserId();

const [user] = await database
  .select({ id: users.id })
  .from(users)
  .where(eq(users.id, targetUserId))
  .limit(1);

if (!user) {
  throw new Error("El usuario destino no existe.");
}

const result = await seedDefaultRecipeLibrary(database, targetUserId);

console.log(
  result.seeded
    ? `Añadidas ${result.recipeCount} recetas predeterminadas.`
    : "La cuenta ya tiene la biblioteca predeterminada actual.",
);

async function resolveSoleUserId() {
  const candidates = await database.select({ id: users.id }).from(users).limit(2);

  if (candidates.length !== 1) {
    throw new Error(
      "La base de datos no tiene una única cuenta. Define NUTRITION_DEFAULT_RECIPES_USER_ID explícitamente.",
    );
  }

  return candidates[0].id;
}
