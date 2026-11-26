import type { Metadata } from "next";
import { PortfolioPage } from "@/components/portfolio-page";
import { getPublicSiteData } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Previous built websites and client trust showcase from Silk City Tech.",
};

export default async function Page() {
  const data = await getPublicSiteData();
  const block = data.blocks.portfolio;
  return (
    <PortfolioPage
      items={data.portfolioItems}
      titleEn={block?.titleEn ?? "Previous built sites & client trust"}
      titleBn={block?.titleBn ?? "আমাদের তৈরি সাইট ও ক্লায়েন্ট আস্থা"}
      subtitleEn={block?.subtitleEn ?? "Browse real projects before you order."}
      subtitleBn={block?.subtitleBn ?? "অর্ডারের আগে আমাদের তৈরি প্রজেক্ট দেখুন।"}
    />
  );
}
