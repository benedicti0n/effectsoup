import type { JSX } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/siteHeader";
import { SiteFooter } from "@/components/siteFooter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function CodeBlock({ code }: { code: string }): JSX.Element {
  return (
    <pre className="overflow-x-auto rounded-sm border border-hairline bg-ink-primary p-4 text-sm leading-relaxed text-on-dark">
      <code>{code}</code>
    </pre>
  );
}

const installSnippet = `pnpm add @effectsoup/core @effectsoup/presets @effectsoup/worker`;

const coreSnippet = `import { createPixelBuffer, toGrayscale } from "@effectsoup/core";
import type { PixelBuffer } from "@effectsoup/core";

// Create a buffer and fill it from a canvas.
const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

const width = canvas.width;
const height = canvas.height;
const source: PixelBuffer = createPixelBuffer(width, height);

const imageData = ctx.getImageData(0, 0, width, height);
source.data.set(imageData.data);

// Run a core primitive in-place.
toGrayscale(source);

// Draw the result back to the canvas.
ctx.putImageData(
  new ImageData(source.data, source.width, source.height),
  0,
  0
);`;

const presetSnippet = `import { getPresetById } from "@effectsoup/presets";
import type { PixelBuffer } from "@effectsoup/core";

const preset = getPresetById("dotHalftone")!;

// Map the product Intensity slider (0-100) to the preset's internal params.
const params = preset.intensityMapper(75, {});

// Build and run the pipeline.
const pipeline = preset.createPipeline(params);
const output: PixelBuffer = pipeline(source, params);`;

const advancedSnippet = `const preset = getPresetById("dotHalftone")!;

// Start from the schema defaults, then override individual controls.
const overrides = preset.advancedControlSchema.reduce(
  (acc, control) => {
    acc[control.id] = control.defaultValue;
    return acc;
  },
  {} as Record<string, number | string | boolean>
);

// Only override the values you care about.
overrides.dotSize = 8;

const params = preset.intensityMapper(75, overrides);
const output = preset.createPipeline(params)(source, params);`;

const workerSnippet = `import { EffectsWorkerClient } from "@effectsoup/worker";

// Point the client at the worker script. The exact path depends on your
// bundler (Vite, webpack, esbuild, Next.js, etc.).
const client = new EffectsWorkerClient(
  new URL("@effectsoup/worker/dist/worker.js", import.meta.url)
);

const output = await client.render({
  presetId: "dotHalftone",
  resolvedParameters: params,
  source,
  crop: {
    aspectRatio: "original",
    zoom: 1,
    offsetX: 0,
    offsetY: 0
  },
  targetWidth: 1200,
  targetHeight: 1600
});

// Clean up when you're done.
client.terminate();`;

const endToEndSnippet = `import { EffectsWorkerClient } from "@effectsoup/worker";
import { getPresetById } from "@effectsoup/presets";
import { createPixelBuffer } from "@effectsoup/core";

async function renderPhoto(canvas: HTMLCanvasElement, presetId: string) {
  const ctx = canvas.getContext("2d")!;
  const source = createPixelBuffer(canvas.width, canvas.height);
  source.data.set(ctx.getImageData(0, 0, canvas.width, canvas.height).data);

  const preset = getPresetById(presetId)!;
  const params = preset.intensityMapper(80, {});

  const client = new EffectsWorkerClient(
    new URL("@effectsoup/worker/dist/worker.js", import.meta.url)
  );

  const output = await client.render({
    presetId,
    resolvedParameters: params,
    source,
    crop: { aspectRatio: "original", zoom: 1, offsetX: 0, offsetY: 0 },
    targetWidth: canvas.width,
    targetHeight: canvas.height
  });

  client.terminate();

  ctx.putImageData(
    new ImageData(output.data, output.width, output.height),
    0,
    0
  );
}`;

