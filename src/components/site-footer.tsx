"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUp, Mail, MapPin, Phone } from "lucide-react";
import type { SiteSettings } from "@/db/schema";
import type { FooterColumnView } from "@/lib/types";
import { useLanguage } from "./language-provider";
import { Logo } from "./logo";
import { SocialIcons } from "./site-header";

export function SiteFooter({ settings, columns }: { settings: SiteSettings; columns: FooterColumnView[] }) {
  const { lang, t } = useLanguage();
  const [showTop, setShowTop] = useState(false);
  const visibleColumns = columns.filter((column) => column.visible);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <footer className="bg-footer text-slate-300">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {visibleColumns.map((column, index) => (
          <div key={column.id}>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-white">
              {lang === "bn" ? column.titleBn : column.titleEn}
            </h3>
            {index === 0 ? (
              <div className="space-y-3 text-sm">
                <a href={`tel:${settings.phone}`} className="flex items-start gap-2 hover:text-white">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {settings.phone}
                </a>
                <a href={`mailto:${settings.email}`} className="flex items-start gap-2 break-all hover:text-white">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {settings.email}
                </a>
                <p className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {lang === "bn" ? settings.addressBn : settings.addressEn}
                </p>
                <div className="pt-2"><SocialIcons settings={settings} /></div>
              </div>
            ) : (
              <ul className="space-y-2.5 text-sm">
                {column.links.filter((link) => link.visible).map((link) => (
                  <li key={link.id}>
                    <Link href={link.href} className="transition hover:text-white hover:underline">
                      {lang === "bn" ? link.labelBn : link.labelEn}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-4 py-5 text-xs text-slate-400 sm:flex-row">
          <div className="flex items-center gap-3">
            <Logo settings={settings} lang={lang} compact />
          </div>
          <p className="text-center">{lang === "bn" ? settings.footerTextBn : settings.footerTextEn}</p>
          <p>© {new Date().getFullYear()} {settings.siteName}</p>
        </div>
      </div>
      {showTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-5 right-5 z-40 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-white text-heading shadow-lg ring-1 ring-slate-200 transition hover:bg-blue-50"
          aria-label={t("Scroll to top", "উপরে যান")}
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </footer>
  );
}
