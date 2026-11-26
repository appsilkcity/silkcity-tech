/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { SiteSettings } from "@/db/schema";
import { BrandMark } from "./illustrations";

export function Logo({ settings, lang, compact = false }: { settings: SiteSettings; lang: "bn" | "en"; compact?: boolean }) {
  const brand = lang === "bn" ? settings.brandNameBn : settings.brandName;
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label={settings.siteName}>
      {settings.logoUrl ? (
        <img src={settings.logoUrl} alt={brand} className="h-10 w-auto max-w-[180px] object-contain" />
      ) : (
        <>
          <BrandMark className={compact ? "h-9 w-9" : "h-11 w-11"} />
          <span className="leading-tight">
            <span className="block text-base font-extrabold tracking-tight text-heading">{brand}</span>
            {!compact && <span className="block text-[11px] font-medium text-muted">{settings.siteName}</span>}
          </span>
        </>
      )}
    </Link>
  );
}
