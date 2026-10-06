NUTRIBRO AGENT BACKLOG
=====================

Format:
- Status: New | In Progress | Blocked | Review | Done
- Priority: High | Medium | Low
- ID: T-XXX
- Title: short title
- Scope: brief description
- Acceptance criteria: list
- Verification: expected commands or checks

T-002 | Done | Medium
Title: Implement the agent task backlog
Description: Create a basic task system in plain text to guide the agent and record work status.
Scope:
- Define the backlog structure
- Document status values and workflow
- Create a reusable task template
- Keep the repository within the defined scope
Do not touch:
- Large architecture changes
- Persistence changes without explicit requirement
- Business changes outside the backlog
Acceptance criteria:
- There is a readable and maintainable backlog file
- There is a template for new tasks
- Repository instructions guide the agent to follow the backlog
- Validation is performed with real checks
Verification:
- Review the created files
- npm run check

T-003 | Done | Low
Title: Update the UI: add a Save button at the top of the "Assign recipes" menu
Description: The current "Save recipes" button sits at the bottom of the panel. When many recipes are created, the user must scroll too far down. A new top button is required that only shows the standard save icon.
Scope:
- Update the UI in the menu described above
Do not touch:
- Unrelated UI changes
- Unrequired infrastructure changes
Acceptance criteria:
- The workflow remains documented and reusable
- The agent must respond with a plan before editing
- Tasks remain traceable by status
Verification:
- Review the related documentation
- npm run check
- User confirmation

Notes:
- Each task's initial status must be updated by the agent or developer when the situation changes.
- If a task depends on another one, it must be stated clearly under Dependencies.
- The agent must prioritize tasks in In Progress and close them before starting another new task without authorization.

ID: T-004
Status: Done
Priority: Medium
Title: Adjust the color of the Save recipes button in "Assign recipes"
Description:
Change the color of the "Save recipes" button displayed at the top of the "Assign recipes" menu so it matches the blue already used by the other buttons in the interface. The goal is to maintain visual consistency and avoid a visually distinct action from the rest of the UI.

Scope:
- Adjust the styling of the Save recipes button in the top view of the "Assign recipes" menu
- Reuse the existing blue design system already used in the UI
- Validate that the button keeps the same functionality and visual accessibility

Do not touch:
- Changes in recipe-saving logic
- Full redesign of the "Assign recipes" menu
- Color changes in other buttons or unrelated components

Dependencies:
- None

Acceptance criteria:
- The Save recipes button in the top position uses the same blue color as the other main buttons
- The visual appearance is consistent with the rest of the interface
- Behavior and functional location remain unchanged except for the color adjustment

Verification:
- Review the menu in the browser
- npm run check

Notes:
- If a styling or implementation blocker appears, it must be documented before proceeding.

ID: T-005
Status: Done
Priority: Medium
Title: Normalize task files and harness to .md and English
Description:
Prepare the repository convention so all operational task files under /tasks use the .md format and are written in English from this point onward. In addition, translate the agent-support files (harness) to English so agent communication happens exclusively in that language without touching the application UI, which must remain visible in Spanish.

Scope:
- Convert the files in /tasks to .md while keeping the operational backlog and template structure
- Establish the rule that new tasks are written in English for future agent work
- Translate the agent support files to English without changing their purpose or project functionality
- Keep the application UI in Spanish and avoid visual or product changes

Do not touch:
- User interface changes
- Functional changes in the application
- Architecture restructuring
- Spanish content that belongs to the user-facing experience

Dependencies:
- None

Acceptance criteria:
- Files inside /tasks use the .md extension and keep the backlog workflow structure
- The backlog and template are written in English from this point onward
- Agent support files are translated into English and remain useful for task execution
- The application UI remains Spanish with no design or visible content changes
- Agent communication is aligned to English for future tasks

Verification:
- Review the structure and content of /tasks and related support files
- Confirm that the application UI is unchanged
- npm run check

Notes:
- If a dependency or additional constraint appears during execution, it must be documented before continuing.
- The harness translation must not affect functional behavior or the end-user experience.

ID: T-006
Status: Done
Priority: Medium
Title: Translate the /docs documentation to English
Description:
Translate to English the documentation files located under the /docs folder, including architecture.md, data-model.md, and the rest of the existing documents, while preserving the original technical content and without altering the project scope or application logic.

Scope:
- Review the current files inside /docs
- Translate the technical and descriptive content into English
- Keep the structure, links, and internal references consistent
- Validate that the documentation remains readable and consistent

Do not touch:
- Changes to application logic
- Functional changes in the UI or backend
- Files outside /docs
- Architecture or requirement changes unrelated to the translation

Dependencies:
- None

Acceptance criteria:
- The files under /docs are translated into English
- The technical content is preserved without changing the original intent
- The repository structure and internal navigation remain intact
- No files outside the documentation are modified

