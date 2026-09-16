import "server-only";

import { PostgresNutritionRepository } from "@/server/infrastructure/postgres-nutrition-repository";
import { NutritionService } from "@/server/services/nutrition-service";

export const nutritionService = new NutritionService(new PostgresNutritionRepository());