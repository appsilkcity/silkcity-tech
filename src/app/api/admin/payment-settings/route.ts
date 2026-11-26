import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { auditLogs, paymentSettings } from "@/db/schema";
import { assertAdminApi } from "@/lib/auth";
import { assertTrustedOrigin, handleApiError, ok, readJson } from "@/lib/api";
import { paymentSettingsSchema } from "@/lib/validation";

export async function GET() {
  try {
    await assertAdminApi();
    const rows = await db.select().from(paymentSettings).where(eq(paymentSettings.id, 1)).limit(1);
    const row = rows[0];
    if (!row) return ok(null);
    const { sslStorePassword: _password, ...rest } = row;
    return ok({ ...rest, hasSslStorePassword: Boolean(_password || process.env.SSLCOMMERZ_STORE_PASSWORD) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request) {
  try {
    await assertAdminApi();
    assertTrustedOrigin(request);
    const { sslStorePassword, ...values } = paymentSettingsSchema.parse(await readJson(request));
    const update: Record<string, unknown> = { ...values, updatedAt: new Date() };
    if (sslStorePassword && sslStorePassword.trim().length > 0) update.sslStorePassword = sslStorePassword.trim();
    const rows = await db.update(paymentSettings).set(update).where(eq(paymentSettings.id, 1)).returning();
    await db.insert(auditLogs).values({ action: "update", entity: "payment-settings", entityId: "1" });
    revalidatePath("/", "layout");
    const row = rows[0];
    const { sslStorePassword: _saved, ...rest } = row;
    return ok({ ...rest, hasSslStorePassword: Boolean(_saved || process.env.SSLCOMMERZ_STORE_PASSWORD) });
  } catch (error) {
    return handleApiError(error);
  }
}
