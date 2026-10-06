import { z, ZodError } from "zod";

import type { MealVisibilityPreferences } from "./types";

export const mealVisibilityPreferencesSchema = z
  .object({
    breakfast: z.boolean(),
    midMorning: z.boolean(),
    lunch: z.boolean(),
    snack: z.boolean(),
    dinner: z.boolean(),
  })
  .strict();

export function parseMealVisibilityPreferences(
  raw: unknown,
): MealVisibilityPreferences {
  return mealVisibilityPreferencesSchema.parse(raw);
}

export function fieldErrorsFromPreferencesSchema(error: ZodError) {
  const fields: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const field = issue.path.join(".") || "form";
    fields[field] ??= [];
    fields[field].push(issue.message);
  }

  return fields;
}
