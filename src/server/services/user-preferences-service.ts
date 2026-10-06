import "server-only";

import { parseMealVisibilityPreferences, fieldErrorsFromPreferencesSchema } from "@/domain/preferences/schemas";
import type { MealVisibilityPreferences } from "@/domain/preferences/types";
import type { UserPreferencesRepository } from "@/server/repositories/user-preferences-repository";
import { ValidationError } from "@/server/services/errors";
import { ZodError } from "zod";

export class UserPreferencesService {
  constructor(private readonly repository: UserPreferencesRepository) {}

  getPreferences(userId: string): Promise<MealVisibilityPreferences> {
    return this.repository.read(userId);
  }

  async savePreferences(
    userId: string,
    rawPreferences: unknown,
  ): Promise<MealVisibilityPreferences> {
    let preferences: MealVisibilityPreferences;
    try {
      preferences = parseMealVisibilityPreferences(rawPreferences);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ValidationError(
          "Revisa la configuración de visibilidad de las comidas.",
          fieldErrorsFromPreferencesSchema(error),
        );
      }

      throw error;
    }

    return this.repository.save(userId, preferences);
  }
}
