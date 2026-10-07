## T-021 — Use Fluid Functionalism CheckboxGroup for meal preferences

### Objective
Replace General's individual meal checkboxes with Fluid Functionalism CheckboxGroup and introduce a dedicated SettingsPanel while preserving existing state and Appearance behavior.

### Ordered implementation units
1. Run `npx shadcn@latest add https://www.fluidfunctionalism.com/r/base/checkbox-group.json --overwrite`; inspect generated/overwritten files, dependencies, and API.
2. Run `npx skills add mickadesign/fluid-functionalism`; inspect installed guidance/files.
3. Replace meal checkbox markup with controlled CheckboxGroup/CheckboxItem controls and add concise Spanish explanatory copy.
4. Extract General into SettingsPanel and return it from the section selector; keep Appearance returned as AppearancePanel.
5. Read the Next.js font guide, add the Inter optical-size axis required for the CheckboxGroup's weight animation, and validate the existing global font wiring.
6. Run focused checks, `npm run check`, and `git diff --check`; review all changes.

### Validation
- Verify checked indices map to all five existing meal preferences and toggling one updates only that key.
- Verify generated props/imports, labels, keyboard focus, and accessibility.
- Verify Next.js still self-hosts the same Inter font with the `opsz` axis enabled.
- Run `npm run check` and `git diff --check`.

### Risks
- `--overwrite` may replace existing shared UI components; inspect diffs and preserve only justified changes.
- The skill installer may create repo-level files; inspect before retaining and avoid unrelated changes.
- Meal visibility stays local and non-persistent, consistent with scope.

### Implementation result
- Installed the Base UI CheckboxGroup registry and the requested project-level Fluid Functionalism skill. No package dependencies changed. Reviewed the generated component and shared type-scale/font/CSS updates; restored the existing `medium` font weight referenced by Tooltip.
- General now renders all five meal options with CheckboxGroup/CheckboxItem. `checkedIndices` reflects the existing controlled state, item toggles update their original meal keys, and the group is described by concise Spanish copy.
- Extracted General into SettingsPanel and renamed the section switch to SelectionPanel; Appearance remains routed to AppearancePanel. Removed the obsolete hand-built checkbox CSS.
- Enabled Inter's optical-size axis in the existing next/font configuration for the CheckboxGroup's variable-weight labels.
- Added CheckboxGroup to the existing ESLint exception for its documented ref-driven calculations. `npm run check` passed (9 test files / 34 tests, build and standalone preparation); `git diff --check` passed. Lint retains non-blocking unused-variable warnings in generated Fluid components.
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

## T-020 — Replace preferences page with sidebar Dialog

### Objective
Replace the standalone `/preferences` page with the Fluid Functionalism Dialog's sidebar layout. The existing avatar-menu Preferences action should open a modal with Apariencia (theme selector) and General (meal visibility options), retaining current state and behavior.

### Ordered implementation units
1. Install `https://www.fluidfunctionalism.com/r/base/dialog.json` using the requested shadcn command with `--overwrite`; inspect generated/overwritten files, shared dependency changes, and compatibility with existing providers and UI conventions.
2. Read the relevant Next.js App Router client-component guide and inspect the existing account menu, preference controls/styles, Dialog and Select APIs, theme provider, and app-wide layout constraints.
3. Extract the preference controls into a focused client-side Dialog component: responsive section navigation, theme control under Apariencia, and meal visibility controls under General; retain existing Spanish labels, local component state behavior, and accessible names.
4. Open/close the Dialog from the avatar menu without route navigation, remove the obsolete `/preferences` page, and delete only styles made unused by the page-to-dialog transition.
5. Run targeted tests if available, `npm run check`, and `git diff --check`; inspect all generated/overwritten changes and report browser smoke-test coverage or remaining human verification.

### Validation
- Confirm account-menu Preferences opens the modal and does not navigate.
- Confirm both sections are switchable on desktop and compact/mobile layouts; closing and reopening does not lose in-session meal checkbox state.
- Confirm existing theme choices still call the existing persisted theme-preference API and meal controls retain their current selection behavior.
- Run `npm run check`, `git diff --check`, and inspect the final diff.
- Request human review of the resulting preferences UX.

### Risks
- The CLI's `--overwrite` option may replace shared shadcn files; inspect every changed file and preserve established shared component behavior.
- The dialog-sidebar pattern needs an accessible narrow-screen section switcher; follow the docs' Select-based behavior below `sm` rather than hiding navigation.
- T-019 remains in Review awaiting independent human verification; this user-authorized task is scoped separately and does not alter T-019's status.

### Implementation result
- Installed the Fluid Functionalism Dialog and `dialog-sidebar` block. The block includes the requested xl dialog, bounded Sidebar layout, and compact Select-based section navigation. No npm package changes were necessary.
- Replaced sample sections with Apariencia (existing System/Light/Dark Select wired to `useTheme`) and General (existing meal visibility choices). Kept the meal checkbox state above the conditional section panel and retained visible keyboard focus.
- Connected the avatar Preferences action to the controlled dialog, removed the standalone `/preferences` route and obsolete page styles, and removed unused sample-only Switch/InputGroup generated files.
- Added the generated Sidebar core/menu files to the existing ESLint exception for the library's ref-driven animations.
- `npm run check` passed (34 tests, production build and standalone preparation); `git diff --check` passed. A brief `next dev` launch regenerated stale route type output and served `/` with HTTP 200; the server was stopped after verification.
- User confirmed the dialog task is completed; T-020 is closed as Done.

## T-022 — Remove the mobile top bar and move the avatar beside Recetas

### Objective
At the existing mobile breakpoint, remove the top bar entirely and place the account avatar immediately to the right of the Recetas control in the fixed bottom navigation. Keep the desktop top bar/avatar layout and all existing account actions unchanged.

### Current implementation facts
- `src/components/app-shell.tsx` renders the mobile brand, top-bar context, create action, and account menu inside `.topbar`; the mobile brand is currently shown below 900px while the context and create action are hidden.
- The same file renders `.mobile-nav` with Plan, create-recipe, Recipes, and the account control after Recetas. The account menu open state and outside-click behavior are owned by `AppShell`; the outside-click handler recognizes both responsive account refs.
- `src/app/globals.css` switches the sidebar/mobile nav at `max-width: 900px`. The mobile nav now has four equal grid tracks; the upward-opening account menu is right-aligned to the avatar wrapper so it stays within the screen.
- There are no AppShell/UI component tests in the current Vitest suite. Existing tests cover domain, service, API, and assignment-dialog behavior.