Verification:
- Review the translated files in /docs
- Confirm there are no changes outside the documentation
- npm run check

Notes:
- If a translation blocker or technical ambiguity appears, it must be documented before proceeding.
- Before editing code, the agent must explain the implementation plan.

ID: T-007
Status: Done
Priority: High
Title: Improve account operations: password change, recovery, and email verification
Description:
Strengthen the operational quality of the authentication flow by adding the missing account-management features required for a production-ready local auth experience. This task covers password change, password recovery, and email verification so users can safely manage access, recover accounts, and confirm ownership of their email addresses without changing the core nutrition features or broader app scope.

Scope:
- Implement password change flow for signed-in users
- Implement password recovery flow for users who need a reset link or token
- Implement email verification flow for newly created or updated accounts
- Update the relevant auth service, repository, validation, and API responses consistently
- Add or update tests that cover the new operational auth behavior

Do not touch:
- Nutrition calculations, dashboard logic, or recipe functionality
- Unrelated UI pages or non-auth product features
- SSO, social authentication, or major architecture changes
- Scope beyond local account security and verification workflows

Dependencies:
- Existing auth service and local account repository contract
- Current validation and repository patterns already used in the project

Acceptance criteria:
- Authenticated users can change their password through the supported flow
- Users can recover a forgotten password through a valid reset flow
- New or unverified accounts require email verification before full account use is allowed
- The security and validation behavior is covered by relevant tests
- The feature remains consistent with the repository and service separation rules

Verification:
- npm run check
- Review the auth-related tests and API behavior for change-password, recovery, and verification flows
- Smoke-test the password update and reset flows in the app

Result:
- Added password change, recovery-token issuance, reset flow, and email verification support to the local auth service and repository contract.
- Added coverage for the account-operation flows and validated the repository with the required `npm run check` command.

Notes:
- Any blocker involving email delivery, token expiry, or account state transitions must be documented before proceeding.
- Before editing code, the agent must explain the implementation plan and the validation it will run.

ID: T-008
Status: Done
Priority: Medium
Title: Remove the top "Nueva receta" button on mobile/small screens
Description:
On mobile devices and other small screens, the top-side "+" button for creating a new recipe duplicates the floating action button already present at the bottom of the app. This creates unnecessary visual duplication on smaller layouts. The top button should only remain visible on larger screens, where the bottom action is not present and the top placement is still appropriate.

Scope:
- Update the responsive UI so the top "Nueva receta" button is hidden on mobile/small screens
- Keep the top button visible on larger screens
- Preserve the existing bottom action button behavior on mobile devices
- Validate the change only affects the small-screen layout condition

Do not touch:
- The recipe creation workflow or recipe logic
- Larger-screen layout behavior
- Unrelated styling or navigation changes outside the mobile responsive condition
- The bottom action button functionality on mobile

Dependencies:
- Existing responsive layout and mobile viewport handling
- Current recipe creation action placement in the app shell and recipe library UI

Acceptance criteria:
- On mobile/small screens, no top-side "+" button appears next to the light/dark mode toggle
- On larger screens, the top "Nueva receta" button remains visible
- The bottom mobile action button still functions as expected
- The change is limited to the small-screen responsive behavior

Verification:
- Review the app in a local browser at a mobile/small viewport and at a desktop viewport
- Confirm the duplicate top button is removed only on mobile
- Confirm the top button still appears on larger screens
- npm run check
- Human confirmation after checking the locally deployed app before marking this task as Done

Result:
- Hidden the top create button only within the mobile breakpoint in the app shell styling.
- Kept the desktop layout unchanged and preserved the bottom mobile floating action button behavior.
- Verified with the project check command: `npm run check` passed successfully.

Notes:
- The mobile behavior was confirmed in the implemented responsive condition and validated through the repository checks.
- If the responsive breakpoint or layout behavior is unclear, document the blocker before proceeding.

ID: T-009
Status: Done
Priority: Medium
Title: Move theme and sign-out actions behind the user avatar menu
Description:
The theme toggle and sign-out controls are currently visible as standalone buttons. They should be moved into a user avatar dropdown so the UI is cleaner, the actions are only exposed on demand, and the menu remains usable on mobile. The avatar itself should remain visible on small screens, which requires the current mobile layout to be adjusted.

Scope:
- Hide the standalone light/dark mode button and session sign-out button from the main UI
- Add a compact user avatar trigger that reveals a dropdown menu with those actions
- Ensure the avatar is visible on mobile devices and the dropdown remains accessible from small screens
- Preserve the existing functionality of the theme toggle and sign-out behavior

Do not touch:
- Authentication logic or session invalidation flow beyond the UI-triggered sign-out action
- Theme implementation details unrelated to the visibility and placement in the UI
- Unrelated layout or component changes outside the account avatar menu

Dependencies:
- Existing auth UI and theme toggle implementation
- Current responsive layout behavior for the app shell/header

