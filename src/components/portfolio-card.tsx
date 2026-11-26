/* eslint-disable @next/next/no-img-element */
"use client";

import { ExternalLink, Globe2, Star } from "lucide-react";
import type { PortfolioView } from "@/lib/types";
import { useLanguage } from "./language-provider";

export function PortfolioCard({ item }: { item: PortfolioView }) {
  const { lang, t } = useLanguage();
  const title = lang === "bn" ? item.titleBn : item.titleEn;
  const description = lang === "bn" ? item.descriptionBn : item.descriptionEn;
  const category = lang === "bn" ? item.categoryBn : item.categoryEn;
  const client = lang === "bn" ? item.clientNameBn : item.clientNameEn;
  const trust = lang === "bn" ? item.trustNoteBn : item.trustNoteEn;

  return (
    <article className="feature-card overflow-hidden">
      <div className="relative aspect-[16/10] bg-gradient-to-br from-sky-100 via-violet-100 to-rose-100">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={title} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-brand">
            <Globe2 className="h-12 w-12" />
            <span className="text-xs font-semibold uppercase tracking-widest">{category}</span>
          </div>
        )}
        {item.featured && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-amber-600 shadow">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {t("Featured", "ফিচার্ড")}
          </span>
        )}
      </div>
      <div className="p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-brand">{category}</p>
        <h3 className="mt-1 text-lg font-bold text-heading">{title}</h3>
        {description && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{description}</p>}
        {item.techStack.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {item.techStack.map((tech) => (
              <span key={tech} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">{tech}</span>
            ))}
          </div>
        )}
        {(client || trust) && (
          <p className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
            {client && <span className="font-semibold text-slate-700">{client}. </span>}
            {trust}
          </p>
        )}
        {item.liveUrl && (
          <a href={item.liveUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand hover:underline">
            {t("Visit live site", "লাইভ সাইট দেখুন")} <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>
    </article>
  );
}
