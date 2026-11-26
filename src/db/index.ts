import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import * as schema from "./schema";
import { getDatabaseUrl } from "./env";

const url = getDatabaseUrl();

if (url.startsWith("file:")) {
  const filePath = url.slice("file:".length);
  mkdirSync(dirname(filePath), { recursive: true });
}

const client = createClient({
  url,
  authToken: process.env.TURSO_AUTH_TOKEN || undefined,
});

export const db = drizzle(client, { schema });
export { schema };
