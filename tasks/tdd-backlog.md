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
