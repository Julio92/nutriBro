process.env.NUTRITION_IMPORT_FILE ??= "data/demo-nutrition-data.json";

export {};

await import("./import-json");
