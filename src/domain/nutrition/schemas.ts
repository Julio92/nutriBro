import { z, ZodError } from "zod";

import { MEAL_TYPE_IDS, WEEKDAY_IDS, type RecipeInput, type StoreData } from "./types";

const uuidSchema = z.string().uuid();
const slotIdPattern =
  /^(monday|tuesday|wednesday|thursday|friday|saturday|sunday)-(breakfast|midMorning|lunch|snack|dinner)$/;

export const recipeIdSchema = uuidSchema;
export const slotIdSchema = z.string().regex(slotIdPattern);

const recipeIdsSchema = z
  .array(recipeIdSchema)
  .max(50)
  .refine((recipeIds) => new Set(recipeIds).size === recipeIds.length, {
    message: "Una receta solo puede añadirse una vez a la misma comida.",
  });

const ingredientInputSchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    quantity: z.string().trim().max(48),
  })
  .strict();

const recipeTagValueSchema = z.string().trim().min(1).max(32);

export const recipeTagsSchema = z
  .array(recipeTagValueSchema)
  .max(12)
  .transform((values) => {
    const normalized: string[] = [];
    const seen = new Set<string>();

    for (const value of values) {
      const key = value.toLocaleLowerCase("en-US");
      if (seen.has(key)) {
        continue;
      }

      seen.add(key);
      normalized.push(value);
    }

    return normalized;
  });

function isHttpsImageUrlOrEmpty(value: string) {
  if (value.length === 0) {
    return true;
  }

  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

export const recipeInputSchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    description: z.string().trim().max(600),
    instructions: z.string().trim().min(1).max(8_000),
    imageUrl: z
      .string()
      .trim()
      .max(2_048)
      .refine(isHttpsImageUrlOrEmpty, {
        message: "La imagen debe usar una URL HTTPS válida.",
      }),
    tags: recipeTagsSchema.default([]),
    ingredients: z.array(ingredientInputSchema).min(1).max(50),
  })
  .strict();

export const assignmentInputSchema = z
  .object({
    recipeIds: recipeIdsSchema,
  })
  .strict();

const storedIngredientSchema = ingredientInputSchema.extend({
  id: uuidSchema,
});

const storedRecipeSchema = z
  .object({
    id: uuidSchema,
    ownerId: uuidSchema,
    name: z.string().min(1).max(120),
    description: z.string().max(600),
    instructions: z.string().min(1).max(8_000),
    imageUrl: z.string().url().nullable(),
    tags: recipeTagsSchema.default([]),
    ingredients: z.array(storedIngredientSchema).min(1).max(50),
    createdAt: z.string().min(1),
    updatedAt: z.string().min(1),
  })
  .strict();

const storedSlotBaseSchema = z
  .object({
    id: slotIdSchema,
    day: z.enum(WEEKDAY_IDS),
    meal: z.enum(MEAL_TYPE_IDS),
    time: z.string().max(10).nullable(),
  });

const storedSlotSchema = z.union([
  storedSlotBaseSchema
    .extend({ recipeIds: recipeIdsSchema })
    .strict(),
  storedSlotBaseSchema
    .extend({ recipeId: uuidSchema.nullable() })
    .strict()
    .transform(({ recipeId, ...slot }) => ({
      ...slot,
      recipeIds: recipeId ? [recipeId] : [],
    })),
]);

const storedPlanSchema = z
  .object({
    id: uuidSchema,
    ownerId: uuidSchema,
    name: z.string().min(1).max(120),
    kind: z.literal("repeating"),
    startsOn: z.string().nullable(),
    endsOn: z.string().nullable(),
    slots: z.array(storedSlotSchema).min(1),
    createdAt: z.string().min(1),
    updatedAt: z.string().min(1),
  })
  .strict();

const storedUserSchema = z
  .object({
    id: uuidSchema,
    displayName: z.string().min(1).max(120),
    email: z.string().email().nullable(),
    role: z.literal("owner"),
    createdAt: z.string().min(1),
  })
  .strict();

const storeDataSchema = z
  .object({
    schemaVersion: z.literal(1),
    users: z.array(storedUserSchema).min(1),
    recipes: z.array(storedRecipeSchema),
    weeklyPlans: z.array(storedPlanSchema).min(1),
  })
  .strict();

export function parseRecipeInput(raw: unknown): RecipeInput {
  return recipeInputSchema.parse(raw);
}

export function parseRecipeId(raw: unknown) {
  return recipeIdSchema.parse(raw);
}

export function parseSlotId(raw: unknown) {
  return slotIdSchema.parse(raw);
}

export function parseAssignmentInput(raw: unknown) {
  return assignmentInputSchema.parse(raw);
}

export function fieldErrorsFromZod(error: ZodError) {
  const fields: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const field = issue.path.join(".") || "form";
    fields[field] ??= [];
    fields[field].push(issue.message);
  }

  return fields;
}

export function validateStoreData(raw: unknown): StoreData {
  const parsed = storeDataSchema.safeParse(raw);

  if (!parsed.success) {
    throw new Error("El archivo de datos no tiene una estructura válida.");
  }

  const data = parsed.data as StoreData;
  assertStoreInvariants(data);
  return data;
}

function assertStoreInvariants(data: StoreData) {
  const userIds = new Set(data.users.map((user) => user.id));
  const recipeIds = new Set<string>();
  const recipesById = new Map<string, string>();

  for (const recipe of data.recipes) {
    if (recipeIds.has(recipe.id)) {
      throw new Error("El archivo de datos contiene recetas duplicadas.");
    }

    if (!userIds.has(recipe.ownerId)) {
      throw new Error("Una receta apunta a un usuario inexistente.");
    }

    recipeIds.add(recipe.id);
    recipesById.set(recipe.id, recipe.ownerId);
  }

  for (const plan of data.weeklyPlans) {
    if (!userIds.has(plan.ownerId)) {
      throw new Error("Un plan apunta a un usuario inexistente.");
    }

    const slotIds = new Set<string>();
    for (const slot of plan.slots) {
      if (slotIds.has(slot.id)) {
        throw new Error("Un plan contiene comidas duplicadas.");
      }

      if (!slot.id.startsWith(`${slot.day}-`) || !slot.id.endsWith(`-${slot.meal}`)) {
        throw new Error("Una comida no coincide con su día o tipo.");
      }

      for (const recipeId of slot.recipeIds) {
        if (!recipeIds.has(recipeId)) {
          throw new Error("Una comida apunta a una receta inexistente.");
        }

        if (recipesById.get(recipeId) !== plan.ownerId) {
          throw new Error("Una comida apunta a una receta de otro usuario.");
        }
      }

      slotIds.add(slot.id);
    }
  }
}
