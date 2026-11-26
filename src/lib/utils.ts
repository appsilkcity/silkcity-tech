import { clsx, type ClassValue } from "clsx";
import type { Lang } from "./types";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function parseList(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function parseObject<T extends object>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    const parsed: unknown = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? { ...fallback, ...(parsed as T) } : fallback;
  } catch {
    return fallback;
  }
}

const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

export function toBnDigits(input: string | number) {
  return String(input).replace(/\d/g, (digit) => bnDigits[Number(digit)]);
}

export function formatNumber(value: number, lang: Lang) {
  const formatted = new Intl.NumberFormat(lang === "bn" ? "bn-BD" : "en-US").format(value);
  return formatted;
}

export function formatBdt(amount: number, lang: Lang) {
  return `৳ ${formatNumber(amount, lang)}`;
}

export function normalizeBdPhone(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "");
  if (digits.startsWith("+880")) return `0${digits.slice(4)}`;
  if (digits.startsWith("880")) return `0${digits.slice(3)}`;
  return digits;
}

export function isValidBdPhone(phone: string) {
  return /^01[3-9]\d{8}$/.test(normalizeBdPhone(phone));
}

export function whatsappLink(baseUrl: string, message: string) {
  const url = new URL(baseUrl.startsWith("http") ? baseUrl : `https://wa.me/${baseUrl.replace(/\D/g, "")}`);
  url.searchParams.set("text", message);
  return url.toString();
}

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}

export function pick<T extends Record<string, unknown>>(row: T, field: string, lang: Lang) {
  const key = `${field}${lang === "bn" ? "Bn" : "En"}` as keyof T;
  return (row[key] ?? row[`${field}En` as keyof T] ?? "") as string;
}

export function orderNumber() {
  const date = new Date();
  const ymd = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const random = crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();
  return `SCT-${ymd}-${random}`;
}
