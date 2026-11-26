"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Check, Clock, MessageCircle, RefreshCcw, X } from "lucide-react";
import type { SiteSettings } from "@/db/schema";
import type { PackageView } from "@/lib/types";
import { formatBdt, whatsappLink } from "@/lib/utils";
import { DynamicIcon } from "./icon";
import { useLanguage } from "./language-provider";

export function PackageModal({ pkg, settings, onClose }: { pkg: PackageView; settings: SiteSettings; onClose: () => void }) {
  const { lang, t } = useLanguage();
  const name = lang === "bn" ? pkg.nameBn : pkg.nameEn;
  const description = lang === "bn" ? pkg.descriptionBn : pkg.descriptionEn;
  const features = lang === "bn" ? pkg.featuresBn : pkg.featuresEn;

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const message = t(
    `Hello, I want to discuss the ${pkg.nameEn} package (${formatBdt(pkg.priceBdt, "en")}) before ordering.`,
    `আসসালামু আলাইকুম, আমি ${pkg.nameBn} প্যাকেজটি (${formatBdt(pkg.priceBdt, "bn")}) অর্ডারের আগে আলোচনা করতে চাই।`,
  );

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/50 p-4" role="dialog" aria-modal="true" aria-label={name} onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div className={`icon-badge tint-${pkg.tint}`}>
            <DynamicIcon name={pkg.icon} />
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label={t("Close", "বন্ধ করুন")}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <h3 className="mt-4 text-2xl font-bold text-heading">{name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
        <p className="mt-4 text-3xl font-extrabold text-brand">{formatBdt(pkg.priceBdt, lang)}</p>
        <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold text-slate-600">
          <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4 text-accent" /> {t(`${pkg.deliveryDays} days delivery`, `${pkg.deliveryDays} দিনে ডেলিভারি`)}</span>
          <span className="inline-flex items-center gap-1"><RefreshCcw className="h-4 w-4 text-accent" /> {t(`${pkg.revisions} revisions`, `${pkg.revisions} রিভিশন`)}</span>
        </div>
        <ul className="mt-5 space-y-2">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-sm text-slate-700">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" /> {feature}
            </li>
          ))}
        </ul>
        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          <a href={whatsappLink(settings.whatsappUrl, message)} target="_blank" rel="noreferrer" className="btn btn-whatsapp">
            <MessageCircle className="h-4 w-4" /> {t("Chat before ordering", "অর্ডারের আগে চ্যাট")}
          </a>
          <Link href={`/order?package=${pkg.slug}`} className="btn btn-primary" onClick={onClose}>
            {t("Select & Order", "সিলেক্ট ও অর্ডার")}
          </Link>
        </div>
        <p className="mt-3 text-center text-xs text-muted">
          {t(`Questions? Call ${settings.phone}`, `প্রশ্ন আছে? কল করুন ${settings.phone}`)}
        </p>
      </div>
    </div>
  );
}
