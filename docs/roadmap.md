# Evolution roadmap

## Version 1.0 — Recurring menu (implemented)

- 7-day × 5-meal menu and priority view of the current day.
- Reusable recipes with CRUD, dynamic ingredients, search, and assignment to slots.
- Light/dark theme, responsive layout, basic accessibility, and domain tests.

## Version 1.1 — Personal data and accounts (implemented)

- Neon PostgreSQL, Drizzle schema, and versioned SQL migrations.
- Local sign-up and sign-in with email/password, Argon2id hashes, and Auth.js JWT sessions.
- Isolation of recipes and menus by user, with automatic provisioning of 35 slots.
- Versioned starter library of 21 plan recipes, copied and edited privately per account.
- Explicit import of legacy JSON and demo data without exposing shared data during sign-up.
- Preparation for Vercel deployment without depending on a local disk.

Final verification of migrations, sign-up, and persistence remains conditional on configuring a Neon development database and the local `DATABASE_URL` and `AUTH_SECRET` variables.

## Version 1.2 — Operational quality

- Profile screen with name, image, account deletion, and session control.
- Password change and recovery, email verification, rate limiting, and E2E tests.
- Add OAuth or magic links only when they provide value and with an explicit account-linking strategy.

## Version 2.0 — Spaces and date-based planning

- ISO week calendar and temporal navigation.
- Base recurring plan plus dated overrides, templates, and one-off exceptions.
- Shared spaces, memberships, explicit roles, and change auditing.
- History of plans and used recipes.

## Version 3.0 — Nutrition and goals

- Food catalog with normalized units.
- Nutrients per ingredient, recipe, meal, and day.
- Personal goals, preferences, allergies, and warnings for incomplete information.
- Source, date, and rounding traceability.

## Version 3.1 — Shopping list

- Ingredient aggregation based on selected slots.
- Consolidation of equivalent units with manual review.
- Pantry exclusions, categories, and purchase status.
- Share or print the list.

## Version 4.0 — Responsible automation

- Optional suggestions based on explicit preferences.
- Explanation of each suggestion and human approval before applying it.
- No health calculation or recommendation without clear data, source, and limits.

## Priority criteria

1. Maintain resource-level authorization even when adding roles or shared spaces.
2. Do not introduce nutrition before normalizing ingredients and units.
3. Apply migrations and backups before enabling schema changes in production.
4. Keep manual editing as the primary path even with automation.
