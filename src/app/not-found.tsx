import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white p-6 text-center">
      <p className="text-6xl font-extrabold text-brand">404</p>
      <h1 className="text-2xl font-bold text-heading">Page not found / পেজটি পাওয়া যায়নি</h1>
      <Link href="/" className="btn btn-primary">Go home / হোমে যান</Link>
    </main>
  );
}
