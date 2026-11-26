"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BadgeCheck, CreditCard, FileText, Home, Inbox, LayoutDashboard, LogOut, Menu, Package,
  Palette, Settings, ShoppingBag, Sparkles, X,
} from "lucide-react";
import type { AdminData } from "@/lib/data";
import { iconNames } from "@/components/icon";
import { BrandMark } from "@/components/illustrations";
import { EntityManager, type AdminRecord, type FieldConfig } from "./entity-manager";
import { BlockEditor, PagesEditor, PaymentSettingsForm, SeoForm, SettingsForm } from "./admin-forms";
import { OrdersManager } from "./orders-manager";

const tabs = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "general", label: "General & Brand", icon: Settings },
  { id: "header-footer", label: "Header & Footer", icon: Menu },
  { id: "homepage", label: "Homepage & Counters", icon: Home },
  { id: "packages", label: "Packages", icon: Package },
  { id: "portfolio", label: "Portfolio", icon: Palette },
  { id: "orders", label: "Orders & Payments", icon: ShoppingBag },
  { id: "payments", label: "Payment Gateways", icon: CreditCard },
  { id: "seo-legal", label: "SEO & Legal Pages", icon: FileText },
  { id: "inquiries", label: "Inquiries", icon: Inbox },
] as const;

type TabId = (typeof tabs)[number]["id"];

const iconOptions = iconNames.map((name) => ({ value: name, label: name }));
const tintOptions = ["pink", "lavender", "mint", "cream", "cyan", "peach", "rose", "sky"].map((value) => ({ value, label: value }));

const bilingualItemFields: FieldConfig[] = [
  { name: "icon", label: "Icon", type: "select", options: iconOptions, required: true },
  { name: "sortOrder", label: "Sort order", type: "number", required: true },
  { name: "titleEn", label: "Title (EN)", type: "text", required: true },
  { name: "titleBn", label: "Title (BN)", type: "text", required: true },
  { name: "descriptionEn", label: "Description (EN)", type: "textarea", required: true },
  { name: "descriptionBn", label: "Description (BN)", type: "textarea", required: true },
  { name: "visible", label: "Visible on website", type: "checkbox" },
];

const packageFields: FieldConfig[] = [
  { name: "slug", label: "Slug (URL key)", type: "text", required: true, placeholder: "business-website" },
  { name: "icon", label: "Icon", type: "select", options: iconOptions, required: true },
  { name: "nameEn", label: "Name (EN)", type: "text", required: true },
  { name: "nameBn", label: "Name (BN)", type: "text", required: true },
  { name: "descriptionEn", label: "Description (EN)", type: "textarea", required: true },
  { name: "descriptionBn", label: "Description (BN)", type: "textarea", required: true },
  { name: "priceBdt", label: "Price (BDT)", type: "number", required: true },
  { name: "tint", label: "Pastel card tint", type: "select", options: tintOptions, required: true },
  { name: "deliveryDays", label: "Delivery days", type: "number", required: true },
  { name: "revisions", label: "Revisions", type: "number", required: true },
  { name: "sortOrder", label: "Sort order", type: "number", required: true },
  { name: "featuresEn", label: "Features (EN) — one per line", type: "list", required: true },
  { name: "featuresBn", label: "Features (BN) — one per line", type: "list", required: true },
  { name: "popular", label: "Popular badge", type: "checkbox" },
  { name: "visible", label: "Visible / orderable", type: "checkbox" },
];

const portfolioFields: FieldConfig[] = [
  { name: "titleEn", label: "Project title (EN)", type: "text", required: true },
  { name: "titleBn", label: "Project title (BN)", type: "text", required: true },
  { name: "categoryEn", label: "Category (EN)", type: "text", required: true },
  { name: "categoryBn", label: "Category (BN)", type: "text", required: true },
  { name: "descriptionEn", label: "Description (EN)", type: "textarea" },
  { name: "descriptionBn", label: "Description (BN)", type: "textarea" },
  { name: "imageUrl", label: "Thumbnail URL", type: "url" },
  { name: "liveUrl", label: "Live site URL", type: "url" },
  { name: "techStack", label: "Tech stack — one per line", type: "list" },
  { name: "clientNameEn", label: "Client name (EN)", type: "text" },
  { name: "clientNameBn", label: "Client name (BN)", type: "text" },
  { name: "trustNoteEn", label: "Client trust note (EN)", type: "textarea" },
  { name: "trustNoteBn", label: "Client trust note (BN)", type: "textarea" },
  { name: "sortOrder", label: "Sort order", type: "number", required: true },
  { name: "featured", label: "Featured", type: "checkbox" },
  { name: "visible", label: "Published", type: "checkbox" },
];

