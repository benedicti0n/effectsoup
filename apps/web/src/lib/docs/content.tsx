import type { JSX } from "react";
import Link from "next/link";
import { allPresets } from "@effectsoup/presets";
import { categoryInfo, getEffectsByCategory } from "./presets";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CodeBlock, InlineCode } from "@/components/docs/code";
import { Callout } from "@/components/docs/callout";
import { ApiSignature, ParamsTable } from "@/components/docs/apiTable";

type PageContent = {
  title: string;
  description: string;
  component: () => JSX.Element;
};

const content: Record<string, PageContent> = {
  // ====== OVERVIEW ======
  "docs": {
    title: "What is EffectSoup?",
    description: "Browser-based non-AI image effects studio",
    component: () => (
      <>
        <h1 className="font-display text-3xl font-medium tracking-tight text-ink-primary md:text-4xl">
          What is EffectSoup?
        </h1>
        <p className="mt-4 text-base leading-relaxed text-body-muted">
          EffectSoup is a browser-based, non-AI image transformation studio. Upload a photo, choose an effect, adjust controls, and export — every pixel is processed in your browser via a Web Worker.
        </p>
        <p className="mt-2 text-base leading-relaxed text-body-muted">
          No AI generation. No cloud uploads. No signup required to edit. Every effect is a deterministic, mathematical image pipeline — the same photo with the same settings always produces the same result.
        </p>

        <div className="my-8 grid gap-4 sm:grid-cols-2">
          <Link href="/playground" className="group rounded-sm border border-hairline p-6 hover:border-ink/20 transition-colors">
            <h2 className="font-display text-lg font-medium text-ink-primary group-hover:text-accent transition-colors">
              Use the Playground →
            </h2>
            <p className="mt-1 text-sm text-body-muted">
              Upload an image, pick from 25+ presets, tweak controls, and export in PNG, JPEG, or WebP.
            </p>
          </Link>
          <Link href="/docs/getting-started/packages" className="group rounded-sm border border-hairline p-6 hover:border-ink/20 transition-colors">
            <h2 className="font-display text-lg font-medium text-ink-primary group-hover:text-accent transition-colors">
              Use the Packages →
            </h2>
            <p className="mt-1 text-sm text-body-muted">
              Install @effectsoup/core, @effectsoup/presets, and @effectsoup/worker in your own app.
            </p>
          </Link>
        </div>

        <section className="my-10">
          <h2 id="how-rendering-works" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary">
            How Rendering Works
          </h2>
          <div className="mt-4 rounded-sm border border-hairline bg-soft-stone/30 p-6 text-sm leading-relaxed text-body-muted">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="rounded-sm border border-hairline bg-canvas px-2 py-1">Upload</span>
              <span>→</span>
              <span className="rounded-sm border border-hairline bg-canvas px-2 py-1">Crop / Viewport</span>
              <span>→</span>
              <span className="rounded-sm border border-hairline bg-canvas px-2 py-1">Resolve Parameters</span>
              <span>→</span>
              <span className="rounded-sm border border-hairline bg-canvas px-2 py-1">Pipeline</span>
              <span>→</span>
              <span className="rounded-sm border border-hairline bg-canvas px-2 py-1">Worker / Render</span>
              <span>→</span>
              <span className="rounded-sm border border-hairline bg-canvas px-2 py-1">Export</span>
            </div>
            <ol className="mt-4 space-y-2 list-decimal list-inside">
              <li>Image is decoded into a <InlineCode>PixelBuffer</InlineCode> via canvas.</li>
              <li>Viewport transform applies crop, zoom, and aspect ratio (non-destructive).</li>
              <li>The preset&apos;s <InlineCode>intensityMapper</InlineCode> converts the 0–100 slider and any advanced overrides into resolved parameters.</li>
              <li>The preset&apos;s pipeline runs the effect chain on the cropped buffer.</li>
              <li>If a Worker is used, steps 2–4 run off the main thread and the result is transferred back.</li>
              <li>The final buffer is drawn to a canvas and exported as PNG, JPEG, or WebP.</li>
            </ol>
          </div>
        </section>

        <section className="my-10">
          <h2 id="packages" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary">
            Packages
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-body-muted">
            The EffectSoup engine is split into four npm packages, all published under the <InlineCode>@effectsoup</InlineCode> scope.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Card>
              <CardTitle><InlineCode>@effectsoup/core</InlineCode></CardTitle>
              <CardDescription>
                Pure TypeScript image-processing primitives: buffer management, color transforms, dithering, ASCII rendering, halftone, glow, distortion, and more. No DOM dependencies.
              </CardDescription>
              <div className="mt-4">
                <Link href="/docs/api/core">
                  <Button variant="outline" size="sm">API Reference</Button>
                </Link>
              </div>
            </Card>
            <Card>
              <CardTitle><InlineCode>@effectsoup/presets</InlineCode></CardTitle>
              <CardDescription>
                Effect presets that bundle core primitives into tunable pipelines. Each preset exposes an Intensity slider and optional advanced controls. Includes preset lookup and ID migration for legacy support.
              </CardDescription>
              <div className="mt-4">
                <Link href="/docs/api/presets">
                  <Button variant="outline" size="sm">API Reference</Button>
                </Link>
              </div>
            </Card>
            <Card>
              <CardTitle><InlineCode>@effectsoup/worker</InlineCode></CardTitle>
              <CardDescription>
                Web Worker client that runs heavy rendering off the main thread. Handles job versioning, cancellation of stale renders, and buffer transfer via <InlineCode>postMessage</InlineCode>.
              </CardDescription>
              <div className="mt-4">
                <Link href="/docs/api/worker">
                  <Button variant="outline" size="sm">API Reference</Button>
                </Link>
              </div>
            </Card>
            <Card>
              <CardTitle><InlineCode>@effectsoup/effectsoup</InlineCode></CardTitle>
              <CardDescription>
                All-in-one meta-package that re-exports <InlineCode>core</InlineCode>, <InlineCode>presets</InlineCode>, and <InlineCode>worker</InlineCode>. Install once and get the entire engine.
              </CardDescription>
              <div className="mt-4">
                <Link href="/docs/api/meta-package">
                  <Button variant="outline" size="sm">API Reference</Button>
                </Link>
              </div>
            </Card>
          </div>
        </section>

        <section className="my-10">
          <h2 id="start-here" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary">
            Start Here
          </h2>
          <div className="mt-4 rounded-sm border border-hairline bg-soft-stone/20 p-6 text-sm leading-relaxed">
            <h3 className="font-medium text-ink-primary mb-3">New to EffectSoup?</h3>
            <ol className="space-y-2 list-decimal list-inside text-body-muted">
              <li>Open the <Link href="/playground" className="text-accent underline">Playground</Link> and upload an image.</li>
              <li>Browse the preset library on the left sidebar. Pick one that catches your eye.</li>
              <li>Adjust the Intensity slider and explore the advanced controls.</li>
              <li>Try the crop and zoom options in the preview.</li>
              <li>Export your result as PNG, JPEG, or WebP.</li>
              <li>Read the <Link href="/docs/effects" className="text-accent underline">Effects Catalog</Link> to learn what each preset does.</li>
            </ol>
          </div>
        </section>
      </>
    )
  },

  // ====== GETTING STARTED - PLAYGROUND ======
  "docs/getting-started/playground": {
    title: "Using the Playground",
    description: "Upload an image, choose an effect, adjust controls, and export",
    component: () => (
      <>
        <h1 className="font-display text-2xl font-medium tracking-tight text-ink-primary md:text-3xl">
          Using the Playground
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-body-muted">
          The playground is the quickest way to use EffectSoup. No signup required — just open it and start editing.
        </p>

        <section className="my-8">
          <h2 id="upload" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Upload an Image
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-body-muted">
            Open the <Link href="/playground" className="text-accent underline">Playground</Link> and upload a JPEG, PNG, or WebP image. Files up to 20 MB are accepted, with a 25-megapixel decoded-size limit. Once loaded, your image appears in the center preview with the effect library on the left and controls on the right.
          </p>
          <Callout variant="note">
            Your image never leaves your device. All processing happens in-browser via a Web Worker.
          </Callout>
        </section>

        <section className="my-8">
          <h2 id="choose-effect" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Choose an Effect
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-body-muted">
            The left sidebar shows all {allPresets.length} presets grouped by category. Click any preset to apply it immediately. The preset&apos;s advanced controls appear on the right panel.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-body-muted">
            Some presets use an <strong>Intensity slider</strong> (0–100%) that scales the primary effect. Others are always-on and rely entirely on advanced controls — the slider is hidden and controls appear directly.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-body-muted">
            Use the <strong>Compare</strong> toggle to see your original image side-by-side with the effect.
          </p>
        </section>

        <section className="my-8">
          <h2 id="controls" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Effect Controls
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-body-muted">
            The right panel shows all controls for the selected effect:
          </p>
          <ul className="mt-2 space-y-1 text-sm text-body-muted list-disc list-inside">
            <li><strong>Intensity</strong> — a 0–100% slider (hidden for always-on presets).</li>
            <li><strong>Advanced controls</strong> — effect-specific parameters like cell size, threshold, dot size, color palette, ink color, grain amount, and more.</li>
            <li><strong>Atmosphere controls</strong> — many presets include Grain and Glow as additional refinements.</li>
            <li><strong>Adjustment controls</strong> — dither presets include Brightness, Contrast, and Saturation.</li>
          </ul>
          <p className="mt-2 text-sm leading-relaxed text-body-muted">
            Changes are reflected in the preview in real time. The preview runs at a reduced resolution for responsiveness; the full-resolution render happens when you export.
          </p>
        </section>

        <section className="my-8">
          <h2 id="crop" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Crop, Zoom &amp; Offset
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-body-muted">
            Below the preview, crop controls let you adjust:
          </p>
          <ul className="mt-2 space-y-1 text-sm text-body-muted list-disc list-inside">
            <li><strong>Aspect ratio</strong> — Original, Free, 1:1, 4:5, 9:16, or 16:9.</li>
            <li><strong>Zoom</strong> — magnify into the image.</li>
            <li><strong>Offset X/Y</strong> — pan the crop window. Clamped so it never extends beyond the source bounds.</li>
          </ul>
          <p className="mt-2 text-sm leading-relaxed text-body-muted">
            The viewport transform is non-destructive — it crops the buffer for rendering and export but does not alter your source image.
          </p>
        </section>

        <section className="my-8">
          <h2 id="export" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Export
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-body-muted">
            Click <strong>Export</strong> in the top toolbar to open the export dialog. Choose:
          </p>
          <ul className="mt-2 space-y-1 text-sm text-body-muted list-disc list-inside">
            <li><strong>Format</strong> — PNG, JPEG, or WebP.</li>
            <li><strong>Quality</strong> — 50–100% (applies to JPEG and WebP; PNG is lossless).</li>
            <li><strong>Resolution</strong> — 1080px longest edge, original resolution, or 4K (3840px longest edge).</li>
          </ul>
          <p className="mt-2 text-sm leading-relaxed text-body-muted">
            You need to sign in to export. The exported image is generated via the Canvas <InlineCode>toBlob</InlineCode> API on your device.
          </p>
        </section>
      </>
    )
  },

  // ====== GETTING STARTED - PACKAGES ======
  "docs/getting-started/packages": {
    title: "Installing the Packages",
    description: "npm packages for developers",
    component: () => (
      <>
        <h1 className="font-display text-2xl font-medium tracking-tight text-ink-primary md:text-3xl">
          Installing the Packages
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-body-muted">
          The EffectSoup engine is available as TypeScript packages on npm. Install everything with the meta-package, or pick only what you need.
        </p>

        <section className="my-8">
          <h2 id="meta-package" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Meta-package (all-in-one)
          </h2>
          <CodeBlock code={`pnpm add @effectsoup/effectsoup`} language="bash" />
          <p className="mt-2 text-sm text-body-muted">Or with npm:</p>
          <CodeBlock code={`npm install @effectsoup/effectsoup`} language="bash" />
          <p className="mt-2 text-sm leading-relaxed text-body-muted">
            The meta-package re-exports everything from core, presets, and worker. Import directly from <InlineCode>@effectsoup/effectsoup</InlineCode>.
          </p>
        </section>

        <section className="my-8">
          <h2 id="individual" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Individual Packages
          </h2>
          <CodeBlock code={`pnpm add @effectsoup/core @effectsoup/presets @effectsoup/worker`} language="bash" />
          <p className="mt-2 text-sm leading-relaxed text-body-muted">
            Install only the packages you need. Each package is independently versioned and documented.
          </p>

          <div className="mt-6 space-y-4">
            <div className="rounded-sm border border-hairline p-4">
              <h3 className="font-display text-base font-medium text-ink-primary"><InlineCode>@effectsoup/core</InlineCode></h3>
              <p className="mt-1 text-sm text-body-muted">Pure TypeScript image-processing primitives. No DOM dependencies. Safe in browsers and Node.js.</p>
              <Link href="/docs/api/core" className="mt-2 inline-block text-sm text-accent underline">API Reference →</Link>
            </div>
            <div className="rounded-sm border border-hairline p-4">
              <h3 className="font-display text-base font-medium text-ink-primary"><InlineCode>@effectsoup/presets</InlineCode></h3>
              <p className="mt-1 text-sm text-body-muted">Effect presets, pipeline builder, intensity mapping, and advanced control schema. Product-ready effect configurations.</p>
              <Link href="/docs/api/presets" className="mt-2 inline-block text-sm text-accent underline">API Reference →</Link>
            </div>
            <div className="rounded-sm border border-hairline p-4">
              <h3 className="font-display text-base font-medium text-ink-primary"><InlineCode>@effectsoup/worker</InlineCode></h3>
              <p className="mt-1 text-sm text-body-muted">Web Worker client for off-main-thread rendering. Handles job versioning, cancellation, and buffer transfer.</p>
              <Link href="/docs/api/worker" className="mt-2 inline-block text-sm text-accent underline">API Reference →</Link>
            </div>
          </div>
        </section>

        <section className="my-8">
          <h2 id="browser-requirement" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Browser Environment
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-body-muted">
            All packages are pure TypeScript and browser-safe. Core has no DOM dependencies. The worker package requires the Web Worker API. Presets work in any JavaScript environment that supports <InlineCode>Uint8ClampedArray</InlineCode>.
          </p>
        </section>

        <section className="my-8">
          <h2 id="minimal-example" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Minimal Example
          </h2>
          <CodeBlock code={`import { createPixelBuffer, toGrayscale } from "@effectsoup/core";
import type { PixelBuffer } from "@effectsoup/core";

// Create a buffer from a canvas element.
const canvas = document.querySelector("canvas")!;
const ctx = canvas.getContext("2d")!;
const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

const source: PixelBuffer = createPixelBuffer(canvas.width, canvas.height);
source.data.set(imageData.data);

// Apply grayscale in-place.
toGrayscale(source);

// Write back to canvas.
ctx.putImageData(
  new ImageData(source.data, source.width, source.height),
  0, 0
);`} language="typescript" />
        </section>
      </>
    )
  },

  // ====== PLAYGROUND GUIDE ======
  "docs/playground": {
    title: "Editor Overview",
    description: "Full walkthrough of the editor UI",
    component: () => (
      <>
        <h1 className="font-display text-2xl font-medium tracking-tight text-ink-primary md:text-3xl">
          Editor Overview
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-body-muted">
          The editor is EffectSoup&apos;s full-screen workspace for applying effects to your photos. Here is how it is laid out.
        </p>

        <section className="my-8">
          <h2 id="layout" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Layout
          </h2>
          <div className="rounded-sm border border-hairline bg-soft-stone/20 p-4 text-sm leading-relaxed text-body-muted">
            <dl className="space-y-3">
              <div>
                <dt className="font-medium text-ink-primary">Top toolbar</dt>
                <dd>Back to homepage, undo/redo/reset, replace/remove image, GitHub link, account link, and Export button.</dd>
              </div>
              <div>
                <dt className="font-medium text-ink-primary">Left sidebar</dt>
                <dd>Preset library showing all {allPresets.length} effects grouped by category. Click one to apply it.</dd>
              </div>
              <div>
                <dt className="font-medium text-ink-primary">Center preview</dt>
                <dd>Your image with the effect applied in real time. Below it: compare toggle and crop controls.</dd>
              </div>
              <div>
                <dt className="font-medium text-ink-primary">Right panel</dt>
                <dd>Intensity slider and all advanced controls for the selected effect. Adjustments update the preview immediately.</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="my-8">
          <h2 id="state-management" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            History &amp; Undo
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-body-muted">
            The editor maintains a history stack (up to 50 entries). <strong>Undo</strong> and <strong>Redo</strong> buttons in the toolbar navigate through crop, effect, and output state changes. <strong>Reset</strong> clears all settings back to defaults.
          </p>
        </section>

        <section className="my-8">
          <h2 id="compare" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Compare
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-body-muted">
            Toggle <strong>Compare Before</strong> to see your original (uncropped, uneffected) image alongside the processed result. Useful for evaluating how much an effect changes the photo.
          </p>
        </section>

        <section className="my-8">
          <h2 id="mobile" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Mobile Layout
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-body-muted">
            On smaller screens, the left preset sidebar is hidden. Tap <strong>Show library</strong> at the bottom to reveal the preset grid. The right controls panel is also hidden on narrow screens; all editing happens through the main interface with the library drawer.
          </p>
        </section>
      </>
    )
  },

  "docs/playground/upload-and-crop": {
    title: "Upload & Crop",
    description: "Image loading, cropping, and zoom",
    component: () => (
      <>
        <h1 className="font-display text-2xl font-medium tracking-tight text-ink-primary md:text-3xl">
          Upload &amp; Crop
        </h1>

        <section className="my-8">
          <h2 id="upload-flow" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Upload Flow
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-body-muted">
            When you first open the playground, you see an upload panel. Drag and drop or click to select an image file. Supported formats are JPEG, PNG, and WebP. Maximum file size is 20 MB with a 25-megapixel decoded-size cap (dimensions beyond that are downscaled on load).
          </p>
          <Callout variant="tip">
            For best results, upload images at or near your target export resolution. Upscaling a small image to 4K will produce pixelation.
          </Callout>
        </section>

        <section className="my-8">
          <h2 id="replace-remove" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Replace &amp; Remove
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-body-muted">
            Once an image is loaded, the toolbar shows <strong>Replace</strong> (load a different image while keeping crop and effect settings) and <strong>Remove</strong> (go back to the upload panel, clearing all state).
          </p>
        </section>

        <section className="my-8">
          <h2 id="crop-controls" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Crop Controls
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-body-muted">
            Below the preview, the crop bar provides:
          </p>
          <ul className="mt-2 space-y-1 text-sm text-body-muted list-disc list-inside">
            <li><strong>Aspect Ratio</strong> — Original (source-native), Free (unconstrained), 1:1 (square), 4:5 (portrait), 9:16 (vertical), or 16:9 (widescreen).</li>
            <li><strong>Zoom</strong> — magnifies into the image. Higher values show a tighter crop window.</li>
            <li><strong>Offset X / Offset Y</strong> — pan the crop window. Values range from -100% to 100% of the centered position.</li>
          </ul>
          <p className="mt-2 text-sm leading-relaxed text-body-muted">
            The viewport transform uses bilinear sampling for smooth results at any zoom level. The crop window is always clamped to stay within source bounds.
          </p>
        </section>

        <section className="my-8">
          <h2 id="free-crop" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Free Crop Behavior
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-body-muted">
            The &quot;Free&quot; aspect ratio uses the zoom to compute the crop-window size directly — both width and height are divided by zoom equally, with no aspect-ratio constraint. This is useful when you want to export at a custom non-standard size.
          </p>
        </section>
      </>
    )
  },

  "docs/playground/controls": {
    title: "Effect Controls",
    description: "Intensity slider and advanced controls",
    component: () => (
      <>
        <h1 className="font-display text-2xl font-medium tracking-tight text-ink-primary md:text-3xl">
          Effect Controls
        </h1>

        <section className="my-8">
          <h2 id="intensity" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Intensity Slider
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-body-muted">
            Most presets have an <strong>Intensity</strong> slider (0–100%). At 0%, the effect is bypassed and the source image is returned unchanged. The slider maps to the preset&apos;s internal parameters via its <InlineCode>intensityMapper</InlineCode> function, which may scale multiple parameters simultaneously.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-body-muted">
            Some presets (like Stipple Print and LED Matrix) set <InlineCode>usesIntensity: false</InlineCode> — they have no intensity slider and are always fully active through their advanced controls.
          </p>
        </section>

        <section className="my-8">
          <h2 id="advanced-controls" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Advanced Controls
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-body-muted">
            Each preset defines its own <InlineCode>advancedControlSchema</InlineCode> — an array of control definitions that the right panel renders automatically. Supported control types are:
          </p>
          <ul className="mt-2 space-y-1 text-sm text-body-muted list-disc list-inside">
            <li><strong>range</strong> — Slider with min, max, and step. Returns a number.</li>
            <li><strong>select</strong> — Dropdown with predefined options. Returns a string.</li>
            <li><strong>color</strong> — Color picker. Returns a hex string (e.g., <InlineCode>#ff006e</InlineCode>).</li>
            <li><strong>boolean</strong> — Toggle. Returns <InlineCode>true</InlineCode> or <InlineCode>false</InlineCode>.</li>
            <li><strong>text</strong> — Text input. Returns a string.</li>
          </ul>
        </section>

        <section className="my-8">
          <h2 id="reset" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Resetting Controls
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-body-muted">
            Use the <strong>Reset effect</strong> link in the control panel to reset all advanced overrides back to the preset defaults while keeping the current effect selected. The overall <strong>Reset</strong> button in the toolbar resets everything (crop, effect, output).
          </p>
        </section>
      </>
    )
  },

  "docs/playground/exporting": {
    title: "Exporting",
    description: "Format, quality, and resolution options",
    component: () => (
      <>
        <h1 className="font-display text-2xl font-medium tracking-tight text-ink-primary md:text-3xl">
          Exporting
        </h1>

        <section className="my-8">
          <h2 id="export-dialog" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Export Dialog
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-body-muted">
            Click the <strong>Export</strong> button in the editor toolbar to open the export dialog. You must be signed in to export. The dialog offers three options:
          </p>
        </section>

        <section className="my-8">
          <h2 id="format" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Format
          </h2>
          <ul className="mt-2 space-y-1 text-sm text-body-muted list-disc list-inside">
            <li><strong>PNG</strong> — Lossless. Best for graphics, text art, and images requiring transparency. Largest file size.</li>
            <li><strong>JPEG</strong> — Lossy with adjustable quality. Best for photos where file size matters more than pixel-perfect fidelity.</li>
            <li><strong>WebP</strong> — Modern format with lossy compression. Smaller files than JPEG at equivalent quality. Supported by modern browsers.</li>
          </ul>
        </section>

        <section className="my-8">
          <h2 id="quality" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Quality
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-body-muted">
            Adjustable from 50–100%. Applies to JPEG and WebP formats. PNG is always lossless regardless of this setting.
          </p>
        </section>

        <section className="my-8">
          <h2 id="resolution" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Resolution
          </h2>
          <ul className="mt-2 space-y-1 text-sm text-body-muted list-disc list-inside">
            <li><strong>1080</strong> — Export at 1080px on the longest edge. Good for social media.</li>
            <li><strong>Original</strong> — Full source resolution (subject to crop).</li>
            <li><strong>4K</strong> — 3840px on the longest edge.</li>
          </ul>
          <p className="mt-2 text-sm leading-relaxed text-body-muted">
            The output dimensions are computed via <InlineCode>getExportDimensions</InlineCode> which scales the cropped source to the requested longest edge while preserving aspect ratio.
          </p>
        </section>

        <section className="my-8">
          <h2 id="how-export-works" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            How Export Works
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-body-muted">
            When you click Export, the editor crops your source image, runs the preset pipeline at full resolution, transfers the result <InlineCode>PixelBuffer</InlineCode> from the worker, draws it onto an offscreen canvas, and calls <InlineCode>canvas.toBlob()</InlineCode> with your chosen format and quality. The resulting blob is downloaded as a file.
          </p>
        </section>
      </>
    )
  },

  // ====== EFFECTS CATALOG ======
  "docs/effects": {
    title: "All Effects",
    description: "Browse every preset effect",
    component: () => {
      const categories = Object.entries(categoryInfo);

      return (
        <>
          <h1 className="font-display text-2xl font-medium tracking-tight text-ink-primary md:text-3xl">
            Effects Catalog
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-body-muted">
            EffectSoup ships with {allPresets.length} presets across {categories.length} categories. Browse by category below, or visit individual effect pages for full control documentation.
          </p>

          {categories.map(([catId, catInfo]) => {
            const catPresets = getEffectsByCategory(catId as import("@effectsoup/presets").PresetCategory);
            if (catPresets.length === 0) return null;

            return (
              <section key={catId} className="my-10">
                <div className="mb-4">
                  <Badge variant="muted" className="mb-2">{catInfo.name}</Badge>
                  <h2 id={catId} className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary">
                    {catInfo.name}
                  </h2>
                  <p className="mt-1 text-sm text-body-muted">{catInfo.description}</p>
                  <p className="mt-1 text-xs text-muted"><strong>Best for:</strong> {catInfo.bestFor}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {catPresets.map((preset) => (
                    <Link
                      key={preset.id}
                      href={`/docs/effects/${preset.id}`}
                      className="group rounded-sm border border-hairline p-4 hover:border-ink/20 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-ink-primary group-hover:text-accent transition-colors">
                          {preset.name}
                        </h3>
                        <Badge variant="muted" className="text-[10px]">{catInfo.name}</Badge>
                      </div>
                      <p className="mt-1.5 text-xs leading-relaxed text-body-muted line-clamp-2">
                        {preset.description}
                      </p>
                      <div className="mt-2 flex items-center gap-3 text-[11px] text-muted">
                        <span>Intensity: {preset.usesIntensity === false ? "Always on" : `${preset.defaultIntensity}%`}</span>
                        <span>{preset.advancedControlSchema.length} controls</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </>
      );
    }
  },

  // ====== API REFERENCE ======
  "docs/api/core": {
    title: "@effectsoup/core",
    description: "PixelBuffer, image primitives, and utilities",
    component: () => (
      <>
        <h1 className="font-display text-2xl font-medium tracking-tight text-ink-primary md:text-3xl">
          <InlineCode>@effectsoup/core</InlineCode>
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-body-muted">
          Pure TypeScript image-processing primitives. No DOM dependencies — safe to run in browsers and Node.js.
        </p>

        <section className="my-8">
          <h2 id="pixelbuffer" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            PixelBuffer
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-body-muted">
            The fundamental image currency in EffectSoup. Every function reads or writes a PixelBuffer.
          </p>
          <ApiSignature signature={`type PixelBuffer = {\n  width: number;\n  height: number;\n  data: Uint8ClampedArray;\n};`} />

          <ParamsTable params={[
            { name: "width", type: "number", description: "Width in pixels" },
            { name: "height", type: "number", description: "Height in pixels" },
            { name: "data", type: "Uint8ClampedArray", description: "RGBA pixel data, length = width × height × 4" }
          ]} />
        </section>

        <section className="my-8">
          <h2 id="buffer-utils" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Buffer Utilities
          </h2>

          <ApiSignature signature={`createPixelBuffer(width: number, height: number, fill?: RgbaColor): PixelBuffer`} />
          <p className="mt-1 text-sm leading-relaxed text-body-muted">Create a new zero-initialized PixelBuffer. Optionally fill with a color.</p>

          <ApiSignature signature={`clonePixelBuffer(buffer: PixelBuffer): PixelBuffer`} />
          <p className="mt-1 text-sm leading-relaxed text-body-muted">Deep-copy a PixelBuffer (new data array, same dimensions).</p>

          <ApiSignature signature={`fillPixelBuffer(buffer: PixelBuffer, color: RgbaColor): void`} />
          <p className="mt-1 text-sm leading-relaxed text-body-muted">Fill an existing buffer with a solid color in-place.</p>

          <ApiSignature signature={`pixelIndex(buffer: PixelBuffer, x: number, y: number): number`} />
          <p className="mt-1 text-sm leading-relaxed text-body-muted">Get the data array index for pixel (x, y).</p>

          <ApiSignature signature={`clampByte(value: number): number`} />
          <p className="mt-1 text-sm leading-relaxed text-body-muted">Clamp a number to 0–255, rounding. Returns 0 for NaN/Infinity.</p>
        </section>

        <section className="my-8">
          <h2 id="color-transforms" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Color Transforms
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-body-muted">
            All color functions modify the buffer <strong>in-place</strong> unless noted.
          </p>

          <ApiSignature signature={`toGrayscale(buffer: PixelBuffer): void`} />
          <p className="mt-1 text-sm leading-relaxed text-body-muted">Convert to grayscale using luminance weights (0.299 R, 0.587 G, 0.114 B).</p>

          <ApiSignature signature={`adjustBrightnessContrast(buffer: PixelBuffer, brightness: number, contrast: number): void`} />
          <p className="mt-1 text-sm leading-relaxed text-body-muted">Adjust brightness (-255 to 255) and contrast (-1 to 1).</p>

          <ApiSignature signature={`adjustSaturation(buffer: PixelBuffer, saturation: number): void`} />
          <p className="mt-1 text-sm leading-relaxed text-body-muted">Adjust saturation (-1 to 1).</p>

          <ApiSignature signature={`applyDuotone(buffer: PixelBuffer, shadow: RgbaColor, highlight: RgbaColor): void`} />
          <p className="mt-1 text-sm leading-relaxed text-body-muted">Map luminance to a gradient between two colors.</p>

          <ApiSignature signature={`applyPosterize(buffer: PixelBuffer, levels: number): void`} />
          <p className="mt-1 text-sm leading-relaxed text-body-muted">Reduce per-channel levels (2–256).</p>

          <ApiSignature signature={`reducePalette(buffer: PixelBuffer, colorCount: number): void`} />
          <p className="mt-1 text-sm leading-relaxed text-body-muted">Uniform per-channel quantization. Actual output colors ≈ round(cbrt(colorCount))³.</p>

          <ApiSignature signature={`applyTint(buffer: PixelBuffer, tint: RgbaColor, amount: number): void`} />
          <p className="mt-1 text-sm leading-relaxed text-body-muted">Blend each pixel toward a tint color (0–1).</p>

          <ApiSignature signature={`averageColor(buffer: PixelBuffer): RgbaColor`} />
          <p className="mt-1 text-sm leading-relaxed text-body-muted">Compute the average RGBA color of a buffer.</p>
        </section>

        <section className="my-8">
          <h2 id="viewport" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Viewport Transform
          </h2>

          <ApiSignature signature={`applyViewportTransform(source: PixelBuffer, viewport: CropConfig, outputWidth: number, outputHeight: number): PixelBuffer`} />
          <p className="mt-1 text-sm leading-relaxed text-body-muted">Apply a non-destructive crop/zoom/offset to a source buffer. Returns a new buffer with bilinear interpolation.</p>

          <ApiSignature signature={`getCroppedOutputSize(sourceWidth: number, sourceHeight: number, aspectRatio: CropConfig['aspectRatio'], longestEdge: number, zoom?: number): { width: number; height: number }`} />
          <p className="mt-1 text-sm leading-relaxed text-body-muted">Compute output dimensions for a given aspect ratio and longest-edge constraint.</p>

          <ApiSignature signature={`parseAspectRatio(ratio: CropConfig['aspectRatio']): number | null`} />
          <p className="mt-1 text-sm leading-relaxed text-body-muted">Parse a CropConfig aspect ratio to a numeric W/H value. Returns null for &quot;original&quot;.</p>
        </section>

        <section className="my-8">
          <h2 id="dithering" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Dithering
          </h2>

          <ApiSignature signature={`applyOrderedDither(buffer: PixelBuffer, threshold: number): void`} />
          <p className="mt-1 text-sm leading-relaxed text-body-muted">Apply 8×8 Bayer ordered dither in-place.</p>

          <ApiSignature signature={`applyFloydSteinbergDither(buffer: PixelBuffer, threshold: number): void`} />
          <p className="mt-1 text-sm leading-relaxed text-body-muted">Apply Floyd-Steinberg error diffusion dither in-place.</p>

          <ApiSignature signature={`applyOrderedColorDither(buffer: PixelBuffer, options: OrderedColorDitherOptions): PixelBuffer`} />
          <p className="mt-1 text-sm leading-relaxed text-body-muted">Cell-based ordered color dither with Bayer luminance offsets.</p>
        </section>

        <section className="my-8">
          <h2 id="halftone" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Halftone
          </h2>

          <ApiSignature signature={`renderHalftoneData(source: PixelBuffer, options: HalftoneOptions): PixelBuffer`} />
          <p className="mt-1 text-sm leading-relaxed text-body-muted">Render a colored dot halftone with configurable dot spacing, size, shape, palette, and color mode.</p>
        </section>

        <section className="my-8">
          <h2 id="ascii" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            ASCII Rendering
          </h2>

          <ApiSignature signature={`renderAscii(source: PixelBuffer, options: AsciiOptions): PixelBuffer`} />
          <p className="mt-1 text-sm leading-relaxed text-body-muted">Render an image as ASCII art with configurable charset, font size, color mode, ink color, and background.</p>

          <ApiSignature signature={`normalizeCustomCharset(charset: string, fallback: string): string`} />
          <p className="mt-1 text-sm leading-relaxed text-body-muted">Validate and normalize a custom character set for ASCII rendering.</p>
        </section>

        <section className="my-8">
          <h2 id="glow-blend" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Glow &amp; Bloom
          </h2>

          <ApiSignature signature={`applyGlow(buffer: PixelBuffer, options: GlowOptions): void`} />
          <p className="mt-1 text-sm leading-relaxed text-body-muted">Apply a glow effect with screen-mode bloom. Options: radius, amount, mode.</p>

          <ApiSignature signature={`applyHeadroomBloom(base: PixelBuffer, mask: PixelBuffer, options: HeadroomBloomOptions): PixelBuffer`} />
          <p className="mt-1 text-sm leading-relaxed text-body-muted">Additive screen composite that preserves headroom — only lifts channels below 255.</p>

          <ApiSignature signature={`extractHighlightMask(source: PixelBuffer, options: HighlightMaskOptions): PixelBuffer`} />
          <p className="mt-1 text-sm leading-relaxed text-body-muted">Extract a luminance-keyed highlight mask with configurable threshold and knee width.</p>

          <ApiSignature signature={`applyBoxBlur(buffer: PixelBuffer, radius: number): void`} />
          <p className="mt-1 text-sm leading-relaxed text-body-muted">Apply a box blur in-place.</p>
        </section>

        <section className="my-8">
          <h2 id="stipple" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Stipple
          </h2>

          <ApiSignature signature={`renderStipple(source: PixelBuffer, options: StippleOptions): PixelBuffer`} />
          <p className="mt-1 text-sm leading-relaxed text-body-muted">Render a hand-drawn stipple illustration using dot density to model tone.</p>
        </section>

        <section className="my-8">
          <h2 id="distortion" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Distortion &amp; Glass
          </h2>

          <ApiSignature signature={`applyGlass(source: PixelBuffer, options: GlassOptions): PixelBuffer`} />
          <p className="mt-1 text-sm leading-relaxed text-body-muted">Apply a faceted glass distortion effect with refraction-like offsets.</p>

          <ApiSignature signature={`applyCrtGlitch(source: PixelBuffer, options: CrtGlitchOptions): PixelBuffer`} />
          <p className="mt-1 text-sm leading-relaxed text-body-muted">Apply CRT glitch with horizontal slice shifts, RGB separation, scanlines, and noise.</p>

          <ApiSignature signature={`glitch(source: PixelBuffer, options: GlitchOptions): PixelBuffer`} />
          <p className="mt-1 text-sm leading-relaxed text-body-muted">Apply glitch effect with horizontal block slicing and displacement.</p>

          <ApiSignature signature={`waveSlice(source: PixelBuffer, options: WaveSliceOptions): PixelBuffer`} />
          <p className="mt-1 text-sm leading-relaxed text-body-muted">Apply a sinusoidal wave distortion effect.</p>
        </section>

        <section className="my-8">
          <h2 id="bitmap" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Bitmap Pixelation
          </h2>

          <ApiSignature signature={`applyBitmap(source: PixelBuffer, options: BitmapOptions): PixelBuffer`} />
          <p className="mt-1 text-sm leading-relaxed text-body-muted">Heavy pixelation with palette reduction and optional ordered dither.</p>
        </section>

        <section className="my-8">
          <h2 id="other" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Other Primitives
          </h2>

          <ApiSignature signature={`applyGrain(buffer: PixelBuffer, amount: number): void`} />
          <p className="mt-1 text-sm leading-relaxed text-body-muted">Apply film grain noise in-place (0–1).</p>

          <ApiSignature signature={`applyVignette(buffer: PixelBuffer, amount: number): void`} />
          <p className="mt-1 text-sm leading-relaxed text-body-muted">Apply a radial vignette darkening in-place (0–1).</p>

          <ApiSignature signature={`applyGridOverlay(buffer: PixelBuffer, options: GridOptions): void`} />
          <p className="mt-1 text-sm leading-relaxed text-body-muted">Draw grid lines on top of the image in-place.</p>

          <ApiSignature signature={`applyScanlines(buffer: PixelBuffer, strength: number): void`} />
          <p className="mt-1 text-sm leading-relaxed text-body-muted">Apply CRT scanline overlay in-place.</p>

          <ApiSignature signature={`applyEdgeDetect(source: PixelBuffer): PixelBuffer`} />
          <p className="mt-1 text-sm leading-relaxed text-body-muted">Edge detection (returns a new buffer).</p>

          <ApiSignature signature={`blendPixelBuffers(a: PixelBuffer, b: PixelBuffer, mode: BlendMode, opacity: number): PixelBuffer`} />
          <p className="mt-1 text-sm leading-relaxed text-body-muted">Blend two buffers with the given mode (e.g. &quot;screen&quot;, &quot;soft&quot;) and opacity.</p>

          <ApiSignature signature={`applyLedMatrix(source: PixelBuffer, options: LedMatrixOptions): PixelBuffer`} />
          <p className="mt-1 text-sm leading-relaxed text-body-muted">Render an LED dot matrix simulation.</p>

          <ApiSignature signature={`applyPencilGrain(source: PixelBuffer, options: PencilGrainOptions): PixelBuffer`} />
          <p className="mt-1 text-sm leading-relaxed text-body-muted">Render a graphite pencil sketch effect.</p>

          <ApiSignature signature={`applyHighlights(source: PixelBuffer, options: HighlightsOptions): PixelBuffer`} />
          <p className="mt-1 text-sm leading-relaxed text-body-muted">Enhance or extract highlight regions.</p>

          <ApiSignature signature={`applyMangaScanlines(source: PixelBuffer, options: MangaOptions): PixelBuffer`} />
          <p className="mt-1 text-sm leading-relaxed text-body-muted">Manga/comic-style screen tone pattern overlay.</p>

          <ApiSignature signature={`invertedGlow(source: PixelBuffer, options: InvertedGlowOptions): PixelBuffer`} />
          <p className="mt-1 text-sm leading-relaxed text-body-muted">Inverted-style glow effect.</p>

          <ApiSignature signature={`resizeNearestNeighbor(source: PixelBuffer, width: number, height: number): PixelBuffer`} />
          <p className="mt-1 text-sm leading-relaxed text-body-muted">Nearest-neighbor resize. Returns a new buffer.</p>

          <ApiSignature signature={`resizeBilinear(source: PixelBuffer, width: number, height: number): PixelBuffer`} />
          <p className="mt-1 text-sm leading-relaxed text-body-muted">Bilinear resize. Returns a new buffer.</p>
        </section>

        <section className="my-8">
          <h2 id="types" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Shared Types
          </h2>

          <ApiSignature signature={`type RgbaColor = [number, number, number, number];`} />
          <p className="mt-1 text-sm leading-relaxed text-body-muted">RGBA color tuple. Components are 0–255. Alpha is typically 255 for opaque colors.</p>

          <ApiSignature signature={`type CropConfig = {\n  aspectRatio: "original" | "free" | "1:1" | "4:5" | "9:16" | "16:9";\n  zoom: number;\n  offsetX: number;\n  offsetY: number;\n};`} />

          <ApiSignature signature={`type OutputOptions = {\n  format: "png" | "jpeg" | "webp";\n  width: number;\n  height: number;\n  backgroundColor?: string;\n  quality?: number;\n};`} />
        </section>
      </>
    )
  },

  "docs/api/presets": {
    title: "@effectsoup/presets",
    description: "EffectPreset, pipeline, and lookup",
    component: () => (
      <>
        <h1 className="font-display text-2xl font-medium tracking-tight text-ink-primary md:text-3xl">
          <InlineCode>@effectsoup/presets</InlineCode>
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-body-muted">
          Effect presets that bundle core primitives into tunable pipelines. Each preset exposes an Intensity slider and optional advanced controls.
        </p>

        <section className="my-8">
          <h2 id="effectpreset" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            EffectPreset
          </h2>
          <ApiSignature signature={`type EffectPreset = {\n  id: string;\n  name: string;\n  description: string;\n  category: PresetCategory;\n  defaultIntensity: number;\n  usesIntensity?: boolean;\n  intensityMapper: IntensityMapper;\n  advancedControlSchema: AdvancedControlDefinition[];\n  createPipeline: (params: ResolvedPresetParameters) => EffectPipeline;\n};`} />

          <ParamsTable params={[
            { name: "id", type: "string", description: "Unique identifier (e.g. 'dotHalftone')" },
            { name: "name", type: "string", description: "Human-readable display name" },
            { name: "description", type: "string", description: "Short description of the effect" },
            { name: "category", type: "PresetCategory", description: "Category grouping" },
            { name: "defaultIntensity", type: "number", description: "Default intensity value (0–100)" },
            { name: "usesIntensity", type: "boolean", description: "Whether the intensity slider is shown (defaults to true)" },
            { name: "intensityMapper", type: "IntensityMapper", description: "Converts slider + advanced overrides to resolved parameters" },
            { name: "advancedControlSchema", type: "AdvancedControlDefinition[]", description: "Control definitions rendered automatically by the UI" },
            { name: "createPipeline", type: "(params) => EffectPipeline", description: "Builds a render pipeline from resolved parameters" }
          ]} />
        </section>

        <section className="my-8">
          <h2 id="preset-category" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            PresetCategory
          </h2>
          <ApiSignature signature={`type PresetCategory =\n  | "pixelDither"\n  | "asciiSymbols"\n  | "printPaper"\n  | "distortionGlass"\n  | "colorGlow"\n  | "atmosphereGlow"\n  | "retroSignal";`} />
        </section>

        <section className="my-8">
          <h2 id="advanced-control" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            AdvancedControlDefinition
          </h2>
          <ApiSignature signature={`type AdvancedControlDefinition = {\n  id: string;\n  name: string;\n  type: "range" | "select" | "color" | "boolean" | "text";\n  min?: number;\n  max?: number;\n  step?: number;\n  options?: string[];\n  defaultValue: number | string | boolean;\n};`} />
        </section>

        <section className="my-8">
          <h2 id="preset-lookup" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Preset Lookup
          </h2>

          <ApiSignature signature={`export const allPresets: EffectPreset[]`} />
          <p className="mt-1 text-sm leading-relaxed text-body-muted">All registered presets as an array.</p>

          <ApiSignature signature={`export function getPresetById(id: string): EffectPreset | undefined`} />
          <p className="mt-1 text-sm leading-relaxed text-body-muted">Find a preset by its ID. Supports legacy ID migration.</p>

          <ApiSignature signature={`export function getPresetIds(): string[]`} />
          <p className="mt-1 text-sm leading-relaxed text-body-muted">Get an array of all preset IDs.</p>

          <ApiSignature signature={`export function hasPresetId(id: string): boolean`} />
          <p className="mt-1 text-sm leading-relaxed text-body-muted">Check if a preset ID exists (supports legacy IDs).</p>

          <ApiSignature signature={`export function migratePresetId(id: string): string`} />
          <p className="mt-1 text-sm leading-relaxed text-body-muted">Map legacy IDs to modern replacements. Returns the input if no migration is needed.</p>
        </section>

        <section className="my-8">
          <h2 id="pipeline" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Pipeline Types
          </h2>

          <ApiSignature signature={`type IntensityMapper = (\n  intensity: number,\n  advancedOverrides: Record<string, number | string | boolean>\n) => ResolvedPresetParameters;`} />
          <p className="mt-1 text-sm leading-relaxed text-body-muted">Maps the 0–100 intensity slider value and any advanced overrides to resolved pipeline parameters.</p>

          <ApiSignature signature={`type ResolvedPresetParameters = {\n  intensity: number;\n  advancedOverrides: Record<string, number | string | boolean>;\n  [key: string]: unknown;\n};`} />
          <p className="mt-1 text-sm leading-relaxed text-body-muted">Resolved parameters ready for the pipeline. The typed fields plus any effect-specific params.</p>

          <ApiSignature signature={`type EffectPipeline = (\n  source: PixelBuffer,\n  params: ResolvedPresetParameters\n) => PixelBuffer;`} />
          <p className="mt-1 text-sm leading-relaxed text-body-muted">A function that takes a source buffer and resolved parameters, returns the output buffer.</p>
        </section>

        <section className="my-8">
          <h2 id="usage" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Usage
          </h2>
          <CodeBlock code={`import { getPresetById } from "@effectsoup/presets";
import type { PixelBuffer } from "@effectsoup/core";

const preset = getPresetById("dotHalftone")!;

// Map the intensity slider (0–100) to internal params.
const params = preset.intensityMapper(75, {});

// Build and run the pipeline.
const pipeline = preset.createPipeline(params);
const output: PixelBuffer = pipeline(source, params);`} language="typescript" />
        </section>

        <section className="my-8">
          <h2 id="advanced-override" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Overriding Advanced Controls
          </h2>
          <CodeBlock code={`const preset = getPresetById("dotHalftone")!;

// Start from schema defaults, then override specific controls.
const overrides: Record<string, number | string | boolean> = {};
// Override only the values you care about:
overrides.dotSize = 8;

const params = preset.intensityMapper(75, overrides);
const output = preset.createPipeline(params)(source, params);`} language="typescript" />
        </section>
      </>
    )
  },

  "docs/api/worker": {
    title: "@effectsoup/worker",
    description: "Web Worker client and rendering",
    component: () => (
      <>
        <h1 className="font-display text-2xl font-medium tracking-tight text-ink-primary md:text-3xl">
          <InlineCode>@effectsoup/worker</InlineCode>
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-body-muted">
          Web Worker client that runs heavy rendering off the main thread. Handles job versioning, cancellation of stale renders, and buffer transfer.
        </p>

        <section className="my-8">
          <h2 id="effects-worker-client" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            EffectsWorkerClient
          </h2>
          <ApiSignature signature={`class EffectsWorkerClient {\n  constructor(workerScriptUrl: string | URL);\n  render(options: RenderOptions): Promise<PixelBuffer>;\n  cancelObsolete(version: number): void;\n  terminate(): void;\n}`} />
        </section>

        <section className="my-8">
          <h2 id="render-options" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            RenderOptions
          </h2>
          <ApiSignature signature={`type RenderOptions = {\n  presetId: string;\n  resolvedParameters: ResolvedPresetParameters;\n  source: PixelBuffer;\n  crop: CropConfig;\n  targetWidth: number;\n  targetHeight: number;\n};`} />
        </section>

        <section className="my-8">
          <h2 id="usage" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Usage
          </h2>
          <CodeBlock code={`import { EffectsWorkerClient } from "@effectsoup/worker";

// Point the client at the worker script. The exact path depends on your bundler.
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

// Clean up when done.
client.terminate();`} language="typescript" />

          <Callout variant="note">
            The worker script URL depends on your bundler. In Vite you can use the <InlineCode>?worker</InlineCode> import syntax. In other setups, point to <InlineCode>dist/worker.js</InlineCode>.
          </Callout>
        </section>

        <section className="my-8">
          <h2 id="versioning" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Job Versioning &amp; Cancellation
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-body-muted">
            Each <InlineCode>render()</InlineCode> call increments an internal version counter. If a new render is requested before a previous one completes, the worker checks the version before posting the result — stale results are silently discarded. Use <InlineCode>cancelObsolete(version)</InlineCode> to signal that a specific version should be ignored.
          </p>
        </section>

        <section className="my-8">
          <h2 id="buffer-transfer" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Buffer Transfer
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-body-muted">
            The worker transfers the source buffer&apos;s underlying <InlineCode>ArrayBuffer</InlineCode> via <InlineCode>postMessage</InlineCode> to avoid copying pixel data. This means the source buffer is emptied after posting. The result buffer is also transferred back.
          </p>
        </section>
      </>
    )
  },

  "docs/api/meta-package": {
    title: "@effectsoup/effectsoup",
    description: "All-in-one meta-package",
    component: () => (
      <>
        <h1 className="font-display text-2xl font-medium tracking-tight text-ink-primary md:text-3xl">
          <InlineCode>@effectsoup/effectsoup</InlineCode>
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-body-muted">
          The meta-package re-exports everything from <InlineCode>@effectsoup/core</InlineCode>, <InlineCode>@effectsoup/presets</InlineCode>, and <InlineCode>@effectsoup/worker</InlineCode>.
        </p>

        <section className="my-8">
          <h2 id="install" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Installation
          </h2>
          <CodeBlock code={`pnpm add @effectsoup/effectsoup`} language="bash" />
          <p className="mt-2 text-sm leading-relaxed text-body-muted">
            This installs all three sub-packages as dependencies. Import anything from the meta-package entry point:
          </p>
        </section>

        <section className="my-8">
          <h2 id="usage" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Usage
          </h2>
          <CodeBlock code={`// All exports available from one package.
import { createPixelBuffer, toGrayscale } from "@effectsoup/effectsoup";
import { getPresetById, allPresets } from "@effectsoup/effectsoup";
import { EffectsWorkerClient } from "@effectsoup/effectsoup";
import type { PixelBuffer, EffectPreset } from "@effectsoup/effectsoup";`} language="typescript" />
        </section>

        <section className="my-8">
          <h2 id="when-to-use" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            When to Use
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-body-muted">
            Install the meta-package when you want the entire EffectSoup engine with a single dependency. Use individual packages when you only need specific parts (e.g., if you only want core primitives without the Worker dependency).
          </p>
        </section>
      </>
    )
  },

  // ====== GUIDES ======
  "docs/guides/creating-an-effect": {
    title: "Creating an Effect",
    description: "Anatomy of an EffectPreset",
    component: () => (
      <>
        <h1 className="font-display text-2xl font-medium tracking-tight text-ink-primary md:text-3xl">
          Creating an Effect
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-body-muted">
          Every effect in EffectSoup is an <InlineCode>EffectPreset</InlineCode> object. This guide walks through the anatomy of a preset and shows how to add a new one.
        </p>

        <section className="my-8">
          <h2 id="preset-structure" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Preset Structure
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-body-muted">
            A preset is a plain object with these required fields:
          </p>
          <ul className="mt-2 space-y-1 text-sm text-body-muted list-disc list-inside">
            <li><strong>id</strong> — Unique string identifier (kebab-case, e.g. <InlineCode>{'"dotHalftone"'}</InlineCode>).</li>
            <li><strong>name</strong> — Display name shown in the UI.</li>
            <li><strong>description</strong> — Short description of the visual result.</li>
            <li><strong>category</strong> — One of the <InlineCode>PresetCategory</InlineCode> values.</li>
            <li><strong>defaultIntensity</strong> — Default slider value (0–100).</li>
            <li><strong>usesIntensity</strong> — Optional. Set to <InlineCode>false</InlineCode> to hide the slider.</li>
            <li><strong>intensityMapper</strong> — Function that converts intensity + overrides to resolved params.</li>
            <li><strong>advancedControlSchema</strong> — Array of control definitions for the UI to render.</li>
            <li><strong>createPipeline</strong> — Function that returns the render pipeline from resolved params.</li>
          </ul>
        </section>

        <section className="my-8">
          <h2 id="minimal-example" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Minimal Preset Example
          </h2>
          <CodeBlock code={`import {
  clonePixelBuffer,
  toGrayscale,
  type PixelBuffer
} from "@effectsoup/core";
import type {
  EffectPipeline,
  EffectPreset,
  ResolvedPresetParameters
} from "../../types.js";

export const myPreset: EffectPreset = {
  id: "myEffect",
  name: "My Effect",
  description: "A custom grayscale effect",
  category: "colorGlow",
  defaultIntensity: 50,
  advancedControlSchema: [
    { id: "brightness", name: "Brightness", type: "range", min: -50, max: 50, step: 1, defaultValue: 0 }
  ],
  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({
    intensity,
    advancedOverrides: overrides,
    brightness: (overrides.brightness as number) ?? 0
  }),
  createPipeline: (params): EffectPipeline => {
    return (source: PixelBuffer) => {
      if (params.intensity === 0) return clonePixelBuffer(source);

      const result = clonePixelBuffer(source);
      toGrayscale(result);
      return result;
    };
  }
};`} language="typescript" />
        </section>

        <section className="my-8">
          <h2 id="registration" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Registration
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-body-muted">
            To make your preset discoverable, import and add it to the <InlineCode>allPresets</InlineCode> array in <InlineCode>packages/effectsPresets/src/index.ts</InlineCode>:
          </p>
          <CodeBlock code={`import { myPreset } from "./presets/free/myPreset.js";

export const allPresets: EffectPreset[] = [
  // ... existing presets
  myPreset
];`} language="typescript" />

          <Callout variant="tip">
            Presets are auto-discovered by the UI through the <InlineCode>allPresets</InlineCode> export. The advanced controls render automatically — no UI code changes needed.
          </Callout>
        </section>

        <section className="my-8">
          <h2 id="best-practices" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Best Practices
          </h2>
          <ul className="mt-2 space-y-1 text-sm text-body-muted list-disc list-inside">
            <li>Clone the source buffer before mutating (use <InlineCode>clonePixelBuffer</InlineCode>).</li>
            <li>Return the source clone unchanged at intensity 0 — this is expected by test conventions and the UI.</li>
            <li>Use <InlineCode>runAtWorkingResolution</InlineCode> for per-pixel effects to keep performance consistent across image sizes.</li>
            <li>Use shared controls from <InlineCode>shared.ts</InlineCode> (<InlineCode>adjustmentControls</InlineCode>, <InlineCode>atmosphereAdvancedControls</InlineCode>) for consistency.</li>
            <li>Write deterministic effects — same input + same params = same output. This enables reliable testing and preview caching.</li>
            <li>Add tests to <InlineCode>presets.test.ts</InlineCode> following the existing patterns.</li>
          </ul>
        </section>

        <section className="my-8">
          <h2 id="pipeline-conventions" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Pipeline Conventions
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-body-muted">
            The pipeline receives a <InlineCode>PixelBuffer</InlineCode> that has already been cropped by the viewport transform. It should <strong>not</strong> modify the source buffer. The return value should be a new buffer (usually via <InlineCode>clonePixelBuffer</InlineCode> and then mutated, or by creating a fresh buffer).
          </p>
          <p className="mt-1 text-sm leading-relaxed text-body-muted">
            Advanced controls are resolved via <InlineCode>resolveOverride</InlineCode> from <InlineCode>shared.ts</InlineCode>, which safely extracts typed values from the overrides record.
          </p>
        </section>
      </>
    )
  },

  "docs/guides/testing-effects": {
    title: "Testing Effects",
    description: "Test conventions and best practices",
    component: () => (
      <>
        <h1 className="font-display text-2xl font-medium tracking-tight text-ink-primary md:text-3xl">
          Testing Effects
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-body-muted">
          EffectSoup uses Vitest (core) and the built-in test suite (presets) with deterministic rendering tests.
        </p>

        <section className="my-8">
          <h2 id="preset-tests" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Preset Tests
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-body-muted">
            Preset tests live in <InlineCode>packages/effectsPresets/src/presets.test.ts</InlineCode>. Each preset is tested for:
          </p>
          <ul className="mt-2 space-y-1 text-sm text-body-muted list-disc list-inside">
            <li><strong>Zero-intensity identity</strong> — At 0% intensity, the pipeline returns the source unchanged (a clone).</li>
            <li><strong>Output dimensions</strong> — The pipeline produces output at the requested size for common resolutions.</li>
            <li><strong>Rendering without errors</strong> — The pipeline runs successfully with default parameters.</li>
          </ul>
        </section>

        <section className="my-8">
          <h2 id="core-tests" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Core Tests
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-body-muted">
            Core primitive tests use Vitest and are colocated with the source files (<InlineCode>dither.test.ts</InlineCode>, <InlineCode>color.test.ts</InlineCode>, etc.). These test individual functions with known inputs and expected outputs.
          </p>
        </section>

        <section className="my-8">
          <h2 id="test-pattern" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Test Pattern
          </h2>
          <CodeBlock code={`import { describe, it, expect } from "vitest";
import { createPixelBuffer } from "@effectsoup/core";
import { myPreset } from "./presets/myPreset.js";

describe("myPreset", () => {
  it("returns source unchanged at 0% intensity", () => {
    const source = createPixelBuffer(4, 4);
    const params = myPreset.intensityMapper(0, {});
    const pipeline = myPreset.createPipeline(params);
    const result = pipeline(source, params);
    expect(result).toEqual(source);
  });

  it("produces output at requested size", () => {
    const source = createPixelBuffer(4, 4);
    const params = myPreset.intensityMapper(50, {});
    const pipeline = myPreset.createPipeline(params);
    const result = pipeline(source, params);
    expect(result.width).toBe(4);
    expect(result.height).toBe(4);
  });
});`} language="typescript" />
        </section>

        <section className="my-8">
          <h2 id="running-tests" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Running Tests
          </h2>
          <CodeBlock code={`# Run all tests
pnpm test

# Run presets tests only
pnpm --filter @effectsoup/presets test

# Run core tests only
pnpm --filter @effectsoup/core test

# Run web app tests
pnpm --filter web test`} language="bash" />

          <p className="mt-2 text-sm leading-relaxed text-body-muted">
            All tests must pass before committing. The CI pipeline runs typecheck, lint, and test on all packages.
          </p>
        </section>
      </>
    )
  },

  "docs/guides/architecture": {
    title: "Architecture",
    description: "Monorepo structure and rendering flow",
    component: () => (
      <>
        <h1 className="font-display text-2xl font-medium tracking-tight text-ink-primary md:text-3xl">
          Architecture
        </h1>

        <section className="my-8">
          <h2 id="monorepo" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Monorepo Structure
          </h2>
          <div className="rounded-sm border border-hairline bg-soft-stone/20 p-4 font-mono text-sm leading-relaxed text-body-muted">
            <p>effectsoup/</p>
            <p className="pl-4">apps/</p>
            <p className="pl-8">web/ — Next.js app (playground, editor, docs, home)</p>
            <p className="pl-4">packages/</p>
            <p className="pl-8">effectsCore/ — Pure TS image primitives</p>
            <p className="pl-8">effectsPresets/ — Effect presets and schema</p>
            <p className="pl-8">effectsWorker/ — Web Worker bridge</p>
            <p className="pl-8">effectsoup/ — Meta-package (re-exports)</p>
          </div>
        </section>

        <section className="my-8">
          <h2 id="render-flow" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Render Flow
          </h2>
          <ol className="mt-2 space-y-2 text-sm text-body-muted list-decimal list-inside">
            <li>User uploads an image → decoded into <InlineCode>PixelBuffer</InlineCode> via Canvas 2D.</li>
            <li>User adjusts crop/zoom/offset → <InlineCode>CropConfig</InlineCode> updated in editor state.</li>
            <li>User selects a preset → intensity defaults applied, advanced controls rendered from schema.</li>
            <li>Editor calls <InlineCode>intensityMapper(intensity, overrides)</InlineCode> → resolved params.</li>
            <li>Client sends <InlineCode>RenderJob</InlineCode> to the Web Worker via <InlineCode>postMessage</InlineCode>.</li>
            <li>Worker applies viewport transform, builds pipeline, runs effect, transfers result back.</li>
            <li>Main thread draws result back to canvas for preview or export.</li>
          </ol>
        </section>

        <section className="my-8">
          <h2 id="preset-lifecycle" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Preset Lifecycle
          </h2>
          <div className="rounded-sm border border-hairline bg-soft-stone/20 p-4 text-sm leading-relaxed text-body-muted">
            <p><strong>Definition time:</strong> Each preset is defined as a static <InlineCode>EffectPreset</InlineCode> object with a factory function for creating pipelines.</p>
            <p className="mt-2"><strong>Registration:</strong> Presets are imported and added to the <InlineCode>allPresets</InlineCode> array in the presets package index.</p>
            <p className="mt-2"><strong>Render time:</strong> <InlineCode>intensityMapper</InlineCode> is called first to resolve parameters. Then <InlineCode>createPipeline(params)</InlineCode> returns a render function. Finally the pipeline is called with the source buffer and resolved params.</p>
          </div>
        </section>

        <section className="my-8">
          <h2 id="worker-lifecycle" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Worker Lifecycle
          </h2>
          <ul className="mt-2 space-y-1 text-sm text-body-muted list-disc list-inside">
            <li>Created when <InlineCode>EffectsWorkerClient</InlineCode> is instantiated.</li>
            <li>Listens for <InlineCode>{'"render"'}</InlineCode> messages (with job payload).</li>
            <li>Listens for <InlineCode>{'"cancel"'}</InlineCode> messages to mark jobs as obsolete.</li>
            <li>Each render increments a version counter; if a previous render completes after a newer one started, the result is discarded.</li>
            <li>Results are posted back as <InlineCode>{'"renderResult"'}</InlineCode> with the output buffer transferred via <InlineCode>ArrayBuffer</InlineCode>.</li>
            <li>Call <InlineCode>client.terminate()</InlineCode> when done to clean up the worker.</li>
          </ul>
        </section>

        <section className="my-8">
          <h2 id="app-boundaries" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            App-to-Package Boundaries
          </h2>
          <ul className="mt-2 space-y-1 text-sm text-body-muted list-disc list-inside">
            <li>The web app imports from packages; packages never import from the app.</li>
            <li>Packages depend only on <InlineCode>@effectsoup/core</InlineCode> for types and primitives.</li>
            <li>The worker package is the only package that imports from both core and presets.</li>
            <li>All packages are pure TypeScript, browser-safe, and tree-shakeable.</li>
            <li>No package has a DOM, Node.js, or framework dependency.</li>
          </ul>
        </section>
      </>
    )
  },

  "docs/guides/performance": {
    title: "Performance",
    description: "Worker, preview, and optimization tips",
    component: () => (
      <>
        <h1 className="font-display text-2xl font-medium tracking-tight text-ink-primary md:text-3xl">
          Performance
        </h1>

        <section className="my-8">
          <h2 id="workers" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Web Workers
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-body-muted">
            EffectSoup runs all rendering in a Web Worker by default. This keeps the UI thread responsive during heavy computation. The worker handles crop, pipeline execution, and buffer creation — everything except canvas drawing and input decoding.
          </p>
        </section>

        <section className="my-8">
          <h2 id="preview-resolution" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Preview Resolution
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-body-muted">
            While adjusting controls, the editor renders at a reduced preview resolution (<InlineCode>previewLongest</InlineCode>). This keeps the UI responsive even on large photos. Full-resolution rendering happens only when you export.
          </p>
        </section>

        <section className="my-8">
          <h2 id="working-resolution" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Working Resolution
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-body-muted">
            Per-pixel effects (dithering, halftone, ASCII) use <InlineCode>runAtWorkingResolution</InlineCode> — they downsample the source to a maximum longest edge (typically 800px), run the effect, then nearest-neighbor upscale back to the original size. This ensures consistent visual density and avoids O(width × height) cost on large images.
          </p>
        </section>

        <section className="my-8">
          <h2 id="buffer-allocation" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Buffer Allocation
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-body-muted">
            <InlineCode>PixelBuffer</InlineCode> uses <InlineCode>Uint8ClampedArray</InlineCode> — a typed array that is fast to allocate and transfer. When sending to a worker, the underlying <InlineCode>ArrayBuffer</InlineCode> is transferred (zero-copy). Avoid unnecessary clones: prefer in-place mutation when the source buffer is not needed afterward.
          </p>
        </section>

        <section className="my-8">
          <h2 id="tips" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Optimization Tips
          </h2>
          <ul className="mt-2 space-y-1 text-sm text-body-muted list-disc list-inside">
            <li>Downsample before running effects on very large images (the editor already does this for previews).</li>
            <li>Use nearest-neighbor upscale for pixel/dithered effects (preserves sharp edges).</li>
            <li>Avoid creating many intermediate buffers in hot loops — reuse where possible.</li>
            <li>The worker handles one job at a time; rapid slider changes cancel previous renders automatically.</li>
            <li>All core functions are synchronous and pure — they can be called from any context (main thread, worker, Node.js).</li>
          </ul>
        </section>
      </>
    )
  },

  // ====== SUPPORT ======
  "docs/troubleshooting": {
    title: "Troubleshooting",
    description: "Common issues and solutions",
    component: () => (
      <>
        <h1 className="font-display text-2xl font-medium tracking-tight text-ink-primary md:text-3xl">
          Troubleshooting
        </h1>

        <section className="my-8">
          <h2 id="effect-weak" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Effect appears weak or too strong
          </h2>
          <dl className="mt-2 space-y-4 text-sm">
            <div>
              <dt className="font-medium text-ink-primary">Symptom</dt>
              <dd className="text-body-muted">The effect barely changes the image, or overwhelms it even at low intensity.</dd>
            </div>
            <div>
              <dt className="font-medium text-ink-primary">Likely cause</dt>
              <dd className="text-body-muted">The default intensity may not suit your image. Some effects are tuned for specific image types.</dd>
            </div>
            <div>
              <dt className="font-medium text-ink-primary">Resolution</dt>
              <dd className="text-body-muted">Adjust the Intensity slider incrementally. If the effect is too strong at 0%, check if the preset has <InlineCode>usesIntensity: false</InlineCode> — some effects are always-on. For those, use the advanced controls to reduce the effect strength.</dd>
            </div>
          </dl>
        </section>

        <section className="my-8">
          <h2 id="preview-differs" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Preview differs from exported result
          </h2>
          <dl className="mt-2 space-y-4 text-sm">
            <div>
              <dt className="font-medium text-ink-primary">Symptom</dt>
              <dd className="text-body-muted">The preview looks different from the downloaded image.</dd>
            </div>
            <div>
              <dt className="font-medium text-ink-primary">Likely cause</dt>
              <dd className="text-body-muted">The preview runs at a reduced resolution for performance. A lower-res preview can look sharper or softer than the full export.</dd>
            </div>
            <div>
              <dt className="font-medium text-ink-primary">Resolution</dt>
              <dd className="text-body-muted">This is expected behavior. Export at your desired resolution to see the final result.</dd>
            </div>
          </dl>
        </section>

        <section className="my-8">
          <h2 id="upload-fail" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Image upload fails
          </h2>
          <dl className="mt-2 space-y-4 text-sm">
            <div>
              <dt className="font-medium text-ink-primary">Symptom</dt>
              <dd className="text-body-muted">Error message when trying to upload an image.</dd>
            </div>
            <div>
              <dt className="font-medium text-ink-primary">Likely cause</dt>
              <dd className="text-body-muted">The file is over 20 MB, exceeds 25 megapixels decoded size, or is not a JPEG/PNG/WebP.</dd>
            </div>
            <div>
              <dt className="font-medium text-ink-primary">Resolution</dt>
              <dd className="text-body-muted">Check the file format and size. Resize very large images before uploading. Only JPEG, PNG, and WebP are accepted.</dd>
            </div>
          </dl>
        </section>

        <section className="my-8">
          <h2 id="slow-performance" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Slow performance on large images
          </h2>
          <dl className="mt-2 space-y-4 text-sm">
            <div>
              <dt className="font-medium text-ink-primary">Symptom</dt>
              <dd className="text-body-muted">The editor feels sluggish when adjusting controls on high-resolution photos.</dd>
            </div>
            <div>
              <dt className="font-medium text-ink-primary">Likely cause</dt>
              <dd className="text-body-muted">Very large images (e.g., 4000×6000px) require more processing time, especially for per-pixel effects.</dd>
            </div>
            <div>
              <dt className="font-medium text-ink-primary">Resolution</dt>
              <dd className="text-body-muted">Use smaller source images for faster previews. The preview already runs at reduced resolution. Export at full resolution when ready.</dd>
            </div>
          </dl>
        </section>

        <section className="my-8">
          <h2 id="export-fails" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Export fails
          </h2>
          <dl className="mt-2 space-y-4 text-sm">
            <div>
              <dt className="font-medium text-ink-primary">Symptom</dt>
              <dd className="text-body-muted">Export button does nothing or shows an error.</dd>
            </div>
            <div>
              <dt className="font-medium text-ink-primary">Likely cause</dt>
              <dd className="text-body-muted">You need to sign in to export. The Canvas <InlineCode>toBlob</InlineCode> API may fail on some browsers for very large images.</dd>
            </div>
            <div>
              <dt className="font-medium text-ink-primary">Resolution</dt>
              <dd className="text-body-muted">Sign in with your account. If export fails on a very large image, try a lower resolution setting or a different format.</dd>
            </div>
          </dl>
        </section>

        <section className="my-8">
          <h2 id="worker-fallback" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Worker not available
          </h2>
          <dl className="mt-2 space-y-4 text-sm">
            <div>
              <dt className="font-medium text-ink-primary">Symptom</dt>
              <dd className="text-body-muted">Rendering fails or the app never loads.</dd>
            </div>
            <div>
              <dt className="font-medium text-ink-primary">Likely cause</dt>
              <dd className="text-body-muted">The browser does not support Web Workers, or the worker script failed to load.</dd>
            </div>
            <div>
              <dt className="font-medium text-ink-primary">Resolution</dt>
              <dd className="text-body-muted">Use a modern browser (Chrome, Firefox, Safari, Edge). The worker script is required for rendering. If the issue persists, check the browser console for specific error messages.</dd>
            </div>
          </dl>
        </section>

        <section className="my-8">
          <h2 id="package-import" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Package import errors
          </h2>
          <dl className="mt-2 space-y-4 text-sm">
            <div>
              <dt className="font-medium text-ink-primary">Symptom</dt>
              <dd className="text-body-muted">TypeScript or build errors when importing from <InlineCode>@effectsoup/*</InlineCode> packages.</dd>
            </div>
            <div>
              <dt className="font-medium text-ink-primary">Likely cause</dt>
              <dd className="text-body-muted">Missing dependencies, incorrect import paths, or the package is not built.</dd>
            </div>
            <div>
              <dt className="font-medium text-ink-primary">Resolution</dt>
              <dd className="text-body-muted">Ensure the packages are installed (check <InlineCode>node_modules</InlineCode>). Run <InlineCode>pnpm build</InlineCode> to build all packages first. In the monorepo, run <InlineCode>pnpm install</InlineCode> from the root.</dd>
            </div>
          </dl>
        </section>

        <section className="my-8">
          <h2 id="preset-not-found" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary">
            Preset not found
          </h2>
          <dl className="mt-2 space-y-4 text-sm">
            <div>
              <dt className="font-medium text-ink-primary">Symptom</dt>
              <dd className="text-body-muted"><InlineCode>getPresetById</InlineCode> returns <InlineCode>undefined</InlineCode>.</dd>
            </div>
            <div>
              <dt className="font-medium text-ink-primary">Likely cause</dt>
              <dd className="text-body-muted">The preset ID is misspelled, using a legacy ID that was not migrated, or the preset is not registered.</dd>
            </div>
            <div>
              <dt className="font-medium text-ink-primary">Resolution</dt>
              <dd className="text-body-muted">Check <InlineCode>getPresetIds()</InlineCode> for all valid IDs. Legacy IDs from before migration are supported via <InlineCode>migratePresetId</InlineCode>. If the preset was removed, use its replacement.</dd>
            </div>
          </dl>
        </section>
      </>
    )
  },

  "docs/faq": {
    title: "FAQ",
    description: "Frequently asked questions",
    component: () => (
      <>
        <h1 className="font-display text-2xl font-medium tracking-tight text-ink-primary md:text-3xl">
          FAQ
        </h1>

        <dl className="mt-6 space-y-6 text-sm">
          <div>
            <dt className="font-medium text-ink-primary">Is EffectSoup AI-based?</dt>
            <dd className="mt-1 text-body-muted leading-relaxed">
              No. Every effect is a deterministic mathematical pipeline. No machine learning, no neural networks, no AI generation. The same image with the same settings always produces the same pixel output.
            </dd>
          </div>

          <div>
            <dt className="font-medium text-ink-primary">Is rendering local/client-side?</dt>
            <dd className="mt-1 text-body-muted leading-relaxed">
              Yes. All rendering happens in your browser using a Web Worker. Your image is never sent to a server.
            </dd>
          </div>

          <div>
            <dt className="font-medium text-ink-primary">Are images uploaded to a server?</dt>
            <dd className="mt-1 text-body-muted leading-relaxed">
              No. Image processing is entirely client-side. The only network requests are for loading the application itself. The exported image is created via the standard Canvas <InlineCode>toBlob</InlineCode> API on your device.
            </dd>
          </div>

          <div>
            <dt className="font-medium text-ink-primary">Which image formats are supported?</dt>
            <dd className="mt-1 text-body-muted leading-relaxed">
              Input: JPEG, PNG, WebP. Output: PNG (lossless), JPEG (lossy), WebP (lossy). Maximum input file size is 20 MB with a 25-megapixel decoded dimension cap.
            </dd>
          </div>

          <div>
            <dt className="font-medium text-ink-primary">Can I use the npm packages commercially?</dt>
            <dd className="mt-1 text-body-muted leading-relaxed">
              Yes. The packages are published under the MIT license. You can use them in commercial projects, modify them, and distribute them.
            </dd>
          </div>

          <div>
            <dt className="font-medium text-ink-primary">How do I create an effect?</dt>
            <dd className="mt-1 text-body-muted leading-relaxed">
              Effects are <InlineCode>EffectPreset</InlineCode> objects. See the <Link href="/docs/guides/creating-an-effect" className="text-accent underline">Creating an Effect</Link> guide for a walkthrough. Presets are defined in <InlineCode>packages/effectsPresets/src/presets/</InlineCode> and registered in the <InlineCode>allPresets</InlineCode> array.
            </dd>
          </div>

          <div>
            <dt className="font-medium text-ink-primary">Why does the same effect look different across images?</dt>
            <dd className="mt-1 text-body-muted leading-relaxed">
              Effect parameters are responsive to the image content. Dither thresholds, halftone dot sizes, ASCII luminance mapping, and glow bloom all depend on the source image&apos;s lighting, contrast, and colors. An image with flat lighting will produce less bloom than one with strong highlights, for example.
            </dd>
          </div>

          <div>
            <dt className="font-medium text-ink-primary">Which effects work best for portraits?</dt>
            <dd className="mt-1 text-body-muted leading-relaxed">
              Dream Glow, Noir Grain, Duotone, and the dither presets work well with portraits. ASCII effects produce recognizable results with strong facial lighting.
            </dd>
          </div>

          <div>
            <dt className="font-medium text-ink-primary">Which effects work best for landscapes?</dt>
            <dd className="mt-1 text-body-muted leading-relaxed">
              Pixel Grid, Dot Halftone, Stipple Print, and the distortion/glass effects bring out texture in landscape photos. CRT Glitch and VHS Bloom can add retro atmosphere to outdoor scenes.
            </dd>
          </div>

          <div>
            <dt className="font-medium text-ink-primary">Which effects work best for graphics and text?</dt>
            <dd className="mt-1 text-body-muted leading-relaxed">
              ASCII effects, LED Matrix, Bitmap, and Manga Scanlines are ideal for graphics with clean edges and bold shapes. Pixel Grid gives a deliberate retro-game look.
            </dd>
          </div>

          <div>
            <dt className="font-medium text-ink-primary">Do I need an account?</dt>
            <dd className="mt-1 text-body-muted leading-relaxed">
              The editor and mini-playground work without an account. An account is optional and currently required to export images.
            </dd>
          </div>

          <div>
            <dt className="font-medium text-ink-primary">Is EffectSoup free?</dt>
            <dd className="mt-1 text-body-muted leading-relaxed">
              Yes. Every effect is free. There are no subscriptions, watermarks, or hidden limits in the editor.
            </dd>
          </div>
        </dl>
      </>
    )
  }
};

export function getPageContent(slug: string): PageContent | undefined {
  return content[slug];
}