### Files to inspect and likely modify
- `src/components/app-shell.tsx` — preserve the user's current mobile account-control placement immediately after Recetas and its existing preference/sign-out callbacks, open state, and outside-click behavior.
- `src/app/globals.css` — hide `.topbar` at the existing mobile-nav breakpoint; align the four mobile-nav controls in equal grid tracks; style the mobile avatar and position its account menu above and left of the trigger within viewport/safe-area constraints. Keep desktop rules unchanged.
- `tasks/backlog.md` — update T-022 status/result only after implementation and the required user verification; do not change its acceptance criteria during implementation.

### Ordered implementation units
1. **Confirm the responsive/accessibility constraints.** Re-read the current app-shell markup and CSS, the relevant Next.js guide under `node_modules/next/dist/docs/` before editing, and this task's acceptance criteria. Explain the implementation plan and validation before production-code edits.
2. **Preserve one account behavior across two responsive placements.** Reuse/extract the account-control markup so the desktop top-bar instance and mobile bottom-nav instance call the same open/close, Preferences, and sign-out behavior. If both responsive instances are mounted, give their controlled menus distinct IDs and ensure outside-click handling recognizes both wrapper refs; clicks inside either menu must not dismiss it prematurely.
3. **Remove the mobile top bar and align the controls.** At the existing `max-width: 900px` breakpoint, hide the complete top bar (including its logo and avatar). Preserve the user's order of Plan, create, Recipes, avatar and give all four controls equal grid tracks. Preserve the current desktop top-bar markup/appearance above the breakpoint.
4. **Make the bottom account menu usable.** Keep the avatar trigger's accessible name and expanded/control relationship, provide at least a 44px touch target, and open/align the account menu above the avatar with its right edge aligned to the trigger so it expands left and stays within viewport/safe-area bounds. Retain the existing desktop menu direction and alignment.
5. **Verify behavior and scope.** Run `npm run check` and `git diff --check`. Smoke-test mobile widths below the breakpoint and desktop above it: confirm no top bar/logo/avatar on mobile, avatar immediately to the right of Recetas, menu positioning and both menu actions, and unchanged desktop top bar/account behavior. Request the human verification specified by T-022 before closing it.

### Validation
- Static: `npm run check` (lint, Vitest suite, production build) and `git diff --check`.
- Browser: check a narrow phone viewport (for example 375px), a wider mobile/tablet viewport below 900px, and a desktop viewport above 900px.
- Interaction: open/close the mobile account menu, click Preferences and verify the existing dialog still opens, click Close session and confirm the existing sign-out action is invoked; verify outside click and keyboard focus remain usable.
- Regression: confirm desktop retains its current brand/sidebar/top-bar/account placement and mobile navigation retains Plan, create-recipe, and Recipes behavior with the avatar directly after Recetas.
- Human verification is required by T-022; do not mark the task Done before it is confirmed.

### Risks and scope boundaries
- The account control currently owns a single ref and menu ID. If responsive desktop/mobile instances are rendered together, handle both refs and use unique IDs to avoid invalid ARIA references or a broken outside-click guard.
- The bottom-nav menu must open upward and remain clear of the system safe-area inset; retain the existing menu actions rather than changing authentication or preferences logic.
- Use the current 900px responsive breakpoint so the top bar and bottom navigation do not overlap at tablet widths. Do not change desktop layout or the app's breakpoint system.
- This is a placement/layout task only: do not alter authentication, theme/preferences behavior, navigation destinations, or add animation/dependencies. The Fluid Functionalism stack audit found no MotionConfig, but reduced-motion setup is unrelated and explicitly out of scope.

### Implementation result
- Extracted the account control into a shared `AccountMenu` and mounted it in both the unchanged desktop top bar and after Recetas in the mobile bottom navigation. The single open state controls the two responsive instances; menu IDs are unique and the outside-click handler recognizes both refs.
- The top bar is hidden at the existing 900px breakpoint, including removal of obsolete mobile-brand markup. The mobile nav has four equal-width tracks in Plan/create/Recipes/avatar order, a 44px avatar trigger, and an account menu anchored upward and aligned to the trigger's right edge so it opens leftward.
- `npm run check` passed (lint has 28 warnings in existing generated UI components, 0 errors; 9 test files / 34 tests; production build and standalone preparation). `git diff --check` passed. The local app root returned HTTP 200; visual and interaction confirmation remains for the user.
- The baseline implementation was awaiting human verification at that stage; the user later confirmed the final navigation after the approved follow-up (see below).
- The user corrected the requested avatar placement from after Plan to after Recetas; the implementation and task requirements now reflect Recetas.

### Approved follow-up plan: Fluid TabsSubtle for mobile view navigation

#### Scope
- Use the Base UI TabsSubtle registry variant only in the mobile navigation for the two existing views, Plan and Recetas.
- Arrange the create-recipe action before the two-tab selector and the account-menu trigger after it, keeping the avatar immediately to the right of Recetas; neither action may change the selected view.
- Retain the desktop sidebar buttons, their view switching, the view content, avatar position after Recetas, and existing menu actions.
- Respect OS reduced-motion preferences for the newly animated tabs.

#### Files to modify
- `src/components/ui/tabs-subtle.tsx` — install from `https://www.fluidfunctionalism.com/r/base/tabs-subtle.json`; inspect generated source and every shared/dependency change. Do not install the Radix flavor.
- `src/components/app-shell.tsx` — connect controlled TabsSubtle index 0/1 to the existing `activeView`, add the linked panels around current Plan/Recetas content, and leave Create and AccountMenu outside the tablist.
- `src/app/globals.css` — compose the tablist and action buttons in the mobile bottom bar with usable touch targets at narrow widths; leave desktop navigation styles unchanged.
- `src/app/layout.tsx` — wrap the app's provider/content tree with `MotionConfig reducedMotion="user"` so Framer Motion observes the OS preference.
- `eslint.config.mjs` — apply the repository's existing file-scoped exception for the registry's documented ref-driven animation implementation; do not modify generated TabsSubtle internals.
- `tasks/backlog.md` and this plan — record implementation/check results; keep T-022 in Review until human verification is confirmed.