function PackageCard({
  name,
  description,
  exports,
  children
}: {
  name: string;
  description: string;
  exports: string;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div className="rounded-sm border border-card-border bg-canvas p-6">
      <h2 className="mb-2 font-display text-xl font-medium text-ink-primary">
        {name}
      </h2>
      <p className="mb-4 text-sm leading-relaxed text-body-muted">
        {description}
      </p>
      <div className="mb-4">
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted">
          Key exports
        </p>
        <p className="font-mono text-sm text-ink">{exports}</p>
      </div>
      {children}
    </div>
  );
}

export default function DocsPage(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b border-hairline bg-soft-stone/30">
          <div className="mx-auto max-w-container px-4 py-16 lg:px-8 lg:py-24">
            <Badge variant="muted" className="mb-4">
              npm packages
            </Badge>
            <h1 className="mb-4 max-w-2xl font-display text-3xl font-medium tracking-tight text-ink-primary md:text-4xl">
              Use the EffectSoup engine in your own app.
            </h1>
            <p className="max-w-2xl text-lg text-body-muted">
              The same deterministic, browser-safe image pipeline is available
              as three TypeScript packages. No AI, no cloud uploads, no
              framework lock-in.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-container px-4 py-12 lg:px-8 lg:py-16">
          <CodeBlock code={installSnippet} />

          <div className="mt-12 space-y-12">
            <PackageCard
              name="@effectsoup/core"
              description="Pure TypeScript image-processing primitives. No DOM, no framework dependencies, and safe to run in a browser or Node.js."
              exports="PixelBuffer, createPixelBuffer, clonePixelBuffer, toGrayscale, adjustBrightnessContrast, applyDuotone, dither, halftone, noise, glow, edge, ascii, stipple, glitch, waveSlice, ..."
            >
              <p className="mb-3 text-sm leading-relaxed text-body-muted">
                The core currency is a <code>PixelBuffer</code>:
              </p>
              <CodeBlock code="type PixelBuffer = { width: number; height: number; data: Uint8ClampedArray };" />
              <div className="mt-4">
                <CodeBlock code={coreSnippet} />
              </div>
            </PackageCard>

            <PackageCard
              name="@effectsoup/presets"
              description="Product presets that bundle core primitives into tunable pipelines. Each preset exposes an Intensity slider and optional advanced controls."
              exports="allPresets, freePresets, premiumPresets, getPresetById, migratePresetId, EffectPreset, ResolvedPresetParameters"
            >
              <p className="mb-3 text-sm leading-relaxed text-body-muted">
                Run a preset by resolving its parameters and building a
                pipeline:
              </p>
              <CodeBlock code={presetSnippet} />
              <p className="my-3 text-sm leading-relaxed text-body-muted">
                Override advanced controls by starting from the schema defaults:
              </p>
              <CodeBlock code={advancedSnippet} />
            </PackageCard>

            <PackageCard
              name="@effectsoup/worker"
              description="Web Worker client that runs heavy rendering off the main thread. Handles job versioning, cancellation of stale renders, and buffer transfer."
              exports="EffectsWorkerClient, RenderOptions, RenderCallbacks"
            >
              <p className="mb-3 text-sm leading-relaxed text-body-muted">
                Create a client pointed at the worker script, then render:
              </p>
              <CodeBlock code={workerSnippet} />
              <p className="my-3 text-sm leading-relaxed text-body-muted">
                The exact worker script URL depends on your bundler. In Vite you
                can import with <code>?worker</code>; in other setups use the
                package&apos;s <code>dist/worker.js</code> entry.
              </p>
            </PackageCard>

            <div className="rounded-sm border border-card-border bg-soft-stone/30 p-6">
              <h2 className="mb-2 font-display text-xl font-medium text-ink-primary">
                End-to-end example
              </h2>
              <p className="mb-4 text-sm leading-relaxed text-body-muted">
                Decode a canvas, run a preset in a worker, and draw the result
                back.
              </p>
              <CodeBlock code={endToEndSnippet} />
            </div>
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/playground">Open playground</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Back home</Link>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
