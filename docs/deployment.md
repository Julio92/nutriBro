# Public deployment on Vercel

## Scope of the first release

Nutribro is delivered from the private repository [Julio92/nutriBro](https://github.com/Julio92/nutriBro) to Vercel. Production starts with an empty Neon database: no recipes or menus are migrated from the local environment. Every person who signs up receives their own starter library and an empty recurring plan.

This slice does not include broad cleanup, CI, readiness endpoints, E2E tests, observability, or per-account authentication limits. The Vercel Firewall IP limit is still required before announcing the site.

## Environment separation

| Environment | Database | Auth.js secret | Use |
| --- | --- | --- | --- |
| Development | Local Neon development project | Local value in `.env.local` | Local development. |
| Preview | Independent Neon base or branch | Different value from Preview | Pull requests and Vercel testing. |
| Production | Exclusive Neon production project | New, stable Production value | Real users. |

`DATABASE_URL` and `AUTH_SECRET` are server secrets. They are not copied to Git, they are not added as `NEXT_PUBLIC_*` variables, and they are not reused across environments. Changing `AUTH_SECRET` invalidates existing JWT sessions.

## Prepare GitHub

1. Run `npm run check` and confirm that lint, tests, and the final build all complete successfully.
2. Initialize Git with `main` as the production branch and add `https://github.com/Julio92/nutriBro.git` as the `origin` remote.
3. Review the staging area before the first commit. The code, [package-lock.json](../package-lock.json), [drizzle](../drizzle), configuration files, and documentation should all be included.
4. Confirm that [.gitignore](../.gitignore) excludes `.env.local`, `.next`, `.vercel`, `node_modules`, and [data/nutrition-data.json](../data/nutrition-data.json). Do not force the inclusion of ignored files.
5. Create the initial commit and push `main` to the private repository.

## Prepare Neon

1. Create the Neon production project in a region appropriate for the expected users.
2. Copy its standard TLS connection URL with `sslmode=require` to a temporary environment for the migration process. Do not modify or publish the local environment file for this purpose.
3. Run `npm run db:migrate` before the first production traffic and confirm that the full history in [drizzle](../drizzle) is applied.
4. Do not run `npm run db:seed`, `npm run db:import-json`, or `npm run db:seed-default-recipes` against the empty production database. Those commands are reserved for explicit imports into an existing account.
5. Repeat the pattern with another Neon project or branch for Preview before enabling pull requests.

## Configure Vercel

1. In Vercel, import the private GitHub repository and select the Next.js preset.
2. Use the repository root, Node.js 22, `npm ci` for installation, and `npm run build` as the build command.
3. Create project secrets before deployment:
   - **Production:** Neon production `DATABASE_URL` and production `AUTH_SECRET`.
   - **Preview:** Neon Preview `DATABASE_URL` and a different `AUTH_SECRET`.
4. Keep the default function region initially. If latency is detected, choose a Vercel region closer to Neon afterward.
5. Do not use Docker, Docker Compose, or `npm run start` as the Vercel flow. Those resources remain available for local execution or alternative hosting.

The project uses Auth.js with `trustHost`, so it does not require `AUTH_URL` or `NEXTAUTH_URL` for this deployment. The absence of either required secret produces an incomplete configuration state instead of enabling access.

## Firewall access limits

Before announcing Production, create a single rate-limiting rule in the Vercel Firewall:

- **Conditions:** method `POST` and the route is equal to `/sign-in`, `/sign-up`, or `/api/auth/callback/credentials`; combine the three routes with `OR`.
- **Key:** IP address.
- **Algorithm:** fixed window.
- **Threshold:** 10 requests in 10 minutes.
- **Response when exceeded:** `429`.

First, save the same condition with logging enabled in a Preview environment and check the Firewall events to confirm it reaches the expected routes. When the condition is correct, change the action to rate limit, review the changes, and publish them. On Vercel Hobby, this shared rule occupies the only rate-limiting limit available per project.

## Launch verification

After the first deployment of `main`:

1. Open the Production URL and confirm that the missing environment variable warning is not shown.
2. Create a new account, sign in, and sign out.
3. Create, edit, and delete a recipe.
4. Assign several recipes to the same meal, reload, and confirm they remain saved.
5. Confirm that a new account receives the starter library and the 35 plan slots.
6. Run controlled access attempts to confirm the `429` response after the threshold and review the Firewall events.
7. Review Vercel logs and Neon usage after the first real session.

## Post-launch operation

- Configure quota alerts and a backup/export strategy in Neon.
- Add GitHub Actions to run `npm ci` and `npm run check` on every pull request.
- Add a readiness check and browser tests for sign-up, sign-in, and multiple assignments.
- As usage grows, separate sign-up and access limits and add a persistent per-account or per-email limit.