import { sql } from "drizzle-orm";
import { db } from "./index";
import {
  contentBlocks, featureItems, footerColumns, footerLinks, navLinks, packages, pages,
  paymentMethods, paymentSettings, portfolioItems, siteSettings, stats, whyItems,
} from "./schema";

const features = (items: string[]) => JSON.stringify(items);

async function seedSingletons() {
  await db.insert(siteSettings).values({ id: 1 }).onConflictDoNothing();
  await db.insert(paymentSettings).values({ id: 1 }).onConflictDoNothing();

  const blocks = [
    {
      key: "hero",
      titleEn: "Hand over your responsibility to us",
      titleBn: "ব্যবসা আপনার দায়িত্ব আমাদের",
      subtitleEn: "From business websites to custom web apps — we design, build and support your digital presence so you can focus on growth.",
      subtitleBn: "আপনার ব্যবসার ওয়েবসাইট থেকে কাস্টম ওয়েব অ্যাপ — আমরা ডিজাইন, ডেভেলপ ও সাপোর্ট দিই, আপনি মনোযোগ দিন ব্যবসার বৃদ্ধিতে।",
      dataJson: JSON.stringify({
        badgeEn: "3000+ happy clients",
        badgeBn: "৩০০০+ এর বেশি ক্লাইন্ট",
        primaryEn: "Call Now",
        primaryBn: "কল করুন",
        secondaryEn: "WhatsApp Chat",
        secondaryBn: "হোয়াটসঅ্যাপ চ্যাট",
      }),
    },
    {
      key: "why",
      titleEn: "Why choose our service?",
      titleBn: "কেন আমাদের সার্ভিস নিবেন?",
      subtitleEn: "We are working with modern technology to deliver complete digital solutions for your business.",
      subtitleBn: "আপনার ব্যবসার জন্য আধুনিক প্রযুক্তি নিয়ে আমরা কাজ করছি একটি সম্পূর্ণ ডিজিটাল সলিউশন পৌঁছে দিতে।",
    },
    {
      key: "services",
      titleEn: "Our services & website packages for you",
      titleBn: "আপনার জন্য আমাদের সেবা সমূহ",
      subtitleEn: "Pick a ready package or request a custom quote — every project includes clear communication and support.",
      subtitleBn: "রেডি প্যাকেজ বেছে নিন অথবা কাস্টম কোটেশন নিন — প্রতিটি প্রজেক্টে থাকছে পরিষ্কার যোগাযোগ ও সাপোর্ট।",
    },
    {
      key: "features",
      titleEn: "Our features & key highlights",
      titleBn: "আমাদের বৈশিষ্ট্য সমূহ",
      subtitleEn: "Quality, speed and long-term reliability are built into every delivery.",
      subtitleBn: "প্রতিটি ডেলিভারিতে আমরা নিশ্চিত করি মান, গতি ও দীর্ঘমেয়াদি নির্ভরযোগ্যতা।",
    },
    {
      key: "cta",
      titleEn: "We are ready to build the web solution your business needs",
      titleBn: "আপনার ওয়েবসাইট তৈরির জন্য আমরা প্রস্তুত",
      subtitleEn: "Tell us about your business. We will suggest the right package, timeline and budget — then build, launch and support it.",
      subtitleBn: "আপনার ব্যবসার কথা বলুন। আমরা সঠিক প্যাকেজ, সময় ও বাজেট প্রস্তাব করব — তারপর তৈরি, লঞ্চ ও সাপোর্ট দেব।",
      imageUrl: "",
      dataJson: JSON.stringify({
        badgeEn: "3000+ happy clients",
        badgeBn: "৩০০০+ এর বেশি ক্লাইন্ট",
        primaryEn: "Order Now",
        primaryBn: "অর্ডার করুন",
        secondaryEn: "WhatsApp",
        secondaryBn: "হোয়াটসঅ্যাপ",
      }),
    },
    {
      key: "stats",
      titleEn: "Trusted by clients, proven by delivery",
      titleBn: "ক্লায়েন্টের আস্থা, ডেলিভারির প্রমাণ",
      subtitleEn: "A snapshot of the work and relationships we have built.",
      subtitleBn: "আমাদের কাজ ও সম্পর্কের একটি সংক্ষিপ্ত চিত্র।",
    },
    {
      key: "portfolio",
      titleEn: "Previous built sites & client trust",
      titleBn: "আমাদের তৈরি সাইট ও ক্লায়েন্ট আস্থা",
      subtitleEn: "Browse real projects before you order. Each entry is managed from the admin dashboard.",
      subtitleBn: "অর্ডারের আগে আমাদের তৈরি প্রজেক্ট দেখুন। প্রতিটি এন্ট্রি অ্যাডমিন ড্যাশবোর্ড থেকে নিয়ন্ত্রিত।",
    },
    {
      key: "payments",
      titleEn: "Our payment methods",
      titleBn: "আমাদের পেমেন্ট পদ্ধতি সমূহ",
      subtitleEn: "Pay securely with SSLCommerz or manual bKash. You can also chat on WhatsApp before ordering.",
      subtitleBn: "SSLCommerz অথবা ম্যানুয়াল বিকাশে নিরাপদে পেমেন্ট করুন। অর্ডারের আগে হোয়াটসঅ্যাপে কথাও বলতে পারেন।",
    },
  ];
  for (const block of blocks) {
    await db.insert(contentBlocks).values(block).onConflictDoNothing();
  }

  const pageRows = [
    {
      slug: "about",
      titleEn: "About Silk City Tech",
      titleBn: "সিল্ক সিটি টেক সম্পর্কে",
      contentEn: "## Who we are\nSilk City Tech (tech.silkcitygroup.com.bd) is the technology wing of Tech Silk City Group, based in Rajshahi, Bangladesh. We help small businesses, startups and organizations launch reliable websites and web applications.\n\n## What we do\n- Business and corporate websites\n- E-commerce stores and payment integration\n- Custom web apps, dashboards and portals\n- WordPress/CMS, SEO, speed optimization and maintenance\n\n## How we work\n1. Understand your business and goals.\n2. Propose a clear scope, timeline and budget.\n3. Design, develop, test and launch.\n4. Provide support, training and improvements.\n\n## Visit or contact us\nMango Tower, Sopura, Boalia, Rajshahi-6203\nPhone / WhatsApp: 01712631560",
      contentBn: "## আমরা কারা\nসিল্ক সিটি টেক (tech.silkcitygroup.com.bd) রাজশাহীভিত্তিক টেক সিল্ক সিটি গ্রুপের প্রযুক্তি বিভাগ। আমরা ছোট ব্যবসা, স্টার্টআপ ও প্রতিষ্ঠানকে নির্ভরযোগ্য ওয়েবসাইট ও ওয়েব অ্যাপ্লিকেশন লঞ্চ করতে সাহায্য করি।\n\n## আমরা যা করি\n- বিজনেস ও কর্পোরেট ওয়েবসাইট\n- ই-কমার্স স্টোর ও পেমেন্ট ইন্টিগ্রেশন\n- কাস্টম ওয়েব অ্যাপ, ড্যাশবোর্ড ও পোর্টাল\n- WordPress/CMS, এসইও, স্পিড অপটিমাইজেশন ও মেইনটেন্যান্স\n\n## আমাদের কাজের ধাপ\n১. আপনার ব্যবসা ও লক্ষ্য বোঝা।\n২. পরিষ্কার স্কোপ, সময় ও বাজেট প্রস্তাব।\n৩. ডিজাইন, ডেভেলপ, টেস্ট ও লঞ্চ।\n৪. সাপোর্ট, ট্রেনিং ও উন্নয়ন।\n\n## যোগাযোগ\nম্যাঙ্গো টাওয়ার, সপুরা, বোয়ালিয়া, রাজশাহী-৬২০৩\nফোন / হোয়াটসঅ্যাপ: ০১৭১২-৬৩১৫৬০",
    },
    {
      slug: "privacy-policy",
      titleEn: "Privacy Policy",
      titleBn: "প্রাইভেসি পলিসি",
      contentEn: "## Overview\nThis policy explains how Silk City Tech collects, uses and protects information when you use tech.silkcitygroup.com.bd, place an order or contact us.\n\n## Information we collect\n- Contact details you submit: name, phone, email and address.\n- Order details: selected package, notes, payment method and transaction reference.\n- Technical data needed for security and site operation.\n\n## How we use information\n- To respond to inquiries and deliver services.\n- To verify manual bKash payments and process SSLCommerz checkout.\n- To improve our website and prevent fraud.\n\n## Payment data\nCard and mobile-banking credentials are entered on SSLCommerz's secure gateway, not on our servers. For manual bKash we store only the sender number and TrxID you submit for verification.\n\n## Sharing and retention\nWe do not sell personal data. We share information only with service providers needed to fulfil your request, or when required by law. We keep records only as long as needed for service, accounting and legal purposes.\n\n## Your choices\nYou may request access, correction or deletion of your data by contacting 01712631560 or info@silkcitygroup.com.bd.\n\n## Updates\nWe may update this policy. The latest version will always be published on this page.",
      contentBn: "## সারাংশ\nএই পলিসিতে ব্যাখ্যা করা হয়েছে tech.silkcitygroup.com.bd ব্যবহার, অর্ডার বা যোগাযোগের সময় সিল্ক সিটি টেক কীভাবে তথ্য সংগ্রহ, ব্যবহার ও সুরক্ষিত রাখে।\n\n## আমরা যে তথ্য সংগ্রহ করি\n- আপনার দেওয়া যোগাযোগ তথ্য: নাম, ফোন, ইমেইল ও ঠিকানা।\n- অর্ডার তথ্য: প্যাকেজ, নোট, পেমেন্ট পদ্ধতি ও ট্রানজেকশন রেফারেন্স।\n- নিরাপত্তা ও সাইট পরিচালনার জন্য প্রয়োজনীয় টেকনিক্যাল তথ্য।\n\n## তথ্য ব্যবহারের উদ্দেশ্য\n- অনুসন্ধানের উত্তর ও সেবা প্রদান।\n- ম্যানুয়াল বিকাশ পেমেন্ট যাচাই ও SSLCommerz চেকআউট প্রক্রিয়া।\n- ওয়েবসাইট উন্নয়ন ও প্রতারণা প্রতিরোধ।\n\n## পেমেন্ট তথ্য\nকার্ড ও মোবাইল ব্যাংকিং তথ্য আমাদের সার্ভারে নয়, SSLCommerz-এর নিরাপদ গেটওয়েতে দেওয়া হয়। ম্যানুয়াল বিকাশে আমরা শুধু আপনার দেওয়া সেন্ডার নম্বর ও TrxID সংরক্ষণ করি।\n\n## শেয়ারিং ও সংরক্ষণ\nআমরা ব্যক্তিগত তথ্য বিক্রি করি না। সেবা প্রদানের জন্য প্রয়োজনীয় প্রোভাইডার বা আইনি বাধ্যবাধকতা ছাড়া তথ্য শেয়ার করি না। সেবা, হিসাবরক্ষণ ও আইনি প্রয়োজন অনুযায়ী রেকর্ড রাখি।\n\n## আপনার অধিকার\nতথ্য দেখা, সংশোধন বা মুছে ফেলার অনুরোধ করতে ০১৭১২-৬৩১৫৬০ বা info@silkcitygroup.com.bd-এ যোগাযোগ করুন।\n\n## হালনাগাদ\nআমরা এই পলিসি হালনাগাদ করতে পারি। সর্বশেষ সংস্করণ এই পেজে প্রকাশিত হবে।",
    },
    {
      slug: "terms",
      titleEn: "Terms & Conditions",
      titleBn: "টার্মস ও কন্ডিশন",
      contentEn: "## Acceptance\nBy ordering or using services from Silk City Tech you agree to these terms.\n\n## Scope and delivery\nProject scope, price, timeline and revisions are confirmed before work begins. Delivery dates depend on timely content, feedback and approvals from the client.\n\n## Payments\nManual bKash orders are verified against sender number and TrxID. SSLCommerz payments are confirmed through gateway validation. Work may begin after payment verification unless otherwise agreed.\n\n## Revisions and support\nEach package includes the stated revisions and support period. Additional features, pages or integrations may be quoted separately.\n\n## Client responsibilities\nYou confirm that content, logos and materials you provide are lawful and that you have permission to use them.\n\n## Intellectual property\nAfter full payment, final deliverables are transferred as agreed. Third-party themes, plugins, fonts and libraries remain under their own licenses.\n\n## Refunds and cancellation\nRefund eligibility depends on work completed and agreed scope. Contact us before opening a dispute so we can resolve issues quickly.\n\n## Limitation\nWe are not liable for indirect losses caused by third-party hosting, gateways, plugins or services outside our control.\n\n## Contact\nMango Tower, Sopura, Boalia, Rajshahi-6203. Phone / WhatsApp: 01712631560.",
      contentBn: "## সম্মতি\nসিল্ক সিটি টেক থেকে অর্ডার বা সেবা ব্যবহার করলে আপনি এই শর্তাবলিতে সম্মত হন।\n\n## স্কোপ ও ডেলিভারি\nকাজ শুরুর আগে প্রজেক্ট স্কোপ, মূল্য, সময় ও রিভিশন নিশ্চিত করা হয়। ক্লায়েন্টের সময়মতো কনটেন্ট, ফিডব্যাক ও অনুমোদনের ওপর ডেলিভারি সময় নির্ভর করে।\n\n## পেমেন্ট\nম্যানুয়াল বিকাশ অর্ডার সেন্ডার নম্বর ও TrxID দিয়ে যাচাই করা হয়। SSLCommerz পেমেন্ট গেটওয়ে ভ্যালিডেশনের মাধ্যমে নিশ্চিত করা হয়। আলাদা সমঝোতা না থাকলে পেমেন্ট যাচাইয়ের পর কাজ শুরু হয়।\n\n## রিভিশন ও সাপোর্ট\nপ্রতিটি প্যাকেজে উল্লেখিত রিভিশন ও সাপোর্ট সময় থাকে। অতিরিক্ত ফিচার, পেজ বা ইন্টিগ্রেশনের জন্য আলাদা কোটেশন হতে পারে।\n\n## ক্লায়েন্টের দায়িত্ব\nআপনি নিশ্চিত করেন যে আপনার দেওয়া কনটেন্ট, লোগো ও উপকরণ বৈধ এবং ব্যবহারের অনুমতি আছে।\n\n## মেধাস্বত্ব\nসম্পূর্ণ পেমেন্টের পর চূড়ান্ত ডেলিভারেবল চুক্তি অনুযায়ী হস্তান্তর করা হয়। থার্ড-পার্টি থিম, প্লাগইন, ফন্ট ও লাইব্রেরি নিজ নিজ লাইসেন্সের অধীনে থাকে।\n\n## রিফান্ড ও বাতিল\nসম্পন্ন কাজ ও সম্মত স্কোপের ওপর রিফান্ড যোগ্যতা নির্ভর করে। সমস্যা দ্রুত সমাধানে ডিসপিউট খোলার আগে আমাদের সাথে যোগাযোগ করুন।\n\n## সীমাবদ্ধতা\nআমাদের নিয়ন্ত্রণের বাইরের হোস্টিং, গেটওয়ে, প্লাগইন বা সেবার কারণে পরোক্ষ ক্ষতির জন্য আমরা দায়ী নই।\n\n## যোগাযোগ\nম্যাঙ্গো টাওয়ার, সপুরা, বোয়ালিয়া, রাজশাহী-৬২০৩। ফোন / হোয়াটসঅ্যাপ: ০১৭১২-৬৩১৫৬০।",
    },
    {
      slug: "contact",
      titleEn: "Contact us",
      titleBn: "যোগাযোগ করুন",
      contentEn: "## Let's talk about your project\nCall or WhatsApp 01712631560, or send the form below. We usually reply within business hours.\n\n## Office\nMango Tower, Sopura, Boalia, Rajshahi-6203",
      contentBn: "## আপনার প্রজেক্ট নিয়ে কথা বলি\n০১৭১২-৬৩১৫৬০ নম্বরে কল বা হোয়াটসঅ্যাপ করুন, অথবা নিচের ফর্ম পাঠান। আমরা সাধারণত কর্মঘণ্টার মধ্যে উত্তর দিই।\n\n## অফিস\nম্যাঙ্গো টাওয়ার, সপুরা, বোয়ালিয়া, রাজশাহী-৬২০৩",
    },
  ];
  for (const page of pageRows) {
    await db.insert(pages).values(page).onConflictDoNothing();
  }
}

