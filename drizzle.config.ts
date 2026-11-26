import { defineConfig } from "drizzle-kit";
import { loadEnv } from "./src/db/env";

loadEnv();

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "turso",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL || "file:.data/local.db",
    authToken: process.env.TURSO_AUTH_TOKEN || undefined,
  },
  verbose: true,
  strict: true,
});
