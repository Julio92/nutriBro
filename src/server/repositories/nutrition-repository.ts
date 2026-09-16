import type { StoreData } from "@/domain/nutrition/types";

export interface NutritionRepository {
  ensureWorkspace(userId: string): Promise<void>;
  read(userId: string): Promise<StoreData>;
  update<T>(
    userId: string,
    mutator: (data: StoreData) => T | Promise<T>,
  ): Promise<T>;
}
