import type { JSX } from "react";
import Link from "next/link";
import { allPresets } from "@imageeffects/presets";
import { SiteHeader } from "@/components/siteHeader";
import { SiteFooter } from "@/components/siteFooter";
import { MiniPlayground } from "@/components/home/miniPlayground";
import { EffectShowcase } from "@/components/home/effectShowcase";
import { HowItWorks } from "@/components/home/howItWorks";
import { CreatorsDevelopers } from "@/components/home/creatorsDevelopers";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function HeroEyebrow(): JSX.Element {
  return (
    <div className="mb-4 inline-flex items-center gap-2 rounded-pill border border-hairline bg-soft-stone/50 px-3 py-1">
      <Badge variant="coral">New</Badge>
      <span className="text-xs font-medium text-body-muted">
        Browser-only image effects studio
      </span>
    </div>
  );
}

function Hero(): JSX.Element {
  return (
    <section className="bg-canvas">
      <div className="mx-auto max-w-container px-4 py-16 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <HeroEyebrow />
            <h1 className="mb-6 font-display text-4xl font-medium leading-[1.1] tracking-tight text-ink-primary md:text-5xl lg:text-6xl">
              Beautiful image effects. <br />
              <span className="text-muted">Made in your browser.</span>
            </h1>
            <p className="mb-8 max-w-md text-lg leading-relaxed text-body-muted">
              Upload a photo, pick a look, and export in seconds. No AI, no
              uploads to a server — every pixel is processed right here.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/playground">Open Playground</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/#showcase">Browse effects</Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-muted">
              <span>{allPresets.length} presets</span>
              <span className="h-1 w-1 rounded-full bg-muted" />
              <span>Every effect free</span>
              <span className="h-1 w-1 rounded-full bg-muted" />
              <span>PNG / JPEG / WebP</span>
            </div>
          </div>
          <MiniPlayground />
        </div>
      </div>
    </section>
  );
}

const features = [
  {
    title: "Private by default",
    description:
      "Your image never leaves your device while editing. Everything runs in a browser Web Worker."
  },
  {
    title: "Deterministic output",
    description:
      "Same photo, same settings, same pixels. Every effect is a pure, testable pipeline."
  },
  {
    title: "Fast previews",
    description:
      "Adaptive preview quality keeps the UI responsive even on large photos and slower devices."
  },
  {
    title: "Built for creators",
    description:
      "From retro print grids to luminous ASCII bloom, the presets are tuned for real photos."
  }
];

function Features(): JSX.Element {
  return (
    <section className="border-y border-hairline bg-soft-stone/30">
      <div className="mx-auto max-w-container px-4 py-16 lg:px-8 lg:py-24">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted">
            Why EffectSoup
          </p>
          <h2 className="font-display text-2xl font-medium tracking-tight text-ink-primary md:text-3xl">
            A small studio that respects your photos.
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-sm border border-card-border bg-canvas p-6"
            >
              <h3 className="mb-2 font-display text-lg font-medium text-ink-primary">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-body-muted">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <CreatorsDevelopers />
        <Features />
        <EffectShowcase />
        <HowItWorks />
      </main>
      <SiteFooter />
    </div>
  );
}
