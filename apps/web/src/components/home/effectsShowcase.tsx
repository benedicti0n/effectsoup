import type { JSX } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const effects = [
  {
    name: "ASCII",
    description: "Symbol-based portraits from luminance maps.",
    gradient: "from-accent/5 via-accent/10 to-accent/5",
    symbol: "@#$%&"
  },
  {
    name: "Halftone",
    description: "Dot-screen print simulation with color control.",
    gradient: "from-accent/5 via-accent/10 to-accent/5",
    symbol: "●●●"
  },
  {
    name: "Dither",
    description: "Ordered and error-diffusion patterns for retro texture.",
    gradient: "from-accent/5 via-accent/10 to-accent/5",
    symbol: "▤▥▦"
  },
  {
    name: "Pixel Grid",
    description: "Blocky LED-matrix rendering with posterized palettes.",
    gradient: "from-accent/5 via-accent/10 to-accent/5",
    symbol: "▣▣▣"
  },
  {
    name: "Glow",
    description: "Screen-mode bloom, headroom highlights, and neon tones.",
    gradient: "from-accent/5 via-accent/10 to-accent/5",
    symbol: "✦✦✦"
  },
  {
    name: "Edge Detect",
    description: "Extract contours and outlines from any photograph.",
    gradient: "from-accent/5 via-accent/10 to-accent/5",
    symbol: "╱╲╱"
  }
];

export function EffectsShowcase(): JSX.Element {
  return (
    <section className="bg-canvas">
      <div className="mx-auto max-w-container px-4 py-16 lg:px-8 lg:py-24">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-accent">
              Effects Studio
            </p>
            <h2 className="font-serif-display text-3xl leading-[1.2] tracking-tight text-ink-primary md:text-4xl">
              Stunning effects, <span className="italic text-accent">endless</span> possibilities.
            </h2>
          </div>
          <Button variant="outline" asChild>
            <Link href="/docs/effects">View all effects</Link>
          </Button>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {effects.map((fx) => (
            <Link
              key={fx.name}
              href={`/docs/effects/${fx.name.toLowerCase().replace(/\s+/g, "")}`}
              className="group rounded-lg border border-hairline bg-canvas p-5 transition-all hover:-translate-y-0.5 hover:border-accent/20 hover:shadow-sm"
            >
              {/* Preview area */}
              <div
                className={`mb-4 flex h-32 items-center justify-center rounded-sm bg-gradient-to-br ${fx.gradient}`}
              >
                <span className="text-2xl font-medium tracking-widest text-accent/40 select-none">
                  {fx.symbol}
                </span>
              </div>
              <h3 className="font-display text-base font-medium text-ink-primary group-hover:text-accent transition-colors">
                {fx.name}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-body-muted">
                {fx.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
