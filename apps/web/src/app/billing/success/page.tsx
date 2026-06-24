import Link from "next/link";
import type { JSX } from "react";
import { SiteHeader } from "@/components/siteHeader";
import { SiteFooter } from "@/components/siteFooter";

export default function BillingSuccessPage(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="mb-4 font-mono text-3xl font-bold text-ink">Welcome to Premium</h1>
        <p className="mb-8 max-w-md font-mono text-base text-body">
          Your subscription is being processed. It may take a moment for Premium features to unlock.
        </p>
        <Link
          href="/editor"
          className="inline-flex h-9 items-center rounded-sm bg-ink px-6 font-mono text-base font-medium text-canvas hover:bg-ink-deep"
        >
          Back to Editor
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
