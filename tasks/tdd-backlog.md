# T-012 execution plan

## Objective
Update the recipe cards in the "Asignar Recetas" view so they display the recipe tags when available instead of the ingredient count beneath the title, while preserving the rest of the assignment flow and card layout.

## Scope
- Limit the change to the metadata displayed in the assignment-card list
- Keep recipe selection, assignment logic, and persistence behavior untouched
- Preserve the current card layout and ensure empty or missing tag data does not break rendering
- Validate the change using project checks and a targeted UI smoke check

## Can this task be split into subtasks?
Yes. This task is small enough to stay focused, but it still benefits from a 3-step division:
1. Trace the card rendering and confirm the tag data shape
2. Replace the ingredient-count line with a tag-based metadata display and handle empty-state cases
3. Verify the UI and run repository validation

## Files to inspect
- src/components/assignment-dialog.tsx
- src/components/recipe-library.tsx
- src/domain/nutrition/types.ts
- any card or list item helper used by the assignment view
- any related tests for recipe card rendering if present

## Ordered implementation steps
### 1) Locate the exact render path for the assignment-card metadata
- Find the recipe list item component used in the "Asignar Recetas" workflow.
- Confirm where the ingredient count is currently rendered under each card title.
- Verify the shape and availability of the recipe tag field so the UI can render tags safely when present.
- Check whether the assignment view already receives tag data from the recipe model or needs no additional pass-through.

### 2) Update the metadata display logic
- Replace the ingredient-count text with a tag display for each recipe card when one or more tags exist.
- Preserve the existing layout and spacing so the card still feels consistent.
- Ensure cards without tags render cleanly without an empty or broken meta line.
- Keep the user-visible behavior contained to the display text only; do not affect assignment behavior or data persistence.

### 3) Validate the UI and project checks
- Review the assignment view in the browser to confirm the list shows tags instead of ingredient count.
- Verify cards with no tags remain visually acceptable and the overall selection experience is unchanged.
- Run the repository validation command: npm run check.

## Validation checklist
- Browser smoke test in the "Asignar Recetas" view
- Confirm tags appear where expected and ingredient counts are no longer shown
- Confirm cards without tags do not break layout
- npm run check passes

## Risk notes
- The task is UI-only, so the biggest risk is accidentally changing the card structure or the assignment selection flow while adjusting metadata.
- Some recipe objects may have undefined, empty, or missing tag arrays; handling that gracefully is required to avoid broken rendering.
- If the naming or rendering pattern for tags differs from the rest of the app, keep the change minimal and consistent with existing recipe metadata styling.
