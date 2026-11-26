import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { requireAdminPage } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Admin Dashboard", robots: { index: false, follow: false } };

export default async function Page() {
  await requireAdminPage();
  return <AdminDashboard />;
}
