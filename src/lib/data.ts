import { asc, eq } from "drizzle-orm";
import { cache } from "react";
import { db } from "@/db";
import {
  contentBlocks, featureItems, footerColumns, footerLinks, navLinks, packages, pages,
  paymentMethods, paymentSettings, portfolioItems, siteSettings, stats, whyItems, orders, inquiries,
} from "@/db/schema";
import type { ContentBlockView, FooterColumnView, PackageView, PortfolioView, PublicPaymentSettings } from "./types";
import { parseList, parseObject } from "./utils";
import type { BlockData } from "./types";

function blockView(row: typeof contentBlocks.$inferSelect): ContentBlockView {
  const { dataJson, ...rest } = row;
  return { ...rest, data: parseObject<BlockData>(dataJson, {}) };
}

function packageView(row: typeof packages.$inferSelect): PackageView {
  return { ...row, featuresEn: parseList(row.featuresEn), featuresBn: parseList(row.featuresBn) };
}

function portfolioView(row: typeof portfolioItems.$inferSelect): PortfolioView {
  return { ...row, techStack: parseList(row.techStack) };
}

export const getPublicSiteData = cache(async () => {
  const [settingsRows, navRows, footerColRows, footerLinkRows, blockRows, whyRows, packageRows, featureRows, statRows, portfolioRows, paymentRow, methodRows] = await Promise.all([
    db.select().from(siteSettings).where(eq(siteSettings.id, 1)).limit(1),
    db.select().from(navLinks).orderBy(asc(navLinks.sortOrder)),
    db.select().from(footerColumns).orderBy(asc(footerColumns.sortOrder)),
    db.select().from(footerLinks).orderBy(asc(footerLinks.sortOrder)),
    db.select().from(contentBlocks),
    db.select().from(whyItems).orderBy(asc(whyItems.sortOrder)),
    db.select().from(packages).orderBy(asc(packages.sortOrder)),
    db.select().from(featureItems).orderBy(asc(featureItems.sortOrder)),
    db.select().from(stats).orderBy(asc(stats.sortOrder)),
    db.select().from(portfolioItems).orderBy(asc(portfolioItems.sortOrder)),
    db.select().from(paymentSettings).where(eq(paymentSettings.id, 1)).limit(1),
    db.select().from(paymentMethods).orderBy(asc(paymentMethods.sortOrder)),
  ]);

  const settings = settingsRows[0];
  if (!settings) throw new Error("Site settings missing. Run npm run db:push && npm run db:seed.");

  const blocks = Object.fromEntries(blockRows.map((row) => [row.key, blockView(row)])) as Record<string, ContentBlockView>;
  const footer: FooterColumnView[] = footerColRows.map((column) => ({
    ...column,
    links: footerLinkRows.filter((link) => link.columnId === column.id),
  }));

  const payment: PublicPaymentSettings = {
    sslEnabled: paymentRow[0]?.sslEnabled ?? false,
    bkashEnabled: paymentRow[0]?.bkashEnabled ?? true,
    bkashNumber: paymentRow[0]?.bkashNumber ?? settings.phone,
    bkashInstructionsEn: paymentRow[0]?.bkashInstructionsEn ?? "",
    bkashInstructionsBn: paymentRow[0]?.bkashInstructionsBn ?? "",
  };

  return {
    settings,
    navLinks: navRows,
    footer,
    blocks,
    whyItems: whyRows,
    packages: packageRows.map(packageView),
    featureItems: featureRows,
    stats: statRows,
    portfolioItems: portfolioRows.map(portfolioView),
    payment,
    paymentMethods: methodRows,
  };
});

export type PublicSiteData = Awaited<ReturnType<typeof getPublicSiteData>>;

export async function getPage(slug: string) {
  const rows = await db.select().from(pages).where(eq(pages.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function getAdminData() {
  const [settingsRows, navRows, footerColRows, footerLinkRows, blockRows, whyRows, packageRows, featureRows, statRows, portfolioRows, paymentRow, methodRows, pageRows, orderRows, inquiryRows] = await Promise.all([
    db.select().from(siteSettings).where(eq(siteSettings.id, 1)).limit(1),
    db.select().from(navLinks).orderBy(asc(navLinks.sortOrder)),
    db.select().from(footerColumns).orderBy(asc(footerColumns.sortOrder)),
    db.select().from(footerLinks).orderBy(asc(footerLinks.sortOrder)),
    db.select().from(contentBlocks),
    db.select().from(whyItems).orderBy(asc(whyItems.sortOrder)),
    db.select().from(packages).orderBy(asc(packages.sortOrder)),
    db.select().from(featureItems).orderBy(asc(featureItems.sortOrder)),
    db.select().from(stats).orderBy(asc(stats.sortOrder)),
    db.select().from(portfolioItems).orderBy(asc(portfolioItems.sortOrder)),
    db.select().from(paymentSettings).where(eq(paymentSettings.id, 1)).limit(1),
    db.select().from(paymentMethods).orderBy(asc(paymentMethods.sortOrder)),
    db.select().from(pages),
    db.select().from(orders).orderBy(asc(orders.createdAt)),
    db.select().from(inquiries).orderBy(asc(inquiries.createdAt)),
  ]);

  const payment = paymentRow[0];
  const { sslStorePassword: _password, ...paymentRest } = payment ?? {
    id: 1, sslEnabled: false, sslStoreId: "", sslStorePassword: "", sslIsLive: false,
    bkashEnabled: true, bkashNumber: "", bkashInstructionsEn: "", bkashInstructionsBn: "", updatedAt: new Date(),
  };

  return {
    settings: settingsRows[0] ?? null,
    navLinks: navRows,
    footerColumns: footerColRows,
    footerLinks: footerLinkRows,
    blocks: blockRows.map(blockView),
    whyItems: whyRows,
    packages: packageRows.map(packageView),
    featureItems: featureRows,
    stats: statRows,
    portfolioItems: portfolioRows.map(portfolioView),
    paymentSettings: { ...paymentRest, hasSslStorePassword: Boolean(_password || process.env.SSLCOMMERZ_STORE_PASSWORD) },
    paymentMethods: methodRows,
    pages: pageRows,
    orders: orderRows,
    inquiries: inquiryRows,
  };
}

export type AdminData = Awaited<ReturnType<typeof getAdminData>>;
