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
