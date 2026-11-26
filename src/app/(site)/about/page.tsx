import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageContent } from "@/components/page-content";
import { getPage, getPublicSiteData } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("about");
  return { title: page?.titleEn ?? "About", description: page?.contentEn.slice(0, 150) ?? "About — Silk City Tech" };
}

export default async function Page() {
  const [page, data] = await Promise.all([getPage("about"), getPublicSiteData()]);
  if (!page) notFound();
  return <PageContent page={page} settings={data.settings} />;
}