#### Ordered implementation units
1. Check the TabsSubtle target is absent and inspect package/CSS prerequisites; install the Base UI registry URL without `--overwrite`, then review every generated, modified, or dependency file.
2. Use `TabsSubtle` with stable `idPrefix`, `selectedIndex`, and `onSelect`; render `TabsSubtlePanel` indices 0 and 1 with the same `selectedIndex` so the tabs' `aria-controls` and the panels' `aria-labelledby` stay linked. Keep only the selected view's content mounted as before.
3. Place Create and AccountMenu as sibling action controls, not tab items, in this order: Create, Plan/Recetas tablist, AccountMenu. Map Plan to index 0 and Recetas to index 1; keep the desktop sidebar controls connected to the same `activeView` state.
4. Add `MotionConfig reducedMotion="user"` around the existing app providers/content. Keep the tabs component source unmodified; compose using its documented props and `className` only.
5. Run `npm run check` and `git diff --check`; inspect the final diff and smoke-test 320px, 375px, just below 900px, and desktop widths. Test mouse/touch selection, Arrow/Home/End focus movement, Enter/Space selection, preferences menu opening, and the reduced-motion OS setting.

#### Risks / decisions
- The registry has Radix and Base UI URLs; use `/r/base/tabs-subtle.json` to match the project's existing Base UI flavor.
- TabsSubtle's tab labels and icon sizing must fit the mobile bar without clipping at 320px; tune the surrounding layout, not generated internals.
- Panels must remain correctly linked with unique IDs while desktop sidebar buttons continue controlling the same active view.
- User approved this as an extension to T-022. Human responsive/interaction verification remains required before marking it Done.

#### Follow-up implementation result
- Installed `src/components/ui/tabs-subtle.tsx` from the Base UI registry URL. The CLI skipped the existing customized shared files and made no package dependency changes; retained its Tailwind scrollbar utility required by the component.
- Wired Plan (index 0) and Recetas (index 1) to the existing `activeView`, with stable linked tab/panel IDs. Create is before the tablist and AccountMenu after it, so avatar remains immediately to the right of Recetas and neither action changes tabs. Desktop sidebar controls still use the same state.
- Added root `MotionConfig reducedMotion="user"`; left the generated TabsSubtle implementation unchanged and added its path to the existing file-scoped React Hooks lint exception for registry animation code.
- `npm run check` passed: 9 test files / 34 tests, production build and standalone preparation. Lint has 28 non-blocking warnings in existing generated UI components; `git diff --check` passed.
- The automated smoke request without an authenticated session redirected `/` to `/sign-in`, and browser automation is not installed. The user subsequently reviewed the final navigation and confirmed it is perfect, satisfying the human-verification requirement.

## T-023 — Use Fluid Functionalism Dropdown for the account menu

### Objective
Replace the custom Preferences/sign-out popup with Fluid Functionalism's Base UI Dropdown, retaining the account avatar trigger and both responsive placements.

### Scope and implementation units
1. Re-read the account-menu JSX/CSS and inspect the Base UI Dropdown registry API and required file targets. Confirm existing component/shared targets and package versions before installation; do not use `--overwrite` on customized files.
2. Install `https://www.fluidfunctionalism.com/r/base/dropdown.json`. Review every created/skipped/modified file and package change; the app already has Base UI and Framer Motion, so avoid redundant npm dependencies.
3. Compose each AccountMenu as a Base UI `DropdownMenu` with `DropdownTrigger`, `DropdownContent`, and action `MenuItem`s. Keep separate menu roots/open state per responsive instance because both placements are mounted while the popup uses a portal.
4. Preserve the avatar button visuals, accessible name, Preferences callback, and sign-out callback. Position the desktop popup below/end-aligned and the mobile popup above/end-aligned; reconcile legacy account-menu CSS with the popup's portalled content.
5. Remove AppShell's manual account outside-click state/listener and obsolete popup CSS only after confirming Base UI fully owns the matching behavior. Do not change avatar or account action semantics.
6. Run `npm run check` and `git diff --check`; smoke-test mobile/desktop anchors, narrow viewport collision handling, focus/arrow navigation, Escape/outside dismissal, Preferences, and sign-out. Keep T-023 in Review until human verification.

### Validation and risks
- Compare target files and dependency lists against the registry before installation; retain all project-local shared code.
- Verify two responsive triggers never produce duplicate portalled menus. Prefer independent per-instance Dropdown state rather than sharing the old boolean.
- Test avatar-menu Preferences still opens SettingsDialog and sign-out still calls the existing `closeSession` callback.
- T-019 remains in Review for separate human verification; this T-023 task is independently authorized by the user and must not modify T-019.

### Implementation result
- Replaced the custom account popup with per-instance Base UI Dropdown roots and retained the existing Preferences/sign-out callbacks. Removed the custom outside-click state/listener and obsolete popup-row styling; kept responsive popup placements and the 44px mobile avatar trigger.
- Registry installation added no npm dependencies. Generated Dropdown sources were left unchanged; their documented React Hooks behavior is covered by the existing file-scoped lint exception. Removed only duplicate registry-appended `@property` declarations while retaining the shared scrollbar utility.
- Removed the account-specific popup width/surface rules, mobile 44px row-height override, and explicit side offset. There was no app-specific font-size/weight override; MenuItem already uses Fluid's default type scale.
- `npm run check` passed (9 test files / 34 tests, production build and standalone preparation); lint has 28 existing warnings and 0 errors. `git diff --check` passed. The user confirmed the responsive Dropdown experience is perfect; T-023 is Done.

## T-024 — Raise mobile bottom navigation above the iPhone gesture area

### Objective
Provide reliable bottom clearance for the fixed mobile navigation in iPhone Safari/web-app mode without changing tab/action behavior or desktop layout.

### Ordered implementation units
1. Confirm the current mobile bar's fixed height, safe-area padding, button dimensions, app-content bottom padding, and viewport behavior.
2. Update only the mobile breakpoint CSS so the bar height grows with `safe-area-inset-bottom` plus 20px, while preserving the existing usable grid height and extending the bar background to the viewport edge.
3. Increase mobile app-content bottom padding to match the taller fixed nav so the last content remains scrollable and visible.
4. Verify the calculation leaves tab, create, and avatar controls at their existing sizes/positions relative to the expanded bar; ensure desktop rules remain unchanged.
5. Run `npm run check` and `git diff --check`; leave T-024 in Review pending the user's iPhone Safari verification after deployment.

### Validation and risks
- The current nav has a fixed 66px height while bottom padding includes `safe-area-inset-bottom`, which can reduce its available grid content height instead of moving the fixed control row upward.
- Keep the existing viewport configuration unless the CSS review proves a viewport-fit change is needed; avoid unrelated top safe-area/layout changes.
- Human verification must confirm all four mobile navigation controls can be tapped without invoking Siri/system navigation and that scrolling content is not covered.