async function seedCollections() {
  const [{ count: navCount }] = await db.select({ count: sql<number>`count(*)` }).from(navLinks);
  if (navCount === 0) {
    await db.insert(navLinks).values([
      { labelEn: "Home", labelBn: "হোম", href: "/", location: "header", sortOrder: 1 },
      { labelEn: "Services / Packages", labelBn: "সার্ভিস সমূহ", href: "/#services", location: "header", sortOrder: 2 },
      { labelEn: "Portfolio", labelBn: "পোর্টফোলিও", href: "/portfolio", location: "header", sortOrder: 3 },
      { labelEn: "About", labelBn: "আমাদের কথা", href: "/about", location: "header", sortOrder: 4 },
      { labelEn: "Contact", labelBn: "যোগাযোগ", href: "/contact", location: "header", sortOrder: 5 },
      { labelEn: "Privacy Policy", labelBn: "প্রাইভেসি পলিসি", href: "/privacy-policy", location: "header", sortOrder: 6, visible: false },
      { labelEn: "Terms", labelBn: "শর্তাবলি", href: "/terms", location: "header", sortOrder: 7, visible: false },
      { labelEn: "WhatsApp", labelBn: "হোয়াটসঅ্যাপ", href: "https://wa.me/8801712631560", location: "utility", sortOrder: 1 },
    ]);
  }

  const [{ count: footerColCount }] = await db.select({ count: sql<number>`count(*)` }).from(footerColumns);
  if (footerColCount === 0) {
    const cols = await db.insert(footerColumns).values([
      { titleEn: "Contact Info", titleBn: "যোগাযোগ তথ্য", sortOrder: 1 },
      { titleEn: "Legal & Quick Links", titleBn: "লিগ্যাল ও কুইক লিংক", sortOrder: 2 },
      { titleEn: "Services", titleBn: "সার্ভিস সমূহ", sortOrder: 3 },
      { titleEn: "Connect", titleBn: "কানেক্ট", sortOrder: 4 },
    ]).returning();
    const [contact, legal, services, connect] = cols;
    await db.insert(footerLinks).values([
      { columnId: contact.id, labelEn: "01712631560", labelBn: "০১৭১২-৬৩১৫৬০", href: "tel:01712631560", sortOrder: 1 },
      { columnId: contact.id, labelEn: "info@silkcitygroup.com.bd", labelBn: "info@silkcitygroup.com.bd", href: "mailto:info@silkcitygroup.com.bd", sortOrder: 2 },
      { columnId: contact.id, labelEn: "Mango Tower, Sopura, Boalia, Rajshahi-6203", labelBn: "ম্যাঙ্গো টাওয়ার, সপুরা, বোয়ালিয়া, রাজশাহী-৬২০৩", href: "/contact", sortOrder: 3 },
      { columnId: legal.id, labelEn: "About", labelBn: "আমাদের কথা", href: "/about", sortOrder: 1 },
      { columnId: legal.id, labelEn: "Contact", labelBn: "যোগাযোগ", href: "/contact", sortOrder: 2 },
      { columnId: legal.id, labelEn: "Privacy Policy", labelBn: "প্রাইভেসি পলিসি", href: "/privacy-policy", sortOrder: 3 },
      { columnId: legal.id, labelEn: "Terms", labelBn: "শর্তাবলি", href: "/terms", sortOrder: 4 },
      { columnId: services.id, labelEn: "Business Website", labelBn: "বিজনেস ওয়েবসাইট", href: "/order?package=business-website", sortOrder: 1 },
      { columnId: services.id, labelEn: "E-Commerce Website", labelBn: "ই-কমার্স ওয়েবসাইট", href: "/order?package=e-commerce-website", sortOrder: 2 },
      { columnId: services.id, labelEn: "Custom Web App", labelBn: "কাস্টম ওয়েব অ্যাপ", href: "/order?package=custom-web-app", sortOrder: 3 },
      { columnId: services.id, labelEn: "SEO & Speed", labelBn: "এসইও ও স্পিড", href: "/order?package=seo-speed", sortOrder: 4 },
      { columnId: connect.id, labelEn: "WhatsApp Chat", labelBn: "হোয়াটসঅ্যাপ চ্যাট", href: "https://wa.me/8801712631560", sortOrder: 1 },
      { columnId: connect.id, labelEn: "Order a Package", labelBn: "প্যাকেজ অর্ডার", href: "/order", sortOrder: 2 },
      { columnId: connect.id, labelEn: "Portfolio", labelBn: "পোর্টফোলিও", href: "/portfolio", sortOrder: 3 },
    ]);
  }

  const [{ count: whyCount }] = await db.select({ count: sql<number>`count(*)` }).from(whyItems);
  if (whyCount === 0) {
    await db.insert(whyItems).values([
      { icon: "Users", titleEn: "Expert developers", titleBn: "দক্ষ ডেভেলপার", descriptionEn: "A practical team for modern, maintainable web solutions.", descriptionBn: "আধুনিক ও রক্ষণাবেক্ষণযোগ্য ওয়েব সলিউশনের জন্য অভিজ্ঞ টিম।", sortOrder: 1 },
      { icon: "Palette", titleEn: "Unique graphics design", titleBn: "অনিক গ্রাফিক্স ডিজাইনার", descriptionEn: "Clean, brand-focused visuals that make your business memorable.", descriptionBn: "পরিচ্ছন্ন ও ব্র্যান্ড-কেন্দ্রিক ভিজ্যুয়াল, যা আপনার ব্যবসাকে মনে রাখার মতো করে।", sortOrder: 2 },
      { icon: "Timer", titleEn: "Fast delivery", titleBn: "দ্রুত ডেলিভারি", descriptionEn: "Clear milestones and on-time launch without compromising quality.", descriptionBn: "মান বজায় রেখে পরিষ্কার মাইলস্টোন ও সময়মতো লঞ্চ।", sortOrder: 3 },
      { icon: "BadgeCheck", titleEn: "Proven experience", titleBn: "সফল অভিজ্ঞতা", descriptionEn: "Experience across business sites, stores, portals and campaigns.", descriptionBn: "বিজনেস সাইট, স্টোর, পোর্টাল ও ক্যাম্পেইনে বাস্তব অভিজ্ঞতা।", sortOrder: 4 },
      { icon: "ListChecks", titleEn: "Complete project management", titleBn: "পূর্ণ প্রজেক্ট ম্যানেজমেন্ট", descriptionEn: "One point of contact from requirement to launch and support.", descriptionBn: "রিকোয়ারমেন্ট থেকে লঞ্চ ও সাপোর্ট পর্যন্ত একক যোগাযোগ।", sortOrder: 5 },
      { icon: "Headphones", titleEn: "Reliable support", titleBn: "নির্ভরযোগ্য সাপোর্ট", descriptionEn: "Friendly help after delivery, not just before the sale.", descriptionBn: "বিক্রির আগে নয়, ডেলিভারির পরেও আন্তরিক সহায়তা।", sortOrder: 6 },
    ]);
  }

  const [{ count: pkgCount }] = await db.select({ count: sql<number>`count(*)` }).from(packages);
  if (pkgCount === 0) {
    await db.insert(packages).values([
      {
        slug: "business-website", nameEn: "Business Website", nameBn: "এক্সক্লুসিভ ওয়েবসাইট ডেভেলপমেন্ট",
        descriptionEn: "A professional company website with service pages, contact form and mobile-first design.",
        descriptionBn: "সার্ভিস পেজ, কন্টাক্ট ফর্ম ও মোবাইল-ফার্স্ট ডিজাইনসহ প্রফেশনাল কোম্পানি ওয়েবসাইট।",
        priceBdt: 15000, icon: "Laptop", tint: "pink", deliveryDays: 7, revisions: 2, sortOrder: 1,
        featuresEn: features(["Up to 6 pages", "Mobile responsive", "Contact / inquiry form", "Basic SEO setup", "1 month support"]),
        featuresBn: features(["৬টি পর্যন্ত পেজ", "মোবাইল রেসপন্সিভ", "কন্টাক্ট / অনুসন্ধান ফর্ম", "বেসিক এসইও সেটআপ", "১ মাস সাপোর্ট"]),
      },
      {
        slug: "graphics-design", nameEn: "Graphics & Brand Design", nameBn: "গ্রাফিক্স ডিজাইন",
        descriptionEn: "Logo, social media kit, banners and brand assets for a consistent identity.",
        descriptionBn: "লোগো, সোশ্যাল মিডিয়া কিট, ব্যানার ও ব্র্যান্ড অ্যাসেট — একটি সামঞ্জস্যপূর্ণ আইডেন্টিটির জন্য।",
        priceBdt: 8000, icon: "PenTool", tint: "lavender", deliveryDays: 5, revisions: 3, sortOrder: 2,
        featuresEn: features(["Logo concept", "Social media kit", "Banner set", "Source files", "Brand color guide"]),
        featuresBn: features(["লোগো কনসেপ্ট", "সোশ্যাল মিডিয়া কিট", "ব্যানার সেট", "সোর্স ফাইল", "ব্র্যান্ড কালার গাইড"]),
      },
      {
        slug: "wordpress-cms", nameEn: "WordPress / CMS", nameBn: "ওয়ার্ডপ্রেস / CMS ডিজাইন",
        descriptionEn: "Editable WordPress or CMS site with training so your team can update content.",
        descriptionBn: "এডিটযোগ্য WordPress বা CMS সাইট, ট্রেনিংসহ — যাতে আপনার টিম কনটেন্ট আপডেট করতে পারে।",
        priceBdt: 18000, icon: "LayoutTemplate", tint: "mint", deliveryDays: 8, revisions: 2, sortOrder: 3,
        featuresEn: features(["CMS setup", "Theme customization", "Blog / news module", "Admin training", "Security basics"]),
        featuresBn: features(["CMS সেটআপ", "থিম কাস্টমাইজেশন", "ব্লগ / নিউজ মডিউল", "অ্যাডমিন ট্রেনিং", "বেসিক সিকিউরিটি"]),
      },
      {
        slug: "e-commerce-website", nameEn: "E-Commerce Website", nameBn: "ই-কমার্স ওয়েবসাইট",
        descriptionEn: "Online store with product catalog, cart, checkout and payment integration.",
        descriptionBn: "প্রোডাক্ট ক্যাটালগ, কার্ট, চেকআউট ও পেমেন্ট ইন্টিগ্রেশনসহ অনলাইন স্টোর।",
        priceBdt: 35000, icon: "ShoppingCart", tint: "cream", deliveryDays: 14, revisions: 2, popular: true, sortOrder: 4,
        featuresEn: features(["Product & order management", "Cart and checkout", "SSLCommerz / bKash", "Order dashboard", "2 months support"]),
        featuresBn: features(["প্রোডাক্ট ও অর্ডার ম্যানেজমেন্ট", "কার্ট ও চেকআউট", "SSLCommerz / বিকাশ", "অর্ডার ড্যাশবোর্ড", "২ মাস সাপোর্ট"]),
      },
      {
        slug: "custom-web-app", nameEn: "Custom Web App", nameBn: "ওয়েব অ্যাপ ডেভেলপমেন্ট",
        descriptionEn: "Tailored dashboards, portals, booking systems and business automation.",
        descriptionBn: "কাস্টম ড্যাশবোর্ড, পোর্টাল, বুকিং সিস্টেম ও বিজনেস অটোমেশন।",
        priceBdt: 50000, icon: "Code2", tint: "cyan", deliveryDays: 21, revisions: 2, sortOrder: 5,
        featuresEn: features(["Requirement analysis", "Custom database", "Role-based access", "API integrations", "Deployment & handover"]),
        featuresBn: features(["রিকোয়ারমেন্ট অ্যানালাইসিস", "কাস্টম ডাটাবেস", "রোল-ভিত্তিক অ্যাক্সেস", "API ইন্টিগ্রেশন", "ডিপ্লয়মেন্ট ও হ্যান্ডওভার"]),
      },
      {
        slug: "maintenance-support", nameEn: "Maintenance & Support", nameBn: "সফটওয়্যার ডেভেলপমেন্ট",
        descriptionEn: "Updates, backups, monitoring, fixes and priority support for existing sites.",
        descriptionBn: "বিদ্যমান সাইটের আপডেট, ব্যাকআপ, মনিটরিং, ফিক্স ও প্রায়োরিটি সাপোর্ট।",
        priceBdt: 5000, icon: "LifeBuoy", tint: "peach", deliveryDays: 3, revisions: 1, sortOrder: 6,
        featuresEn: features(["Monthly updates", "Backup check", "Uptime monitoring", "Bug fixes", "Priority WhatsApp support"]),
        featuresBn: features(["মাসিক আপডেট", "ব্যাকআপ চেক", "আপটাইম মনিটরিং", "বাগ ফিক্স", "প্রায়োরিটি হোয়াটসঅ্যাপ সাপোর্ট"]),
      },
      {
        slug: "seo-speed", nameEn: "SEO & Speed Optimization", nameBn: "এসইও ও স্পিড অপটিমাইজেশন",
        descriptionEn: "Technical SEO, metadata, sitemap, performance and Core Web Vitals improvements.",
        descriptionBn: "টেকনিক্যাল এসইও, মেটাডেটা, সাইটম্যাপ, পারফরম্যান্স ও Core Web Vitals উন্নয়ন।",
        priceBdt: 10000, icon: "Search", tint: "rose", deliveryDays: 5, revisions: 1, sortOrder: 7,
        featuresEn: features(["SEO audit", "Meta & schema setup", "Sitemap / robots", "Speed optimization", "Before / after report"]),
        featuresBn: features(["এসইও অডিট", "মেটা ও স্কিমা সেটআপ", "সাইটম্যাপ / robots", "স্পিড অপটিমাইজেশন", "আগে / পরে রিপোর্ট"]),
      },
      {
        slug: "custom-order", nameEn: "Custom Order / Add-on", nameBn: "ডিজিটাল মার্কেটিং",
        descriptionEn: "Digital marketing, integrations, extra pages or a fully custom requirement.",
        descriptionBn: "ডিজিটাল মার্কেটিং, ইন্টিগ্রেশন, অতিরিক্ত পেজ বা সম্পূর্ণ কাস্টম রিকোয়ারমেন্ট।",
        priceBdt: 7000, icon: "Megaphone", tint: "sky", deliveryDays: 7, revisions: 2, sortOrder: 8,
        featuresEn: features(["Custom scope", "Flexible add-ons", "Campaign setup", "Integration help", "Quote after discussion"]),
        featuresBn: features(["কাস্টম স্কোপ", "ফ্লেক্সিবল অ্যাড-অন", "ক্যাম্পেইন সেটআপ", "ইন্টিগ্রেশন সহায়তা", "আলোচনার পর কোটেশন"]),
      },
    ]);
  }

  const [{ count: featureCount }] = await db.select({ count: sql<number>`count(*)` }).from(featureItems);
  if (featureCount === 0) {
    await db.insert(featureItems).values([
      { icon: "MonitorSmartphone", titleEn: "Responsive design", titleBn: "রেসপন্সিভ ডিজাইন", descriptionEn: "Looks and works beautifully on mobile, tablet and desktop.", descriptionBn: "মোবাইল, ট্যাবলেট ও ডেস্কটপে সুন্দর ও কার্যকর।", sortOrder: 1 },
      { icon: "Zap", titleEn: "Fast performance", titleBn: "দ্রুত পারফরম্যান্স", descriptionEn: "Optimized assets and clean code for quick loading pages.", descriptionBn: "দ্রুত লোডিং পেজের জন্য অপটিমাইজড অ্যাসেট ও পরিচ্ছন্ন কোড।", sortOrder: 2 },
      { icon: "SearchCheck", titleEn: "SEO-ready structure", titleBn: "এসইও-রেডি স্ট্রাকচার", descriptionEn: "Semantic markup, metadata, sitemap and search-friendly URLs.", descriptionBn: "সিমান্টিক মার্কআপ, মেটাডেটা, সাইটম্যাপ ও সার্চ-বান্ধব URL।", sortOrder: 3 },
      { icon: "ShieldCheck", titleEn: "Security best practices", titleBn: "সিকিউরিটি বেস্ট প্র্যাকটিস", descriptionEn: "Validated inputs, protected admin and secure payment flows.", descriptionBn: "ভ্যালিডেটেড ইনপুট, সুরক্ষিত অ্যাডমিন ও নিরাপদ পেমেন্ট ফ্লো।", sortOrder: 4 },
      { icon: "CalendarCheck", titleEn: "On-time delivery", titleBn: "সময়মতো ডেলিভারি", descriptionEn: "Milestones, previews and clear approvals keep launches predictable.", descriptionBn: "মাইলস্টোন, প্রিভিউ ও পরিষ্কার অনুমোদন — লঞ্চ হয় পরিকল্পনামাফিক।", sortOrder: 5 },
      { icon: "HeartHandshake", titleEn: "After-sales support", titleBn: "বিক্রয়োত্তর সাপোর্ট", descriptionEn: "Training, fixes and friendly help after your site goes live.", descriptionBn: "সাইট লাইভ হওয়ার পর ট্রেনিং, ফিক্স ও আন্তরিক সহায়তা।", sortOrder: 6 },
    ]);
  }

  const [{ count: statCount }] = await db.select({ count: sql<number>`count(*)` }).from(stats);
  if (statCount === 0) {
    await db.insert(stats).values([
      { labelEn: "Active Clients", labelBn: "এক্টিভ ক্লায়েন্ট", value: 50, suffixEn: "+", suffixBn: "+", icon: "Users", sortOrder: 1 },
      { labelEn: "Successful Projects", labelBn: "সফল প্রজেক্ট", value: 120, suffixEn: "+", suffixBn: "+", icon: "Rocket", sortOrder: 2 },
      { labelEn: "Years of Experience", labelBn: "অভিজ্ঞতার বছর", value: 3, suffixEn: "+", suffixBn: "+", icon: "Award", sortOrder: 3 },
    ]);
  }

  const [{ count: portfolioCount }] = await db.select({ count: sql<number>`count(*)` }).from(portfolioItems);
  if (portfolioCount === 0) {
    await db.insert(portfolioItems).values([
      {
        titleEn: "Corporate Business Website", titleBn: "কর্পোরেট বিজনেস ওয়েবসাইট",
        descriptionEn: "A clean company profile with services, team and inquiry flow.",
        descriptionBn: "সার্ভিস, টিম ও অনুসন্ধান ফ্লোসহ পরিচ্ছন্ন কোম্পানি প্রোফাইল।",
        categoryEn: "Business Website", categoryBn: "বিজনেস ওয়েবসাইট",
        techStack: features(["Next.js", "Tailwind CSS", "Turso"]),
        trustNoteEn: "Sample showcase entry — replace with a real client project from Admin → Portfolio.",
        trustNoteBn: "নমুনা শোকেস এন্ট্রি — Admin → Portfolio থেকে বাস্তব ক্লায়েন্ট প্রজেক্ট দিয়ে প্রতিস্থাপন করুন।",
        featured: true, visible: false, sortOrder: 1,
      },
      {
        titleEn: "E-Commerce Store", titleBn: "ই-কমার্স স্টোর",
        descriptionEn: "Product catalog, cart, checkout and order management.",
        descriptionBn: "প্রোডাক্ট ক্যাটালগ, কার্ট, চেকআউট ও অর্ডার ম্যানেজমেন্ট।",
        categoryEn: "E-Commerce", categoryBn: "ই-কমার্স",
        techStack: features(["Next.js", "SSLCommerz", "bKash"]),
        trustNoteEn: "Sample showcase entry — replace with a real client project from Admin → Portfolio.",
        trustNoteBn: "নমুনা শোকেস এন্ট্রি — Admin → Portfolio থেকে বাস্তব ক্লায়েন্ট প্রজেক্ট দিয়ে প্রতিস্থাপন করুন।",
        featured: true, visible: false, sortOrder: 2,
      },
      {
        titleEn: "Booking & Service Portal", titleBn: "বুকিং ও সার্ভিস পোর্টাল",
        descriptionEn: "Custom portal for bookings, customers and staff operations.",
        descriptionBn: "বুকিং, কাস্টমার ও স্টাফ অপারেশনের জন্য কাস্টম পোর্টাল।",
        categoryEn: "Web App", categoryBn: "ওয়েব অ্যাপ",
        techStack: features(["TypeScript", "Drizzle ORM", "Framer Motion"]),
        trustNoteEn: "Sample showcase entry — replace with a real client project from Admin → Portfolio.",
        trustNoteBn: "নমুনা শোকেস এন্ট্রি — Admin → Portfolio থেকে বাস্তব ক্লায়েন্ট প্রজেক্ট দিয়ে প্রতিস্থাপন করুন।",
        featured: false, visible: false, sortOrder: 3,
      },
    ]);
  }

  const [{ count: methodCount }] = await db.select({ count: sql<number>`count(*)` }).from(paymentMethods);
  if (methodCount === 0) {
    await db.insert(paymentMethods).values([
      { key: "sslcommerz", nameEn: "SSLCommerz", nameBn: "SSLCommerz", kind: "gateway", color: "#0b6e4f", sortOrder: 1 },
      { key: "bkash", nameEn: "bKash", nameBn: "বিকাশ", kind: "manual", color: "#e2136e", sortOrder: 2 },
      { key: "nagad", nameEn: "Nagad", nameBn: "নগদ", kind: "badge", color: "#f6921e", sortOrder: 3 },
      { key: "rocket", nameEn: "Rocket", nameBn: "রকেট", kind: "badge", color: "#8c3494", sortOrder: 4 },
      { key: "upay", nameEn: "Upay", nameBn: "উপায়", kind: "badge", color: "#f58220", sortOrder: 5 },
      { key: "cards", nameEn: "Visa / Mastercard", nameBn: "ভিসা / মাস্টারকার্ড", kind: "badge", color: "#1a1f71", sortOrder: 6 },
    ]);
  }
}

async function main() {
  console.log("Seeding Silk City Tech defaults…");
  await seedSingletons();
  await seedCollections();
  const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(packages);
  console.log(`Seed complete. Packages: ${count}. Admin password is read from ADMIN_PASSWORD.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
