"use client";

import NextImage from "next/image";
import { allPresets } from "@imageeffects/presets";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { JSX } from "react";

const categoryLabels: Record<string, string> = {
  printGrid: "Print & Grid",
  asciiSymbols: "ASCII & Symbols",
  atmosphereGlow: "Atmosphere & Glow"
};

export function EffectShowcase(): JSX.Element {
  const presets = allPresets.slice(0, 12);

  return (
    <section id="showcase" className="bg-canvas">
      <div className="mx-auto max-w-container px-4 py-16 lg:px-8 lg:py-24">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted">
              Effect showcase
            </p>
            <h2 className="font-display text-2xl font-medium tracking-tight text-ink-primary md:text-3xl">
              16 presets tuned for real photos.
            </h2>
          </div>
          <Button variant="outline" asChild>
            <a href="/playground">Browse all in playground</a>
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {presets.map((preset, index) => {
            const imageNum = (index % 12) + 1;
            return (
              <a
                key={preset.id}
                href={`/playground?preset=${preset.id}`}
                className="group relative aspect-[4/5] overflow-hidden rounded-sm border border-card-border bg-soft-stone"
              >
                <NextImage
                  src={`/assets/showcase/img${imageNum}.png`}
                  alt={preset.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  unoptimized
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-primary/90 via-ink-primary/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <p className="mb-1 text-xs font-medium text-on-dark/70">
                    {categoryLabels[preset.category] ?? preset.category}
                  </p>
                  <h3 className="mb-2 font-display text-lg font-medium text-on-dark">
                    {preset.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    {preset.access === "premium" ? (
                      <Badge variant="premium">Premium</Badge>
                    ) : (
                      <Badge variant="outline" className="border-on-dark/30 text-on-dark">
                        Free
                      </Badge>
                    )}
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
