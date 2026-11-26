import { config } from "dotenv";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

let loaded = false;

/** Load .env.local then .env for CLI scripts. Next.js loads these itself. */
export function loadEnv() {
  if (loaded) return;
  config({ path: ".env.local", quiet: true });
  config({ path: ".env", quiet: true });
  loaded = true;
}

export function getDatabaseUrl() {
  loadEnv();
  const url = process.env.TURSO_DATABASE_URL?.trim();
  if (url) return url;
  if (process.env.NODE_ENV === "production") {
    throw new Error("TURSO_DATABASE_URL is required in production. Configure Turso before deploying.");
  }
  const localUrl = "file:.data/local.db";
  mkdirSync(dirname(localUrl.slice("file:".length)), { recursive: true });
  return localUrl;
}
