"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { AdminData } from "@/lib/data";
import type { ContentBlockView } from "@/lib/types";
import type { Page } from "@/db/schema";

type Settings = NonNullable<AdminData["settings"]>;
type PaymentSettings = AdminData["paymentSettings"];

function Field({ label, children, wide = false }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <span className="label">{label}</span>
      {children}
    </div>
  );
}

export function SettingsForm({ settings, onSave }: { settings: Settings; onSave: (values: Record<string, unknown>) => Promise<void> }) {
  const [form, setForm] = useState<Record<string, unknown>>({ ...settings });
  const [busy, setBusy] = useState(false);
  useEffect(() => setForm({ ...settings }), [settings]);
  const set = (key: string, value: unknown) => setForm((prev) => ({ ...prev, [key]: value }));

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      await onSave(form);
    } finally {
      setBusy(false);
    }
  }

  const text = (key: string, label: string, wide = false, type = "text") => (
    <Field label={label} wide={wide}>
      <input className="input" type={type} value={String(form[key] ?? "")} onChange={(e) => set(key, e.target.value)} />
    </Field>
  );

  return (
    <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-heading">General & Brand Settings</h2>
      <p className="mt-1 text-sm text-muted">Site identity, logo, favicon, contact details and social links. Bilingual address and brand name.</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {text("siteName", "Site / domain name")}
        {text("brandName", "Brand name (EN)")}
        {text("brandNameBn", "Brand name (BN)")}
        {text("logoUrl", "Logo URL", false, "url")}
        {text("faviconUrl", "Favicon / site icon URL", false, "url")}
        {text("phone", "Phone")}
        {text("whatsappUrl", "WhatsApp URL", true, "url")}
        {text("email", "Email", false, "email")}
        {text("addressEn", "Address (EN)", true)}
        {text("addressBn", "Address (BN)", true)}
        {text("facebookUrl", "Facebook URL", false, "url")}
        {text("instagramUrl", "Instagram URL", false, "url")}
        {text("linkedinUrl", "LinkedIn URL", false, "url")}
        {text("youtubeUrl", "YouTube URL", false, "url")}
        <Field label="Footer text (EN)" wide><textarea className="input min-h-20" value={String(form.footerTextEn ?? "")} onChange={(e) => set("footerTextEn", e.target.value)} /></Field>
        <Field label="Footer text (BN)" wide><textarea className="input min-h-20" value={String(form.footerTextBn ?? "")} onChange={(e) => set("footerTextBn", e.target.value)} /></Field>
      </div>
      <button type="submit" className="btn btn-primary mt-5" disabled={busy}>{busy ? "Saving…" : "Save settings"}</button>
    </form>
  );
}

export function SeoForm({ settings, onSave }: { settings: Settings; onSave: (values: Record<string, unknown>) => Promise<void> }) {
  const [form, setForm] = useState<Record<string, unknown>>({ ...settings });
  const [busy, setBusy] = useState(false);
  useEffect(() => setForm({ ...settings }), [settings]);
  const set = (key: string, value: unknown) => setForm((prev) => ({ ...prev, [key]: value }));

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      await onSave(form);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-heading">Global SEO</h2>
      <p className="mt-1 text-sm text-muted">Meta title/description, keywords, OpenGraph image, Google verification, sitemap and robots are generated from these values.</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Meta title (EN)"><input className="input" value={String(form.seoTitleEn ?? "")} onChange={(e) => set("seoTitleEn", e.target.value)} /></Field>
        <Field label="Meta title (BN)"><input className="input" value={String(form.seoTitleBn ?? "")} onChange={(e) => set("seoTitleBn", e.target.value)} /></Field>
        <Field label="Meta description (EN)" wide><textarea className="input min-h-20" value={String(form.seoDescriptionEn ?? "")} onChange={(e) => set("seoDescriptionEn", e.target.value)} /></Field>
        <Field label="Meta description (BN)" wide><textarea className="input min-h-20" value={String(form.seoDescriptionBn ?? "")} onChange={(e) => set("seoDescriptionBn", e.target.value)} /></Field>
        <Field label="Keywords" wide><input className="input" value={String(form.seoKeywords ?? "")} onChange={(e) => set("seoKeywords", e.target.value)} /></Field>
        <Field label="OpenGraph image URL"><input className="input" type="url" value={String(form.ogImageUrl ?? "")} onChange={(e) => set("ogImageUrl", e.target.value)} /></Field>
        <Field label="Google verification tag content"><input className="input" value={String(form.googleVerification ?? "")} onChange={(e) => set("googleVerification", e.target.value)} /></Field>
      </div>
      <button type="submit" className="btn btn-primary mt-5" disabled={busy}>{busy ? "Saving…" : "Save SEO"}</button>
    </form>
  );
}