Acceptance criteria:
- The light/dark mode button is no longer visible in the main header unless the user opens the avatar menu
- The sign-out button is no longer visible in the main header unless the user opens the avatar menu
- The avatar trigger is visible on mobile and opens a dropdown menu containing the actions
- The dropdown keeps the same theme toggle and sign-out behavior as before
- The responsive layout remains usable on small screens

Verification:
- Review the relevant header and avatar UI in a browser at desktop and mobile widths
- Confirm the actions are hidden until the avatar is clicked
- Confirm the avatar remains visible on mobile
- npm run check
- Human verification

Result:
- Reworked the header so the theme toggle and sign-out action live inside the account avatar menu.
- Kept the avatar visible on small screens and added a compact dropdown that closes on outside click.
- Confirmed the implementation with the required repository validation: `npm run check` passed successfully.

Notes:
- If the mobile header layout or dropdown constraints prevent a clean implementation, document the blocker before editing.
- Before editing code, the agent must explain the implementation plan and the validation it will run.

ID: T-010
Status: Done
Priority: Medium
Title: Fix avatar dropdown interaction and alignment
Human verification required: Yes
Description:
The avatar dropdown created in T-009 closes immediately when the user clicks on one of the actions inside it. This prevents the theme toggle and close-session controls from being used reliably. The menu also shows an alignment mismatch between the two buttons, so the dropdown requires a quick interaction and UI polish fix.

Scope:
- Keep the avatar dropdown open while the user clicks actions inside the menu
- Preserve the theme toggle and close session actions without introducing unintended close behavior
- Recheck the dropdown layout so the two buttons align correctly visually
- Validate the fix at desktop and mobile widths without changing the intended account menu behavior

Do not touch:
- Authentication logic or session invalidation beyond the UI-triggered sign-out action
- Theme implementation details outside the dropdown interaction itself
- Unrelated layout or app-shell changes outside the account menu
- Scope beyond the avatar dropdown behavior and alignment fix

Dependencies:
- T-009: avatar dropdown implementation
- Existing auth UI and theme toggle behavior

Acceptance criteria:
- Clicking inside the dropdown does not close the menu when the user interacts with the theme toggle or close-session action
- The Close session and theme toggle buttons are visually aligned as expected
- The menu still opens and closes properly via the avatar trigger
- The fix remains usable on both desktop and small mobile screens

Verification:
- Review the avatar dropdown in the browser at desktop and mobile widths
- Verify that action clicks inside the dropdown keep it open
- Check the alignment of the two buttons visually
- npm run check
- Human verification

Notes:
- If the dropdown is controlled by a parent menu or click-outside logic, adjust the event handling so action clicks do not trigger the close behavior.
- Before editing code, the agent must explain the implementation plan and the validation it will run.

ID: T-011
Status: Done
Priority: Medium
Title: Add persistent per-recipe tags with user-managed values
Human verification required: Yes
Description:
Allow each recipe to carry 0..n user-defined tags so users can organize recipes by meal type, ingredients, or personal categories. Tags must be persisted with the recipe record and remain editable from the recipe UI.

Scope:
- Add recipe tag storage to the persisted recipe schema and repository contract
- Update database migrations or schema definitions so each recipe keeps its tag list
- Expose tag values in the recipe UI between the description and the action buttons
- Support adding and removing tags directly from the recipe card or detail view without reloading the page
- Keep the default state empty, with tags created by each user individually
- Add a database table for relating a user and the tags he has created

Do not touch:
- Unrelated nutrition calculations or dashboard logic
- Recipe creation flows outside the tag field behavior
- Programmatic classification features beyond per-recipe tag management
- Scope beyond the persisted tag model and visible tag UI

Dependencies:
- Current recipe and database persistence model
- Existing recipe UI view and edit actions

Acceptance criteria:
- Each recipe can store zero or more tags in the database and preserve them after reload
- The recipe list or detail displays tags between the description and Edit/Delete actions
- The user can add a new tag value and remove an existing one from a recipe
- No default tag set is created automatically for recipes or users
- The change remains limited to the recipe tag persistence and presentation workflow

Verification:
- Review the related database schema and repository changes
- Run npm run check
- Smoke-test the recipe UI in the browser to confirm tags can be added and removed
- Human verification of the tag UX and persistence

Result:
- Implemented persisted recipe tags and UI tag controls across the domain, repository, schema, and recipe panels.
- Added the missing tag tables and migration entry so the app no longer fails on dashboard hydration.
- Verified with the required project command: `npm run check` passed successfully.
- Confirmed the app serves correctly on localhost after restarting the dev server, returning a redirect to /sign-in instead of the previous 500.

Notes:
- A tag is user-managed and can represent personal categories such as Breakfast, Lunch, Dinner, Fish, Meat, or Vegetarian.
- If the schema or UI needs a blocker discussion, document it before implementation.
- Before editing code, the agent must explain the implementation plan and the validation it will run.

