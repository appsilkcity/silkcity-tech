import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { ConfirmationPage } from "@/components/confirmation-page";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { getPublicSiteData } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order Confirmation",
  robots: { index: false, follow: false },
};

export default async function Page({ searchParams }: { searchParams: Promise<{ order?: string; payment?: string }> }) {
  const params = await searchParams;
  const data = await getPublicSiteData();
  let order = null;
  if (params.order) {
    const rows = await db.select().from(orders).where(eq(orders.orderNumber, params.order)).limit(1);
    const row = rows[0];
    if (row) {
      order = {
        orderNumber: row.orderNumber,
        packageNameEn: row.packageNameEn,
        packageNameBn: row.packageNameBn,
        amountBdt: row.amountBdt,
        paymentMethod: row.paymentMethod,
        paymentStatus: row.paymentStatus,
        status: row.status,
      };
    }
  }
  return <ConfirmationPage order={order} payment={params.payment} settings={data.settings} />;
}
