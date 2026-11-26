import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { auditLogs, contentBlocks } from "@/db/schema";
import { assertAdminApi } from "@/lib/auth";
import { assertTrustedOrigin, handleApiError, ok, readJson } from "@/lib/api";
import { contentBlockSchema } from "@/lib/validation";
import { parseObject } from "@/lib/utils";
import type { BlockData } from "@/lib/types";

export async function GET() {
  try {
    await assertAdminApi();
    return ok(await db.select().from(contentBlocks));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request) {
  try {
    await assertAdminApi();
    assertTrustedOrigin(request);
    const { key, badgeEn, badgeBn, primaryEn, primaryBn, secondaryEn, secondaryBn, ...fields } = contentBlockSchema.parse(await readJson(request));
    const existing = await db.select().from(contentBlocks).where(eq(contentBlocks.key, key)).limit(1);
    const data = parseObject<BlockData>(existing[0]?.dataJson, {});
    const nextData: BlockData = {
      ...data,
      ...(badgeEn !== undefined ? { badgeEn } : {}),
      ...(badgeBn !== undefined ? { badgeBn } : {}),
      ...(primaryEn !== undefined ? { primaryEn } : {}),
      ...(primaryBn !== undefined ? { primaryBn } : {}),
      ...(secondaryEn !== undefined ? { secondaryEn } : {}),
      ...(secondaryBn !== undefined ? { secondaryBn } : {}),
    };
    const values = { ...fields, dataJson: JSON.stringify(nextData), updatedAt: new Date() };
    const rows = existing[0]
      ? await db.update(contentBlocks).set(values).where(eq(contentBlocks.key, key)).returning()
      : await db.insert(contentBlocks).values({ key, ...values }).returning();
    await db.insert(auditLogs).values({ action: "update", entity: "content-block", entityId: key });
    revalidatePath("/", "layout");
    return ok(rows[0]);
  } catch (error) {
    return handleApiError(error);
  }
}