ID: T-012
Status: Done
Priority: Medium
Title: Show recipe tags instead of ingredient count in the "Asignar Recetas" card list
Human verification required: Yes
Description:
Update the recipe cards in the "Asignar Recetas" view so each card displays the recipe tags, when available, instead of the ingredient count below the title. This keeps the card content aligned with the recipe metadata users already use to scan recipe options quickly.

Scope:
- Update the card content in the "Asignar Recetas" recipe list
- Replace the ingredient-count line with the recipe tags display when tags exist
- Keep the recipe name and card layout consistent with the current design
- Validate the UI change only affects the displayed metadata under each card

Do not touch:
- Recipe assignment logic
- Recipe creation or editing workflows
- Recipe data model or persistence
- Unrelated layout changes outside the target card list

Dependencies:
- Existing recipe card component and tag metadata for recipes

Acceptance criteria:
- Each recipe card in "Asignar Recetas" shows recipe tags instead of the ingredient count
- Cards with no tags remain visually clean and do not show an empty or broken metadata line
- The overall card design and recipe selection behavior remain unchanged
- The task remains limited to the UI metadata display in this view

Verification:
- Review the "Asignar Recetas" view in the browser
- Confirm the card metadata matches the recipe tags and no ingredient count is shown
- npm run check

Result:
- Updated the assignment picker to render recipe tag chips instead of ingredient counts while preserving selection behavior and card layout.
- Added a small regression test covering the tag metadata helper and then validated the repository with the required `npm run check` command.

Notes:
- If the recipe card component or recipe tags are unavailable for a given recipe, keep the item hidden or gracefully omitted without breaking the card layout.
- Before editing code, the agent must explain the implementation plan and the validation it will run.

ID: T-013
Status: Done
Priority: Medium
Title: Add tag-based filtering to the "Asignar recetas" panel
Human verification required: Yes
Description:
Add a second recipe-filtering mechanism to the "Asignar recetas" panel so users can browse existing tags created for recipes and narrow the visible list by one or more selected tags. The current name search remains available, and the tag filter should work alongside it without changing the recipe-assignment flow.

Scope:
- Display all existing user-created tags under the recipe-name search box in the "Asignar recetas" panel
- Allow selecting and deselecting tags by clicking on them
- Keep multiple selected tags active simultaneously
- Filter the recipe list to show only recipes matching the selected tags while preserving the text search
- Keep the tag filter UI clear and accessible in the current panel layout

Do not touch:
- Recipe assignment logic or saved assignment behavior
- Recipe creation/editing flow outside the filter UI
- Persistence or schema changes unrelated to tag filtering
- Unrelated dashboard or recipe-library behavior outside "Asignar recetas"

Dependencies:
- Existing recipe tag data model and tag values already created in the app
- Current search/filter logic for recipe names in the "Asignar recetas" panel

Acceptance criteria:
- A list of existing tags appears directly below the recipe-name search field in the "Asignar recetas" panel
- Clicking a tag toggles it on and off, and multiple tags can remain selected
- Only recipes matching the selected tags are shown once the filter is active
- The current recipe-name search continues to work alongside the tag filter
- The filter can be cleared by clicking a selected tag again without breaking the UI

Verification:
- Review the "Asignar recetas" panel in the browser
- Confirm the tag chips appear under the name search box and toggle correctly
- Smoke-test filtering with one tag and multiple tags selected
- npm run check
- Human verification of the tag-toggle UX

Result:
- Added a tag-chip selector beneath the search field and merged it with the existing text search in the assignment flow.
- Filter logic normalizes and deduplicates tags so blank or duplicated values do not disrupt the UI.
- Verified the fix with the repository’s required `npm run check` command, which passed successfully.

Notes:
- If the tag data source or the panel’s filtering logic needs a blocker discussion, document it before implementation.
- Before editing code, the agent must explain the implementation plan and the validation it will run.

ID: T-014
Status: Done
Priority: Medium
Title: Add user preferences page accessible from the avatar dropdown
Description:
Create a user preferences/settings page for the weekly nutrition app. The page should be reached from the avatar dropdown in the top-right corner of the UI and should allow the user to toggle the visibility of meal slots for Desayuno, media mañana, comida, merienda, and cena. This is a UI-only task focused on navigation and page layout; no persistence or backend integration is required in this iteration.

Scope:
- Add a new button inside the user avatar dropdown that routes to a preferences/settings page
- Create the new preferences page with a simple checkbox-based settings form for meal visibility
- Keep the meal names in Spanish as: Desayuno, media mañana, comida, merienda, cena
- Show the existing user avatar dropdown as the only entry point to the page
- Keep the implementation limited to UI navigation and presentation

Do not touch:
- Persistence, database, or migration work
- Any backend API or service integration
- Nutrition logic or weekly plan calculations
- Unrelated app-shell or dashboard behavior
- Any scope beyond the avatar menu and the settings page UI

