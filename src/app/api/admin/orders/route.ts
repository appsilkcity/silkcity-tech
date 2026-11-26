import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { auditLogs, orders } from "@/db/schema";
import { assertAdminApi } from "@/lib/auth";
import { assertTrustedOrigin, fail, handleApiError, ok, readJson } from "@/lib/api";
import { orderUpdateSchema } from "@/lib/validation";

export async function GET() {
  try {
    await assertAdminApi();
    return ok(await db.select().from(orders).orderBy(desc(orders.createdAt)));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    await assertAdminApi();
    assertTrustedOrigin(request);
    const { id, ...values } = orderUpdateSchema.parse(await readJson(request));
    const update: Record<string, unknown> = { ...values, updatedAt: new Date() };
    if (values.paymentStatus === "paid") update.paidAt = new Date();
    const rows = await db.update(orders).set(update).where(eq(orders.id, id)).returning();
    if (!rows[0]) return fail("Order not found", 404);
    await db.insert(auditLogs).values({ action: "update", entity: "order", entityId: id });
    revalidatePath("/", "layout");
    return ok(rows[0]);
  } catch (error) {
    return handleApiError(error);
  }
}
