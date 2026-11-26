"use client";

import Link from "next/link";
import { useState } from "react";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Menu, MessageCircle, Phone, X, Youtube } from "lucide-react";
import type { NavLink, SiteSettings } from "@/db/schema";
import { LanguageToggle, useLanguage } from "./language-provider";
import { Logo } from "./logo";

export function SiteHeader({ settings, navLinks }: { settings: SiteSettings; navLinks: NavLink[] }) {
  const { lang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const headerLinks = navLinks.filter((link) => link.visible && link.location === "header");
  const utilityLinks = navLinks.filter((link) => link.visible && link.location === "utility");
  const address = lang === "bn" ? settings.addressBn : settings.addressEn;

  return (
    <header className="sticky top-0 z-50">
      <div className="utility-gradient text-white">
        <div className="container-page flex min-h-9 flex-wrap items-center justify-between gap-2 py-1.5 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <a href={`mailto:${settings.email}`} className="inline-flex items-center gap-1.5 hover:underline">
              <Mail className="h-3.5 w-3.5" /> {settings.email}
            </a>
            <a href={`tel:${settings.phone}`} className="inline-flex items-center gap-1.5 font-semibold hover:underline">
              <Phone className="h-3.5 w-3.5" /> {settings.phone}
            </a>
            <span className="hidden items-center gap-1.5 lg:inline-flex">
              <MapPin className="h-3.5 w-3.5" /> {address}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {utilityLinks.map((link) => (
              <a key={link.id} href={link.href} className="hidden rounded-full bg-white/15 px-2.5 py-0.5 font-semibold hover:bg-white/25 sm:inline-flex">
                {lang === "bn" ? link.labelBn : link.labelEn}
              </a>
            ))}
            <SocialIcons settings={settings} small />
          </div>
        </div>
      </div>

      <div className="border-b border-slate-100 bg-white/95 shadow-sm backdrop-blur">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <Logo settings={settings} lang={lang} />
          <nav className="hidden items-center gap-5 xl:flex" aria-label="Main navigation">
            {headerLinks.map((link) => (
              <Link key={link.id} href={link.href} className="text-sm font-semibold text-heading transition hover:text-brand">
                {lang === "bn" ? link.labelBn : link.labelEn}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <LanguageToggle compact />
            <Link href="/order" className="btn btn-primary hidden !px-4 !py-2 text-sm sm:inline-flex">
              {t("Order Now", "অর্ডার করুন")}
            </Link>
            <button type="button" className="rounded-lg border border-slate-200 p-2 xl:hidden" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu" aria-expanded={open}>
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {open && (
          <nav className="border-t border-slate-100 bg-white xl:hidden" aria-label="Mobile navigation">
            <div className="container-page grid gap-1 py-3">
              {headerLinks.map((link) => (
                <Link key={link.id} href={link.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm font-semibold text-heading hover:bg-blue-50">
                  {lang === "bn" ? link.labelBn : link.labelEn}
                </Link>
              ))}
              <Link href="/order" onClick={() => setOpen(false)} className="btn btn-primary mt-2">
                {t("Order Now", "অর্ডার করুন")}
              </Link>
              <a href={settings.whatsappUrl} className="btn btn-whatsapp mt-1">
                <MessageCircle className="h-4 w-4" /> {t("WhatsApp", "হোয়াটসঅ্যাপ")}
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

export function SocialIcons({ settings, small = false }: { settings: SiteSettings; small?: boolean }) {
  const size = small ? "h-3.5 w-3.5" : "h-4 w-4";
  const className = small
    ? "inline-flex h-6 w-6 items-center justify-center rounded bg-white/15 hover:bg-white/30"
    : "inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20";
  const items = [
    { href: settings.facebookUrl, icon: <Facebook className={size} />, label: "Facebook" },
    { href: settings.instagramUrl, icon: <Instagram className={size} />, label: "Instagram" },
    { href: settings.linkedinUrl, icon: <Linkedin className={size} />, label: "LinkedIn" },
    { href: settings.youtubeUrl, icon: <Youtube className={size} />, label: "YouTube" },
  ].filter((item) => item.href);
  return (
    <div className="flex items-center gap-1.5">
      {items.map((item) => (
        <a key={item.label} href={item.href} target="_blank" rel="noreferrer" aria-label={item.label} className={className}>
          {item.icon}
        </a>
      ))}
    </div>
  );
}
