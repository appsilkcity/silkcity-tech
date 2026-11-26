"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { BrandMark } from "@/components/illustrations";

export function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const json = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(json.error || "Login failed");
      router.push("/admin");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="flex items-center gap-3">
          <BrandMark className="h-12 w-12" />
          <div>
            <h1 className="text-xl font-extrabold text-heading">Silk City Tech Admin</h1>
            <p className="text-sm text-muted">Full-control dashboard</p>
          </div>
        </div>
        <label className="label mt-8" htmlFor="admin-password">Admin password</label>
        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input id="admin-password" type="password" className="input pl-9" required autoFocus value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
        <button type="submit" className="btn btn-primary mt-5 w-full" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
        <p className="mt-4 text-center text-xs text-muted">Set <code>ADMIN_PASSWORD</code> in your environment. Sessions expire after 8 hours.</p>
        <Link href="/" className="mt-4 block text-center text-sm font-semibold text-brand hover:underline">Back to website</Link>
      </form>
    </main>
  );
}
