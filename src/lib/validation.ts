import { z } from "zod";
import { isValidBdPhone } from "./utils";

export const langSchema = z.enum(["bn", "en"]);
const requiredText = z.string().trim().min(1).max(500);
const longText = z.string().trim().max(20000);
const optionalUrl = z.string().trim().url().max(2000).or(z.literal(""));
const optionalMediaUrl = z.string().trim().max(2000).refine((value) => value === "" || value.startsWith("/") || /^https?:\/\//i.test(value), {
  message: "Use an absolute https URL, a root-relative path, or leave empty",
});
const phoneSchema = z.string().trim().min(6).max(20);
const listSchema = z.array(z.string().trim().min(1).max(200)).max(30);

export const adminLoginSchema = z.object({ password: z.string().min(1).max(200) });

export const settingsSchema = z.object({
  siteName: requiredText,
  brandName: requiredText,
  brandNameBn: requiredText,
  logoUrl: optionalMediaUrl,
  faviconUrl: optionalMediaUrl,
  phone: phoneSchema,
  whatsappUrl: requiredText,
  email: z.string().trim().email().max(200),
  addressEn: requiredText,
  addressBn: requiredText,
  facebookUrl: optionalUrl,
  instagramUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  youtubeUrl: optionalUrl,
  seoTitleEn: requiredText,
  seoTitleBn: requiredText,
  seoDescriptionEn: longText,
  seoDescriptionBn: longText,
  seoKeywords: z.string().trim().max(1000),
  ogImageUrl: optionalMediaUrl,
  googleVerification: z.string().trim().max(500),
  footerTextEn: longText,
  footerTextBn: longText,
});

export const contentBlockSchema = z.object({
  key: z.enum(["hero", "why", "services", "features", "cta", "stats", "portfolio", "payments"]),
  titleEn: z.string().trim().max(500),
  titleBn: z.string().trim().max(500),
  subtitleEn: longText,
  subtitleBn: longText,
  bodyEn: longText,
  bodyBn: longText,
  imageUrl: optionalMediaUrl,
  badgeEn: z.string().trim().max(200).optional(),
  badgeBn: z.string().trim().max(200).optional(),
  primaryEn: z.string().trim().max(100).optional(),
  primaryBn: z.string().trim().max(100).optional(),
  secondaryEn: z.string().trim().max(100).optional(),
  secondaryBn: z.string().trim().max(100).optional(),
});

export const pageSchema = z.object({
  slug: z.enum(["about", "privacy-policy", "terms", "contact"]),
  titleEn: requiredText,
  titleBn: requiredText,
  contentEn: longText,
  contentBn: longText,
});

export const paymentSettingsSchema = z.object({
  sslEnabled: z.boolean(),
  sslStoreId: z.string().trim().max(200),
  sslStorePassword: z.string().max(200).optional(),
  sslIsLive: z.boolean(),
  bkashEnabled: z.boolean(),
  bkashNumber: phoneSchema,
  bkashInstructionsEn: longText,
  bkashInstructionsBn: longText,
});

export const navLinkSchema = z.object({
  labelEn: requiredText,
  labelBn: requiredText,
  href: requiredText,
  location: z.enum(["header", "utility"]),
  sortOrder: z.coerce.number().int().min(0).max(10000),
  visible: z.boolean(),
});

export const footerColumnSchema = z.object({
  titleEn: requiredText,
  titleBn: requiredText,
  sortOrder: z.coerce.number().int().min(0).max(10000),
  visible: z.boolean(),
});

export const footerLinkSchema = z.object({
  columnId: z.string().uuid(),
  labelEn: requiredText,
  labelBn: requiredText,
  href: requiredText,
  sortOrder: z.coerce.number().int().min(0).max(10000),
  visible: z.boolean(),
});

export const whyItemSchema = z.object({
  icon: requiredText,
  titleEn: requiredText,
  titleBn: requiredText,
  descriptionEn: longText,
  descriptionBn: longText,
  sortOrder: z.coerce.number().int().min(0).max(10000),
  visible: z.boolean(),
});

