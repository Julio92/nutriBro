import "server-only";

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import { ConfigurationError } from "@/server/services/errors";

import { databaseSchema } from "./schema";

function createDatabase(connectionString: string) {
  return drizzle({
    client: neon(connectionString),
    schema: databaseSchema,
  });
}

export type NutritionDatabase = ReturnType<typeof createDatabase>;

let database: NutritionDatabase | undefined;

export function getDatabase() {
  const connectionString = process.env.DATABASE_URL?.trim();

  if (!connectionString) {
    throw new ConfigurationError("Falta configurar DATABASE_URL para conectar con PostgreSQL.");
  }

  database ??= createDatabase(connectionString);
  return database;
}
