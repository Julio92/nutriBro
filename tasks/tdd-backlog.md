## T-016 — Evaluate EasyUI and replace the auth forms

### Objective
Learn EasyUI’s documented installation, styling, and usage patterns by integrating its login and sign-up examples into NutriBro, replacing the existing auth form UI while preserving current authentication behavior.

### Scope
- Review the EasyUI introduction, quick-start, login, and sign-up references listed in `tasks/backlog.md`.
- Limit application changes to dependencies/configuration and the sign-in/sign-up UI or directly related tests/docs if needed.
- Preserve existing auth actions, field validation, feedback, navigation, and accessibility; do not change auth services or unrelated product features.

### Files and documentation to inspect
- `package.json` and the lockfile for package manager, current versions, and available scripts.
- `src/components/local-auth-forms.tsx` and related auth UI tests, if present.
- `src/app/sign-in/page.tsx`, `src/app/sign-in/actions.ts`, `src/app/sign-up/page.tsx`, and `src/app/sign-up/actions.ts`.
- `src/app/globals.css`, `src/app/layout.tsx`, and relevant auth/domain schemas to understand styling, layout, and validation contracts.
- The relevant Next.js guide under `node_modules/next/dist/docs/` before changing Next.js-facing code, as required by `AGENTS.md`.
- EasyUI official docs and both component examples to determine whether components are package-installed, copied, or generated, and identify dependencies, CSS setup, and supported framework assumptions.

### Ordered implementation units
1. **Confirm compatibility and integration method.** Read the official docs and current project setup; identify the minimal supported installation/configuration path, required peer dependencies, styles, and licensing/attribution requirements. Record any incompatibility or blocker before proceeding.
2. **Install and configure minimally.** Add only the dependencies and global/theme configuration required by the documented approach. Confirm the project still type-checks/builds before moving to UI replacement.
3. **Map current auth behavior.** Trace the existing sign-in/sign-up form props, server actions, schemas, errors/success states, links, and pending states. Keep the existing backend and validation contracts as the behavioral baseline.
4. **Integrate the login component.** Adapt the documented EasyUI login example to the current sign-in page and existing action/validation flow. Preserve accessible labels, keyboard behavior, errors, pending feedback, and navigation.
5. **Integrate the sign-up component.** Adapt the documented EasyUI sign-up example similarly, keeping the current required fields, validation, submission behavior, and existing auth navigation.
6. **Add or update focused tests and polish.** Cover the form-to-action wiring and important visible validation/feedback behavior using the repository’s existing testing patterns; check responsive layout and reduced-motion/accessibility conventions.
7. **Verify and review.** Run `npm run check`, resolve relevant failures, and smoke-test sign-in and sign-up in a browser at desktop and mobile widths. Confirm the intended auth actions still behave as before, then request human verification before marking the backlog task Done.

### Validation
- After dependency/configuration changes: run the applicable type-check/build check to catch integration issues early.
- After UI wiring: run targeted auth tests, then the required `npm run check`.
- Browser smoke test both auth pages, including required-field/invalid input feedback and visible pending or result states where supported; confirm links between auth pages still work.
- Human review of the final appearance, responsive behavior, and auth workflow.

### Risks and blockers
- The referenced EasyUI content may provide copy-paste components rather than an installable package; follow the actual official setup and avoid inventing package APIs.
- EasyUI’s styling or framework assumptions may conflict with this project’s Next.js/Tailwind setup. Prefer the smallest documented compatible integration; if no clean path exists, stop and document the blocker rather than broadening scope.
- UI replacement must not bypass existing server actions, Zod validation, auth feedback, or accessibility requirements.

## T-017 — Use Fluid Functionalism Combobox for recipe tag selection

### Objective
Use the Fluid Functionalism Combobox in both the assignment dialog and the recipe create/edit form. In the recipe form, surface existing user tags in the options and enable creation of a new tag from the search query.