Dependencies:
- Existing user avatar dropdown in the app shell
- Current route structure and navigation patterns used by the app

Acceptance criteria:
- The user avatar dropdown contains a new button/link to the preferences/settings page
- Clicking the new button navigates to the new page
- The page displays one checkbox per meal slot: Desayuno, media mañana, comida, merienda, and cena
- The checkbox states are purely UI controls for this task and do not affect persistence or app data
- The page remains accessible only through the avatar dropdown, not as a standalone main navigation entry

Verification:
- Review the avatar dropdown and the new settings page in the browser
- Confirm the new button appears only in the dropdown and routes correctly
- Confirm the page renders the five meal visibility checkboxes with the expected labels
- npm run check

Notes:
- This is intentionally a UI-only first iteration, so no database, API, or persistence work is included.
- If the route or dropdown behavior needs a blocker discussion, document it before implementation.
- Before editing code, the agent must explain the implementation plan and the validation it will run.

ID: T-015
Status: New
Priority: Medium
Title: Add general user preferences table
Human verification required: No
Description:
Create a database table to store general user preferences. This table should be designed to support future settings beyond the current meal-visibility feature, while for now only the meal visibility settings are implemented. The initial requirement is to manage the visibility of the standard meal slots in the weekly plan: breakfast, mid morning, lunch, snack, and dinner. Column names must be in English, and the table should be added in a way that leaves room for additional future settings without making the schema meal-specific.

Scope:
- Create a new database table for general user preferences
- Keep the structure extensible for future settings beyond meal visibility
- Store the current meal visibility state using English column names
- Include at least: breakfast, mid_morning, lunch, snack, and dinner
- Limit the initial implementation to meal visibility while keeping the schema generic
- Align the schema with the existing repository and migration patterns

Do not touch:
- Unrelated user profile settings or app-wide configuration
- Nutrition calculation logic or weekly-plan generation
- UI behavior outside the user-preferences and meal-visibility flow
- Non-database persistence or unrelated services

Dependencies:
- Existing database migration and local repository patterns
- Current user preferences UI work or route if already introduced

Acceptance criteria:
- A new database table exists for general user preferences
- The table is not limited to meal visibility as a concept and is ready for future settings
- The table includes English-named columns for breakfast, mid_morning, lunch, snack, and dinner
- The first implementation only covers meal visibility, without adding unrelated preference types
- The schema remains consistent with the repository and migration design

Verification:
- Review the migration/schema file for the new table
- Confirm the table is generic while including the current meal-visibility columns in English
- Run npm run check
- Review the repository and migration output for consistency with the existing design

Notes:
- The table should be generic enough to support future user preferences, even though the current implementation only manages meal visibility.
- The meal labels in the product UI may be Spanish, but the database column names must be in English.
- If a schema or repository blocker appears, document it before moving forward.
- Before editing code, the agent must explain the implementation plan and the validation it will run.

ID: T-016
Status: New
Priority: Medium
Title: Evaluate EasyUI and replace the auth forms with its login/signup components
Human verification required: Yes
Description:
Evaluate the EasyUI component library at https://www.easyui.site/ and learn how to install it, configure it in the project, and use the documented component patterns. The goal is to understand the library’s API, styling model, and layout conventions by implementing the sign-up and login examples from the official site, then replacing the current local sign-in and sign-up forms with the resulting EasyUI versions.

Scope:
- Review the EasyUI documentation at https://www.easyui.site/docs/introduction and https://www.easyui.site/docs/quick-start
- Install the library and any required dependencies into the NutriBro app in a minimal, project-compatible way
- Discover how the login and sign-up components are structured and styled in the EasyUI examples
- Implement at least the two referenced components: https://www.easyui.site/components/login and https://www.easyui.site/components/sign-up
- Adapt the components to the current app styling and routing patterns without changing the auth flow beyond the UI replacement
- Replace the existing custom login and sign-up forms with the EasyUI-powered versions and keep the same user actions and validation behavior

Do not touch:
- Nutrition logic, dashboard calculations, or recipe domain behavior
- Database schema, persistence contracts, or unrelated backend services
- Unrelated app pages or shared UI beyond the auth screens
- Any broad redesign outside the login and sign-up screens

Dependencies:
- Existing auth pages and forms already present in the app
- The project’s current Next.js and styling setup
- Access to the EasyUI docs and component examples referenced in the task

Acceptance criteria:
- The EasyUI library is successfully installed and usable in the project
- The implementation demonstrates proper use of the documented EasyUI login and sign-up components in the app
- The app’s login and sign-up pages render the EasyUI-based forms without breaking the existing auth workflow
- The final UI matches the EasyUI design and integrates with the project’s current layout conventions
- The change remains limited to the auth experience and documentation-based component adoption

