import type { JSX } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function DevSection(): JSX.Element {
  return (
    <section className="bg-soft-stone/40 border-y border-hairline">
      <div className="mx-auto max-w-container px-4 py-16 lg:px-8 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-lg">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-accent">
              For developers
            </p>
            <h2 className="font-serif-display text-3xl leading-[1.2] tracking-tight text-ink-primary md:text-4xl">
              Developer friendly. <br />
              <span className="italic text-accent">npm</span> ready.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-body-muted">
              The same deterministic pixel pipeline that powers the UI is available
              as TypeScript packages. Import EffectSoup into your own app, script,
              or automation workflow.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="outline" asChild>
                <Link
                  href="https://www.npmjs.com/package/@effectsoup/effectsoup"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on npm
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/docs">Read the docs</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-hairline bg-canvas p-5 shadow-sm">
            {/* Tab bar */}
            <div className="mb-3 flex items-center gap-3 border-b border-hairline pb-3">
              <span className="rounded-sm bg-ink-primary px-2.5 py-1 text-[11px] font-medium text-on-primary">
                TypeScript
              </span>
              <span className="text-[11px] text-muted">npm</span>
              <span className="text-[11px] text-muted">pnpm</span>
            </div>
            <pre className="overflow-x-auto text-sm leading-relaxed text-ink-primary">
              <code>{`import { applyHalftone } from "@effectsoup/core";

const result = applyHalftone(image, {
  dotSize: 8,
  colorMode: "duotone"
});`}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
