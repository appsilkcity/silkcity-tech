import { LanguageProvider } from "@/components/language-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPublicSiteData } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const data = await getPublicSiteData();
  return (
    <LanguageProvider>
      <SiteHeader settings={data.settings} navLinks={data.navLinks} />
      <main>{children}</main>
      <SiteFooter settings={data.settings} columns={data.footer} />
    </LanguageProvider>
  );
}