### Scope and files
- Run the user-provided `npx shadcn@latest add https://www.fluidfunctionalism.com/r/base/combobox.json --overwrite` command and inspect all generated files and package changes.
- Update `src/components/assignment-dialog.tsx` to use the registry's multiple-selection field and existing tag selection state.
- Pass existing recipe tags from `src/components/app-shell.tsx` into `src/components/recipe-form-dialog.tsx`.
- Replace the recipe form's manual tag input with the multi-select Combobox, adding custom queries to the recipe draft and returning the new option so it is selected.
- Add focused tests for option normalization, new-tag creation, deduplication, and the existing 32-character constraint.
- Update `src/app/globals.css` only as needed to remove obsolete tag-pill styles or align spacing/theme.
- Keep tests adjacent to the existing assignment and recipe-form tag behavior.
- Update `tasks/backlog.md` and this execution plan to record completion and validation.

### Ordered implementation units
1. Inspect the generated Combobox and helper dependencies; identify their direct/transitive npm dependencies and verify font and styling assumptions against the project.
2. Integrate the recipe-form Combobox as a controlled multi-select, passing deduplicated existing tags and implementing `onCreate` to append/select a valid new draft tag.
3. Remove only obsolete manual tag-entry styles and add focused tests for tag normalization, create-from-query, duplicate handling, and combined assignment filtering.
4. Run focused tests and `npm run check`; inspect the final diff for unrelated overwrite or scaffolding changes. Report any browser-only UX verification still needed.

### Validation
- Run the assignment-dialog test file through the existing Vitest script.
- Run focused recipe-tag helper tests.
- Run `npm run check` (lint, tests, and production build).
- Review generated package dependencies and changed files; perform a browser smoke test of both assignment and create/edit forms if practical.

### Risks
- Registry dependencies may include additional shared component files and theme conventions beyond the component itself; preserve the app's existing design tokens and avoid unrelated generated replacements.
- The component expects Inter for variable-weight animation. Verify what the installer configures and add only an in-scope font setup if needed.
- Keep the 32-character limit aligned with the existing recipe tag schema; the create row must never bypass tag normalization or persistence validation.

### Implementation result
- Installed the Base UI registry variant. Direct Combobox requirements: `@base-ui/react`, `framer-motion`, `class-variance-authority`, `cn`; `lucide-react` was already installed. Registry shared files also use Base UI Scroll Area. The CLI added `tw-animate-css` for its generated Tailwind setup and `shadcn` as a dev dependency.
- Changed the generated font setup to Inter and mapped registry surface/color tokens to NutriBro's existing light/dark theme tokens.
- Replaced the visible tag button list with a searchable multiple-selection chips field. Existing selected-tag state now comes directly from Combobox values; filtering remains AND-based and combines with recipe text search.
- Replaced the recipe form's separate input/add button and tag pills with the same Combobox, seeded options from all dashboard recipe tags (including the current recipe's tags), and configured the create row in Spanish. Successful creation appends the trimmed tag to draft state and returns it so Combobox selects it; case-insensitive duplicates and values above the existing 32-character schema maximum are not created.
- Added normalized case-insensitive and combined-query tests. Focused tests passed (6); `npm run check` passed (8 test files, 31 tests, build). `git diff --check` passed.
- Added shared recipe-tag helper tests for existing option normalization, valid query creation, case-insensitive duplicates, empty queries, and the 32-character boundary. Focused tests passed (9); `npm run check` passed (9 test files, 34 tests, build).
- Removed generic form input border styling from the Combobox's nested input, leaving its outer field border visible.
- User confirmed the Combobox experience and marked T-017 complete.

## T-018 — Use Fluid Functionalism Badge for recipe detail tags

### Objective
Replace the existing tag pills below the recipe description in the recipe detail drawer with the Fluid Functionalism Badge, preserving all labels and the wrapping-row layout.

