import { describe, expect, it } from "vitest";

import type { MealVisibilityPreferences } from "@/domain/preferences/types";
import type { UserPreferencesRepository } from "@/server/repositories/user-preferences-repository";
import { ValidationError } from "@/server/services/errors";

import { UserPreferencesService } from "./user-preferences-service";

class InMemoryUserPreferencesRepository implements UserPreferencesRepository {
  readonly savedFor: string[] = [];
  readonly values = new Map<string, MealVisibilityPreferences>();

  async read(userId: string) {
    return this.values.get(userId) ?? {
      breakfast: true,
      midMorning: true,
      lunch: true,
      snack: true,
      dinner: true,
    };
  }

  async save(userId: string, preferences: MealVisibilityPreferences) {
    this.savedFor.push(userId);
    this.values.set(userId, { ...preferences });
    return { ...preferences };
  }
}

const userId = "00000000-0000-4000-8000-000000000001";
const preferences: MealVisibilityPreferences = {
  breakfast: false,
  midMorning: true,
  lunch: false,
  snack: true,
  dinner: false,
};

describe("UserPreferencesService", () => {
  it("returns all-visible defaults without creating a row for a missing user", async () => {
    const repository = new InMemoryUserPreferencesRepository();
    const service = new UserPreferencesService(repository);

    await expect(service.getPreferences(userId)).resolves.toEqual({
      breakfast: true,
      midMorning: true,
      lunch: true,
      snack: true,
      dinner: true,
    });
    expect(repository.values.size).toBe(0);
  });

  it("validates and saves the complete snapshot for the supplied user", async () => {
    const repository = new InMemoryUserPreferencesRepository();
    const service = new UserPreferencesService(repository);

    await expect(service.savePreferences(userId, preferences)).resolves.toEqual(preferences);
    await expect(service.getPreferences(userId)).resolves.toEqual(preferences);
    expect(repository.savedFor).toEqual([userId]);
  });

  it("turns malformed preference input into a validation error", async () => {
    const service = new UserPreferencesService(new InMemoryUserPreferencesRepository());

    await expect(service.savePreferences(userId, { ...preferences, userId: "attacker" }))
      .rejects.toBeInstanceOf(ValidationError);
  });
});