export const packageSchema = z.object({
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(100),
  nameEn: requiredText,
  nameBn: requiredText,
  descriptionEn: longText,
  descriptionBn: longText,
  priceBdt: z.coerce.number().int().min(0).max(100000000),
  featuresEn: listSchema,
  featuresBn: listSchema,
  icon: requiredText,
  tint: z.enum(["pink", "lavender", "mint", "cream", "cyan", "peach", "rose", "sky"]),
  deliveryDays: z.coerce.number().int().min(1).max(365),
  revisions: z.coerce.number().int().min(0).max(50),
  popular: z.boolean(),
  visible: z.boolean(),
  sortOrder: z.coerce.number().int().min(0).max(10000),
});

export const featureItemSchema = whyItemSchema;

export const statSchema = z.object({
  labelEn: requiredText,
  labelBn: requiredText,
  value: z.coerce.number().int().min(0).max(100000000),
  suffixEn: z.string().trim().max(20),
  suffixBn: z.string().trim().max(20),
  icon: requiredText,
  sortOrder: z.coerce.number().int().min(0).max(10000),
  visible: z.boolean(),
});

export const portfolioSchema = z.object({
  titleEn: requiredText,
  titleBn: requiredText,
  descriptionEn: longText,
  descriptionBn: longText,
  categoryEn: requiredText,
  categoryBn: requiredText,
  imageUrl: optionalMediaUrl,
  liveUrl: optionalUrl,
  techStack: listSchema,
  clientNameEn: z.string().trim().max(200),
  clientNameBn: z.string().trim().max(200),
  trustNoteEn: longText,
  trustNoteBn: longText,
  featured: z.boolean(),
  visible: z.boolean(),
  sortOrder: z.coerce.number().int().min(0).max(10000),
});

export const paymentMethodSchema = z.object({
  key: z.string().trim().regex(/^[a-z0-9-]+$/).max(60),
  nameEn: requiredText,
  nameBn: requiredText,
  kind: z.enum(["gateway", "manual", "badge"]),
  imageUrl: optionalMediaUrl,
  color: z.string().trim().regex(/^#[0-9a-fA-F]{6}$/),
  enabled: z.boolean(),
  sortOrder: z.coerce.number().int().min(0).max(10000),
});

export const inquiryUpdateSchema = z.object({
  status: z.enum(["new", "read", "archived"]),
});

export const orderStatusSchema = z.enum(["pending", "in_progress", "completed", "cancelled"]);
export const paymentStatusSchema = z.enum(["unpaid", "awaiting_verification", "paid", "failed", "refunded"]);

export const orderUpdateSchema = z.object({
  id: z.string().uuid(),
  status: orderStatusSchema.optional(),
  paymentStatus: paymentStatusSchema.optional(),
  adminNotes: z.string().trim().max(5000).optional(),
});

export const orderCreateSchema = z.object({
  packageId: z.string().uuid(),
  customerName: z.string().trim().min(2).max(120),
  customerPhone: phoneSchema,
  customerEmail: z.string().trim().email().max(200).or(z.literal("")),
  customerAddress: z.string().trim().max(500).optional().default(""),
  notes: z.string().trim().max(3000).optional().default(""),
  language: langSchema,
  paymentMethod: z.enum(["bkash", "sslcommerz"]),
  bkashSenderNumber: z.string().trim().max(20).optional().default(""),
  bkashTrxId: z.string().trim().regex(/^[A-Za-z0-9]{6,20}$/).optional().or(z.literal("")).default(""),
}).superRefine((value, ctx) => {
  if (!isValidBdPhone(value.customerPhone)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["customerPhone"], message: "Valid Bangladeshi phone number required" });
  }
  if (value.paymentMethod === "bkash") {
    if (!isValidBdPhone(value.bkashSenderNumber)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["bkashSenderNumber"], message: "Valid bKash sender number required" });
    }
    if (!/^[A-Za-z0-9]{6,20}$/.test(value.bkashTrxId)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["bkashTrxId"], message: "Valid TrxID required" });
    }
  }
});

export const inquirySchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200).or(z.literal("")),
  phone: z.string().trim().max(20).optional().default(""),
  message: z.string().trim().min(10).max(5000),
  locale: langSchema,
});

export const sslInitSchema = z.object({ orderId: z.string().uuid() });
export const sslRevalidateSchema = z.object({ orderId: z.string().uuid() });
