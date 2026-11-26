"use client";

import Link from "next/link";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-2xl font-bold text-heading">Something went wrong / কিছু একটা সমস্যা হয়েছে</h1>
      <p className="max-w-md text-sm text-muted">Please try again. If the problem continues, call or WhatsApp 01712631560.</p>
      <div className="flex gap-3">
        <button type="button" className="btn btn-primary" onClick={reset}>Try again</button>
        <Link href="/" className="btn btn-outline">Home</Link>
      </div>
    </div>
  );
}
