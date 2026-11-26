import type { Metadata } from "next";
import { OrderPage } from "@/components/order-page";
import { getPublicSiteData } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order a Package",
  description: "Select a website package, chat on WhatsApp, pay with SSLCommerz or submit manual bKash TrxID.",
};

export default async function Page({ searchParams }: { searchParams: Promise<{ package?: string }> }) {
  const params = await searchParams;
  const data = await getPublicSiteData();
  return <OrderPage data={data} initialSlug={params.package} />;
}
