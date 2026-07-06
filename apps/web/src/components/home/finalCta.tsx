import type { JSX } from "react";
import Link from "next/link";
import { allPresets } from "@effectsoup/presets";
import { Button } from "@/components/ui/button";

export function FinalCta(): JSX.Element {
  return (
    <section className="relative overflow-hidden bg-ink-primary">
      {/* Subtle pattern overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
        <div className="h-full w-full" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)",
          backgroundSize: "24px 24px"
        }} />
      </div>
      <div className="relative mx-auto max-w-container px-4 py-20 text-center lg:px-8 lg:py-28">
        <h2 className="font-serif-display text-3xl leading-[1.2] tracking-tight text-on-primary md:text-4xl lg:text-5xl">
          Your next image deserves <br />
          <span className="italic text-accent">a better effect.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-on-primary/70">
          Upload your photo, choose from {allPresets.length} presets, and export in seconds.
          No AI, no uploads, no limits.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button className="bg-on-primary text-ink-primary hover:bg-on-primary/90" asChild>
            <Link href="/playground">Try Playground</Link>
          </Button>
          <Button
            variant="outline"
            className="border-on-primary/20 text-on-primary hover:bg-on-primary/10"
            asChild
          >
            <Link href="/docs/reference/effects-catalog">Explore Effects</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
