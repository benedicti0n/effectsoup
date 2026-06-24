import Link from "next/link";
import type { JSX } from "react";

export default function BillingCancelPage(): JSX.Element {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-charcoal p-8 text-center text-neon-cream">
      <h1 className="mb-4 text-3xl font-bold">Checkout Cancelled</h1>
      <p className="mb-8 max-w-md text-white/70">
        You can continue using the free effects or try Premium again whenever you like.
      </p>
      <Link
        href="/editor"
        className="rounded-lg border border-white/10 px-8 py-3 text-sm font-semibold hover:bg-white/5"
      >
        Back to Editor
      </Link>
    </main>
  );
}
