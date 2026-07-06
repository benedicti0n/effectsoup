"use client";

import { useEffect, useRef, useState, type JSX } from "react";
import Link from "next/link";
import { getPresetById } from "@effectsoup/presets";
import { loadImageSource } from "@/lib/imageExport";
import { renderEffectSync } from "@/lib/renderEffect";

interface EffectCard {
  name: string;
  description: string;
  presetId: string;
  sourceImg: string;
}

const effects: EffectCard[] = [
  {
    name: "ASCII",
    description: "Symbol-based portraits from luminance maps.",
    presetId: "classicAscii",
    sourceImg: "img2"
  },
  {
    name: "Halftone",
    description: "Dot-screen print simulation with color control.",
    presetId: "dotHalftone",
    sourceImg: "img4"
  },
  {
    name: "Dither",
    description: "Ordered and error-diffusion patterns for retro texture.",
    presetId: "orderedDither",
    sourceImg: "img6"
  },
  {
    name: "Pixel Grid",
    description: "Blocky LED-matrix rendering with posterized palettes.",
    presetId: "pixelGrid",
    sourceImg: "img8"
  },
  {
    name: "Glow",
    description: "Screen-mode bloom, headroom highlights, and neon tones.",
    presetId: "dreamGlow",
    sourceImg: "img10"
  },
  {
    name: "Edge Detect",
    description: "Extract contours and outlines from any photograph.",
    presetId: "noirGrain",
    sourceImg: "img12"
  }
];

const defaultCrop = { aspectRatio: "original" as const, zoom: 1, offsetX: 0, offsetY: 0 };
const PREVIEW_LONGEST = 320;

function EffectPreview({ effect }: { effect: EffectCard }): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const source = await loadImageSource(`/assets/showcase/${effect.sourceImg}.png`);
        if (cancelled) return;
        const preset = getPresetById(effect.presetId);
        if (!preset) return;
        const intensity = preset.defaultIntensity ?? 50;
        const resolved = preset.intensityMapper(intensity, {});
        const longest = Math.max(source.width, source.height);
        const scale = longest > PREVIEW_LONGEST ? PREVIEW_LONGEST / longest : 1;
        const w = Math.round(source.width * scale);
        const h = Math.round(source.height * scale);
        const output = renderEffectSync(source, defaultCrop, effect.presetId, resolved, w, h);
        if (cancelled) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = output.width;
        canvas.height = output.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.putImageData(
          new ImageData(new Uint8ClampedArray(output.data), output.width, output.height),
          0,
          0
        );
        setReady(true);
      } catch {
        // silently fail — card shows loading state
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [effect]);

  return (
    <div className="mb-4 overflow-hidden rounded-sm bg-soft-stone">
      <canvas
        ref={canvasRef}
        className={`aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105 ${ready ? "block" : "hidden"}`}
      />
      {!ready && (
        <div className="flex aspect-[4/3] items-center justify-center text-sm text-muted">
          Loading…
        </div>
      )}
    </div>
  );
}

export function EffectsShowcase(): JSX.Element {
  return (
    <section className="bg-canvas">
      <div className="mx-auto max-w-container px-4 py-16 lg:px-8 lg:py-24">
        <div className="mb-12 flex flex-col items-start gap-4">
          <div className="max-w-xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-accent">
              Effects Studio
            </p>
            <h2 className="font-serif-display text-3xl leading-[1.2] tracking-tight text-ink-primary md:text-4xl">
              Stunning effects, <span className="italic text-accent">endless</span> possibilities.
            </h2>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {effects.map((fx) => (
            <Link
              key={fx.name}
              href={`/docs/effects/${fx.presetId}`}
              className="group rounded-lg border border-hairline bg-canvas p-5 transition-all hover:-translate-y-0.5 hover:border-accent/20 hover:shadow-sm"
            >
              <EffectPreview effect={fx} />
              <h3 className="font-display text-base font-medium text-ink-primary transition-colors group-hover:text-accent">
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
