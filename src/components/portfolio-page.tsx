"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { PortfolioView } from "@/lib/types";
import { useLanguage } from "./language-provider";
import { Reveal } from "./motion";
import { PortfolioCard } from "./portfolio-card";

export function PortfolioPage({ items, titleEn, titleBn, subtitleEn, subtitleBn }: { items: PortfolioView[]; titleEn: string; titleBn: string; subtitleEn: string; subtitleBn: string }) {
  const { lang, t } = useLanguage();
  const [category, setCategory] = useState("all");
  const visible = items.filter((item) => item.visible);
  const categories = useMemo(() => {
    const set = new Set(visible.map((item) => (lang === "bn" ? item.categoryBn : item.categoryEn)));
    return ["all", ...Array.from(set)];
  }, [visible, lang]);
  const filtered = category === "all" ? visible : visible.filter((item) => (lang === "bn" ? item.categoryBn : item.categoryEn) === category);

  return (
    <section className="section-pad">
      <div className="container-page">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-extrabold text-heading md:text-4xl">{t(titleEn, titleBn)}</h1>
          <p className="mt-3 text-muted">{t(subtitleEn, subtitleBn)}</p>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-brand to-accent" />
        </Reveal>
        {categories.length > 1 && (
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {categories.map((item) => (
              <button key={item} type="button" onClick={() => setCategory(item)} className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${category === item ? "bg-brand text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                {item === "all" ? t("All", "সব") : item}
              </button>
            ))}
          </div>
        )}
        {filtered.length > 0 ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item, index) => <Reveal key={item.id} delay={index * 0.04}><PortfolioCard item={item} /></Reveal>)}
          </div>
        ) : (
          <Reveal className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <p className="font-semibold text-heading">{t("Our project showcase is being refreshed.", "আমাদের প্রজেক্ট শোকেস হালনাগাদ করা হচ্ছে।")}</p>
            <p className="mt-2 text-sm text-muted">{t("Call or WhatsApp us to request recent work samples before ordering.", "অর্ডারের আগে সাম্প্রতিক কাজের নমুনা দেখতে কল বা হোয়াটসঅ্যাপ করুন।")}</p>
            <Link href="/order" className="btn btn-primary mt-6">{t("Start your project", "আপনার প্রজেক্ট শুরু করুন")}</Link>
          </Reveal>
        )}
      </div>
    </section>
  );
}
