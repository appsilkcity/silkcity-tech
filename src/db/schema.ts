import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

const id = () => text("id").primaryKey().$defaultFn(() => crypto.randomUUID());
const createdAt = () => integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`);
const updatedAt = () => integer("updated_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`);

export const siteSettings = sqliteTable("site_settings", {
  id: integer("id").primaryKey().default(1),
  siteName: text("site_name").notNull().default("tech.silkcitygroup.com.bd"),
  brandName: text("brand_name").notNull().default("Silk City Tech"),
  brandNameBn: text("brand_name_bn").notNull().default("সিল্ক সিটি টেক"),
  logoUrl: text("logo_url").notNull().default(""),
  faviconUrl: text("favicon_url").notNull().default("/icon.svg"),
  phone: text("phone").notNull().default("01712631560"),
  whatsappUrl: text("whatsapp_url").notNull().default("https://wa.me/8801712631560"),
  email: text("email").notNull().default("info@silkcitygroup.com.bd"),
  addressEn: text("address_en").notNull().default("Mango Tower, Sopura, Boalia, Rajshahi-6203"),
  addressBn: text("address_bn").notNull().default("ম্যাঙ্গো টাওয়ার, সপুরা, বোয়ালিয়া, রাজশাহী-৬২০৩"),
  facebookUrl: text("facebook_url").notNull().default("https://facebook.com/"),
  instagramUrl: text("instagram_url").notNull().default("https://instagram.com/"),
  linkedinUrl: text("linkedin_url").notNull().default("https://linkedin.com/"),
  youtubeUrl: text("youtube_url").notNull().default("https://youtube.com/"),
  seoTitleEn: text("seo_title_en").notNull().default("Silk City Tech — Website & Web Solution Partner in Rajshahi"),
  seoTitleBn: text("seo_title_bn").notNull().default("সিল্ক সিটি টেক — রাজশাহীর ওয়েবসাইট ও ওয়েব সলিউশন পার্টনার"),
  seoDescriptionEn: text("seo_description_en").notNull().default("Business websites, e-commerce, custom web apps, SEO and support from Silk City Tech, Rajshahi."),
  seoDescriptionBn: text("seo_description_bn").notNull().default("রাজশাহীর সিল্ক সিটি টেক থেকে বিজনেস ওয়েবসাইট, ই-কমার্স, কাস্টম ওয়েব অ্যাপ, এসইও ও সাপোর্ট নিন।"),
  seoKeywords: text("seo_keywords").notNull().default("website development rajshahi, silk city tech, e-commerce website, web app bangladesh"),
  ogImageUrl: text("og_image_url").notNull().default("/og.svg"),
  googleVerification: text("google_verification").notNull().default(""),
  footerTextEn: text("footer_text_en").notNull().default("Websites, web apps and digital growth — built with care in Rajshahi."),
  footerTextBn: text("footer_text_bn").notNull().default("রাজশাহীতে যত্নে তৈরি ওয়েবসাইট, ওয়েব অ্যাপ ও ডিজিটাল গ্রোথ সলিউশন।"),
  updatedAt: updatedAt(),
});

export const navLinks = sqliteTable("nav_links", {
  id: id(),
  labelEn: text("label_en").notNull(),
  labelBn: text("label_bn").notNull(),
  href: text("href").notNull(),
  location: text("location", { enum: ["header", "utility"] }).notNull().default("header"),
  sortOrder: integer("sort_order").notNull().default(0),
  visible: integer("visible", { mode: "boolean" }).notNull().default(true),
  createdAt: createdAt(),
});

export const footerColumns = sqliteTable("footer_columns", {
  id: id(),
  titleEn: text("title_en").notNull(),
  titleBn: text("title_bn").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  visible: integer("visible", { mode: "boolean" }).notNull().default(true),
});

export const footerLinks = sqliteTable("footer_links", {
  id: id(),
  columnId: text("column_id").notNull().references(() => footerColumns.id, { onDelete: "cascade" }),
  labelEn: text("label_en").notNull(),
  labelBn: text("label_bn").notNull(),
  href: text("href").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  visible: integer("visible", { mode: "boolean" }).notNull().default(true),
}, (table) => [index("footer_links_column_idx").on(table.columnId)]);

export const contentBlocks = sqliteTable("content_blocks", {
  key: text("key").primaryKey(),
  titleEn: text("title_en").notNull().default(""),
  titleBn: text("title_bn").notNull().default(""),
  subtitleEn: text("subtitle_en").notNull().default(""),
  subtitleBn: text("subtitle_bn").notNull().default(""),
  bodyEn: text("body_en").notNull().default(""),
  bodyBn: text("body_bn").notNull().default(""),
  imageUrl: text("image_url").notNull().default(""),
  dataJson: text("data_json").notNull().default("{}"),
  updatedAt: updatedAt(),
});

