import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLogin } from "@/components/admin/admin-login";
import { isAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Admin Login", robots: { index: false, follow: false } };

export default async function Page() {
  if (await isAdmin()) redirect("/admin");
  return <AdminLogin />;
}
