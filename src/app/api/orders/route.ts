import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { orders, packages, paymentSettings } from "@/db/schema";
import { fail, handleApiError, ok, readJson } from "@/lib/api";
import { normalizeBdPhone, orderNumber } from "@/lib/utils";
import { orderCreateSchema } from "@/lib/validation";
import { getSslCredentials } from "@/lib/payments";

function isDuplicateTrxError(error: unknown): boolean {
  let current: unknown = error;
  for (let depth = 0; depth < 5 && current; depth += 1) {
    const message = current instanceof Error ? current.message : String(current);
    if (/UNIQUE constraint failed:\s*orders\.bkash_trx_id/i.test(message) || (message.includes("UNIQUE") && message.includes("bkash_trx_id"))) {
      return true;
    }
    current = current instanceof Error ? current.cause : undefined;
  }
  return false;
}

export async function POST(request: Request) {
  try {
    const input = orderCreateSchema.parse(await readJson(request));
    const packageRows = await db.select().from(packages).where(eq(packages.id, input.packageId)).limit(1);
    const pkg = packageRows[0];
    if (!pkg || !pkg.visible) return fail("Package not found or unavailable", 404);

    const paymentRows = await db.select().from(paymentSettings).where(eq(paymentSettings.id, 1)).limit(1);
    const payment = paymentRows[0];
    if (input.paymentMethod === "bkash" && payment && !payment.bkashEnabled) return fail("Manual bKash is currently disabled", 409);
    if (input.paymentMethod === "sslcommerz") {
      const credentials = await getSslCredentials();
      if (!credentials.enabled || !credentials.storeId || !credentials.storePassword) {
        return fail("SSLCommerz checkout is not available right now. Please use bKash or WhatsApp.", 409);
      }
    }

    const number = orderNumber();
    const sender = input.paymentMethod === "bkash" ? normalizeBdPhone(input.bkashSenderNumber) : "";
    const trxId = input.paymentMethod === "bkash" ? input.bkashTrxId.toUpperCase() : "";

    try {
      const rows = await db.insert(orders).values({
        orderNumber: number,
        packageId: pkg.id,
        packageNameEn: pkg.nameEn,
        packageNameBn: pkg.nameBn,
        amountBdt: pkg.priceBdt,
        customerName: input.customerName,
        customerPhone: normalizeBdPhone(input.customerPhone),
        customerEmail: input.customerEmail,
        customerAddress: input.customerAddress,
        notes: input.notes,
        language: input.language,
        paymentMethod: input.paymentMethod,
        paymentStatus: input.paymentMethod === "bkash" ? "awaiting_verification" : "unpaid",
        bkashSenderNumber: sender,
        bkashTrxId: trxId,
        sslTranId: input.paymentMethod === "sslcommerz" ? number : "",
      }).returning();
      revalidatePath("/admin");
      return ok({ id: rows[0].id, orderNumber: rows[0].orderNumber, paymentStatus: rows[0].paymentStatus }, 201);
    } catch (error) {
      if (isDuplicateTrxError(error)) {
        return fail("This TrxID has already been submitted. Please check the number or contact support.", 409);
      }
      throw error;
    }
  } catch (error) {
    return handleApiError(error);
  }
}
