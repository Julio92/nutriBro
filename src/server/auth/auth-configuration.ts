import "server-only";

const REQUIRED_AUTHIRONMENT_VARIABLES = [
  "DATABASE_URL",
  "AUTH_SECRET",
] as const;

export function getMissingAuthenticationEnvironmentVariables() {
  return REQUIRED_AUTHIRONMENT_VARIABLES.filter(
    (name) => !process.env[name]?.trim(),
  );
}

export function isAuthenticationConfigured() {
  return getMissingAuthenticationEnvironmentVariables().length === 0;
}
