# Technical risks and mitigations

| Risk | Impact | Current probability | Current mitigation | Action before escalating |
| --- | --- | --- | --- | --- |
| Neon/Auth.js variables not configured | Access and data are unavailable | High before first configuration | Sign-in screen and APIs fail explicitly without using shared demo data | Configure secrets per environment, verify connectivity, and add deployment checks. |
| Brute-force attacks or credential stuffing | Unauthorized access to local accounts | Medium in a public app | Passwords of 12+ characters, Argon2id hashes, and a generic sign-in error | Rate limiting by IP/account, adaptive CAPTCHA, MFA, and monitoring. |
| Missing password recovery | An account may become inaccessible | Medium | Scope is explicitly limited to local development | Implement a single-use link, expiration, email verification, and session revocation. |
| Exposed or unrotated secrets | Session hijacking or database access | Low with good practices | `.env*` is ignored, there are no public secrets, and Vercel manages the variables | Rotation, minimum access, secret alerts, and log review. |
| Neon free plan limits or cold starts | Initial latency or unavailability after quota exhaustion | Medium | Serverless HTTP connection and a compact schema | Quota alerts, exports, a paid plan, and recovery testing. |
| Concurrent writes to the same menu | One update may overwrite a recent edit | Low in personal use; medium as usage grows | Neon batching keeps each synchronization atomic and the aggregate is limited to a user | Add optimistic revision/versioning or more granular SQL mutations before collaboration or high concurrency. |
| Destructive JSON import | Data loss in the target account | Medium during migration | Requires `NUTRITION_IMPORT_CONFIRM=replace`, destination UUID, and ID remapping | Pre-import backup, preview mode, and import logging. |
| Incomplete transcription of the source plan | Ambiguous ingredients or steps in the starter library | Medium when updating the plan | Recipes are versioned, validated with Zod, and portions without instructions are not converted into recipes | Review each new version with the end user and record source corrections. |
| Recipe deletion cleaning assignments | One action affects multiple meals | Medium | Confirmation, count of cleaned slots, and `ON DELETE SET NULL` FK | History, trash bin, and confirmation with affected slot details. |
| Free-text ingredients | Units cannot be reliably summed | High | Deliberate choice: there are no nutritional calculations or data | Food catalog, decimal quantities, and canonical units. |
| External image URLs | Privacy issues, changing content, or broken images | Medium | Only HTTPS, no uploads or proxying | Self-hosted media, allowlist of domains, or a safe proxy with file analysis. |
| Unit-only coverage | Sign-up, session, UI, or browser issues go undetected | Medium | Domain, service, and HTTP response tests | Add Playwright coverage for sign-up, sign-in, account isolation, CRUD, and accessibility. |
| npm dependencies | Upstream vulnerabilities | Medium | Lockfile and npm audit; moderate vulnerabilities remain to be reviewed | Automatic renewal, SCA, advisory review, and CI patches. |
| CSP with `unsafe-inline` | Script protection is weaker | Low | CSP, single origin, and no untrusted HTML; `unsafe-eval` only in development | Use per-request nonce values for scripts and styles when adding third parties. |

## Database operations

- Apply the migration before deploying a version that depends on new tables or columns.
- Keep the legacy JSON until import has been verified and a Neon backup has been taken.
- Use different databases and credentials for development, preview, and production.
- Rotate `AUTH_SECRET` on a planned schedule: changing it invalidates all JWT sessions.

## Product boundaries that must remain explicit

The application must not present recipes as medical advice or simulate nutritional data. If goals or calculations are added later, they must show the data source, date range, uncertainty, and a warning for clinical needs.
