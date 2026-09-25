# T-013 execution plan

## Objective
Add tag-based filtering to the "Asignar recetas" panel so users can narrow the visible recipe list by one or more existing recipe tags while keeping the current recipe-name search and assignment workflow intact.

## Scope
- Add an existing-tag selector beneath the recipe-name search field in the assignment panel
- Support toggling tag chips on and off with multi-select behavior
- Combine tag filtering with the current text search without changing assignment actions or saved results
- Keep empty, missing, and duplicate tag data safe for rendering and filtering
- Validate the change with a focused UI smoke test and the repository check

## Can this task be split into subtasks?
Yes. This task fits a 3-step plan:
1. Trace the current assignment-panel search and list filtering flow
2. Add tag chips and combine them with the text filter logic
3. Validate the UI behavior and project checks

## Files to inspect
- src/components/assignment-dialog.tsx
- src/components/recipe-library.tsx
- src/domain/nutrition/types.ts
- any helper or state logic used to filter the assignment recipe list
- any existing tag UI or tag-related model code introduced in the recipe-tag work

## Ordered implementation steps
### 1) Locate the current assignment-panel filtering behavior
- Identify the search input and the code that derives the visible recipe list in the "Asignar recetas" panel.
- Confirm how recipe tags are represented in the current data model and whether they are already available in the assignment view.
- Trace the current name-search logic to understand the right place to add a second filter without replacing the search behavior.
- Check whether the list is already memoized or filtered in a helper so the tag logic can be introduced cleanly.

### 2) Add the tag chip UI and merge it with the search filter
- Render all available existing tags directly under the recipe-name search field in the panel.
- Make each tag clickable so it toggles selected vs. unselected state and supports multiple active tags at the same time.
- Filter the panel list to show only recipes matching all active tags, while still applying the active name search.
- Ensure the filter can be cleared by toggling the selected tag off without breaking the list state or layout.
- Keep the filter UI compact and accessible within the current panel layout.

### 3) Validate the behavior and repository checks
- Review the assignment panel in a browser to confirm the tag chips appear under the search box and behave correctly.
- Test one-tag and multi-tag filtering flows, then clear the selection and confirm the list restores correctly.
- Confirm the existing name search continues to work alongside the tag filter.
- Run the repository validation command: npm run check.

## Validation checklist
- Tag chips appear beneath the recipe-name search field in the assignment panel
- Clicking a tag toggles it on and off, with multiple tags allowed at once
- Matching recipes update based on the active tag selection and text search together
- Clearing all selected tags restores the original recipe list behavior
- npm run check passes

## Risk notes
- The main risk is replacing the current name-search logic instead of combining it with the tag filter, which would change the assignment flow unexpectedly.
- Some recipes may have missing, empty, or duplicate tag values; the filter should handle those cases gracefully without breaking the UI.
- The panel layout is narrow, so the tag selector should remain compact and not disturb the recipe list or selection area.
