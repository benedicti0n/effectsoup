import type { JSX } from "react";
import Link from "next/link";
import { allPresets } from "@effectsoup/presets";
import { Button } from "@/components/ui/button";

const demoEffects = [
  { name: "ASCII", color: "bg-accent/10 text-accent border-accent/20" },
  { name: "Dither", color: "bg-accent/10 text-accent border-accent/20" },
  { name: "Pixel Grid", color: "bg-accent/10 text-accent border-accent/20" },
  { name: "Halftone", color: "bg-accent/10 text-accent border-accent/20" },
  { name: "Glow", color: "bg-accent/10 text-accent border-accent/20" },
  { name: "Edge Detect", color: "bg-accent/10 text-accent border-accent/20" }
];

export function HeroSection(): JSX.Element {
  return (
    <section className="bg-soft-stone/40">
      <div className="mx-auto max-w-container px-4 py-16 lg:px-8 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: editorial copy */}
          <div className="max-w-lg">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-accent">
              Image Effects for Creators &amp; Developers
            </p>
            <h1 className="font-serif-display text-4xl leading-[1.15] tracking-tight text-ink-primary md:text-5xl lg:text-6xl">
              Turn ordinary images into <br />
              <span className="italic text-accent">beautiful</span> effects.
            </h1>
            <p className="mt-5 text-base leading-relaxed text-body-muted md:text-lg">
              Upload a photo, pick a look, and export in seconds. No AI, no uploads
              to a server — every pixel is processed right in your browser.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/playground">Try Playground</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/docs/effects">Explore Effects</Link>
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-muted">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                No credit card
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Instant results
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Export anywhere
              </span>
            </div>
          </div>

          {/* Right: product preview */}
          <div className="rounded-lg border border-hairline bg-canvas p-4 shadow-sm lg:p-6">
            {/* Toolbar */}
            <div className="mb-4 flex items-center gap-2 border-b border-hairline pb-3">
              <span className="h-3 w-3 rounded-full bg-accent/60" />
              <span className="h-3 w-3 rounded-full bg-muted/30" />
              <span className="h-3 w-3 rounded-full bg-muted/30" />
              <span className="ml-2 text-xs font-medium text-muted">EffectSoup — preview</span>
            </div>

            {/* Upload area / canvas preview */}
            <div className="mb-4 flex aspect-[4/3] items-center justify-center rounded-sm bg-soft-stone/60">
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="rounded-lg border border-dashed border-hairline bg-canvas p-4">
                  <svg className="mx-auto h-8 w-8 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  <p className="mt-2 text-xs text-muted">Drop an image or click to upload</p>
                </div>
              </div>
            </div>

            {/* Effect selection pills */}
            <div className="mb-3">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted">Effects</p>
              <div className="flex flex-wrap gap-1.5">
                {demoEffects.map((fx) => (
                  <span
                    key={fx.name}
                    className={`rounded-pill border px-2.5 py-1 text-[11px] font-medium ${fx.color}`}
                  >
                    {fx.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Controls row */}
            <div className="flex items-center gap-4 border-t border-hairline pt-3">
              <div className="flex-1">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-muted">Intensity</span>
                  <span className="text-[11px] font-medium text-ink">75%</span>
                </div>
                <div className="h-1.5 rounded-full bg-soft-stone">
                  <div className="h-1.5 w-3/4 rounded-full bg-accent" />
                </div>
              </div>
              <span className="rounded-sm border border-hairline px-2 py-1 text-[11px] font-medium text-muted">
                {allPresets.length} presets
              </span>
              <span className="rounded-sm bg-ink-primary px-2 py-1 text-[11px] font-medium text-on-primary">
                Export
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
