import Link from "next/link";
import type { JSX } from "react";
import { SiteHeader } from "@/components/siteHeader";
import { SiteFooter } from "@/components/siteFooter";

export default function BillingCancelPage(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="mb-4 font-mono text-3xl font-bold text-ink">Checkout Cancelled</h1>
        <p className="mb-8 max-w-md font-mono text-base text-body">
          You can continue using the free effects or try Premium again whenever you like.
        </p>
        <Link
          href="/editor"
          className="inline-flex h-9 items-center rounded-sm border border-hairline-strong bg-canvas px-6 font-mono text-base font-medium text-ink hover:bg-surface-soft"
        >
          Back to Editor
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