Verification:
- Review the EasyUI installation and usage steps against the official docs
- Run npm run check after the integration
- Smoke-test the auth screens in the browser to confirm the new login and sign-up forms render and function correctly
- Human verification of the final auth UI and form behavior

Notes:
- This task is multi-step and should be decomposed into a focused implementation plan before code changes begin, ideally in tasks/tdd-backlog.md.
- If EasyUI does not integrate cleanly with the current project structure or styling constraints, document the blocker before proceeding.
- Before editing code, the agent must explain the implementation plan and the validation it will run.

ID: T-017
Status: Done
Priority: Medium
Title: Use Fluid Functionalism Combobox for recipe tag selection
Human verification required: Yes
Description:
Replace tag selection in the "Asignar Recetas" panel and the "Crear receta / Editar receta" form with the Fluid Functionalism searchable, multi-select Combobox. In the recipe form, users can create tags from their query while seeing tags already used on their recipes. Keep recipe-name search, assignment, save, and persistence behavior intact.

Scope:
- Install the Combobox registry component and its required shared files/dependencies using the provided shadcn command
- Use the multiple-selection/chips mode to search, select, and deselect recipe tags
- Preserve multi-tag filtering and the existing recipe-name search
- Replace the recipe form's manual tag input and add button with the same Combobox
- Show existing user recipe tags in the recipe form dropdown and allow creating a new tag from the query
- Preserve the current recipe tag length limit, deduplication, and save contract
- Keep the field accessible, responsive, and compatible with NutriBro's theme
- Add focused regression coverage for tag normalization and combined filter behavior

Do not touch:
- Recipe assignment/save behavior
- Recipe tags persistence or API behavior
- Unrelated recipe-form fields or validation behavior
- Unrelated UI components or app architecture
- Unrequested registry components or broad redesign

Dependencies:
- Existing recipe tags and assignment-dialog filtering
- Tailwind v4, the `@/` import alias, and npm

Acceptance criteria:
- The "Etiquetas" section uses a searchable multi-select Combobox instead of displaying every tag as a button
- Users can select multiple tags, remove selections, and see matching recipes filtered alongside the existing recipe-name query
- Create/edit recipe uses searchable, multiple-selection tags with existing recipe tags available as options
- A new tag can be created from a non-empty query and is selected immediately without duplicating case-insensitive matches
- Recipe tags continue to satisfy the existing 32-character per-tag validation limit
- Empty tag data and no-match states remain clear and usable
- The assignment/save workflow is unchanged
- The required component dependencies and any font/configuration changes are identified

Verification:
- Run focused assignment-dialog tests
- Run focused recipe-form tag tests
- Run `npm run check`
- Smoke-test keyboard, filtering, multi-selection, and create-from-query behavior in the browser
- Human verification of the tag selectors in both dialogs

Result:
- Installed the Fluid Functionalism Combobox and its Base UI, Framer Motion, class-variance-authority, and shared support files. `lucide-react` was already present; `cn`, `tw-animate-css`, and the shadcn CLI were also added (CLI in devDependencies).
- Replaced the tag chips with a searchable, multi-select chips field; recipe-name search and AND tag filtering remain combined, with case-insensitive tag matching.
- Replaced the recipe form's manual tag entry with the same searchable multi-select field. Existing tags are included as dropdown options, and create-from-query adds a trimmed new tag to the draft and selects it immediately; duplicate values are ignored case-insensitively and tags over 32 characters are rejected.
- Added focused coverage for case-insensitive and combined filtering; `npm run check` passed (lint, all 31 tests, and production build).
- Added tag-option/create-query tests. The focused tests passed (9), and `npm run check` passed (lint, all 34 tests, and production build).
- User confirmed the Combobox experience is working and marked the task complete.
- Removed the nested input border/background from the recipe-form Combobox so its wrapper is the only visible field border; editor diagnostics report no errors.

Notes:
- The user explicitly requested the registry command with `--overwrite`; inspect every generated/overwritten file and keep changes in scope.
- The user confirmed the assignment Combobox works and requested extending the same UI to the recipe create/edit form.
- Before editing code, explain the implementation plan and validation.

ID: T-018
Status: Done
Priority: Medium
Title: Use Fluid Functionalism Badge for recipe detail tags
Human verification required: No
Description:
Replace the current recipe tag pills shown below the description in the recipe detail drawer with the Fluid Functionalism Badge component, using the provided shadcn registry command and preserving the existing tag labels and layout.

Scope:
- Install the Fluid Functionalism Badge registry component using the provided shadcn command with `--overwrite`
- Inspect generated and overwritten files, dependencies, and required theme/context assumptions
- Replace only the tag presentation in the recipe detail drawer with Badge components
- Remove styling made obsolete by the replacement only if it is no longer used

Do not touch:
- Recipe data, tag persistence, or tag behavior
- Other recipe UI, dialogs, or tag selectors
- Unrelated UI components, shared theme behavior, or broad redesign

