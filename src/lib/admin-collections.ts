import { asc, eq } from "drizzle-orm";
import type { AnySQLiteColumn, SQLiteTable } from "drizzle-orm/sqlite-core";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import {
  auditLogs, featureItems, footerColumns, footerLinks, inquiries, navLinks, packages,
  paymentMethods, portfolioItems, stats, whyItems,
} from "@/db/schema";
import { assertAdminApi } from "./auth";
import { assertTrustedOrigin, fail, handleApiError, ok, readJson } from "./api";
import {
  featureItemSchema, footerColumnSchema, footerLinkSchema, inquiryUpdateSchema, navLinkSchema,
  packageSchema, paymentMethodSchema, portfolioSchema, statSchema, whyItemSchema,
} from "./validation";

interface CollectionConfig {
  table: SQLiteTable;
  idColumn: AnySQLiteColumn;
  orderColumn: AnySQLiteColumn;
  schema: z.ZodObject<z.ZodRawShape>;
  serialize?: (values: Record<string, unknown>) => Record<string, unknown>;
  allowCreate?: boolean;
  allowDelete?: boolean;
}

const serializeJsonLists = (fields: string[]) => (values: Record<string, unknown>) => {
  const next = { ...values };
  for (const field of fields) {
    if (Array.isArray(next[field])) next[field] = JSON.stringify(next[field]);
  }
  return next;
};

export const collectionConfigs: Record<string, CollectionConfig> = {
  "nav-links": { table: navLinks, idColumn: navLinks.id, orderColumn: navLinks.sortOrder, schema: navLinkSchema },
  "footer-columns": { table: footerColumns, idColumn: footerColumns.id, orderColumn: footerColumns.sortOrder, schema: footerColumnSchema },
  "footer-links": { table: footerLinks, idColumn: footerLinks.id, orderColumn: footerLinks.sortOrder, schema: footerLinkSchema },
  "why-items": { table: whyItems, idColumn: whyItems.id, orderColumn: whyItems.sortOrder, schema: whyItemSchema },
  packages: { table: packages, idColumn: packages.id, orderColumn: packages.sortOrder, schema: packageSchema, serialize: serializeJsonLists(["featuresEn", "featuresBn"]) },
  "feature-items": { table: featureItems, idColumn: featureItems.id, orderColumn: featureItems.sortOrder, schema: featureItemSchema },
  stats: { table: stats, idColumn: stats.id, orderColumn: stats.sortOrder, schema: statSchema },
  portfolio: { table: portfolioItems, idColumn: portfolioItems.id, orderColumn: portfolioItems.sortOrder, schema: portfolioSchema, serialize: serializeJsonLists(["techStack"]) },
  "payment-methods": { table: paymentMethods, idColumn: paymentMethods.id, orderColumn: paymentMethods.sortOrder, schema: paymentMethodSchema },
  inquiries: { table: inquiries, idColumn: inquiries.id, orderColumn: inquiries.createdAt, schema: inquiryUpdateSchema, allowCreate: false },
};

async function audit(action: string, entity: string, entityId: string) {
  await db.insert(auditLogs).values({ action, entity, entityId });
}

export function createCollectionRoute(resource: string) {
  const config = collectionConfigs[resource];
  if (!config) throw new Error(`Unknown admin collection: ${resource}`);

  async function GET() {
    try {
      await assertAdminApi();
      const rows = await db.select().from(config.table).orderBy(asc(config.orderColumn));
      return ok(rows);
    } catch (error) {
      return handleApiError(error);
    }
  }

  async function POST(request: Request) {
    try {
      await assertAdminApi();
      assertTrustedOrigin(request);
      if (config.allowCreate === false) return fail("Create is not allowed for this collection", 405);
      const parsed = config.schema.parse(await readJson(request)) as Record<string, unknown>;
      const values = config.serialize ? config.serialize(parsed) : parsed;
      const rows = await db.insert(config.table).values(values).returning();
      await audit("create", resource, String(rows[0]?.id ?? ""));
      revalidatePath("/", "layout");
      return ok(rows[0], 201);
    } catch (error) {
      return handleApiError(error);
    }
  }

  async function PATCH(request: Request) {
    try {
      await assertAdminApi();
      assertTrustedOrigin(request);
      const body = (await readJson(request)) as Record<string, unknown>;
      const id = z.string().uuid().parse(body.id);
      const parsed = config.schema.partial().parse(body) as Record<string, unknown>;
      delete parsed.id;
      const values = config.serialize ? config.serialize(parsed) : parsed;
      if (Object.keys(values).length === 0) return fail("No fields to update");
      const rows = await db.update(config.table).set(values).where(eq(config.idColumn, id)).returning();
      if (!rows[0]) return fail("Not found", 404);
      await audit("update", resource, id);
      revalidatePath("/", "layout");
      return ok(rows[0]);
    } catch (error) {
      return handleApiError(error);
    }
  }

  async function DELETE(request: Request) {
    try {
      await assertAdminApi();
      assertTrustedOrigin(request);
      if (config.allowDelete === false) return fail("Delete is not allowed for this collection", 405);
      const id = z.string().uuid().parse(new URL(request.url).searchParams.get("id"));
      await db.delete(config.table).where(eq(config.idColumn, id));
      await audit("delete", resource, id);
      revalidatePath("/", "layout");
      return ok({ success: true });
    } catch (error) {
      return handleApiError(error);
    }
  }

  return { GET, POST, PATCH, DELETE };
}
