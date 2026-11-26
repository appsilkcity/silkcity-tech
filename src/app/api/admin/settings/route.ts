import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { auditLogs, siteSettings } from "@/db/schema";
import { assertAdminApi } from "@/lib/auth";
import { assertTrustedOrigin, handleApiError, ok, readJson } from "@/lib/api";
import { settingsSchema } from "@/lib/validation";

export async function GET() {
  try {
    await assertAdminApi();
    const rows = await db.select().from(siteSettings).where(eq(siteSettings.id, 1)).limit(1);
    return ok(rows[0] ?? null);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request) {
  try {
    await assertAdminApi();
    assertTrustedOrigin(request);
    const values = settingsSchema.parse(await readJson(request));
    const rows = await db.update(siteSettings).set({ ...values, updatedAt: new Date() }).where(eq(siteSettings.id, 1)).returning();
    await db.insert(auditLogs).values({ action: "update", entity: "settings", entityId: "1" });
    revalidatePath("/", "layout");
    return ok(rows[0]);
  } catch (error) {
    return handleApiError(error);
  }
}
