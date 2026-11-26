import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { paymentSettings, type Order } from "@/db/schema";
import { siteUrl } from "./utils";

export interface SslCredentials {
  storeId: string;
  storePassword: string;
  isLive: boolean;
  enabled: boolean;
}

export async function getSslCredentials(): Promise<SslCredentials> {
  const rows = await db.select().from(paymentSettings).where(eq(paymentSettings.id, 1)).limit(1);
  const row = rows[0];
  return {
    enabled: row?.sslEnabled ?? false,
    storeId: row?.sslStoreId || process.env.SSLCOMMERZ_STORE_ID || "",
    storePassword: row?.sslStorePassword || process.env.SSLCOMMERZ_STORE_PASSWORD || "",
    isLive: row?.sslIsLive ?? process.env.SSLCOMMERZ_IS_LIVE === "true",
  };
}

export function sslBase(isLive: boolean) {
  return isLive ? "https://securepay.sslcommerz.com" : "https://sandbox.sslcommerz.com";
}

const initResponseSchema = z.object({
  status: z.string(),
  GatewayPageURL: z.string().url().optional(),
  sessionkey: z.string().optional(),
  failedreason: z.string().optional(),
});

const validationResponseSchema = z.object({
  status: z.string(),
  tran_id: z.string().optional(),
  val_id: z.string().optional(),
  amount: z.union([z.string(), z.number()]).optional(),
  currency: z.string().optional(),
  store_id: z.string().optional(),
});

export async function initSslPayment(order: Order, credentials: SslCredentials) {
  if (!credentials.enabled || !credentials.storeId || !credentials.storePassword) {
    throw new Error("SSLCommerz is not configured. Enable it in Admin → Payments or set environment variables.");
  }
  const base = siteUrl();
  const tranId = order.orderNumber;
  const body = new URLSearchParams({
    store_id: credentials.storeId,
    store_passwd: credentials.storePassword,
    total_amount: String(order.amountBdt),
    currency: "BDT",
    tran_id: tranId,
    success_url: `${base}/api/payment/sslcommerz/success`,
    fail_url: `${base}/api/payment/sslcommerz/fail`,
    cancel_url: `${base}/api/payment/sslcommerz/cancel`,
    ipn_url: `${base}/api/payment/sslcommerz/ipn`,
    product_name: order.packageNameEn.slice(0, 100),
    product_category: "Website Service",
    product_profile: "general",
    cus_name: order.customerName.slice(0, 50),
    cus_email: order.customerEmail || "customer@example.com",
    cus_phone: order.customerPhone.slice(0, 20),
    cus_add1: order.customerAddress || "Rajshahi",
    cus_city: "Rajshahi",
    cus_country: "Bangladesh",
    shipping_method: "NO",
    num_of_item: "1",
    value_a: order.id,
  });

  const response = await fetch(`${sslBase(credentials.isLive)}/gwprocess/v4/api.php`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`SSLCommerz init failed with HTTP ${response.status}`);
  const json: unknown = await response.json();
  const parsed = initResponseSchema.safeParse(json);
  if (!parsed.success || parsed.data.status !== "SUCCESS" || !parsed.data.GatewayPageURL) {
    const reason = parsed.success ? parsed.data.failedreason || parsed.data.status : "Invalid response";
    throw new Error(`SSLCommerz init rejected: ${reason}`);
  }
  return { gatewayUrl: parsed.data.GatewayPageURL, sessionKey: parsed.data.sessionkey ?? "", tranId };
}

export async function validateSslPayment(valId: string, credentials: SslCredentials) {
  if (!credentials.storeId || !credentials.storePassword) throw new Error("SSLCommerz credentials missing.");
  const url = new URL(`${sslBase(credentials.isLive)}/validator/api/validationserverAPI.php`);
  url.searchParams.set("val_id", valId);
  url.searchParams.set("store_id", credentials.storeId);
  url.searchParams.set("store_passwd", credentials.storePassword);
  url.searchParams.set("format", "json");
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`SSLCommerz validation failed with HTTP ${response.status}`);
  const json: unknown = await response.json();
  const parsed = validationResponseSchema.safeParse(json);
  if (!parsed.success) throw new Error("Invalid SSLCommerz validation response.");
  return { raw: json as Record<string, unknown>, data: parsed.data };
}

export function sslAmountMatches(reported: string | number | undefined, expected: number) {
  if (reported === undefined) return false;
  const amount = typeof reported === "number" ? reported : Number(reported);
  return Number.isFinite(amount) && Math.abs(amount - expected) < 0.01;
}

export function sslValidationOk(status: string | undefined) {
  return status === "VALID" || status === "VALIDATED";
}
