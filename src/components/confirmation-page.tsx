"use client";

import Link from "next/link";
import { CheckCircle2, Clock3, MessageCircle, XCircle } from "lucide-react";
import type { SiteSettings } from "@/db/schema";
import { formatBdt, whatsappLink } from "@/lib/utils";
import { useLanguage } from "./language-provider";
import { Reveal } from "./motion";

export interface ConfirmationOrder {
  orderNumber: string;
  packageNameEn: string;
  packageNameBn: string;
  amountBdt: number;
  paymentMethod: "bkash" | "sslcommerz";
  paymentStatus: string;
  status: string;
}

export function ConfirmationPage({ order, payment, settings }: { order: ConfirmationOrder | null; payment?: string; settings: SiteSettings }) {
  const { lang, t } = useLanguage();
  const paid = order?.paymentStatus === "paid";
  const awaiting = order?.paymentStatus === "awaiting_verification";
  const failed = payment === "failed" || payment === "cancelled" || order?.paymentStatus === "failed";
  const paymentStatusLabel = (status: string) => {
    const labels: Record<string, [string, string]> = {
      unpaid: ["Unpaid", "অপরিশোধিত"],
      awaiting_verification: ["Awaiting verification", "যাচাইয়ের অপেক্ষায়"],
      paid: ["Paid", "পরিশোধিত"],
      failed: ["Failed", "ব্যর্থ"],
      refunded: ["Refunded", "রিফান্ড করা হয়েছে"],
    };
    const label = labels[status] ?? [status, status];
    return t(label[0], label[1]);
  };

  return (
    <section className="section-pad">
      <div className="container-page max-w-2xl">
        <Reveal className="rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm">
          {paid ? (
            <CheckCircle2 className="mx-auto h-14 w-14 text-green-600" />
          ) : failed ? (
            <XCircle className="mx-auto h-14 w-14 text-red-500" />
          ) : (
            <Clock3 className="mx-auto h-14 w-14 text-amber-500" />
          )}
          <h1 className="mt-5 text-2xl font-extrabold text-heading">
            {paid ? t("Payment confirmed", "পেমেন্ট নিশ্চিত হয়েছে") : failed ? t("Payment not completed", "পেমেন্ট সম্পন্ন হয়নি") : t("Order received", "অর্ডার গ্রহণ করা হয়েছে")}
          </h1>
          {order ? (
            <>
              <p className="mt-3 text-sm text-muted">
                {t("Order number", "অর্ডার নম্বর")}: <span className="font-bold text-heading">{order.orderNumber}</span>
              </p>
              <div className="mt-6 grid gap-2 rounded-xl bg-slate-50 p-4 text-sm">
                <p><span className="font-semibold">{t("Package", "প্যাকেজ")}:</span> {lang === "bn" ? order.packageNameBn : order.packageNameEn}</p>
                <p><span className="font-semibold">{t("Amount", "পরিমাণ")}:</span> {formatBdt(order.amountBdt, lang)}</p>
                <p><span className="font-semibold">{t("Payment", "পেমেন্ট")}:</span> {order.paymentMethod === "bkash" ? t("Manual bKash", "ম্যানুয়াল বিকাশ") : "SSLCommerz"}</p>
                <p><span className="font-semibold">{t("Payment status", "পেমেন্ট স্ট্যাটাস")}:</span> {paymentStatusLabel(order.paymentStatus)}</p>
              </div>
              <p className="mt-5 text-sm leading-relaxed text-muted">
                {paid
                  ? t("Thank you! Our team will contact you to start the project.", "ধন্যবাদ! প্রজেক্ট শুরু করতে আমাদের টিম আপনার সাথে যোগাযোগ করবে।")
                  : awaiting
                    ? t("We will verify your bKash sender number and TrxID, then update the order.", "আমরা আপনার বিকাশ সেন্ডার নম্বর ও TrxID যাচাই করে অর্ডার হালনাগাদ করব।")
                    : failed
                      ? t("Please try again or contact us on WhatsApp for help.", "অনুগ্রহ করে আবার চেষ্টা করুন অথবা সাহায্যের জন্য হোয়াটসঅ্যাপে যোগাযোগ করুন।")
                      : t("Your order is pending. Complete payment or contact us if you need help.", "আপনার অর্ডার পেন্ডিং। পেমেন্ট সম্পন্ন করুন অথবা সাহায্যের জন্য যোগাযোগ করুন।")}
              </p>
            </>
          ) : (
            <p className="mt-4 text-sm text-muted">{t("We could not find this order. Please contact support with your transaction details.", "এই অর্ডারটি খুঁজে পাওয়া যায়নি। ট্রানজেকশন তথ্যসহ সাপোর্টে যোগাযোগ করুন।")}</p>
          )}
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a href={whatsappLink(settings.whatsappUrl, t(`Hello, I need help with order ${order?.orderNumber ?? ""}.`, `আসসালামু আলাইকুম, ${order?.orderNumber ?? ""} অর্ডার বিষয়ে সাহায্য দরকার।`))} target="_blank" rel="noreferrer" className="btn btn-whatsapp">
              <MessageCircle className="h-4 w-4" /> {t("WhatsApp support", "হোয়াটসঅ্যাপ সাপোর্ট")}
            </a>
            <Link href="/order" className="btn btn-outline">{t("Back to order", "অর্ডারে ফিরুন")}</Link>
            <Link href="/" className="btn btn-primary">{t("Home", "হোম")}</Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
