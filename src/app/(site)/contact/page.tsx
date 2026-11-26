import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContactPage } from "@/components/contact-page";
import { getPage, getPublicSiteData } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Silk City Tech — call or WhatsApp 01712631560, Mango Tower, Sopura, Boalia, Rajshahi-6203.",
};

export default async function Page() {
  const [page, data] = await Promise.all([getPage("contact"), getPublicSiteData()]);
  if (!page) notFound();
  return <ContactPage page={page} settings={data.settings} />;
}
