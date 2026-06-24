import Link from "next/link";
import type { JSX } from "react";

export default function BillingSuccessPage(): JSX.Element {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-charcoal p-8 text-center text-neon-cream">
      <h1 className="mb-4 text-3xl font-bold text-neon-lavender">Welcome to Premium</h1>
      <p className="mb-8 max-w-md text-white/70">
        Your subscription is being processed. It may take a moment for Premium features to unlock.
      </p>
      <Link
        href="/editor"
        className="rounded-lg bg-neon-pink px-8 py-3 text-sm font-semibold text-white hover:bg-neon-pink/90"
      >
        Back to Editor
      </Link>
    </main>
  );
}