function records<T>(items: T[]): AdminRecord[] {
  return items as unknown as AdminRecord[];
}

export function AdminDashboard() {
  const router = useRouter();
  const [data, setData] = useState<AdminData | null>(null);
  const [tab, setTab] = useState<TabId>("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [mobileNav, setMobileNav] = useState(false);

  const load = useCallback(async () => {
    const response = await fetch("/api/admin/bootstrap", { cache: "no-store" });
    if (response.status === 401) {
      router.push("/admin/login");
      return;
    }
    const json = (await response.json()) as AdminData & { error?: string };
    if (!response.ok) throw new Error(json.error || "Failed to load admin data");
    setData(json);
  }, [router]);

  useEffect(() => {
    load().catch((caught: unknown) => setError(caught instanceof Error ? caught.message : "Failed to load")).finally(() => setLoading(false));
  }, [load]);

  const mutate = useCallback(async (path: string, method: "POST" | "PUT" | "PATCH" | "DELETE", body?: Record<string, unknown>) => {
    setError("");
    const response = await fetch(path, {
      method,
      headers: body ? { "content-type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    const json = (await response.json().catch(() => ({}))) as { error?: string; issues?: unknown };
    if (!response.ok) {
      throw new Error(json.error || `Request failed (${response.status})`);
    }
    await load();
    setToast("Saved successfully");
    window.setTimeout(() => setToast(""), 2500);
  }, [load]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  async function verify(orderId: string, action: "approve" | "reject" | "revalidate-ssl") {
    await mutate("/api/admin/orders/verify", "POST", { orderId, action });
  }

  if (loading) {
    return <main className="flex min-h-screen items-center justify-center bg-slate-100 text-muted">Loading admin dashboard…</main>;
  }

  if (!data || !data.settings) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-100 p-6 text-center">
        <p className="font-semibold text-red-600">{error || "Admin data unavailable. Run db:push and db:seed."}</p>
        <Link href="/" className="btn btn-primary">Back to website</Link>
      </main>
    );
  }

  const footerColumnOptions = data.footerColumns.map((column) => ({ value: column.id, label: column.titleEn }));
  const navFields: FieldConfig[] = [
    { name: "labelEn", label: "Label (EN)", type: "text", required: true },
    { name: "labelBn", label: "Label (BN)", type: "text", required: true },
    { name: "href", label: "Href / URL", type: "text", required: true, placeholder: "/about or https://…" },
    { name: "location", label: "Location", type: "select", options: [{ value: "header", label: "Main header" }, { value: "utility", label: "Top utility strip" }], required: true },
    { name: "sortOrder", label: "Sort order", type: "number", required: true },
    { name: "visible", label: "Visible", type: "checkbox" },
  ];
  const footerColumnFields: FieldConfig[] = [
    { name: "titleEn", label: "Column title (EN)", type: "text", required: true },
    { name: "titleBn", label: "Column title (BN)", type: "text", required: true },
    { name: "sortOrder", label: "Sort order", type: "number", required: true },
    { name: "visible", label: "Visible", type: "checkbox" },
  ];
  const footerLinkFields: FieldConfig[] = [
    { name: "columnId", label: "Footer column", type: "select", options: footerColumnOptions, required: true },
    { name: "labelEn", label: "Label (EN)", type: "text", required: true },
    { name: "labelBn", label: "Label (BN)", type: "text", required: true },
    { name: "href", label: "Href / URL", type: "text", required: true },
    { name: "sortOrder", label: "Sort order", type: "number", required: true },
    { name: "visible", label: "Visible", type: "checkbox" },
  ];
  const statFields: FieldConfig[] = [
    { name: "labelEn", label: "Label (EN)", type: "text", required: true },
    { name: "labelBn", label: "Label (BN)", type: "text", required: true },
    { name: "value", label: "Counter value", type: "number", required: true },
    { name: "suffixEn", label: "Suffix (EN)", type: "text" },
    { name: "suffixBn", label: "Suffix (BN)", type: "text" },
    { name: "icon", label: "Icon", type: "select", options: iconOptions, required: true },
    { name: "sortOrder", label: "Sort order", type: "number", required: true },
    { name: "visible", label: "Visible", type: "checkbox" },
  ];
  const paymentMethodFields: FieldConfig[] = [
    { name: "key", label: "Key", type: "text", required: true, placeholder: "bkash" },
    { name: "nameEn", label: "Name (EN)", type: "text", required: true },
    { name: "nameBn", label: "Name (BN)", type: "text", required: true },
    { name: "kind", label: "Kind", type: "select", options: [{ value: "gateway", label: "Gateway" }, { value: "manual", label: "Manual" }, { value: "badge", label: "Badge only" }], required: true },
    { name: "imageUrl", label: "Logo image URL (optional)", type: "url" },
    { name: "color", label: "Brand color", type: "color", required: true },
    { name: "sortOrder", label: "Sort order", type: "number", required: true },
    { name: "enabled", label: "Enabled", type: "checkbox" },
  ];
  const inquiryFields: FieldConfig[] = [
    { name: "status", label: "Status", type: "select", options: [{ value: "new", label: "New" }, { value: "read", label: "Read" }, { value: "archived", label: "Archived" }], required: true },
  ];

  const pendingOrders = data.orders.filter((order) => order.paymentStatus === "awaiting_verification").length;
  const newInquiries = data.inquiries.filter((inquiry) => inquiry.status === "new").length;

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="flex h-16 items-center justify-between gap-3 px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button type="button" className="rounded-lg p-2 hover:bg-slate-100 lg:hidden" onClick={() => setMobileNav(!mobileNav)} aria-label="Toggle admin menu">
              {mobileNav ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <BrandMark className="h-9 w-9" />
            <div>
              <p className="font-extrabold text-heading">Silk City Tech Admin</p>
              <p className="text-xs text-muted">{data.settings.siteName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="btn btn-outline !px-3 !py-1.5 text-xs">View site</Link>
            <button type="button" className="btn btn-dark !px-3 !py-1.5 text-xs" onClick={() => void logout()}><LogOut className="h-4 w-4" /> Logout</button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className={`${mobileNav ? "block" : "hidden"} fixed inset-x-0 top-16 z-30 border-b border-slate-200 bg-white p-3 lg:sticky lg:top-16 lg:block lg:h-[calc(100vh-4rem)] lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r lg:p-4`}>
          <nav className="grid gap-1">
            {tabs.map((item) => (
              <button key={item.id} type="button" onClick={() => { setTab(item.id); setMobileNav(false); }} className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${tab === item.id ? "bg-brand text-white" : "text-slate-600 hover:bg-slate-100"}`}>
                <item.icon className="h-4 w-4" /> {item.label}
                {item.id === "orders" && pendingOrders > 0 && <span className="ml-auto rounded-full bg-amber-400 px-2 text-xs text-amber-950">{pendingOrders}</span>}
                {item.id === "inquiries" && newInquiries > 0 && <span className="ml-auto rounded-full bg-blue-100 px-2 text-xs text-blue-700">{newInquiries}</span>}
              </button>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 p-4 lg:p-6">
          {error && <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
          {toast && <p className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-green-600 px-5 py-2 text-sm font-bold text-white shadow-lg">{toast}</p>}

          {tab === "overview" && (
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: "Packages", value: data.packages.length, icon: Package },
                  { label: "Orders", value: data.orders.length, icon: ShoppingBag },
                  { label: "Awaiting bKash verification", value: pendingOrders, icon: BadgeCheck },
                  { label: "New inquiries", value: newInquiries, icon: Inbox },
                ].map((card) => (
                  <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <card.icon className="h-6 w-6 text-brand" />
                    <p className="mt-3 text-3xl font-extrabold text-heading">{card.value}</p>
                    <p className="text-sm text-muted">{card.label}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="flex items-center gap-2 text-lg font-bold text-heading"><Sparkles className="h-5 w-5 text-accent" /> Full-control checklist</h2>
                <ul className="mt-3 grid gap-2 text-sm text-slate-600 md:grid-cols-2">
                  <li>• General & Brand: logo, favicon, phone, WhatsApp, email, bilingual address.</li>
                  <li>• Header & Footer: add/edit/reorder/hide/delete links and columns.</li>
                  <li>• Homepage: hero, why items, packages, features, CTA, counters.</li>
                  <li>• Portfolio: publish real completed sites with live URLs and trust notes.</li>
                  <li>• Orders: verify bKash TrxID, revalidate SSLCommerz, update statuses.</li>
                  <li>• Payments: SSLCommerz sandbox/live credentials and manual bKash instructions.</li>
                  <li>• SEO & Legal: meta, OG, verification, sitemap/robots, About/Privacy/Terms/Contact.</li>
                  <li>• Inquiries: review contact form submissions.</li>
                </ul>
              </div>
            </div>
          )}

          {tab === "general" && <SettingsForm settings={data.settings} onSave={(values) => mutate("/api/admin/settings", "PUT", values)} />}

          {tab === "header-footer" && (
            <div className="space-y-5">
              <EntityManager title="Header / Utility Navigation" resource="nav-links" items={records(data.navLinks)} fields={navFields} defaults={{ labelEn: "", labelBn: "", href: "/", location: "header", sortOrder: data.navLinks.length + 1, visible: true }} summaryField="labelEn" onMutate={mutate} />
              <EntityManager title="Footer Columns" resource="footer-columns" items={records(data.footerColumns)} fields={footerColumnFields} defaults={{ titleEn: "", titleBn: "", sortOrder: data.footerColumns.length + 1, visible: true }} onMutate={mutate} />
              <EntityManager title="Footer Links" resource="footer-links" items={records(data.footerLinks)} fields={footerLinkFields} defaults={{ columnId: data.footerColumns[0]?.id ?? "", labelEn: "", labelBn: "", href: "/", sortOrder: data.footerLinks.length + 1, visible: true }} summaryField="labelEn" onMutate={mutate} />
            </div>
          )}

          {tab === "homepage" && (
            <div className="space-y-5">
              <BlockEditor blocks={data.blocks} onSave={(values) => mutate("/api/admin/content-blocks", "PUT", values)} />
              <EntityManager title="Why Choose Us — 6 callouts" resource="why-items" items={records(data.whyItems)} fields={bilingualItemFields} defaults={{ icon: "Sparkles", titleEn: "", titleBn: "", descriptionEn: "", descriptionBn: "", sortOrder: data.whyItems.length + 1, visible: true }} onMutate={mutate} />
              <EntityManager title="Our Features — 6 cards" resource="feature-items" items={records(data.featureItems)} fields={bilingualItemFields} defaults={{ icon: "ShieldCheck", titleEn: "", titleBn: "", descriptionEn: "", descriptionBn: "", sortOrder: data.featureItems.length + 1, visible: true }} onMutate={mutate} />
              <EntityManager title="Live Counters" resource="stats" items={records(data.stats)} fields={statFields} defaults={{ labelEn: "", labelBn: "", value: 0, suffixEn: "+", suffixBn: "+", icon: "Users", sortOrder: data.stats.length + 1, visible: true }} summaryField="labelEn" onMutate={mutate} />
            </div>
          )}

          {tab === "packages" && (
            <EntityManager title="Services / Website Packages" description="8 pastel cards by default. Edit price, features, BN/EN text, tint, visibility and order." resource="packages" items={records(data.packages)} fields={packageFields} defaults={{ slug: "", nameEn: "", nameBn: "", descriptionEn: "", descriptionBn: "", priceBdt: 10000, featuresEn: [], featuresBn: [], icon: "Globe", tint: "mint", deliveryDays: 7, revisions: 2, popular: false, visible: true, sortOrder: data.packages.length + 1 }} summaryField="nameEn" onMutate={mutate} />
          )}

          {tab === "portfolio" && (
            <EntityManager title="Portfolio / Previous Built Sites" description="Publish real completed websites to build customer trust before buying." resource="portfolio" items={records(data.portfolioItems)} fields={portfolioFields} defaults={{ titleEn: "", titleBn: "", descriptionEn: "", descriptionBn: "", categoryEn: "Business Website", categoryBn: "বিজনেস ওয়েবসাইট", imageUrl: "", liveUrl: "", techStack: [], clientNameEn: "", clientNameBn: "", trustNoteEn: "", trustNoteBn: "", featured: false, visible: true, sortOrder: data.portfolioItems.length + 1 }} onMutate={mutate} />
          )}

          {tab === "orders" && <OrdersManager orders={data.orders} onMutate={mutate} onVerify={verify} />}

          {tab === "payments" && (
            <div className="space-y-5">
              <PaymentSettingsForm settings={data.paymentSettings} onSave={(values) => mutate("/api/admin/payment-settings", "PUT", values)} />
              <EntityManager title="Payment Method Tiles / Badges" resource="payment-methods" items={records(data.paymentMethods)} fields={paymentMethodFields} defaults={{ key: "", nameEn: "", nameBn: "", kind: "badge", imageUrl: "", color: "#2563eb", enabled: true, sortOrder: data.paymentMethods.length + 1 }} summaryField="nameEn" onMutate={mutate} />
            </div>
          )}

          {tab === "seo-legal" && (
            <div className="space-y-5">
              <SeoForm settings={data.settings} onSave={(values) => mutate("/api/admin/settings", "PUT", values)} />
              <PagesEditor pages={data.pages} onSave={(values) => mutate("/api/admin/pages", "PUT", values)} />
            </div>
          )}

          {tab === "inquiries" && (
            <EntityManager title="Contact Inquiries" description="Messages submitted from the contact form." resource="inquiries" items={records(data.inquiries)} fields={inquiryFields} defaults={{ status: "new" }} summaryField="name" allowCreate={false} onMutate={mutate} />
          )}
        </main>
      </div>
    </div>
  );
}
