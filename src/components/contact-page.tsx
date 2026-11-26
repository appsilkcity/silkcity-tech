"use client";

import { useState, type FormEvent } from "react";
import { Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import type { Page, SiteSettings } from "@/db/schema";
import { whatsappLink } from "@/lib/utils";
import { useLanguage } from "./language-provider";
import { Reveal } from "./motion";
import { RichText } from "./rich-text";

export function ContactPage({ page, settings }: { page: Page; settings: SiteSettings }) {
  const { lang, t } = useLanguage();
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSending(true);
    setError("");
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...form, locale: lang }),
      });
      const json = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(json.error || "Failed to send");
      setDone(true);
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t("Something went wrong", "কিছু একটা সমস্যা হয়েছে"));
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="section-pad">
      <div className="container-page">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-extrabold text-heading md:text-4xl">{lang === "bn" ? page.titleBn : page.titleEn}</h1>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-brand to-accent" />
        </Reveal>
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          <Reveal className="space-y-5">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <RichText content={lang === "bn" ? page.contentBn : page.contentEn} />
            </div>
            <div className="grid gap-3">
              <a href={`tel:${settings.phone}`} className="feature-card flex items-center gap-3 p-4">
                <span className="icon-badge tint-sky"><Phone className="h-5 w-5" /></span>
                <span><span className="block text-xs font-semibold text-muted">{t("Call us", "কল করুন")}</span><span className="font-bold text-heading">{settings.phone}</span></span>
              </a>
              <a href={whatsappLink(settings.whatsappUrl, t("Hello, I need help with a website.", "আসসালামু আলাইকুম, ওয়েবসাইট বিষয়ে সাহায্য দরকার।"))} target="_blank" rel="noreferrer" className="feature-card flex items-center gap-3 p-4">
                <span className="icon-badge tint-mint"><MessageCircle className="h-5 w-5" /></span>
                <span><span className="block text-xs font-semibold text-muted">WhatsApp</span><span className="font-bold text-heading">{settings.phone}</span></span>
              </a>
              <a href={`mailto:${settings.email}`} className="feature-card flex items-center gap-3 p-4">
                <span className="icon-badge tint-lavender"><Mail className="h-5 w-5" /></span>
                <span><span className="block text-xs font-semibold text-muted">{t("Email", "ইমেইল")}</span><span className="break-all font-bold text-heading">{settings.email}</span></span>
              </a>
              <div className="feature-card flex items-center gap-3 p-4">
                <span className="icon-badge tint-peach"><MapPin className="h-5 w-5" /></span>
                <span><span className="block text-xs font-semibold text-muted">{t("Office", "অফিস")}</span><span className="font-bold text-heading">{lang === "bn" ? settings.addressBn : settings.addressEn}</span></span>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <form onSubmit={onSubmit} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm md:p-8">
              <h2 className="text-xl font-bold text-heading">{t("Send an inquiry", "অনুসন্ধান পাঠান")}</h2>
              <p className="mt-1 text-sm text-muted">{t("We usually reply within business hours.", "আমরা সাধারণত কর্মঘণ্টার মধ্যে উত্তর দিই।")}</p>
              {done && <p className="mt-4 rounded-lg bg-green-50 p-3 text-sm font-semibold text-green-700">{t("Thank you! Your inquiry has been received.", "ধন্যবাদ! আপনার অনুসন্ধান গ্রহণ করা হয়েছে।")}</p>}
              {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
              <div className="mt-5 grid gap-4">
                <div>
                  <label className="label" htmlFor="contact-name">{t("Name", "নাম")} *</label>
                  <input id="contact-name" className="input" required minLength={2} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label" htmlFor="contact-phone">{t("Phone", "ফোন")}</label>
                    <input id="contact-phone" className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="01XXXXXXXXX" />
                  </div>
                  <div>
                    <label className="label" htmlFor="contact-email">{t("Email", "ইমেইল")}</label>
                    <input id="contact-email" type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="label" htmlFor="contact-message">{t("Message", "বার্তা")} *</label>
                  <textarea id="contact-message" className="input min-h-36" required minLength={10} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                </div>
                <button type="submit" className="btn btn-primary" disabled={sending}>
                  <Send className="h-4 w-4" /> {sending ? t("Sending…", "পাঠানো হচ্ছে…") : t("Send message", "বার্তা পাঠান")}
                </button>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
