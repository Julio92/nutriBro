import "server-only";

import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import { createEmptyStoreData } from "@/domain/nutrition/factories";
import { validateStoreData } from "@/domain/nutrition/schemas";
import type { StoreData } from "@/domain/nutrition/types";
import type { NutritionRepository } from "@/server/repositories/nutrition-repository";

const DEFAULT_DATA_FILE = "data/nutrition-data.json";

function resolveDataFilePath() {
  const configuredPath = process.env.NUTRITION_DATA_FILE?.trim();
  return resolve(
    /* turbopackIgnore: true */ process.cwd(),
    configuredPath || DEFAULT_DATA_FILE,
  );
}

function resolveDemoDataFilePath(dataFilePath: string) {
  return resolve(dirname(dataFilePath), "demo-nutrition-data.json");
}

function isMissingFile(error: unknown): error is NodeJS.ErrnoException {
  return Boolean(
    error &&
      typeof error === "object" &&
      "code" in error &&
      (error as NodeJS.ErrnoException).code === "ENOENT",
  );
}

/**
 * Adaptador heredado para el origen JSON local. La composición de producción
 * usa PostgreSQL; este adaptador se conserva para compatibilidad e importación.
 */
export class JsonNutritionRepository implements NutritionRepository {
  private writeTail: Promise<void> = Promise.resolve();

  constructor(private readonly dataFilePath = resolveDataFilePath()) {}

  async ensureWorkspace(): Promise<void> {
    await this.readOrCreate();
  }

  async read(): Promise<StoreData> {
    return structuredClone(await this.readOrCreate());
  }

  async update<T>(
    userId: string,
    mutator: (data: StoreData) => T | Promise<T>,
  ): Promise<T> {
    void userId;
    const operation = this.writeTail.then(async () => {
      const current = await this.readOrCreate();
      const draft = structuredClone(current);
      const result = await mutator(draft);

      validateStoreData(draft);
      await this.writeAtomically(draft);
      return result;
    });

    this.writeTail = operation.then(
      () => undefined,
      () => undefined,
    );

    return operation;
  }

  private async readOrCreate(): Promise<StoreData> {
    try {
      const raw = await readFile(this.dataFilePath, "utf8");
      return validateStoreData(JSON.parse(raw) as unknown);
    } catch (error) {
      if (!isMissingFile(error)) {
        throw error;
      }

      const initialData = await this.readDemoDataOrEmpty();
      await this.writeAtomically(initialData);
      return initialData;
    }
  }

  private async readDemoDataOrEmpty() {
    try {
      const raw = await readFile(resolveDemoDataFilePath(this.dataFilePath), "utf8");
      return validateStoreData(JSON.parse(raw) as unknown);
    } catch (error) {
      if (isMissingFile(error)) {
        return createEmptyStoreData();
      }

      throw error;
    }
  }

  private async writeAtomically(data: StoreData) {
    await mkdir(dirname(this.dataFilePath), { recursive: true });

    const temporaryPath = `${this.dataFilePath}.${process.pid}.${Date.now()}.tmp`;
    await writeFile(temporaryPath, `${JSON.stringify(data, null, 2)}\n`, {
      encoding: "utf8",
      mode: 0o600,
    });
    await rename(temporaryPath, this.dataFilePath);
  }
}
