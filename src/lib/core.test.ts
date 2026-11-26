import { describe, expect, it } from "vitest";
import { createSessionToken, verifySessionToken } from "./auth";
import { sslAmountMatches, sslValidationOk } from "./payments";
import { formatBdt, normalizeBdPhone, parseList, toBnDigits, whatsappLink } from "./utils";
import { orderCreateSchema, packageSchema } from "./validation";

describe("utils", () => {
  it("normalizes Bangladeshi phone numbers", () => {
    expect(normalizeBdPhone("+8801712631560")).toBe("01712631560");
    expect(normalizeBdPhone("8801712631560")).toBe("01712631560");
    expect(normalizeBdPhone("01712-631560")).toBe("01712631560");
  });

  it("converts digits and formats BDT", () => {
    expect(toBnDigits("01712631560")).toBe("০১৭১২৬৩১৫৬০");
    expect(formatBdt(15000, "bn")).toContain("৳");
  });

  it("parses JSON lists safely", () => {
    expect(parseList('["Next.js","Turso"]')).toEqual(["Next.js", "Turso"]);
    expect(parseList("bad json")).toEqual([]);
  });

  it("builds WhatsApp links with prefilled text", () => {
    expect(whatsappLink("https://wa.me/8801712631560", "Hello")).toBe("https://wa.me/8801712631560?text=Hello");
  });
});

describe("admin session", () => {
  it("signs and verifies a session token", () => {
    const token = createSessionToken("correct-password");
    expect(verifySessionToken(token, "correct-password")).toBe(true);
    expect(verifySessionToken(token, "wrong-password")).toBe(false);
    expect(verifySessionToken(undefined, "correct-password")).toBe(false);
    expect(verifySessionToken("tampered.token", "correct-password")).toBe(false);
  });
});

describe("validation", () => {
  it("requires bKash sender and TrxID for manual orders", () => {
    const base = {
      packageId: "00000000-0000-4000-8000-000000000000",
      customerName: "Test Customer",
      customerPhone: "01712631560",
      customerEmail: "",
      language: "bn",
      paymentMethod: "bkash",
    };
    expect(orderCreateSchema.safeParse({ ...base, bkashSenderNumber: "01712631560", bkashTrxId: "ABC123DEF" }).success).toBe(true);
    expect(orderCreateSchema.safeParse({ ...base, bkashSenderNumber: "", bkashTrxId: "" }).success).toBe(false);
  });

  it("validates package slugs and prices", () => {
    const pkg = {
      slug: "business-website",
      nameEn: "Business",
      nameBn: "বিজনেস",
      descriptionEn: "Desc",
      descriptionBn: "বিবরণ",
      priceBdt: 15000,
      featuresEn: ["One"],
      featuresBn: ["এক"],
      icon: "Globe",
      tint: "mint",
      deliveryDays: 7,
      revisions: 2,
      popular: false,
      visible: true,
      sortOrder: 1,
    };
    expect(packageSchema.safeParse(pkg).success).toBe(true);
    expect(packageSchema.safeParse({ ...pkg, slug: "Bad Slug" }).success).toBe(false);
    expect(packageSchema.safeParse({ ...pkg, priceBdt: -1 }).success).toBe(false);
  });
});

describe("SSLCommerz helpers", () => {
  it("matches amounts with cent tolerance", () => {
    expect(sslAmountMatches("15000.00", 15000)).toBe(true);
    expect(sslAmountMatches(15000, 15000)).toBe(true);
    expect(sslAmountMatches("14999.00", 15000)).toBe(false);
    expect(sslAmountMatches(undefined, 15000)).toBe(false);
  });

  it("accepts only valid validation statuses", () => {
    expect(sslValidationOk("VALID")).toBe(true);
    expect(sslValidationOk("VALIDATED")).toBe(true);
    expect(sslValidationOk("FAILED")).toBe(false);
  });
});
