import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { auditLogs, orders } from "@/db/schema";
import { assertAdminApi } from "@/lib/auth";
import { assertTrustedOrigin, fail, handleApiError, ok, readJson } from "@/lib/api";
import { getSslCredentials, sslAmountMatches, sslValidationOk, validateSslPayment } from "@/lib/payments";

const schema = z.object({
  orderId: z.string().uuid(),
  action: z.enum(["approve", "reject", "revalidate-ssl"]),
});

export async function POST(request: Request) {
  try {
    await assertAdminApi();
    assertTrustedOrigin(request);
    const { orderId, action } = schema.parse(await readJson(request));
    const rows = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
    const order = rows[0];
    if (!order) return fail("Order not found", 404);

    if (action === "approve") {
      if (order.paymentMethod !== "bkash") return fail("Manual approval is only for bKash orders. Use SSL revalidation for gateway orders.");
      if (!order.bkashTrxId || !order.bkashSenderNumber) return fail("This order has no bKash sender number / TrxID.");
      const updated = await db.update(orders).set({ paymentStatus: "paid", paidAt: new Date(), updatedAt: new Date() }).where(eq(orders.id, orderId)).returning();
      await db.insert(auditLogs).values({ action: "approve-payment", entity: "order", entityId: orderId });
      revalidatePath("/", "layout");
      return ok(updated[0]);
    }

    if (action === "reject") {
      const updated = await db.update(orders).set({ paymentStatus: "failed", updatedAt: new Date() }).where(eq(orders.id, orderId)).returning();
      await db.insert(auditLogs).values({ action: "reject-payment", entity: "order", entityId: orderId });
      revalidatePath("/", "layout");
      return ok(updated[0]);
    }

    if (!order.sslValId) return fail("No SSLCommerz val_id is stored for this order yet.");
    const credentials = await getSslCredentials();
    const validation = await validateSslPayment(order.sslValId, credentials);
    const valid = sslValidationOk(validation.data.status)
      && validation.data.tran_id === order.orderNumber
      && sslAmountMatches(validation.data.amount, order.amountBdt)
      && (validation.data.currency ?? "BDT") === "BDT";
    const updated = await db.update(orders).set({
      paymentStatus: valid ? "paid" : "failed",
      paidAt: valid ? new Date() : order.paidAt,
      sslValidationJson: JSON.stringify(validation.raw),
      updatedAt: new Date(),
    }).where(eq(orders.id, orderId)).returning();
    await db.insert(auditLogs).values({ action: valid ? "ssl-valid" : "ssl-invalid", entity: "order", entityId: orderId });
    revalidatePath("/", "layout");
    return ok({ order: updated[0], valid, validation: validation.raw });
  } catch (error) {
    return handleApiError(error);
  }
}