export function PaymentSettingsForm({ settings, onSave }: { settings: PaymentSettings; onSave: (values: Record<string, unknown>) => Promise<void> }) {
  const [form, setForm] = useState<Record<string, unknown>>({ ...settings, sslStorePassword: "" });
  const [busy, setBusy] = useState(false);
  useEffect(() => setForm({ ...settings, sslStorePassword: "" }), [settings]);
  const set = (key: string, value: unknown) => setForm((prev) => ({ ...prev, [key]: value }));

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      const body = { ...form };
      if (!String(body.sslStorePassword ?? "").trim()) delete body.sslStorePassword;
      delete body.hasSslStorePassword;
      await onSave(body);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-heading">Payment Gateway Settings</h2>
      <p className="mt-1 text-sm text-muted">Configure SSLCommerz and manual bKash. Store password is write-only and never returned to the browser.</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={Boolean(form.sslEnabled)} onChange={(e) => set("sslEnabled", e.target.checked)} /> Enable SSLCommerz</label>
        <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={Boolean(form.sslIsLive)} onChange={(e) => set("sslIsLive", e.target.checked)} /> SSLCommerz Live mode (unchecked = sandbox)</label>
        <Field label="SSLCommerz Store ID"><input className="input" value={String(form.sslStoreId ?? "")} onChange={(e) => set("sslStoreId", e.target.value)} /></Field>
        <Field label={`SSLCommerz Store Password ${settings.hasSslStorePassword ? "(saved — leave blank to keep)" : ""}`}>
          <input className="input" type="password" autoComplete="new-password" value={String(form.sslStorePassword ?? "")} onChange={(e) => set("sslStorePassword", e.target.value)} />
        </Field>
        <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={Boolean(form.bkashEnabled)} onChange={(e) => set("bkashEnabled", e.target.checked)} /> Enable Manual bKash</label>
        <Field label="bKash number"><input className="input" value={String(form.bkashNumber ?? "")} onChange={(e) => set("bkashNumber", e.target.value)} /></Field>
        <Field label="bKash instructions (EN)" wide><textarea className="input min-h-20" value={String(form.bkashInstructionsEn ?? "")} onChange={(e) => set("bkashInstructionsEn", e.target.value)} /></Field>
        <Field label="bKash instructions (BN)" wide><textarea className="input min-h-20" value={String(form.bkashInstructionsBn ?? "")} onChange={(e) => set("bkashInstructionsBn", e.target.value)} /></Field>
      </div>
      <button type="submit" className="btn btn-primary mt-5" disabled={busy}>{busy ? "Saving…" : "Save payment settings"}</button>
    </form>
  );
}

const blockKeys = ["hero", "why", "services", "features", "cta", "stats", "portfolio", "payments"] as const;

