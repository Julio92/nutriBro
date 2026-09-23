import { randomUUID } from "node:crypto";

import {
  foreignKey,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

function createdAtColumn() {
  return timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull();
}

function timestampColumns() {
  return {
    createdAt: createdAtColumn(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .notNull(),
  };
}

/**
 * Auth.js gestiona estos usuarios. Las entidades de Nutribro se particionan
 * por `ownerId`, que referencia `users.id`.
 */
export const users = pgTable("users", {
  id: uuid("id").primaryKey().$defaultFn(randomUUID),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("email_verified", { mode: "date", withTimezone: true }),
  image: text("image"),
  createdAt: createdAtColumn(),
});

export const authAccounts = pgTable(
  "auth_accounts",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (table) => [
    primaryKey({ columns: [table.provider, table.providerAccountId] }),
    index("auth_accounts_user_id_idx").on(table.userId),
  ],
);

export const authSessions = pgTable(
  "auth_sessions",
  {
    sessionToken: text("session_token").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date", withTimezone: true }).notNull(),
  },
  (table) => [index("auth_sessions_user_id_idx").on(table.userId)],
);

export const authVerificationTokens = pgTable(
  "auth_verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date", withTimezone: true }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.identifier, table.token] })],
);

/**
 * Las contraseñas nunca se almacenan en `users`: únicamente su hash Argon2id
 * queda en esta tabla, que se elimina al borrar la cuenta.
 */
export const userCredentials = pgTable("user_credentials", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  passwordHash: text("password_hash").notNull(),
  passwordUpdatedAt: timestamp("password_updated_at", {
    mode: "date",
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
  createdAt: createdAtColumn(),
});

/** Registra qué versión de la biblioteca inicial recibió cada cuenta. */
export const userDefaultRecipeLibraries = pgTable("user_default_recipe_libraries", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  version: integer("version").notNull(),
  seededAt: timestamp("seeded_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const recipes = pgTable(
  "recipes",
  {
    id: uuid("id").primaryKey(),
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description").notNull(),
    instructions: text("instructions").notNull(),
    imageUrl: text("image_url"),
    ...timestampColumns(),
  },
  (table) => [index("recipes_owner_updated_at_idx").on(table.ownerId, table.updatedAt)],
);

export const recipeIngredients = pgTable(
  "recipe_ingredients",
  {
    id: uuid("id").primaryKey(),
    recipeId: uuid("recipe_id")
      .notNull()
      .references(() => recipes.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    quantity: text("quantity").notNull(),
    position: integer("position").notNull(),
  },
  (table) => [index("recipe_ingredients_recipe_position_idx").on(table.recipeId, table.position)],
);

export const userRecipeTags = pgTable(
  "user_recipe_tags",
  {
    id: uuid("id").primaryKey(),
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    value: text("value").notNull(),
    createdAt: createdAtColumn(),
  },
  (table) => [uniqueIndex("user_recipe_tags_owner_value_idx").on(table.ownerId, table.value)],
);

export const recipeTags = pgTable(
  "recipe_tags",
  {
    recipeId: uuid("recipe_id")
      .notNull()
      .references(() => recipes.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => userRecipeTags.id, { onDelete: "cascade" }),
    position: integer("position").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.recipeId, table.tagId] }),
    uniqueIndex("recipe_tags_recipe_position_idx").on(table.recipeId, table.position),
    index("recipe_tags_tag_id_idx").on(table.tagId),
  ],
);

export const weeklyPlans = pgTable(
  "weekly_plans",
  {
    id: uuid("id").primaryKey(),
    ownerId: uuid("owner_id")
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    kind: text("kind").notNull(),
    startsOn: text("starts_on"),
    endsOn: text("ends_on"),
    ...timestampColumns(),
  },
);

export const mealSlots = pgTable(
  "meal_slots",
  {
    weeklyPlanId: uuid("weekly_plan_id")
      .notNull()
      .references(() => weeklyPlans.id, { onDelete: "cascade" }),
    id: text("id").notNull(),
    day: text("day").notNull(),
    meal: text("meal").notNull(),
    time: text("time"),
  },
  (table) => [
    primaryKey({ columns: [table.weeklyPlanId, table.id] }),
    uniqueIndex("meal_slots_plan_day_meal_idx").on(
      table.weeklyPlanId,
      table.day,
      table.meal,
    ),
  ],
);

/** Recetas ordenadas asignadas a un hueco; un hueco puede contener varias. */
export const mealSlotRecipeAssignments = pgTable(
  "meal_slot_recipe_assignments",
  {
    weeklyPlanId: uuid("weekly_plan_id").notNull(),
    slotId: text("slot_id").notNull(),
    recipeId: uuid("recipe_id")
      .notNull()
      .references(() => recipes.id, { onDelete: "cascade" }),
    position: integer("position").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.weeklyPlanId, table.slotId, table.recipeId] }),
    foreignKey({
      columns: [table.weeklyPlanId, table.slotId],
      foreignColumns: [mealSlots.weeklyPlanId, mealSlots.id],
      name: "meal_slot_recipe_assignments_slot_fk",
    }).onDelete("cascade"),
    uniqueIndex("meal_slot_recipe_assignments_plan_slot_position_idx").on(
      table.weeklyPlanId,
      table.slotId,
      table.position,
    ),
    index("meal_slot_recipe_assignments_recipe_id_idx").on(table.recipeId),
  ],
);

export const databaseSchema = {
  users,
  authAccounts,
  authSessions,
  authVerificationTokens,
  userCredentials,
  userDefaultRecipeLibraries,
  recipes,
  recipeIngredients,
  userRecipeTags,
  recipeTags,
  weeklyPlans,
  mealSlots,
  mealSlotRecipeAssignments,
};