### Ordered implementation units
1. Run the requested `npx shadcn@latest add https://www.fluidfunctionalism.com/r/badge.json --overwrite` command and inspect all changed/generated files, dependencies, and any overwritten files.
2. Check the generated Badge API against the established project context, aliases, Tailwind v4, and current theme setup; keep built-in color, shape, and size behavior intact.
3. Update only the tag row in `src/components/recipe-detail-drawer.tsx` to render each recipe tag as a Badge, retaining the existing accessible label and spacing/wrapping behavior.
4. Remove obsolete tag-row or tag-pill CSS only if no other UI uses it.
5. Run focused checks if present, then `npm run check`; review diagnostics and diff for scope.

### Validation
- Inspect the generated component and every registry-modified file.
- Run focused recipe-detail tests if available.
- Run `npm run check` (lint, tests, production build) and review the final diff.

### Risks
- The registry may overwrite shared UI files because `--overwrite` is required; preserve unrelated project behavior and inspect resulting diffs.
- Badge depends on shared shape/size behavior. Prefer generated component defaults and documented props rather than custom radius, sizing, or palette logic.

### Implementation result
- Installed the registry component with `NODE_OPTIONS=--use-system-ca` after the first fetch attempt encountered the environment's self-signed certificate chain. The CLI added only `src/components/ui/badge.tsx`; shared utils and shape/size contexts were skipped as identical.
- Updated the recipe detail drawer to use the default solid gray Badge for each existing tag. Preserved the accessible tag-row label and wrapping/margin styles, and removed only obsolete tag-pill rules.
- `npm run check` passed (lint, 9 test files / 34 tests, production build); `git diff --check` passed.

## T-019 — Add theme preference Select

### Objective
Add the Fluid Functionalism Select to Preferences for System, Light, and Dark themes, with the System choice following the OS preference and existing theme changes persisted in local storage.

### Ordered implementation units
1. Install the requested Base UI Select registry component with `--overwrite`; inspect generated files, overwritten files, and package changes.
2. Read the relevant Next.js App Router/client component guide and inspect existing theme initialization, provider, preferences styling, and Select APIs.
3. Extend theme state to distinguish the persisted preference (`system | light | dark`) from the effective theme (`light | dark`); handle OS preference changes and remove the redundant avatar-menu theme toggle.
4. Add a clearly labeled theme section to Preferences with the requested icon-bearing Select options; leave meal visibility UI intact.
5. Run diagnostics and `npm run check`, review generated/unrelated diffs, and perform a browser smoke test if available.

### Validation
- Confirm System applies `prefers-color-scheme`, updates when the OS value changes, and survives reload.
- Confirm explicit Light/Dark choices persist and the account menu contains no theme action while retaining the Preferences link.
- Run `npm run check` and inspect final diff for overwritten shared files.
- Human verification of the resulting preference UX.

### Implementation result
- Installed `https://www.fluidfunctionalism.com/r/base/select.json`; it created `src/components/ui/select.tsx` and reused the project's existing shared files/dependencies. The registry also inserted its Tailwind dark variant; no Select-specific npm dependency was added.
- Added a persisted theme preference API (`system | light | dark`) while retaining the existing effective `light | dark` theme API.
- Updated the pre-hydration theme initialization and provider to resolve System from `prefers-color-scheme` and react to OS preference changes.
- Added a Spanish Preferences section using the requested icon-bearing Select options; meal visibility controls remain unchanged.
- Removed the duplicate theme action from the account dropdown, along with its unused icons, provider toggle API, and menu-only styles.
- Removed the unused generated Switch component, unreferenced `font-weight.ts`, and the Switch-only `@radix-ui/react-switch` dependency (including its unused transitive packages). This removed the unrelated TypeScript build error.
- `npm run check` passed: lint, 9 test files / 34 tests, production build, and standalone preparation. Browser interaction and human verification remain outstanding.
