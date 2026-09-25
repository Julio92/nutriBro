# Nutribro project instructions

- [x] Defined requirements: weekly nutrition MVP, TypeScript, responsive UI, local persistence, and tests.
- [x] Project initialized with Next.js App Router, TypeScript, Tailwind CSS, and ESLint.
- [x] Application customized with a decoupled domain, Route Handlers, JSON repository, recipe library, and weekly dashboard.
- [x] No additional VS Code extensions are required.
- [x] Validate changes with `npm run check` before integrating.
- [x] Use `npm run dev` for local development. Do not start persistent servers during a task unless needed for a focused verification.
- [x] Keep the README and docs in `docs/` updated when architecture, model, endpoints, or scope change.
- [x] Use the active task defined in `tasks/backlog.md` as the source of work for agents. Each task must include status, scope, and acceptance criteria.
- [x] For complex or multi-step work, create or update `tasks/tdd-backlog.md` as the execution plan before implementation begins.
- [x] Before editing code, the agent must explain the implementation plan and the validation it will run.

## Conventions

- Keep TypeScript strict and validate all HTTP input with Zod.
- Do not access persistence directly from components or Route Handlers; use `NutritionService` and `NutritionRepository`.
- Respect the separation of concerns: UI in `src/components`, domain in `src/domain`, application logic in `src/server/services`, and infrastructure in `src/server/infrastructure`.
- The recurring menu is the source of truth for the MVP. Do not add nutritional calculations, AI, authentication, or shopping lists without updating scope and documentation.
- The active file `data/nutrition-data.json` is local and must not be versioned. Reproducible data is in `data/demo-nutrition-data.json`.
- Before replacing JSON with a database, preserve the `NutritionRepository` contract and add migrations and integration tests.
- Preserve accessibility: labels, visible focus, contrast, and reduced-motion preferences.
- Every development task must be recorded in `tasks/backlog.md` with status `New | In Progress | Blocked | Review | Done` and clear acceptance criteria.
- If several tasks are open, the agent must work on the one marked as `In Progress` first or on the highest-priority available task.
- The agent must not begin a new task if the current task is not closed or if the scope is not explicitly defined.
- If a task requires scope expansion or architecture changes, it must be documented before implementation.
- The required validation is `npm run check` for integration merges, and UI/feature tasks should include a smoke test or additional documentation check when applicable.
- If a task requires user validation, ask for explicit confirmation before marking it as Done.