### Implementation result
- Expanded the mobile nav to `86px + safe-area-inset-bottom` and its bottom padding to `26px + safe-area-inset-bottom`. Together, these preserve the existing 53px grid area and raise the controls 20px plus the device inset while the nav background remains flush to the viewport edge.
- Increased mobile app-content bottom padding to `88px + safe-area-inset-bottom` so page content can scroll clear of the taller fixed bar. Desktop styles and tab/action behavior are unchanged.
- `npm run check` passed (9 test files / 34 tests, production build and standalone preparation); lint has 28 existing warnings and 0 errors. `git diff --check` passed. T-024 remains in Review pending deployed iPhone Safari verification.

## T-025 — Split dashboard into Hoy and Plan navigation tabs

### Objective
Provide the same three views on mobile and desktop: Hoy (today's meals), Plan / Plan semanal (the existing recurring weekly calendar), and Recetas (the existing recipe library). The desktop Plan label may remain longer as “Plan semanal”, but it and mobile “Plan” must select the exact same view. Retain the create-recipe and account actions outside the mobile tablist.

### Current implementation facts
- `src/components/app-shell.tsx` owns a shared `activeView` state currently typed as `"plan" | "recipes"`, and the mobile TabsSubtle maps index 0 to Plan and index 1 to Recetas.
- The current Plan tabpanel renders both `TodayMeals` and `WeeklyBoard` in sequence; the Recetas panel renders `RecipeLibrary`.
- The desktop sidebar's Plan semanal and Recetas buttons drive the same `activeView` as the mobile tabs; both responsive navigation systems must expose all three shared views.
- The mobile nav uses the existing Base UI-backed Fluid Functionalism TabsSubtle, with active-label mode, accessible linked tabpanels, a separate create action before the tablist, and the account menu after it. The responsive bar and safe-area geometry are implemented in `src/app/globals.css`.
- Vitest tests pure module behavior, but the repository has no AppShell/component-render tests or React Testing Library dependency. Add a small, directly testable view/index mapping rather than introducing a new UI-test stack for this task.

### Files to inspect and likely modify
- `src/components/app-shell.tsx` — extend the view model, map three selected indices, split the three tabpanels, add Hoy/Plan/Recetas tabs, and preserve recipe/account/create callbacks. Add a desktop Hoy navigation item so desktop users can return to today's view after selecting the weekly calendar; keep existing Plan semanal and Recetas actions and desktop layout intact.
- `src/lib/app-navigation.ts` (new) and `src/lib/app-navigation.test.ts` (new) — define the three-view/index mapping independently of React and test its ordering/round-trip behavior before wiring the UI.
- `src/app/globals.css` — adjust only the mobile tablist sizing/layout if necessary to fit three tabs beside the existing create and avatar actions, preserving the current breakpoint, 44px targets, and safe-area spacing.
- `src/components/today-meals.tsx`, `src/components/weekly-board.tsx`, and `src/components/recipe-library.tsx` — inspect their props and existing presentation; modify only if separation requires a minimal correction. Their business logic and content are not in scope.
- `src/components/ui/tabs-subtle.tsx` — inspect and reuse the existing three-index-compatible API; do not modify the generated component internals.
- `package.json` and `vitest.config.ts` — inspect test conventions/configuration; no new dependency is expected.

### Ordered implementation units
1. **Lock down view mapping with a focused test.** Create a small pure navigation mapping for `today`, `plan`, and `recipes`; add Vitest coverage that each view maps to its intended tab index and each supported index maps back to the intended view. Keep the mapping exhaustive and avoid adding a component-test dependency.
2. **Expand shared view state and desktop navigation.** In AppShell, use the new three-view type and mapping, initialize the landing view to Hoy, and connect the desktop Hoy item, existing Plan semanal item, and Recetas item to the shared views. The desktop and mobile controls must be two labels/layouts for one navigation model, not separate or viewport-specific active states.
3. **Split the tabpanels and wire mobile navigation.** Render TodayMeals alone in the Hoy panel, WeeklyBoard alone in the Plan panel, and RecipeLibrary alone in the Recetas panel. Add three TabsSubtle items with a stable index-to-view mapping and preserve each panel's `idPrefix`, `aria-controls`/`aria-labelledby` relationships, and selected-only mounting behavior. Keep Create and AccountMenu outside the tablist and preserve their callbacks.
4. **Fit the expanded mobile tabs.** Check the existing active-label behavior at narrow widths; adjust only `.mobile-nav` / `.mobile-nav__tabs` / `.mobile-nav__tab` rules if required so all three controls remain operable alongside the create and avatar actions. Preserve the existing mobile breakpoint, safe-area calculations, nav height, and touch target sizes; do not alter desktop geometry.
5. **Run checks and verify the complete flow.** Run the focused mapping tests, `npm run check`, and `git diff --check`. Smoke-test Hoy, Plan, and Recetas at narrow mobile, normal mobile, and desktop widths; verify desktop sidebar switching, tab keyboard behavior, and that Create/account actions do not change the selected view. Request the task's required human verification before marking it Done.

### Validation
- Unit: test all three view/index mappings and round trips; run the focused Vitest test before UI integration and again after wiring.
- Repository: run `npm run check` and `git diff --check`; review the final diff to ensure no domain, API, repository, recipe, account, preferences, or safe-area behavior changed.
- Mobile smoke test: at 320px and 375px, verify all three tab names/icons fit without clipping, active state is clear, content is not obscured by the fixed navigation, and create/avatar remain separate actions.
- Interaction: verify Hoy shows only TodayMeals, Plan shows only WeeklyBoard, Recetas remains the existing RecipeLibrary, and selecting each view preserves its existing assignment/recipe interactions. Verify Base UI arrow/Home/End focus movement and Enter/Space selection.
- Desktop smoke test: verify the same Hoy, Plan semanal, and Recetas views are reachable via the sidebar; selecting a view shows the same content as its mobile counterpart, with only the Plan label differing (“Plan” on mobile, “Plan semanal” on desktop). Keep the desktop layout otherwise intact.
- Human verification is required by T-025; do not mark the task Done until the user confirms the view split and navigation.

### Risks and decisions
- Mobile and desktop must share one view state and one three-view content mapping. Desktop uses the visible label “Plan semanal” for the same weekly-calendar view labeled “Plan” on mobile; add only the missing Hoy sidebar action and do not otherwise redesign desktop navigation.
- TabsSubtle's `activeLabel` mode shows all icons while expanding only the selected label, which should keep three choices viable in the mobile bar. Validate at 320px; if a CSS adjustment is needed, do not shrink the current 44px tab target or alter safe-area geometry.
- Keep the existing TabsSubtle implementation unchanged. It already provides Base UI tab semantics, linked controls/panels, roving keyboard focus, and manual activation.
- TodayMeals and WeeklyBoard use the same existing plan data and slot callbacks. This task changes only which component is rendered per view; do not duplicate or modify their domain/business behavior.
- The landing-view choice is Hoy, matching the new tab label and making today's meals immediately available. The existing desktop Plan semanal action continues to open the weekly calendar.

### Implementation result
- Added `src/lib/app-navigation.ts` with an exhaustive `today` / `plan` / `recipes` view type and checked bidirectional tab-index mapping. Added focused tests for all view mappings and unsupported indices; all 4 passed.
- Updated `src/components/app-shell.tsx` to use one shared three-view state across layouts, default to Hoy, add Hoy to the desktop sidebar, and retain Plan semanal and Recetas. Mobile tabs now show Hoy, Plan, and Recetas, with linked panels rendering TodayMeals, WeeklyBoard, and RecipeLibrary separately. Create and account actions remain outside the tablist.
- No CSS, safe-area geometry, dashboard business logic, or recipe behavior needed changes; the existing active-label TabsSubtle layout accommodates the additional tab without changing the 44px target rules.
- `npm run check` passed: lint (0 errors; 28 existing warnings in generated UI components), 10 test files / 38 tests, production build, and standalone preparation. `git diff --check` passed.
- T-025 is in Review pending the required human review of view switching and responsive layout at mobile and desktop widths.

### Approved follow-up: align the three view headings

#### Verified mismatch
- `Hoy` uses a primary title at `clamp(28px, 3vw, 38px)`, 14px subtitle text with a 10px top gap, and the default eyebrow bottom margin of 9px.
- `Plan` and `Recetas` use an overridden 23px title, 13px subtitle text with a 6px top gap, and a 7px eyebrow bottom margin.
- `WeeklyBoard` also retains a 42px top margin (28px at the mobile breakpoint) from when it appeared below today's meals. Now that it is a standalone view, that extra offset makes Plan's header sit lower than the other views.

#### Ordered implementation units
1. Promote the standalone Plan and Recetas titles to the same page-heading level as Hoy while retaining their existing text and accessible `aria-labelledby` IDs.
2. Remove the compact `.section-heading` title/eyebrow/subtitle overrides so Plan and Recetas inherit the same title scale, eyebrow spacing, and subtitle typography already used by Hoy.
3. Remove WeeklyBoard's legacy top margin at desktop and mobile sizes so all three view headings begin at the same content inset. Preserve unrelated spacing inside each view and keep recipe controls/content unchanged.
4. Run `npm run check` and `git diff --check`; compare the three headings at mobile and desktop sizes if a browser smoke check is available.

#### Validation and boundary
- The user confirmed that navigation works perfectly and specifically requested the visual heading alignment refinement.
- Only heading hierarchy/presentation and Plan's now-obsolete outer offset may change. Keep each view's eyebrow/title/subtitle wording distinct, and do not alter tab behavior, recipe interactions, domain logic, or mobile safe-area layout.
- After implementation and automated checks, return the task to Review pending the user's visual confirmation.

#### Follow-up implementation result
- Promoted the standalone Plan and Recetas titles to `h1`, matching Hoy's page-heading hierarchy while preserving their existing labels, descriptions, and accessible heading IDs.
- Removed the smaller title and subtitle overrides from `.section-heading`, so all three views use the same 28–38px title scale, 14px subtitle with 10px top spacing, and default eyebrow spacing.
- Removed WeeklyBoard's 42px desktop / 28px mobile top margin left over from its former position beneath Hoy. All headings now begin at the same content inset.
- `npm run check` passed (10 test files / 38 tests, production build and standalone preparation); lint reports 28 existing warnings and no errors. `git diff --check` passed.
- T-025 is in Review. Navigation was confirmed by the user; final visual confirmation of the heading alignment remains requested.

## T-015 — Add general user preferences table

### Objective
Create a generic user preferences table with explicit meal-visibility booleans, preserving the all-visible default and existing user ownership conventions.

### Ordered implementation units
1. Add the `userPreferences` Drizzle table with `user_id` as a cascading primary-key foreign key to `users.id`, plus non-null `breakfast`, `mid_morning`, `lunch`, `snack`, and `dinner` booleans defaulting to true; register it in `databaseSchema`.
2. Generate the next PostgreSQL migration after `0006_sparkling_green_goblin`; retain the generated schema changes and add an idempotence-appropriate backfill for all users existing at migration time. Do not add preference rows for users created after the migration unless they explicitly save preferences.
3. Update `docs/data-model.md` with the one-to-one relationship, columns/defaults, existing-user backfill, and the rule that a missing row for a later account means all meals are visible.
4. Review generated schema and migration metadata, inspect the final diff, and ensure no UI, API, service, or registration behavior changed.

### Validation
- Review the generated SQL for primary/foreign keys, cascade deletion, `NOT NULL` and `DEFAULT true` on all five fields, and backfill from `users`.
- Run `npm run check` and `git diff --check`.
- Confirm T-015 acceptance criteria and changed-file scope before recording the implementation result.

### Scope decisions
- Database table: `user_preferences`; meal columns: `breakfast`, `mid_morning`, `lunch`, `snack`, `dinner`.
- Backfill existing users with all five values true. For accounts registered after this migration, leave the row absent until preferences are explicitly saved; future preference reads must treat absence as all true.
- Do not wire settings UI, APIs/services, or registration inserts in this task.

### Implementation result
- Added and registered `userPreferences` in the Drizzle schema with `user_id` as the cascading primary-key foreign key and five non-null booleans defaulting to true.
- Generated migration `0007_add_user_preferences` and added an insert-select backfill from `users`; Drizzle generated snapshot and journal metadata are synchronized.
- Applied the migration to the `.env.local` database and verified the PostgreSQL schema: five default-true, non-null boolean columns, cascading user FK, 5 users, 5 preference rows, and 0 users missing a preference row at verification time.
- Documented the relationship, column meanings/defaults, backfill, and missing-row semantics in `docs/data-model.md`.
- No UI/API/service/account-registration changes were made. `npm run db:generate -- --name=verify_user_preferences` reported no schema changes; `npm run check` passed (10 test files / 38 tests and production build); `git diff --check` passed. ESLint reported 28 pre-existing warnings and no errors.

## T-026 — Persist meal visibility preferences and apply them to the dashboard

### Objective
Load the existing per-user meal-visibility record with the authenticated dashboard, save General changes atomically through an authenticated API, and filter meal rows in Hoy and Plan using committed values.

### Ordered implementation units
1. Add a domain preferences DTO and strict Zod parser using the five `MealTypeId`-aligned keys. Add and test a pure helper for filtering meal slots by the visibility record.
2. Add a dedicated `UserPreferencesRepository` port, PostgreSQL implementation, service, and production composition. Reads of an absent row return all-true defaults without insertion; saves upsert all five fields for the supplied authenticated user.
3. Add `PATCH /api/preferences` using the existing same-origin, JSON body, identity, service, and response-envelope patterns. Reject malformed/incomplete/extra input; derive identity only from the authenticated session.
4. Load dashboard and preferences together in the authenticated server page. Pass initial preferences into AppShell and own the committed preference state there so the initial dashboard and settings dialog use the same values.
5. Add a typed preferences update method to `api-client.ts`. Make SettingsDialog edit a draft and expose a Spanish Save action with pending, success, and retryable error states. Commit draft state to AppShell only after PATCH succeeds; retain the draft on failure.
6. Filter TodayMeals and WeeklyBoard by MealTypeId; add a clear empty state if all meals are hidden. Test individual hidden values, all-visible/all-hidden, and missing slots.
7. Update `docs/data-model.md` with PATCH contract and `docs/architecture.md` with initial load, service/repository, and save flow. Review scope and run focused tests, `npm run check`, and `git diff --check`.
8. Smoke-test authenticated initial rendering, edit/save/reopen, failed-save retry, and visibility in Hoy/Plan at desktop and mobile sizes. Keep T-026 in Review until the user confirms the UI behavior.

### Validation
- Domain/schema tests: accept the exact five booleans; reject missing, wrong-type, null, or unknown fields.
- Service/repository tests: missing row returns all-true without insert; persisted values round-trip; writes are scoped to the authenticated user; upsert creates absent row.
- Route tests: authenticated PATCH success, unauthenticated rejection, same-origin checks, malformed/invalid payloads, and no client identity override.
- Filtering tests: each meal independently, all visible, all hidden, and absent plan slots.
- UI smoke test: server-provided values populate General and both views; only successful save changes committed dashboard visibility; failure leaves draft retryable.
- Run `npm run check` and `git diff --check`; preserve unrelated existing worktree modifications.

### Scope decisions and risks
- The existing `user_preferences` schema/migration is already present and applied; do not generate a migration.
- Missing rows are interpreted as all visible until Save; GET/read must not create a row. New account creation remains unchanged.
- Keep preferences independent of the nutrition aggregate and never accept user identity from client JSON.
- Initial preferences load happens alongside the dashboard (once per server page load) so there is no flash of hidden meals; reopening the dialog does not refetch.
- The existing Vitest setup is Node-oriented; focus unit/service/repository/API tests, and perform dialog interaction as a browser/manual smoke test rather than adding a component-test stack without need.

### Implementation result
- Added `MealVisibilityPreferences`, strict Zod parsing, and a pure visible-slot filter, with focused domain tests.
- Added a dedicated `UserPreferencesRepository`, PostgreSQL implementation (read defaults without inserting; upsert on save), service, and production composition.
- Added authenticated `PATCH /api/preferences` with same-origin and body validation; the user ID comes only from the session identity.
- Loaded preferences in parallel with the initial dashboard and shared committed state across General, Hoy, and Plan. General edits a draft and exposes an explicit save action with pending, success, and retryable error messaging; only success updates the displayed meal visibility.
- Filtered Hoy and Plan using saved values and added all-hidden empty states. Updated architecture and API contract docs. No schema, migration, or account registration changes.
- Focused preference tests passed (14); `npm run check` passed (15 test files / 52 tests, production build); `git diff --check` passed. ESLint reports 28 existing warnings and no errors.
- The user confirmed the preferences interaction and visible-meal behavior; T-026 is closed as Done.

## T-028 — Implement responsive recipe create, edit, and view overlays with Base UI Drawer

### Objective
Replace the recipe create, edit, and view overlays with one shared shadcn/Base UI Drawer primitive and responsive shell. Keep the shell right-sided on desktop and near-fullscreen from the bottom on mobile; preserve recipe behavior, edit-over-detail stacking, directional swipe dismissal, and discard-on-dismiss drafts.

### Scope and files to inspect or modify
- `node_modules/next/dist/docs/01-app/02-guides/server-and-client-boundary.md` and `interactive-apps.md` — read the current local Next.js guidance before changing client-side responsive behavior or overlay wiring; also use the current app-router/component guidance linked by those docs if the implementation crosses a boundary.
- `node_modules/@base-ui/react/drawer/` — verify the installed Drawer API/version, responsive `swipeDirection`, popup/viewport composition, and focus/close behavior against the installed declarations and implementation before relying on it.
- `.agents/skills/fluid-functionalism/scripts/stack.mjs` — rerun the required, read-only stack audit immediately before implementation; do not save an audit artifact.
- `src/components/ui/drawer.tsx` — inspect whether a shadcn Base UI Drawer wrapper already exists; if absent, add the project's Base UI-flavor wrapper only after reviewing registry-generated files and dependencies.
- `src/components/app-shell.tsx` — preserve current selected/loading recipe state, create/edit transitions, save refresh, and detail reopening; compose edit as a nested/top Drawer while leaving the detail Drawer mounted underneath.
- `src/components/recipe-detail-drawer.tsx` and `src/components/recipe-form-dialog.tsx` — retain existing detail/form content, accessible names, validation, pending/error handling, close controls, and callbacks while moving them into the shared Drawer shell.
- `src/app/globals.css` — replace only recipe overlay/backdrop/panel rules with shared responsive Drawer styling; inspect portal stacking, popup/Combobox layering, scroll behavior, and old animation transforms before removal.
- `src/lib/recipe-overlay.ts` and `src/lib/recipe-overlay.test.ts` (add only if needed) — keep responsive gesture-direction and pure overlay transition policy independently testable using the existing Node/Vitest setup.
- `docs/wireframes.md` — update only the recipe detail/editor overlay description to specify desktop right Drawer, mobile near-fullscreen bottom Drawer, stacked edit, and matching swipe-to-dismiss directions.
- `vitest.config.ts`, `package.json`, and existing `src/**/*.test.ts` files — inspect conventions only; avoid adding a DOM/component-test dependency unless the existing test setup proves inadequate and scope approval is obtained.
- Do not modify unrelated settings/assignment dialogs, recipe domain/API/persistence, navigation, or authentication.

### Verified implementation constraints and current baseline
- The current app uses Next.js App Router, React 19, Tailwind 4, npm, and the Base UI flavor; `@base-ui/react` is already installed. The Fluid Functionalism catalog has no Drawer component, so use shadcn's Base UI Drawer primitive rather than introducing Radix, Vaul, or a different FF primitive.
- The required Fluid stack audit currently reports `MotionConfig reducedMotion="user"` and Inter `opsz` already wired. Re-run it at implementation time; preserve these existing settings and do not add redundant motion/font setup.
- Installed Base UI declarations accept one `Drawer.Root` `swipeDirection` from `up | down | left | right` (default `down`). Set it responsively in JavaScript so it is correct on first client render and updates while open after a breakpoint change: down for the bottom mobile presentation, right for a right-side desktop presentation.
- Base UI's Drawer requires `Drawer.Popup` under `Drawer.Viewport` for swipe handling and touch scroll locking; a development warning explicitly identifies a missing Viewport. The Viewport's gesture axis follows `swipeDirection`, so changing CSS placement alone cannot update gesture behavior.
- Drawer swipe movement is applied through Base UI's own popup gesture machinery/CSS variables. Do not add an independent Framer Motion or CSS `transform` entrance/drag animation to the same popup; verify transform composition and use the primitive's state/data attributes and supported styling instead.
- The current Vitest environment is Node and includes only `src/**/*.test.ts`; there is no existing component-render test stack. Prefer focused pure policy tests plus explicit browser smoke tests rather than adding an unrequested test framework.
- Current app state already retains `selectedRecipe` while `isRecipeFormOpen` is true during edit, and successful save refreshes data and selects the updated recipe. Preserve this detail-under-form stack and existing form key/reset lifecycle.

### Ordered implementation units
1. **Complete preimplementation checks and lock the API.** Read the local Next.js guides listed above before source edits; rerun and review the Fluid stack audit; inspect the current UI states, CSS, test scripts, and wireframe; verify the installed Base UI declarations/runtime and the shadcn Base UI Drawer recipe. Confirm that no target is overwritten blindly and record any compatibility blocker before proceeding. Do not begin code changes unless the one-primitive/right-desktop/bottom-mobile design is supported.
2. **Add/reuse the shared Base UI Drawer shell.** Use one responsive shell built from the same Base UI Drawer Root, Portal, Backdrop, Viewport, Popup, title/description, and close primitives for create, edit, and view. Keep placement and breakpoint-specific `swipeDirection` in reactive client state, including an initial viewport decision that avoids server/client hydration mismatch and a live resize update while open. Keep the popup scrollable and accessible, and avoid a parallel Dialog primitive or CSS-only gesture direction.
3. **Migrate the detail and create/edit flows without changing their behavior.** Move the existing view and form content into the shared shell. Create opens the same form Drawer with a blank draft; edit opens it above the still-mounted detail Drawer; close of the edit layer returns to detail and restores focus to the edit trigger, while closing detail returns focus to its opener where available. Keep save, loading, validation, errors, delete confirmation, data refresh, and successful detail update unchanged.
4. **Unify dismissal and draft lifecycle.** Route close button, backdrop/outside press, Escape, and swipe through the same close handling. Any allowed form dismissal discards the unsubmitted draft and reopening starts from a fresh blank/current-recipe draft; save remains the only commit path. Preserve the existing in-flight save close protection. Confirm that a swipe on the stacked form closes only the top form and leaves detail open.
5. **Style and cover responsive transitions.** Replace only recipe-specific legacy `.overlay`, `.recipe-drawer`, and `.recipe-form-dialog` behavior that conflicts with Base UI portals/stacking. Style the same Drawer from the right on desktop and near-fullscreen from the bottom on mobile, with independently scrollable content, correctly layered backdrop/popups, and no gesture-conflicting transforms. Verify existing Combobox popup layering and avoid modifying unrelated assignment/settings dialogs.
6. **Add focused tests and update the wireframe.** Test the responsive direction mapping (mobile down, desktop right, and changes in both directions while open), create/view/edit transitions, stacked edit dismissal preserving detail, and draft discard/reset after close/reopen using pure state/policy helpers compatible with Node/Vitest. Update the recipe wireframe for both responsive presentations and stacked edit/swipe behavior.
7. **Validate and review.** Run focused overlay tests, `npm run check`, and `git diff --check`; inspect all generated/shared files and confirm only T-028 scope changed. Browser-smoke-test create, view, edit-over-detail, save, every dismissal path, draft discard, keyboard/focus restoration, popup layering, and live resizing at mobile and desktop widths. Keep the task in Review and request user confirmation for the interaction checks that cannot be exercised in this environment.

### Validation
- Unit: prove responsive swipe direction resolves to `down` on mobile and `right` on desktop; prove direction updates after resizing with an open Drawer. Cover the create/view/edit stack, closing only the top edit layer, and discarded drafts not reappearing on reopen.
- Automated integration: run focused overlay tests and `npm run check` (lint, full Vitest suite, production build/standalone preparation); run `git diff --check`.
- Desktop smoke: at a width above the app breakpoint, create, view, and edit each use the same right-side Drawer; swipe right dismisses; keyboard Escape/close, focus return, save, validation, delete, and popup stacking remain correct.
- Mobile smoke: at a narrow phone width, the same Drawer is near-fullscreen from the bottom; swipe down dismisses; scrolling content does not accidentally dismiss, while a deliberate dismiss gesture works; create/edit drafts reset after dismissal.
- Resize smoke: with each recipe overlay open, resize across the responsive breakpoint in both directions; confirm presentation, gesture direction, content position, and nested edit focus/stack remain consistent without stale transforms or duplicate layers.
- Review docs and final diff: wireframe documents both orientations and the edit-over-detail stack; no changes to domain, API, persistence, unrelated overlays, or non-recipe UI.

### Risks and blockers
- `swipeDirection` is a single runtime Drawer-root value, not a CSS breakpoint setting. A non-reactive media query or mount-only direction will fail resizing while open; prove the initial and subsequent values and avoid hydration mismatch.
- Nested modal focus scopes, portals, backdrops, and z-index can cause the lower detail Drawer to close, lose focus, or intercept gestures. Use Base UI's supported nested Drawer behavior and test stack dismissal/focus rather than rendering two unrelated dialogs.
- Legacy entrance animations and generated component styles may write `transform`, conflicting with Base UI drag movement. Remove only conflicting recipe-specific rules; do not patch Base UI internals or add Vaul/Radix/desktop Dialog fallbacks.
- Base UI shadcn code generation can create or update shared UI files. Inspect all generated/dependency changes and preserve custom project code; if required behavior cannot be met with the single Base UI Drawer, stop and document the blocker without substituting primitives.
- Existing tests cannot exercise browser focus, portal, pointer/touch, and viewport behavior. Pure tests are necessary but not sufficient; complete the requested manual responsive/gesture/focus smoke coverage.

### Implementation outcome — Review
- Added shadcn's generated Base UI Drawer composition and a shared recipe shell. The shell uses a server-safe `useSyncExternalStore` media-query snapshot so the same primitive changes from right-side/`right` swipe on desktop to bottom-sheet/`down` swipe on mobile and updates on resize. The generated `showSwipeHandle` adapts its indicator to the active swipe axis, and the nested Drawer implementation handles stack presentation.
- Migrated create/edit to the shared shell and recipe detail to direct shadcn Drawer composition, preserving stacked edit-over-detail transitions and reducer-driven visibility. Added DrawerTitle/DrawerDescription for the visible recipe name/description; the form also uses Drawer.Content, the virtual-keyboard provider, and Drawer-native close buttons.
- Replaced recipe overlay transforms with the generated Base UI Drawer’s swipe-movement and starting/ending behavior; recipe CSS now only customizes sizing, app surface colors, and the stronger blurred backdrop. Mobile uses small safe-area-aware margins, the built-in swipe handle, and no X controls. Updated the recipe wireframe for both orientations and dismissal directions.
- Added focused reducer/direction tests: 5 passed. Final `npm run check` passed: lint has 28 existing warnings and 0 errors, 16 test files / 57 tests passed, and the production build completed. `git diff --check` passed. Pylance reports no errors in the changed TypeScript files.
- The local route served successfully in the browser smoke session. Full gesture, visual layout, focus restoration, and resize interaction checks could not be completed: no local Playwright/Chromium runner is available and the browser view does not expose page interaction to this session. Request user validation before marking T-028 Done.
- Follow-up sizing fix: removed the shared max-height cap that left unused space below desktop side Drawers, kept the cap only for mobile vertical Drawers, and reset the mobile Drawer width to `auto` so its safe-area margins fit within the viewport. The generated Drawer component was inspected and left unchanged.

## T-029 — Use Fluid Dialog for recipe deletion confirmation

### Objective
Replace the native `window.confirm` in the recipe deletion flow with the already-installed Fluid Functionalism Base UI Dialog while retaining delete semantics and feedback.

### Ordered implementation units
1. Confirm the existing Fluid Dialog/Button API, current delete flow, styling, and applicable Next.js client-component guidance. Preserve unrelated in-progress T-028 files.
2. Add controlled delete-confirmation state and a pending flag in `AppShell`; make cancellation and dialog dismissal side-effect free.
3. Compose the existing Fluid Dialog with Spanish title/description and Cancel/Eliminar actions; send the delete request only after explicit confirmation and guard against duplicate requests.
4. Preserve existing success refresh/toast and failure toast behavior, then run focused tests if available, `npm run check`, and `git diff --check`.

### Validation
- Verify controlled dialog opens for the selected recipe and Cancel/Escape/backdrop close without calling delete.
- Verify confirmation sends at most one delete request, refreshes the dashboard, closes recipe detail, and shows existing success feedback.
- Verify failed deletion reports the existing error and leaves the recipe available for retry.
- Run `npm run check` and `git diff --check`; inspect the final scoped diff.

### Constraints
- Reuse the installed customized Fluid components. Do not run the registry install with `--overwrite` or modify shared component files.
- T-028 remains in Review pending its required browser verification; do not alter its requirements/status.

### Implementation result — Done
- Replaced `window.confirm` with a controlled Fluid Dialog composed from the installed customized Base UI Dialog and Button. The confirmation names the recipe and retains the existing warning that assigned meals will be cleared.
- Cancel, Escape, backdrop, and close-button dismissal only clear confirmation state. The Eliminar action is loading/disabled during the request, and a ref-based guard prevents duplicate API calls.
- Preserved the delete endpoint call, dashboard refresh, detail close on success, success toast wording, and existing error/authentication feedback on failure. On failure, the detail view remains available for retry.
- Focused nutrition service tests passed (2 tests). `npm run check` passed (16 test files / 57 tests, production build, and standalone preparation); lint has 28 existing warnings and no errors. `git diff --check` passed.
- The user confirmed the final deletion-dialog experience is perfect, including the requested interaction behavior; T-029 is closed as Done.
- Follow-up desktop inset: set the generated Drawer inset variable to 8px so the right-side panel has consistent top, right, and bottom breathing room; mobile continues to use its safe-area-specific margins.
- Detail composition follow-up: extract the breakpoint-aware swipe direction into `use-recipe-drawer-swipe-direction.ts`, use Drawer directly in the detail component, and render the recipe name and description with visible DrawerTitle/DrawerDescription primitives. Other recipe detail content remains unchanged.
- Follow-up toolbar title: render the recipe name in a visible DrawerTitle inside the sticky toolbar (with a loading fallback), replacing the static toolbar label. Keep DrawerDescription in the recipe content.
- Shared popup follow-up: move the drawer inset to `:root`, apply common popup styling through shadcn's `data-slot="drawer-popup"`, and remove `recipe-drawer-popup` classes from DrawerContent call sites. Preserve the form's wider panel through `data-drawer-variant="form"`.
- Root-token follow-up: centralize app-owned inset, detail/form panel widths, and mobile max-height tokens under `:root`; use shared popup slot rules to consume them. Keep shadcn's swipe/stack variables local because they are runtime state values.
- Validation after direct composition and shared popup styling: focused recipe overlay tests passed (5); `npm run check` passed (16 test files / 57 tests, production build); lint reports 28 existing warnings and 0 errors; `git diff --check` passed; Pylance reports no errors in changed TypeScript files. Task remains Review for browser interaction verification.
