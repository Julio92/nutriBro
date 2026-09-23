import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/server/infrastructure/database/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgresql://neondb_owner:npg_BV13uIdTKxMp@ep-orange-grass-zahjtk19-pooler.c-2.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  },
  strict: true,
  verbose: true,
});
