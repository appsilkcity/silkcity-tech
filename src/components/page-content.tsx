"use client";

import type { Page, SiteSettings } from "@/db/schema";
import { useLanguage } from "./language-provider";
import { Reveal } from "./motion";
import { RichText } from "./rich-text";

export function PageContent({ page, settings }: { page: Page; settings: SiteSettings }) {
  const { lang, t } = useLanguage();
  return (
    <section className="section-pad">
      <div className="container-page max-w-4xl">
        <Reveal className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">{settings.brandName}</p>
          <h1 className="mt-3 text-3xl font-extrabold text-heading md:text-4xl">{lang === "bn" ? page.titleBn : page.titleEn}</h1>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-brand to-accent" />
        </Reveal>
        <Reveal delay={0.1} className="mt-10 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm md:p-10">
          <RichText content={lang === "bn" ? page.contentBn : page.contentEn} />
          <p className="mt-8 border-t border-slate-100 pt-5 text-xs text-muted">
            {t(`Last updated: ${page.updatedAt.toLocaleDateString("en-GB")}`, `সর্বশেষ হালনাগাদ: ${page.updatedAt.toLocaleDateString("bn-BD")}`)}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