export function BlockEditor({ blocks, onSave }: { blocks: ContentBlockView[]; onSave: (values: Record<string, unknown>) => Promise<void> }) {
  const [key, setKey] = useState<(typeof blockKeys)[number]>("hero");
  const block = blocks.find((item) => item.key === key);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setForm({
      key,
      titleEn: block?.titleEn ?? "",
      titleBn: block?.titleBn ?? "",
      subtitleEn: block?.subtitleEn ?? "",
      subtitleBn: block?.subtitleBn ?? "",
      bodyEn: block?.bodyEn ?? "",
      bodyBn: block?.bodyBn ?? "",
      imageUrl: block?.imageUrl ?? "",
      badgeEn: block?.data.badgeEn ?? "",
      badgeBn: block?.data.badgeBn ?? "",
      primaryEn: block?.data.primaryEn ?? "",
      primaryBn: block?.data.primaryBn ?? "",
      secondaryEn: block?.data.secondaryEn ?? "",
      secondaryBn: block?.data.secondaryBn ?? "",
    });
  }, [key, block]);

  const set = (field: string, value: unknown) => setForm((prev) => ({ ...prev, [field]: value }));
  const showButtons = key === "hero" || key === "cta";

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      await onSave(form);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-heading">Homepage Section Text</h2>
      <p className="mt-1 text-sm text-muted">Edit hero, section headings, CTA banner and portfolio/payment copy in both languages.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {blockKeys.map((item) => (
          <button key={item} type="button" onClick={() => setKey(item)} className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${key === item ? "bg-brand text-white" : "bg-slate-100 text-slate-600"}`}>{item}</button>
        ))}
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Title / headline (EN)"><input className="input" value={String(form.titleEn ?? "")} onChange={(e) => set("titleEn", e.target.value)} /></Field>
        <Field label="Title / headline (BN)"><input className="input" value={String(form.titleBn ?? "")} onChange={(e) => set("titleBn", e.target.value)} /></Field>
        <Field label="Subtitle (EN)" wide><textarea className="input min-h-20" value={String(form.subtitleEn ?? "")} onChange={(e) => set("subtitleEn", e.target.value)} /></Field>
        <Field label="Subtitle (BN)" wide><textarea className="input min-h-20" value={String(form.subtitleBn ?? "")} onChange={(e) => set("subtitleBn", e.target.value)} /></Field>
        <Field label="Image URL (optional — overrides built-in illustration)" wide><input className="input" type="url" value={String(form.imageUrl ?? "")} onChange={(e) => set("imageUrl", e.target.value)} /></Field>
        {showButtons && (
          <>
            <Field label="Trust badge (EN)"><input className="input" value={String(form.badgeEn ?? "")} onChange={(e) => set("badgeEn", e.target.value)} /></Field>
            <Field label="Trust badge (BN)"><input className="input" value={String(form.badgeBn ?? "")} onChange={(e) => set("badgeBn", e.target.value)} /></Field>
            <Field label="Primary button (EN)"><input className="input" value={String(form.primaryEn ?? "")} onChange={(e) => set("primaryEn", e.target.value)} /></Field>
            <Field label="Primary button (BN)"><input className="input" value={String(form.primaryBn ?? "")} onChange={(e) => set("primaryBn", e.target.value)} /></Field>
            <Field label="Secondary button (EN)"><input className="input" value={String(form.secondaryEn ?? "")} onChange={(e) => set("secondaryEn", e.target.value)} /></Field>
            <Field label="Secondary button (BN)"><input className="input" value={String(form.secondaryBn ?? "")} onChange={(e) => set("secondaryBn", e.target.value)} /></Field>
          </>
        )}
      </div>
      <button type="submit" className="btn btn-primary mt-5" disabled={busy}>{busy ? "Saving…" : `Save ${key}`}</button>
    </form>
  );
}

const pageSlugs = ["about", "privacy-policy", "terms", "contact"] as const;

export function PagesEditor({ pages, onSave }: { pages: Page[]; onSave: (values: Record<string, unknown>) => Promise<void> }) {
  const [slug, setSlug] = useState<(typeof pageSlugs)[number]>("about");
  const page = pages.find((item) => item.slug === slug);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setForm({ slug, titleEn: page?.titleEn ?? "", titleBn: page?.titleBn ?? "", contentEn: page?.contentEn ?? "", contentBn: page?.contentBn ?? "" });
  }, [slug, page]);

  const set = (field: string, value: unknown) => setForm((prev) => ({ ...prev, [field]: value }));

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      await onSave(form);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-heading">Legal & Content Pages</h2>
      <p className="mt-1 text-sm text-muted">Edit About, Privacy Policy, Terms and Contact intro in Bangla and English. Supports lightweight Markdown: ## heading, - list, 1. list.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {pageSlugs.map((item) => (
          <button key={item} type="button" onClick={() => setSlug(item)} className={`rounded-full px-3 py-1 text-xs font-bold ${slug === item ? "bg-brand text-white" : "bg-slate-100 text-slate-600"}`}>{item}</button>
        ))}
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Title (EN)"><input className="input" value={String(form.titleEn ?? "")} onChange={(e) => set("titleEn", e.target.value)} /></Field>
        <Field label="Title (BN)"><input className="input" value={String(form.titleBn ?? "")} onChange={(e) => set("titleBn", e.target.value)} /></Field>
        <Field label="Content (EN)" wide><textarea className="input min-h-72 font-mono text-xs" value={String(form.contentEn ?? "")} onChange={(e) => set("contentEn", e.target.value)} /></Field>
        <Field label="Content (BN)" wide><textarea className="input min-h-72 font-mono text-xs" value={String(form.contentBn ?? "")} onChange={(e) => set("contentBn", e.target.value)} /></Field>
      </div>
      <button type="submit" className="btn btn-primary mt-5" disabled={busy}>{busy ? "Saving…" : `Save /${slug}`}</button>
    </form>
  );
}
