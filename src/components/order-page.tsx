"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Check, CreditCard, MessageCircle, Phone, Smartphone } from "lucide-react";
import type { PublicSiteData } from "@/lib/data";
import { formatBdt, whatsappLink } from "@/lib/utils";
import { DynamicIcon } from "./icon";
import { useLanguage } from "./language-provider";
import { Reveal } from "./motion";

export function OrderPage({ data, initialSlug }: { data: PublicSiteData; initialSlug?: string }) {
  const { lang, t } = useLanguage();
  const router = useRouter();
  const packages = useMemo(() => data.packages.filter((pkg) => pkg.visible), [data.packages]);
  const initial = packages.find((pkg) => pkg.slug === initialSlug) ?? packages[0];
  const [selectedId, setSelectedId] = useState(initial?.id ?? "");
  const selected = packages.find((pkg) => pkg.id === selectedId) ?? initial;
  const [method, setMethod] = useState<"bkash" | "sslcommerz">(data.payment.bkashEnabled ? "bkash" : "sslcommerz");
  const [form, setForm] = useState({ customerName: "", customerPhone: "", customerEmail: "", customerAddress: "", notes: "", bkashSenderNumber: "", bkashTrxId: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const bothDisabled = !data.payment.bkashEnabled && !data.payment.sslEnabled;
  const message = selected
    ? t(`Hello, I want to order ${selected.nameEn} (${formatBdt(selected.priceBdt, "en")}).`, `আসসালামু আলাইকুম, আমি ${selected.nameBn} (${formatBdt(selected.priceBdt, "bn")}) অর্ডার করতে চাই।`)
    : t("Hello, I want to discuss a custom website project.", "আসসালামু আলাইকুম, কাস্টম ওয়েবসাইট প্রজেক্ট নিয়ে আলোচনা করতে চাই।");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!selected) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...form, packageId: selected.id, language: lang, paymentMethod: method }),
      });
      const json = (await response.json()) as { id?: string; orderNumber?: string; error?: string };
      if (!response.ok || !json.id) throw new Error(json.error || t("Could not create order", "অর্ডার তৈরি করা যায়নি"));

      if (method === "sslcommerz") {
        const initResponse = await fetch("/api/payment/sslcommerz/init", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ orderId: json.id }),
        });
        const initJson = (await initResponse.json()) as { redirectUrl?: string; error?: string };
        if (!initResponse.ok || !initJson.redirectUrl) throw new Error(initJson.error || t("Could not start SSLCommerz checkout", "SSLCommerz চেকআউট শুরু করা যায়নি"));
        window.location.assign(initJson.redirectUrl);
        return;
      }

      router.push(`/order/confirmation?order=${encodeURIComponent(json.orderNumber ?? "")}&payment=submitted`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t("Something went wrong", "কিছু একটা সমস্যা হয়েছে"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="section-pad bg-slate-50/50">
      <div className="container-page">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-extrabold text-heading md:text-4xl">{t("Select a package & order", "প্যাকেজ সিলেক্ট ও অর্ডার করুন")}</h1>
          <p className="mt-3 text-muted">{t("Chat on WhatsApp before ordering, or checkout with SSLCommerz / manual bKash.", "অর্ডারের আগে হোয়াটসঅ্যাপে কথা বলুন, অথবা SSLCommerz / ম্যানুয়াল বিকাশে চেকআউট করুন।")}</p>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-brand to-accent" />
        </Reveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_1fr]">
          <Reveal className="space-y-5">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <h2 className="font-bold text-heading">{t("1. Choose your package", "১. প্যাকেজ বেছে নিন")}</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {packages.map((pkg) => (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => setSelectedId(pkg.id)}
                    className={`rounded-xl border p-4 text-left transition ${selectedId === pkg.id ? "border-brand bg-blue-50 ring-2 ring-blue-100" : "border-slate-200 bg-white hover:border-slate-300"}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`icon-badge !h-9 !w-9 tint-${pkg.tint}`}><DynamicIcon name={pkg.icon} className="h-4 w-4" /></span>
                      <span className="text-sm font-bold text-heading">{t(pkg.nameEn, pkg.nameBn)}</span>
                    </div>
                    <p className="mt-2 text-lg font-extrabold text-brand">{formatBdt(pkg.priceBdt, lang)}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-muted">{t(pkg.descriptionEn, pkg.descriptionBn)}</p>
                  </button>
                ))}
              </div>
            </div>

            {selected && (
              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <h2 className="font-bold text-heading">{t("Package details", "প্যাকেজ বিস্তারিত")}</h2>
                <p className="mt-2 text-sm text-muted">{t(selected.descriptionEn, selected.descriptionBn)}</p>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {(lang === "bn" ? selected.featuresBn : selected.featuresEn).map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-slate-700"><Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />{feature}</li>
                  ))}
                </ul>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a href={whatsappLink(data.settings.whatsappUrl, message)} target="_blank" rel="noreferrer" className="btn btn-whatsapp">
                    <MessageCircle className="h-4 w-4" /> {t("Chat before ordering", "অর্ডারের আগে চ্যাট")}
                  </a>
                  <a href={`tel:${data.settings.phone}`} className="btn btn-outline"><Phone className="h-4 w-4" /> {data.settings.phone}</a>
                </div>
              </div>
            )}
          </Reveal>

          <Reveal delay={0.1}>
            <form onSubmit={onSubmit} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h2 className="font-bold text-heading">{t("2. Your details & payment", "২. আপনার তথ্য ও পেমেন্ট")}</h2>
              {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
              {bothDisabled && (
                <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm font-semibold text-amber-700">
                  {t("Online payment is currently disabled. Please order via WhatsApp.", "অনলাইন পেমেন্ট বর্তমানে বন্ধ। অনুগ্রহ করে হোয়াটসঅ্যাপে অর্ডার করুন।")}
                </p>
              )}
              <div className="mt-5 grid gap-4">
                <div>
                  <label className="label" htmlFor="order-name">{t("Full name", "পূর্ণ নাম")} *</label>
                  <input id="order-name" className="input" required minLength={2} value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label" htmlFor="order-phone">{t("Phone", "ফোন")} *</label>
                    <input id="order-phone" className="input" required placeholder="01XXXXXXXXX" value={form.customerPhone} onChange={(e) => setForm({ ...form, customerPhone: e.target.value })} />
                  </div>
                  <div>
                    <label className="label" htmlFor="order-email">{t("Email", "ইমেইল")}</label>
                    <input id="order-email" type="email" className="input" value={form.customerEmail} onChange={(e) => setForm({ ...form, customerEmail: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="label" htmlFor="order-address">{t("Address / business location", "ঠিকানা / ব্যবসার অবস্থান")}</label>
                  <input id="order-address" className="input" value={form.customerAddress} onChange={(e) => setForm({ ...form, customerAddress: e.target.value })} />
                </div>
                <div>
                  <label className="label" htmlFor="order-notes">{t("Project notes", "প্রজেক্ট নোট")}</label>
                  <textarea id="order-notes" className="input min-h-24" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                </div>

                <div>
                  <span className="label">{t("Payment method", "পেমেন্ট পদ্ধতি")}</span>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button type="button" disabled={!data.payment.bkashEnabled} onClick={() => setMethod("bkash")} className={`rounded-xl border p-4 text-left transition disabled:opacity-50 ${method === "bkash" ? "border-pink-500 bg-pink-50 ring-2 ring-pink-100" : "border-slate-200"}`}>
                      <span className="flex items-center gap-2 font-bold text-pink-600"><Smartphone className="h-4 w-4" /> {t("Manual bKash", "ম্যানুয়াল বিকাশ")}</span>
                      <span className="mt-1 block text-xs text-muted">{t("Send Money / Payment, then submit TrxID", "Send Money / Payment করে TrxID জমা দিন")}</span>
                    </button>
                    <button type="button" disabled={!data.payment.sslEnabled} onClick={() => setMethod("sslcommerz")} className={`rounded-xl border p-4 text-left transition disabled:opacity-50 ${method === "sslcommerz" ? "border-green-600 bg-green-50 ring-2 ring-green-100" : "border-slate-200"}`}>
                      <span className="flex items-center gap-2 font-bold text-green-700"><CreditCard className="h-4 w-4" /> SSLCommerz</span>
                      <span className="mt-1 block text-xs text-muted">{t("Cards, mobile banking & net banking", "কার্ড, মোবাইল ব্যাংকিং ও নেট ব্যাংকিং")}</span>
                    </button>
                  </div>
                </div>

                {method === "bkash" && data.payment.bkashEnabled && (
                  <div className="rounded-xl bg-pink-50 p-4">
                    <p className="text-sm font-semibold text-pink-700">{t("Send to bKash:", "বিকাশে পাঠান:")} <span className="text-lg font-extrabold">{data.payment.bkashNumber}</span></p>
                    <p className="mt-1 text-xs text-pink-700/80">{lang === "bn" ? data.payment.bkashInstructionsBn : data.payment.bkashInstructionsEn}</p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="label" htmlFor="bkash-sender">{t("Sender number", "সেন্ডার নম্বর")} *</label>
                        <input id="bkash-sender" className="input" required placeholder="01XXXXXXXXX" value={form.bkashSenderNumber} onChange={(e) => setForm({ ...form, bkashSenderNumber: e.target.value })} />
                      </div>
                      <div>
                        <label className="label" htmlFor="bkash-trx">TrxID *</label>
                        <input id="bkash-trx" className="input" required placeholder="e.g. 9F7A2B1CDE" value={form.bkashTrxId} onChange={(e) => setForm({ ...form, bkashTrxId: e.target.value.toUpperCase() })} />
                      </div>
                    </div>
                  </div>
                )}

                {selected && (
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                    <span className="text-sm font-semibold text-muted">{t("Total", "মোট")}</span>
                    <span className="text-2xl font-extrabold text-heading">{formatBdt(selected.priceBdt, lang)}</span>
                  </div>
                )}

                <button type="submit" className="btn btn-primary w-full" disabled={busy || !selected || bothDisabled}>
                  {busy ? t("Processing…", "প্রক্রিয়াধীন…") : method === "sslcommerz" ? t("Pay with SSLCommerz", "SSLCommerz-এ পেমেন্ট করুন") : t("Submit order & TrxID", "অর্ডার ও TrxID জমা দিন")}
                </button>
                <p className="text-center text-xs text-muted">{t("By ordering you agree to our Terms & Conditions.", "অর্ডার করলে আপনি আমাদের শর্তাবলিতে সম্মত হন।")}</p>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
