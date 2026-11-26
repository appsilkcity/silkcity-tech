import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { getSslCredentials, sslAmountMatches, sslValidationOk, validateSslPayment } from "./payments";
import { siteUrl } from "./utils";

type CallbackKind = "success" | "fail" | "cancel" | "ipn";

function confirmationUrl(orderNumber: string, payment: string) {
  const url = new URL(`${siteUrl()}/order/confirmation`);
  url.searchParams.set("order", orderNumber);
  url.searchParams.set("payment", payment);
  return url;
}

export async function handleSslCallback(request: Request, kind: CallbackKind) {
  let orderNumber = "";
  try {
    const form = await request.formData();
    const tranId = String(form.get("tran_id") ?? "");
    const valId = String(form.get("val_id") ?? "");
    orderNumber = tranId;
    const rows = await db.select().from(orders).where(eq(orders.orderNumber, tranId)).limit(1);
    const order = rows[0];
    if (!order) {
      if (kind === "ipn") return NextResponse.json({ error: "Order not found" }, { status: 404 });
      return NextResponse.redirect(confirmationUrl(tranId || "unknown", "error"), 303);
    }

    if (kind === "fail" || kind === "cancel") {
      if (order.paymentStatus === "paid") {
        return NextResponse.redirect(confirmationUrl(order.orderNumber, "success"), 303);
      }
      await db.update(orders).set({
        paymentStatus: "failed",
        sslValId: valId || order.sslValId,
        updatedAt: new Date(),
      }).where(eq(orders.id, order.id));
      revalidatePath("/admin");
      return NextResponse.redirect(confirmationUrl(order.orderNumber, kind === "fail" ? "failed" : "cancelled"), 303);
    }

    if (!valId) {
      if (kind === "ipn") return NextResponse.json({ error: "Missing val_id" }, { status: 400 });
      return NextResponse.redirect(confirmationUrl(order.orderNumber, "error"), 303);
    }

    if (order.paymentStatus === "paid" && order.sslValId === valId) {
      if (kind === "ipn") return NextResponse.json({ success: true, alreadyPaid: true });
      return NextResponse.redirect(confirmationUrl(order.orderNumber, "success"), 303);
    }

    const credentials = await getSslCredentials();
    const validation = await validateSslPayment(valId, credentials);
    const valid = sslValidationOk(validation.data.status)
      && validation.data.tran_id === order.orderNumber
      && sslAmountMatches(validation.data.amount, order.amountBdt)
      && (validation.data.currency ?? "BDT") === "BDT";

    await db.update(orders).set({
      paymentStatus: valid ? "paid" : "failed",
      paidAt: valid ? new Date() : order.paidAt,
      sslValId: valId,
      sslValidationJson: JSON.stringify(validation.raw),
      updatedAt: new Date(),
    }).where(eq(orders.id, order.id));
    revalidatePath("/admin");

    if (kind === "ipn") return NextResponse.json({ success: valid });
    return NextResponse.redirect(confirmationUrl(order.orderNumber, valid ? "success" : "failed"), 303);
  } catch (error) {
    console.error("SSLCommerz callback error", error);
    if (kind === "ipn") return NextResponse.json({ error: "Callback processing failed" }, { status: 500 });
    return NextResponse.redirect(confirmationUrl(orderNumber || "unknown", "error"), 303);
  }
}
