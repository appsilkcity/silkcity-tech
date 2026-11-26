/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight, MessageCircle, Phone, ShieldCheck, Users } from "lucide-react";
import type { PublicSiteData } from "@/lib/data";
import type { PackageView } from "@/lib/types";
import { formatNumber, whatsappLink } from "@/lib/utils";
import { DynamicIcon } from "./icon";
import { CtaIllustration, HeroIllustration, TeamIllustration } from "./illustrations";
import { useLanguage } from "./language-provider";
import { Float, Reveal } from "./motion";
import { PackageModal } from "./package-modal";
import { PaymentBadge } from "./payment-badge";
import { PortfolioCard } from "./portfolio-card";
import { SectionHeading } from "./section-heading";

function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const { lang } = useLanguage();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, reduce, value]);

  return (
    <span ref={ref} className="text-4xl font-extrabold text-heading md:text-5xl">
      {formatNumber(display, lang)}{suffix}
    </span>
  );
}

export function HomePage({ data }: { data: PublicSiteData }) {
  const { lang, t } = useLanguage();
  const [selected, setSelected] = useState<PackageView | null>(null);
  const { settings, blocks } = data;
  const hero = blocks.hero;
  const why = blocks.why;
  const services = blocks.services;
  const features = blocks.features;
  const cta = blocks.cta;
  const statsBlock = blocks.stats;
  const portfolioBlock = blocks.portfolio;
  const paymentsBlock = blocks.payments;
  const visiblePackages = data.packages.filter((pkg) => pkg.visible);
  const visibleWhy = data.whyItems.filter((item) => item.visible);
  const visibleFeatures = data.featureItems.filter((item) => item.visible);
  const visibleStats = data.stats.filter((item) => item.visible);
  const visiblePortfolio = data.portfolioItems.filter((item) => item.visible);
  const visibleMethods = data.paymentMethods.filter((method) => method.enabled);
  const heroMessage = t("Hello, I want to build a website for my business.", "আসসালামু আলাইকুম, আমি আমার ব্যবসার জন্য ওয়েবসাইট তৈরি করতে চাই।");

  return (
    <>
      <section className="hero-gradient overflow-hidden">
        <div className="container-page grid items-center gap-10 py-14 md:py-20 lg:grid-cols-2">
          <Reveal>
            <h1 className="text-3xl font-extrabold leading-tight text-heading md:text-5xl">
              {hero ? t(hero.titleEn, hero.titleBn) : t("Hand over your responsibility to us", "ব্যবসা আপনার দায়িত্ব আমাদের")}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">
              {hero ? t(hero.subtitleEn, hero.subtitleBn) : ""}
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-bold text-accent shadow-sm ring-1 ring-orange-100">
              <Users className="h-4 w-4" />
              {hero?.data ? t(hero.data.badgeEn ?? "Trusted clients", hero.data.badgeBn ?? "আস্থার ক্লায়েন্ট") : t("Trusted clients", "আস্থার ক্লায়েন্ট")}
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href={`tel:${settings.phone}`} className="btn btn-primary">
                <Phone className="h-4 w-4" /> {hero?.data ? t(hero.data.primaryEn ?? "Call Now", hero.data.primaryBn ?? "কল করুন") : t("Call Now", "কল করুন")}
              </a>
              <a href={whatsappLink(settings.whatsappUrl, heroMessage)} target="_blank" rel="noreferrer" className="btn btn-whatsapp">
                <MessageCircle className="h-4 w-4" /> {hero?.data ? t(hero.data.secondaryEn ?? "WhatsApp Chat", hero.data.secondaryBn ?? "হোয়াটসঅ্যাপ চ্যাট") : t("WhatsApp Chat", "হোয়াটসঅ্যাপ চ্যাট")}
              </a>
            </div>
            <p className="mt-4 text-xs font-medium text-muted">{settings.phone} · {lang === "bn" ? settings.addressBn : settings.addressEn}</p>
          </Reveal>
          <Reveal delay={0.15} className="relative">
            <Float>
              {hero?.imageUrl ? (
                <img src={hero.imageUrl} alt={t("Workspace illustration", "ওয়ার্কস্পেস ইলাস্ট্রেশন")} className="mx-auto w-full max-w-xl rounded-3xl object-cover" />
              ) : (
                <HeroIllustration className="mx-auto w-full max-w-xl" />
              )}
            </Float>
          </Reveal>
        </div>
      </section>

      <section className="section-pad" id="why">
        <div className="container-page">
          <SectionHeading titleEn={why?.titleEn ?? "Why choose our service?"} titleBn={why?.titleBn ?? "কেন আমাদের সার্ভিস নিবেন?"} subtitleEn={why?.subtitleEn} subtitleBn={why?.subtitleBn} />
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_minmax(260px,420px)_1fr]">
            <div className="space-y-8">
              {visibleWhy.slice(0, 3).map((item, index) => (
                <Reveal key={item.id} delay={index * 0.06} className="flex gap-4 lg:flex-row-reverse lg:text-right">
                  <span className="icon-badge shrink-0 tint-mint"><DynamicIcon name={item.icon} /></span>
                  <div>
                    <h3 className="font-bold text-heading">{t(item.titleEn, item.titleBn)}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{t(item.descriptionEn, item.descriptionBn)}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal className="order-first lg:order-none">
              {why?.imageUrl ? (
                <img src={why.imageUrl} alt={t("Team illustration", "টিম ইলাস্ট্রেশন")} className="mx-auto w-full max-w-md rounded-3xl" />
              ) : (
                <TeamIllustration className="mx-auto w-full max-w-md" />
              )}
            </Reveal>
            <div className="space-y-8">
              {visibleWhy.slice(3, 6).map((item, index) => (
                <Reveal key={item.id} delay={index * 0.06} className="flex gap-4">
                  <span className="icon-badge shrink-0 tint-sky"><DynamicIcon name={item.icon} /></span>
                  <div>
                    <h3 className="font-bold text-heading">{t(item.titleEn, item.titleBn)}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{t(item.descriptionEn, item.descriptionBn)}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad bg-slate-50/60" id="services">
        <div className="container-page">
          <SectionHeading titleEn={services?.titleEn ?? "Our services & website packages"} titleBn={services?.titleBn ?? "আপনার জন্য আমাদের সেবা সমূহ"} subtitleEn={services?.subtitleEn} subtitleBn={services?.subtitleBn} />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {visiblePackages.map((pkg, index) => (
              <Reveal key={pkg.id} delay={index * 0.04}>
                <button
                  type="button"
                  onClick={() => setSelected(pkg)}
                  className={`tint-${pkg.tint} group flex h-full min-h-40 w-full flex-col items-center justify-center gap-4 rounded-xl p-5 text-center transition hover:-translate-y-1 hover:shadow-lg`}
                >
                  <span className="icon-badge text-brand transition group-hover:scale-105">
                    <DynamicIcon name={pkg.icon} className="h-7 w-7" />
                  </span>
                  <span className="text-sm font-bold leading-snug text-heading">{t(pkg.nameEn, pkg.nameBn)}</span>
                  {pkg.popular && <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent">{t("Popular", "জনপ্রিয়")}</span>}
                </button>
              </Reveal>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/order" className="btn btn-outline">
              {t("Compare packages & order", "প্যাকেজ দেখুন ও অর্ডার করুন")} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section-pad" id="features">
        <div className="container-page">
          <SectionHeading titleEn={features?.titleEn ?? "Our features"} titleBn={features?.titleBn ?? "আমাদের বৈশিষ্ট্য সমূহ"} subtitleEn={features?.subtitleEn} subtitleBn={features?.subtitleBn} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visibleFeatures.map((item, index) => (
              <Reveal key={item.id} delay={index * 0.05}>
                <div className="feature-card h-full p-6 text-center">
                  <span className="icon-badge mx-auto tint-lavender"><DynamicIcon name={item.icon} /></span>
                  <h3 className="mt-4 font-bold text-brand">{t(item.titleEn, item.titleBn)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{t(item.descriptionEn, item.descriptionBn)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-gradient section-pad">
        <div className="container-page grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="rounded-2xl bg-gradient-to-br from-amber-300 via-rose-300 to-violet-400 p-1 shadow-xl">
              <div className="rounded-xl bg-white/70 p-4">
                {cta?.imageUrl ? (
                  <img src={cta.imageUrl} alt={t("Project planning illustration", "প্রজেক্ট প্ল্যানিং ইলাস্ট্রেশন")} className="w-full rounded-lg" />
                ) : (
                  <CtaIllustration className="w-full" />
                )}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-2xl font-extrabold leading-snug text-heading md:text-3xl">
              {cta ? t(cta.titleEn, cta.titleBn) : t("We are ready to build your web solution", "আপনার ওয়েব সলিউশন তৈরিতে আমরা প্রস্তুত")}
            </h2>
            <p className="mt-4 leading-relaxed text-slate-600">{cta ? t(cta.subtitleEn, cta.subtitleBn) : ""}</p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-accent shadow-sm">
              <ShieldCheck className="h-4 w-4" />
              {cta?.data ? t(cta.data.badgeEn ?? "Trusted clients", cta.data.badgeBn ?? "আস্থার ক্লায়েন্ট") : t("Trusted clients", "আস্থার ক্লায়েন্ট")}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/order" className="btn btn-primary">
                {cta?.data ? t(cta.data.primaryEn ?? "Order Now", cta.data.primaryBn ?? "অর্ডার করুন") : t("Order Now", "অর্ডার করুন")}
              </Link>
              <a href={whatsappLink(settings.whatsappUrl, heroMessage)} target="_blank" rel="noreferrer" className="btn btn-whatsapp">
                <MessageCircle className="h-4 w-4" /> {cta?.data ? t(cta.data.secondaryEn ?? "WhatsApp", cta.data.secondaryBn ?? "হোয়াটসঅ্যাপ") : t("WhatsApp", "হোয়াটসঅ্যাপ")}
              </a>
              <a href={`tel:${settings.phone}`} className="btn btn-outline">
                <Phone className="h-4 w-4" /> {settings.phone}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-pad" id="stats">
        <div className="container-page">
          {statsBlock?.titleEn && <SectionHeading titleEn={statsBlock.titleEn} titleBn={statsBlock.titleBn} subtitleEn={statsBlock.subtitleEn} subtitleBn={statsBlock.subtitleBn} />}
          <div className="grid gap-8 sm:grid-cols-3 sm:gap-0">
            {visibleStats.map((stat, index) => (
              <Reveal key={stat.id} delay={index * 0.08} className={`flex flex-col items-center text-center ${index > 0 ? "sm:border-l sm:border-slate-200" : ""}`}>
                <span className="icon-badge tint-rose"><DynamicIcon name={stat.icon} /></span>
                <p className="mt-4 font-bold text-brand">{t(stat.labelEn, stat.labelBn)}</p>
                <div className="mt-2"><CountUp value={stat.value} suffix={lang === "bn" ? stat.suffixBn : stat.suffixEn} /></div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-slate-50/60" id="portfolio">
        <div className="container-page">
          <SectionHeading titleEn={portfolioBlock?.titleEn ?? "Previous built sites"} titleBn={portfolioBlock?.titleBn ?? "আমাদের তৈরি সাইট"} subtitleEn={portfolioBlock?.subtitleEn} subtitleBn={portfolioBlock?.subtitleBn} />
          {visiblePortfolio.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {visiblePortfolio.slice(0, 6).map((item, index) => (
                <Reveal key={item.id} delay={index * 0.05}><PortfolioCard item={item} /></Reveal>
              ))}
            </div>
          ) : (
            <Reveal className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <p className="font-semibold text-heading">{t("Our project showcase is being refreshed.", "আমাদের প্রজেক্ট শোকেস হালনাগাদ করা হচ্ছে।")}</p>
              <p className="mt-2 text-sm text-muted">{t("Call or WhatsApp us to request recent work samples before ordering.", "অর্ডারের আগে সাম্প্রতিক কাজের নমুনা দেখতে কল বা হোয়াটসঅ্যাপ করুন।")}</p>
            </Reveal>
          )}
          <div className="mt-8 text-center">
            <Link href="/portfolio" className="btn btn-outline">{t("View full portfolio", "সম্পূর্ণ পোর্টফোলিও দেখুন")} <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      <section className="section-pad" id="payments">
        <div className="container-page">
          <SectionHeading titleEn={paymentsBlock?.titleEn ?? "Our payment methods"} titleBn={paymentsBlock?.titleBn ?? "আমাদের পেমেন্ট পদ্ধতি সমূহ"} subtitleEn={paymentsBlock?.subtitleEn} subtitleBn={paymentsBlock?.subtitleBn} />
          <div className="flex flex-wrap items-center justify-center gap-4">
            {visibleMethods.map((method) => <PaymentBadge key={method.id} method={method} />)}
          </div>
          <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-slate-100 bg-white p-5 text-center shadow-sm">
            <p className="text-sm text-muted">
              {t(
                `SSLCommerz checkout: ${data.payment.sslEnabled ? "available" : "available on request"}. Manual bKash: ${data.payment.bkashEnabled ? data.payment.bkashNumber : "currently unavailable"}.`,
                `SSLCommerz চেকআউট: ${data.payment.sslEnabled ? "সচল" : "অনুরোধে চালু করা যায়"}। ম্যানুয়াল বিকাশ: ${data.payment.bkashEnabled ? data.payment.bkashNumber : "বর্তমানে বন্ধ"}।`,
              )}
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <Link href="/order" className="btn btn-primary">{t("Proceed to checkout", "চেকআউটে যান")}</Link>
              <a href={whatsappLink(settings.whatsappUrl, heroMessage)} target="_blank" rel="noreferrer" className="btn btn-whatsapp">
                <MessageCircle className="h-4 w-4" /> {t("Pre-order inquiry", "অর্ডারের আগে অনুসন্ধান")}
              </a>
            </div>
          </div>
        </div>
      </section>

      {selected && <PackageModal pkg={selected} settings={settings} onClose={() => setSelected(null)} />}
    </>
  );
}
