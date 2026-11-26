import { eq } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { fail, handleApiError, ok, readJson } from "@/lib/api";
import { getSslCredentials, initSslPayment } from "@/lib/payments";
import { sslInitSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const { orderId } = sslInitSchema.parse(await readJson(request));
    const rows = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
    const order = rows[0];
    if (!order) return fail("Order not found", 404);
    if (order.paymentMethod !== "sslcommerz") return fail("Order is not an SSLCommerz order", 409);
    if (order.paymentStatus === "paid") return fail("Order is already paid", 409);
    if (order.status === "cancelled") return fail("Order is cancelled", 409);

    const credentials = await getSslCredentials();
    const result = await initSslPayment(order, credentials);
    await db.update(orders).set({
      sslTranId: result.tranId,
      sslSessionKey: result.sessionKey,
      updatedAt: new Date(),
    }).where(eq(orders.id, orderId));
    return ok({ redirectUrl: result.gatewayUrl, orderNumber: order.orderNumber });
  } catch (error) {
    return handleApiError(error);
  }
}
