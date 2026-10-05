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
