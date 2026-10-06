import "server-only";

import { PostgresUserPreferencesRepository } from "@/server/infrastructure/postgres-user-preferences-repository";
import { UserPreferencesService } from "@/server/services/user-preferences-service";

export const userPreferencesService = new UserPreferencesService(
  new PostgresUserPreferencesRepository(),
);
