"use client";

import { useLanguage } from "./language-provider";
import { Reveal } from "./motion";

export function SectionHeading({ titleEn, titleBn, subtitleEn, subtitleBn }: { titleEn: string; titleBn: string; subtitleEn?: string; subtitleBn?: string }) {
  const { t } = useLanguage();
  return (
    <Reveal className="mx-auto mb-10 max-w-3xl text-center">
      <h2 className="text-2xl font-bold text-heading md:text-3xl">{t(titleEn, titleBn)}</h2>
      {(subtitleEn || subtitleBn) && (
        <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">{t(subtitleEn ?? "", subtitleBn ?? "")}</p>
      )}
      <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-brand to-accent" />
    </Reveal>
  );
}
