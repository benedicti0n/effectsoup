import Link from "next/link";
import type { JSX } from "react";
import { SiteHeader } from "@/components/siteHeader";
import { SiteFooter } from "@/components/siteFooter";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";

function HeroTuiMockup(): JSX.Element {
  return (
    <div className="w-full bg-surface-dark px-6 py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-3xl">
        <pre className="mb-8 font-mono text-sm font-bold leading-none text-on-dark md:text-base">
          {`[EFFECTLAB]`}
        </pre>
        <div className="mb-6 rounded-sm bg-surface-dark-elevated p-3 font-mono text-sm text-on-dark md:p-4 md:text-base">
          <span className="text-on-dark-mute">$</span> effect render --preset=ascii --intensity=42
        </div>
        <div className="font-mono text-sm text-on-dark-mute">
          <span className="text-on-dark">[tab]</span> switch preset{"  "}
          <span className="text-on-dark">[ctrl-p]</span> export
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: string }): JSX.Element {
  return (
    <div className="mb-6 border-b border-hairline pb-3">
      <h2 className="font-mono text-base font-bold text-ink">{children}</h2>
    </div>
  );
}

function FeatureRow({ marker, label, desc }: { marker: string; label: string; desc: string }): JSX.Element {
  return (
    <div className="border-b border-hairline py-2 font-mono text-base text-body last:border-b-0">
      <span className="text-ink">{marker}</span>{" "}
      <span className="font-medium text-ink">{label}</span>{" "}
      <span className="text-body">{desc}</span>
    </div>
  );
}

export default function HomePage(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <SiteHeader />

      <main className="flex-1">
        <HeroTuiMockup />

        <section className="mx-auto max-w-5xl px-4 py-16 md:py-section">
          <div className="mb-2 font-mono text-sm text-mute">[News] Browser-only image effects studio</div>
          <h1 className="mb-6 font-mono text-3xl font-bold leading-snug text-ink md:text-[38px]">
            The open source retro-digital image studio.
          </h1>
          <p className="mb-8 max-w-2xl font-mono text-base leading-relaxed text-body">
            Upload a photo, pick a look, adjust one slider, and export. No AI. Your image never leaves
            your device while editing.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/editor"
              className="inline-flex h-9 items-center gap-2 rounded-sm bg-ink px-5 font-mono text-base font-medium text-canvas hover:bg-ink-deep"
            >
              Open the Editor
              <HugeiconsIcon icon={ArrowRight01Icon} className="h-4 w-4" />
            </Link>
            <Link
              href="/account"
              className="inline-flex h-9 items-center rounded-sm border border-hairline-strong bg-canvas px-5 font-mono text-base font-medium text-ink hover:bg-surface-soft"
            >
              Account
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 pb-16 md:pb-section">
          <SectionLabel>[+] What is effectLab?</SectionLabel>
          <div className="max-w-3xl">
            <FeatureRow marker="[+]" label="Deterministic." desc="Every effect is a pure pixel pipeline. Same input, same output." />
            <FeatureRow marker="[+]" label="Private." desc="All rendering happens in your browser. No server-side image processing." />
            <FeatureRow marker="[+]" label="Fast." desc="Web Worker previews keep the UI responsive even on large photos." />
            <FeatureRow marker="[+]" label="Open." desc="Free presets, premium upgrades, and a monospaced codebase." />
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 pb-16 md:pb-section">
          <SectionLabel>[-] Free vs Premium</SectionLabel>
          <div className="grid gap-px bg-hairline md:grid-cols-2">
            <div className="bg-canvas p-5">
              <h3 className="mb-4 font-mono text-base font-bold text-ink">Free</h3>
              <ul className="space-y-2 font-mono text-base text-body">
                <li>[+] 9 free presets</li>
                <li>[+] Upload, crop, preview all effects</li>
                <li>[+] Export up to 1080px</li>
                <li>[+] No watermark</li>
              </ul>
            </div>
            <div className="bg-surface-soft p-5">
              <h3 className="mb-4 font-mono text-base font-bold text-ink">Premium — $3/month</h3>
              <ul className="space-y-2 font-mono text-base text-body">
                <li>[+] All 16 presets</li>
                <li>[+] Original / 4K export</li>
                <li>[+] Full advanced controls</li>
                <li>[+] Cloud projects</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 pb-16 md:pb-section">
          <SectionLabel>[x] Install</SectionLabel>
          <div className="rounded-sm bg-surface-card p-4 font-mono text-base text-ink">
            $ npx create-effectlab-app my-project
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