export const whyItems = sqliteTable("why_items", {
  id: id(),
  icon: text("icon").notNull().default("Sparkles"),
  titleEn: text("title_en").notNull(),
  titleBn: text("title_bn").notNull(),
  descriptionEn: text("description_en").notNull(),
  descriptionBn: text("description_bn").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  visible: integer("visible", { mode: "boolean" }).notNull().default(true),
});

export const packages = sqliteTable("packages", {
  id: id(),
  slug: text("slug").notNull(),
  nameEn: text("name_en").notNull(),
  nameBn: text("name_bn").notNull(),
  descriptionEn: text("description_en").notNull(),
  descriptionBn: text("description_bn").notNull(),
  priceBdt: integer("price_bdt").notNull(),
  featuresEn: text("features_en").notNull().default("[]"),
  featuresBn: text("features_bn").notNull().default("[]"),
  icon: text("icon").notNull().default("Globe"),
  tint: text("tint", { enum: ["pink", "lavender", "mint", "cream", "cyan", "peach", "rose", "sky"] }).notNull().default("mint"),
  deliveryDays: integer("delivery_days").notNull().default(7),
  revisions: integer("revisions").notNull().default(2),
  popular: integer("popular", { mode: "boolean" }).notNull().default(false),
  visible: integer("visible", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
}, (table) => [uniqueIndex("packages_slug_idx").on(table.slug)]);

export const featureItems = sqliteTable("feature_items", {
  id: id(),
  icon: text("icon").notNull().default("ShieldCheck"),
  titleEn: text("title_en").notNull(),
  titleBn: text("title_bn").notNull(),
  descriptionEn: text("description_en").notNull(),
  descriptionBn: text("description_bn").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  visible: integer("visible", { mode: "boolean" }).notNull().default(true),
});

export const stats = sqliteTable("stats", {
  id: id(),
  labelEn: text("label_en").notNull(),
  labelBn: text("label_bn").notNull(),
  value: integer("value").notNull().default(0),
  suffixEn: text("suffix_en").notNull().default("+"),
  suffixBn: text("suffix_bn").notNull().default("+"),
  icon: text("icon").notNull().default("Users"),
  sortOrder: integer("sort_order").notNull().default(0),
  visible: integer("visible", { mode: "boolean" }).notNull().default(true),
});

export const portfolioItems = sqliteTable("portfolio_items", {
  id: id(),
  titleEn: text("title_en").notNull(),
  titleBn: text("title_bn").notNull(),
  descriptionEn: text("description_en").notNull().default(""),
  descriptionBn: text("description_bn").notNull().default(""),
  categoryEn: text("category_en").notNull().default("Business Website"),
  categoryBn: text("category_bn").notNull().default("বিজনেস ওয়েবসাইট"),
  imageUrl: text("image_url").notNull().default(""),
  liveUrl: text("live_url").notNull().default(""),
  techStack: text("tech_stack").notNull().default("[]"),
  clientNameEn: text("client_name_en").notNull().default(""),
  clientNameBn: text("client_name_bn").notNull().default(""),
  trustNoteEn: text("trust_note_en").notNull().default(""),
  trustNoteBn: text("trust_note_bn").notNull().default(""),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  visible: integer("visible", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: createdAt(),
}, (table) => [index("portfolio_featured_idx").on(table.featured)]);

export const paymentSettings = sqliteTable("payment_settings", {
  id: integer("id").primaryKey().default(1),
  sslEnabled: integer("ssl_enabled", { mode: "boolean" }).notNull().default(false),
  sslStoreId: text("ssl_store_id").notNull().default(""),
  sslStorePassword: text("ssl_store_password").notNull().default(""),
  sslIsLive: integer("ssl_is_live", { mode: "boolean" }).notNull().default(false),
  bkashEnabled: integer("bkash_enabled", { mode: "boolean" }).notNull().default(true),
  bkashNumber: text("bkash_number").notNull().default("01712631560"),
  bkashInstructionsEn: text("bkash_instructions_en").notNull().default("Send Money / Payment to the bKash number below, then submit your sender number and TrxID."),
  bkashInstructionsBn: text("bkash_instructions_bn").notNull().default("নিচের বিকাশ নম্বরে Send Money / Payment করুন, তারপর আপনার সেন্ডার নম্বর ও TrxID জমা দিন।"),
  updatedAt: updatedAt(),
});

export const paymentMethods = sqliteTable("payment_methods", {
  id: id(),
  key: text("key").notNull(),
  nameEn: text("name_en").notNull(),
  nameBn: text("name_bn").notNull(),
  kind: text("kind", { enum: ["gateway", "manual", "badge"] }).notNull().default("badge"),
  imageUrl: text("image_url").notNull().default(""),
  color: text("color").notNull().default("#e2136e"),
  enabled: integer("enabled", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
}, (table) => [uniqueIndex("payment_methods_key_idx").on(table.key)]);

export const pages = sqliteTable("pages", {
  slug: text("slug").primaryKey(),
  titleEn: text("title_en").notNull(),
  titleBn: text("title_bn").notNull(),
  contentEn: text("content_en").notNull().default(""),
  contentBn: text("content_bn").notNull().default(""),
  updatedAt: updatedAt(),
});

export const orders = sqliteTable("orders", {
  id: id(),
  orderNumber: text("order_number").notNull(),
  packageId: text("package_id").references(() => packages.id, { onDelete: "set null" }),
  packageNameEn: text("package_name_en").notNull(),
  packageNameBn: text("package_name_bn").notNull(),
  amountBdt: integer("amount_bdt").notNull(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerEmail: text("customer_email").notNull().default(""),
  customerAddress: text("customer_address").notNull().default(""),
  notes: text("notes").notNull().default(""),
  language: text("language", { enum: ["bn", "en"] }).notNull().default("bn"),
  paymentMethod: text("payment_method", { enum: ["bkash", "sslcommerz"] }).notNull(),
  status: text("status", { enum: ["pending", "in_progress", "completed", "cancelled"] }).notNull().default("pending"),
  paymentStatus: text("payment_status", { enum: ["unpaid", "awaiting_verification", "paid", "failed", "refunded"] }).notNull().default("unpaid"),
  bkashSenderNumber: text("bkash_sender_number").notNull().default(""),
  bkashTrxId: text("bkash_trx_id").notNull().default(""),
  sslTranId: text("ssl_tran_id").notNull().default(""),
  sslValId: text("ssl_val_id").notNull().default(""),
  sslSessionKey: text("ssl_session_key").notNull().default(""),
  sslValidationJson: text("ssl_validation_json").notNull().default(""),
  adminNotes: text("admin_notes").notNull().default(""),
  paidAt: integer("paid_at", { mode: "timestamp" }),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
}, (table) => [
  uniqueIndex("orders_number_idx").on(table.orderNumber),
  uniqueIndex("orders_bkash_trx_idx").on(table.bkashTrxId).where(sql`bkash_trx_id <> ''`),
  index("orders_status_idx").on(table.status),
  index("orders_payment_status_idx").on(table.paymentStatus),
]);

export const inquiries = sqliteTable("inquiries", {
  id: id(),
  name: text("name").notNull(),
  email: text("email").notNull().default(""),
  phone: text("phone").notNull().default(""),
  message: text("message").notNull(),
  locale: text("locale", { enum: ["bn", "en"] }).notNull().default("bn"),
  status: text("status", { enum: ["new", "read", "archived"] }).notNull().default("new"),
  createdAt: createdAt(),
});

export const loginAttempts = sqliteTable("login_attempts", {
  key: text("key").primaryKey(),
  attempts: integer("attempts").notNull().default(0),
  resetAt: integer("reset_at").notNull(),
});

export const auditLogs = sqliteTable("audit_logs", {
  id: id(),
  action: text("action").notNull(),
  entity: text("entity").notNull(),
  entityId: text("entity_id").notNull().default(""),
  createdAt: createdAt(),
});

export type SiteSettings = typeof siteSettings.$inferSelect;
export type NavLink = typeof navLinks.$inferSelect;
export type FooterColumn = typeof footerColumns.$inferSelect;
export type FooterLink = typeof footerLinks.$inferSelect;
export type ContentBlock = typeof contentBlocks.$inferSelect;
export type WhyItem = typeof whyItems.$inferSelect;
export type Package = typeof packages.$inferSelect;
export type FeatureItem = typeof featureItems.$inferSelect;
export type Stat = typeof stats.$inferSelect;
export type PortfolioItem = typeof portfolioItems.$inferSelect;
export type PaymentSettings = typeof paymentSettings.$inferSelect;
export type PaymentMethod = typeof paymentMethods.$inferSelect;
export type Page = typeof pages.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type Inquiry = typeof inquiries.$inferSelect;
