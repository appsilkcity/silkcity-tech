import type { Metadata } from "next";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/hind-siliguri/400.css";
import "@fontsource/hind-siliguri/500.css";
import "@fontsource/hind-siliguri/600.css";
import "@fontsource/hind-siliguri/700.css";
import "./globals.css";
import { getPublicSiteData } from "@/lib/data";
import { siteUrl } from "@/lib/utils";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563eb",
};

export async function generateMetadata(): Promise<Metadata> {
  const base = siteUrl();
  try {
    const { settings } = await getPublicSiteData();
    return {
      metadataBase: new URL(base),
      title: { default: settings.seoTitleBn, template: `%s | ${settings.brandName}` },
      description: settings.seoDescriptionBn,
      keywords: settings.seoKeywords,
      alternates: { canonical: "/" },
      openGraph: {
        title: settings.seoTitleBn,
        description: settings.seoDescriptionBn,
        url: base,
        siteName: settings.siteName,
        images: settings.ogImageUrl ? [{ url: settings.ogImageUrl }] : [],
        locale: "bn_BD",
        type: "website",
      },
      twitter: { card: "summary_large_image", title: settings.seoTitleBn, description: settings.seoDescriptionBn },
      icons: { icon: settings.faviconUrl || "/icon.svg" },
      verification: settings.googleVerification ? { google: settings.googleVerification } : undefined,
    };
  } catch {
    return {
      metadataBase: new URL(base),
      title: "Silk City Tech",
      description: "Website and web solution partner in Rajshahi.",
      icons: { icon: "/icon.svg" },
    };
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