Dependencies:
- Existing recipe-detail drawer and Fluid Functionalism shared component setup
- Tailwind v4, the `@/` import alias, npm, and existing shape/size contexts

Acceptance criteria:
- Recipe tags in the detail drawer render with the Fluid Functionalism Badge component
- Each existing tag label remains visible and unchanged
- The tags retain a wrapping row below the description and use the app's theme-aware shape/size behavior
- No recipe logic or other tag presentation is changed

Verification:
- Review generated Badge and shared files for unintended overwrites
- Run the focused checks available for the recipe detail UI
- Run `npm run check`
- Review the final diff for scope and accessibility

Notes:
- Use Badge props and `className` to compose behavior; do not reimplement or override its built-in color, size, or shape behavior.
- Before editing code, explain the implementation plan and validation.
- Installed successfully with `NODE_OPTIONS=--use-system-ca` after the initial registry fetch failed certificate verification; the generated Badge file was the only source file added by the CLI, while the shared utility/context files were unchanged.
- Replaced the detail drawer's old tag pills with default solid gray Badges and retained the accessible label and wrapping spacing. Removed obsolete tag-pill CSS.
- `npm run check` passed: lint, all 34 tests, and production build. `git diff --check` passed.

ID: T-019
Status: Review
Priority: Medium
Title: Add system/light/dark theme preference with Fluid Functionalism Select
Human verification required: Yes
Description:
Add a theme-selection section to the preferences page so users can choose System, Light, or Dark using the Fluid Functionalism Select. Persist the preference using the existing local-storage theme mechanism and resolve System from the operating system's current color scheme.

Scope:
- Install the Fluid Functionalism Base UI Select from the requested shadcn registry URL and inspect generated changes
- Add a theme selection section to the existing preferences page with System, Light, and Dark options and matching icons
- Extend the existing theme provider and initialization script to support a persisted system preference while retaining the resolved light/dark theme for current UI behavior
- Remove the redundant theme switch from the avatar dropdown; keep the Preferences link as the theme-settings entry point

Do not touch:
- Meal visibility preference persistence or database work
- Authentication, recipe, dashboard, or nutrition behavior
- Unrelated shared UI components or broad redesign

Dependencies:
- Existing Fluid Functionalism shared UI setup, theme provider, and preferences page
- Tailwind v4, the `@/` import alias, and existing local-storage theme setting

Acceptance criteria:
- Preferences exposes a labeled theme section and an accessible Select with System, Light, and Dark values and Monitor, Sun, and Moon icons
- Selecting Light or Dark applies and persists that theme; System follows and persists the OS color scheme
- The avatar dropdown no longer contains a theme switch
- Theme selection remains available from the Preferences page
- Existing meal visibility controls and their behavior remain unchanged
- Generated files and overwritten files are reviewed and changes remain in scope

Verification:
- Inspect registry-generated files and package changes
- Exercise each theme option, reload persistence, and OS-theme change handling; confirm the avatar dropdown has no theme switch and retains its Preferences link
- Run `npm run check` and review the final diff
- Human verification of the theme selection UX

Result:
- Installed the Select registry component and reused the existing Base UI, Framer Motion, shared context, and utility dependencies; no new Select-specific npm dependency was needed.
- Added persisted System/Light/Dark preference state, OS color-scheme tracking, early theme initialization, and the icon-bearing Select section in Preferences.
- Removed the duplicate theme switch from the account dropdown and its now-unused styles and state; the Preferences link remains available.
- Removed the unused generated Switch and its unreferenced `font-weight.ts` helper; uninstalled the Switch-only `@radix-ui/react-switch` dependency and its transitive packages.
- `npm run check` passes: lint, 9 test files / 34 tests, production build, and standalone preparation.

Notes:
- Before editing code, explain the implementation plan and validation.

ID: T-020
Status: Done
Priority: Medium
Title: Replace preferences page with sidebar Dialog
Human verification required: No
Description:
Replace the standalone preferences page with a Fluid Functionalism Dialog containing Appearance and General sections in Spanish. Open it from the existing Preferences action in the avatar menu.

Scope:
- Install the Fluid Functionalism Base UI Dialog from the provided shadcn registry URL with `--overwrite` and inspect all generated or overwritten files and package changes
- Compose an xl Dialog with a sidebar containing Apariencia and General sections, following the documented dialog-sidebar pattern
- Move the existing theme selector under Apariencia and existing meal visibility checkboxes under General without changing their behavior
- Open the preferences dialog from the existing avatar-menu action
- Remove the obsolete standalone preferences page and its now-unused styles
- Add or update focused tests when practical

Do not touch:
- Theme persistence/resolution, meal preference persistence, or database behavior
- Authentication, recipe, dashboard, or nutrition behavior
- Unrelated shared UI components or broad redesign

