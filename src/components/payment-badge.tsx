/* eslint-disable @next/next/no-img-element */
"use client";

import { CreditCard, Smartphone } from "lucide-react";
import type { PaymentMethod } from "@/db/schema";
import { useLanguage } from "./language-provider";

export function PaymentBadge({ method }: { method: PaymentMethod }) {
  const { lang } = useLanguage();
  const name = lang === "bn" ? method.nameBn : method.nameEn;
  return (
    <div className="flex min-h-20 min-w-32 items-center justify-center rounded-xl border border-slate-100 bg-white px-5 py-4 shadow-sm">
      {method.imageUrl ? (
        <img src={method.imageUrl} alt={name} className="max-h-10 max-w-32 object-contain" loading="lazy" />
      ) : (
        <span className="inline-flex items-center gap-2 text-lg font-extrabold" style={{ color: method.color }}>
          {method.kind === "gateway" ? <CreditCard className="h-5 w-5" /> : <Smartphone className="h-5 w-5" />}
          {name}
        </span>
      )}
    </div>
  );
}
