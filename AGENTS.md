<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Agent workflow for Nutribro

- Work from the active task recorded in `tasks/backlog.md`.
- Each task must have a status: `New`, `In Progress`, `Blocked`, `Review`, or `Done`.
- For complex or multi-step work, create or update `tasks/tdd-backlog.md` as the execution plan before implementation begins.
- Before editing production code, explain the plan and the validation you will run.
- Do not broaden scope beyond the task unless the task explicitly requires it.
- Validate with `npm run check` before integration.