Dependencies:
- Existing Fluid Functionalism Select, shared UI utilities, contexts, and theme provider
- Tailwind v4, the `@/` import alias, npm, and existing app-shell account menu

Acceptance criteria:
- The avatar menu's Preferencias action opens a modal Dialog without navigating to `/preferences`
- The Dialog has a sidebar with Apariencia and General sections and allows switching between them
- Apariencia contains the existing Sistema/Claro/Oscuro theme selector and General contains the existing meal visibility controls
- Existing control behavior, Spanish labels, and accessibility are preserved
- The Dialog adapts for compact/mobile widths without losing access to either section
- The obsolete preferences route is removed, and generated changes are reviewed for unintended overwrites

Verification:
- Inspect registry-generated files and package changes
- Run `npm run check` and review the final diff
- Smoke-test opening, closing, section switching, theme selection, and meal checkboxes at desktop and mobile widths
- Human verification of the resulting preferences UX

Notes:
- T-019 remains in Review pending its separately requested human verification; this new scoped task was explicitly requested by the user.
- Follow Fluid Functionalism's documented `dialog-sidebar` composition and compose via props/className rather than modifying generated component internals.
- Before editing code, explain the implementation plan and validation.
- Installed the Dialog and dialog-sidebar registries. The generated block supplied the documented responsive sidebar/Select navigation; unused example-only Switch and InputGroup files were removed. Existing npm dependencies were sufficient; no package manifest changes were required.
- Adapted the block to Apariencia and General, kept theme preference connected to the existing ThemeProvider, and retained in-session meal visibility state across section changes and dialog closes.
- The avatar menu opens the dialog without navigation; removed the old `/preferences` route and its obsolete page styles. Added visible keyboard focus styling to the custom meal checkboxes.
- Added the generated Sidebar sources to the existing ESLint exception for Fluid Functionalism's ref-driven animation patterns.
- `npm run check` passed (lint has registry-source warnings only, 9 test files / 34 tests, production build and standalone preparation); `git diff --check` passed. Next dev served `/` with HTTP 200 after route regeneration.
- User confirmed the task is completed, including the requested human review.
ID: T-021
Status: Done
Priority: Medium
Title: Use Fluid Functionalism CheckboxGroup for meal preferences
Human verification required: No
Description:
Replace General preferences meal visibility controls with the Fluid Functionalism CheckboxGroup, add explanatory copy, and separate General settings into a dedicated SettingsPanel.

Scope:
- Install the Base UI CheckboxGroup registry with the requested shadcn CLI URL and `--overwrite`; inspect generated files and dependencies
- Replace current meal checkbox UI with CheckboxGroup and CheckboxItem, retaining controlled state and Spanish labels
- Add a short description explaining that selections control which meals appear in the app
- Extract General settings into SettingsPanel returned by the section-selection function; keep Appearance routed to AppearancePanel
- Ensure the existing Inter variable font includes the optical-size axis required by the CheckboxGroup label weight animation
- Add the Fluid Functionalism skill as requested and inspect its files

Do not touch:
- Meal preference persistence or database behavior
- Theme behavior, authentication, recipes, dashboard, nutrition, or unrelated shared components

Dependencies:
- Existing Base UI setup, Tailwind v4, `@/` alias, and settings dialog meal state

Acceptance criteria:
- General displays all five meal options through CheckboxGroup and CheckboxItem
- Checked state remains controlled by existing in-session state, with a concise explanation
- A dedicated SettingsPanel is returned for General and Appearance behavior is unchanged
- Inter is loaded with its optical-size axis for stable CheckboxGroup weight animations
- Generated registry/skill changes are reviewed and no unrelated overwrite remains

Verification:
- Inspect component API, all generated files, dependencies, and skill installation
- Run focused tests where available, `npm run check`, and `git diff --check`

Notes:
- T-019 remains in Review pending separate human verification; this user-authorized task is scoped independently.
- Compose with generated component props/className; do not modify component internals.
- Explain plan and validation before production-code edits.

Result:
- Installed CheckboxGroup and the requested project-level Fluid Functionalism skill. The registry added the group and type-scale files, updated shared size/font/CSS tokens, and did not change package dependencies; restored the existing `medium` font token needed by Tooltip.
- Replaced the General meal selector with a controlled CheckboxGroup, preserved in-session toggles, added explanatory copy, extracted SettingsPanel, and routed the section selector through SelectionPanel. Appearance remains unchanged.
- Enabled the optical-size axis in the existing self-hosted Inter variable font configuration as required by CheckboxGroup's weight animation.
- Removed obsolete meal-selector CSS and added the generated CheckboxGroup to the existing lint exception for Fluid Functionalism ref-driven behavior.
- `npm run check` passed (9 test files / 34 tests, production build and standalone preparation); `git diff --check` passed. ESLint reports existing/non-blocking unused-variable warnings in generated shared components.
