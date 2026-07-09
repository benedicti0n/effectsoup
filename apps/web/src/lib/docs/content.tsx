import type { JSX } from "react";
import { CodeBlock } from "@/components/docs/code";
import { Callout } from "@/components/docs/callout";

type PageContent = {
  title: string;
  description: string;
  component: () => JSX.Element;
};

const content: Record<string, PageContent> = {
  "docs/getting-started/introduction": {
    title: "What is EffectSoup?",
    description: "Browser-based non-AI image effects studio",
    component: () => (
      <>
        <p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "EffectSoup is a browser-based, non-AI image transformation engine. Upload a photo, choose an effect, adjust controls, and export — every pixel is processed in a Web Worker on your device. No uploads to a server, no AI generation." }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Every effect is a deterministic, mathematical image pipeline. The same photo with the same settings always produces the same pixel output." }} />

<h2 id="how-rendering-works" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "How Rendering Works" }} />

<ol className="mt-2 space-y-1 text-sm text-body-muted list-decimal list-inside">
<li dangerouslySetInnerHTML={{ __html: "<strong>Decode</strong> — Image is decoded into a <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">PixelBuffer</code> via Canvas 2D API." }} />
<li dangerouslySetInnerHTML={{ __html: "<strong>Viewport</strong> — Crop, zoom, and offset are applied non-destructively via <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">applyViewportTransform</code>." }} />
<li dangerouslySetInnerHTML={{ __html: "<strong>Resolve</strong> — The preset's <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">intensityMapper</code> converts the 0–100 slider and advanced overrides into resolved parameters." }} />
<li dangerouslySetInnerHTML={{ __html: "<strong>Pipeline</strong> — The preset's <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">createPipeline</code> builds a render function that runs the effect chain." }} />
<li dangerouslySetInnerHTML={{ __html: "<strong>Render</strong> — If using <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">EffectsWorkerClient</code>, steps 2–4 run off the main thread and the result is transferred back via <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">postMessage</code> with zero-copy <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">ArrayBuffer</code> transfer." }} />
<li dangerouslySetInnerHTML={{ __html: "<strong>Export</strong> — The final buffer is drawn to an offscreen canvas and exported as PNG, JPEG, or WebP via the Canvas <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">toBlob</code> API." }} />
</ol>

<h2 id="packages" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Packages" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "The engine is split into four npm packages under the <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">@effectsoup</code> scope (113 exported symbols total):" }} />

<div className="my-6 overflow-x-auto">
<table className="w-full text-sm">
<thead><tr className="border-b border-hairline">
<th className="px-4 py-2 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted" dangerouslySetInnerHTML={{ __html: "Package" }} />
<th className="px-4 py-2 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted" dangerouslySetInnerHTML={{ __html: "Description" }} />
<th className="px-4 py-2 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted" dangerouslySetInnerHTML={{ __html: "Key exports" }} />
</tr></thead>
<tbody>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/api/core\" class=\"text-action-blue underline\"><code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">@effectsoup/core</code></a>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Pure TS image primitives" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">PixelBuffer</code>, <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">createPixelBuffer</code>, <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">toGrayscale</code>, dithering, ASCII, glow, distortion, halftone, stipple, and more (39 functions, 22 types)" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/api/presets\" class=\"text-action-blue underline\"><code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">@effectsoup/presets</code></a>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Effect presets with intensity mapping" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">EffectPreset</code>, <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">allPresets</code> (25 presets), <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">getPresetById</code>, <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">intensityMapper</code>, <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">createPipeline</code>" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/api/worker\" class=\"text-action-blue underline\"><code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">@effectsoup/worker</code></a>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Web Worker client" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">EffectsWorkerClient</code> class for off-thread rendering with job versioning" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/api/meta-package\" class=\"text-action-blue underline\"><code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">@effectsoup/effectsoup</code></a>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "All-in-one meta-package" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Re-exports core + presets + worker" }} />
</tr>
</tbody>
</table>
</div>

<h2 id="quick-links" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Quick Links" }} />

<ul className="mt-2 space-y-1 text-sm text-body-muted list-disc list-inside">
<li dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/getting-started/quickstart\" class=\"text-action-blue underline\">Get started in 5 minutes</a> — open the playground, apply an effect, export" }} />
<li dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/getting-started/installation\" class=\"text-action-blue underline\">Install the packages</a> — npm/pnpm setup with a minimal example" }} />
<li dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/reference/effects-catalog\" class=\"text-action-blue underline\">Browse all effects</a> — 25 presets across 7 categories" }} />
<li dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/guides/creating-an-effect\" class=\"text-action-blue underline\">Create a custom effect</a> — EffectPreset anatomy and registration" }} />
</ul>

<h2 id="see-also" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "See Also" }} />

<ul className="mt-2 space-y-1 text-sm text-body-muted list-disc list-inside">
<li dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/guides/architecture\" class=\"text-action-blue underline\">Architecture</a> — monorepo layout and render flow" }} />
<li dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/faq\" class=\"text-action-blue underline\">FAQ</a> — common questions" }} />
</ul>
      </>
    )
  },
  "docs/getting-started/installation": {
    title: "Installation",
    description: "npm packages, requirements, and setup",
    component: () => (
      <>
        <p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "The EffectSoup engine is available as TypeScript packages on npm. Install everything with the meta-package, or pick only what you need." }} />

<h2 id="requirements" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Requirements" }} />

<ul className="mt-2 space-y-1 text-sm text-body-muted list-disc list-inside">
<li dangerouslySetInnerHTML={{ __html: "Node.js >= 20" }} />
<li dangerouslySetInnerHTML={{ __html: "pnpm (recommended), npm, or yarn" }} />
<li dangerouslySetInnerHTML={{ __html: "Modern browser (Chrome, Firefox, Safari, Edge) for running effects" }} />
</ul>

<h2 id="meta-package-all-in-one" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Meta-package (all-in-one)" }} />

<CodeBlock code={'pnpm add @effectsoup/effectsoup'} language="bash" className="my-4" />

<CodeBlock code={'npm install @effectsoup/effectsoup'} language="bash" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "The meta-package re-exports everything from core, presets, and worker. Import any symbol from <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">@effectsoup/effectsoup</code>:" }} />

<CodeBlock code={'import { createPixelBuffer, toGrayscale } from "@effectsoup/effectsoup";\nimport { getPresetById, allPresets } from "@effectsoup/effectsoup";\nimport { EffectsWorkerClient } from "@effectsoup/effectsoup";\nimport type { PixelBuffer, EffectPreset } from "@effectsoup/effectsoup";'} language="typescript" className="my-4" />

<h2 id="individual-packages" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Individual packages" }} />

<CodeBlock code={'pnpm add @effectsoup/core @effectsoup/presets @effectsoup/worker'} language="bash" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Install only what you need. Each package is independently versioned." }} />

<div className="my-6 overflow-x-auto">
<table className="w-full text-sm">
<thead><tr className="border-b border-hairline">
<th className="px-4 py-2 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted" dangerouslySetInnerHTML={{ __html: "Package" }} />
<th className="px-4 py-2 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted" dangerouslySetInnerHTML={{ __html: "When to install" }} />
</tr></thead>
<tbody>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">@effectsoup/core</code>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "You only need image primitives — buffer management, color transforms, dithering" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">@effectsoup/presets</code>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "You need ready-made effect pipelines with intensity controls" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">@effectsoup/worker</code>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "You want off-main-thread rendering with cancellation support" }} />
</tr>
</tbody>
</table>
</div>

<h2 id="browser-compatibility" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Browser compatibility" }} />

<ul className="mt-2 space-y-1 text-sm text-body-muted list-disc list-inside">
<li dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">@effectsoup/core</code> — no DOM dependencies. Safe in browsers and Node.js. Requires <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">Uint8ClampedArray</code>." }} />
<li dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">@effectsoup/presets</code> — works in any JS environment with <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">Uint8ClampedArray</code>." }} />
<li dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">@effectsoup/worker</code> — requires the Web Worker API. Not available in Node.js." }} />
</ul>

<h2 id="minimal-example" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Minimal example" }} />

<CodeBlock code={'import { createPixelBuffer, toGrayscale } from "@effectsoup/core";\nimport type { PixelBuffer } from "@effectsoup/core";\n\n// Create a buffer from a canvas element.\nconst canvas = document.querySelector("canvas")!;\nconst ctx = canvas.getContext("2d")!;\nconst imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);\n\nconst source: PixelBuffer = createPixelBuffer(canvas.width, canvas.height);\nsource.data.set(imageData.data);\n\n// Apply grayscale in-place.\ntoGrayscale(source);\n\n// Write back to canvas.\nctx.putImageData(\n  new ImageData(source.data, source.width, source.height),\n  0, 0\n);'} language="typescript" className="my-4" />

<h2 id="see-also" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "See Also" }} />

<ul className="mt-2 space-y-1 text-sm text-body-muted list-disc list-inside">
<li dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/getting-started/quickstart\" class=\"text-action-blue underline\">Quickstart</a> — use the playground without installing anything" }} />
<li dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/api/core\" class=\"text-action-blue underline\">Core API Reference</a> — all 39 functions" }} />
<li dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/api/presets\" class=\"text-action-blue underline\">Presets API Reference</a> — <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">getPresetById</code>, <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">allPresets</code>" }} />
</ul>
      </>
    )
  },
  "docs/getting-started/quickstart": {
    title: "Quickstart",
    description: "First 5 minutes in the playground",
    component: () => (
      <>
        <p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Open the playground, upload a photo, and export an effect — in under 5 minutes, no installation required." }} />

<h2 id="prerequisites" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Prerequisites" }} />

<ul className="mt-2 space-y-1 text-sm text-body-muted list-disc list-inside">
<li dangerouslySetInnerHTML={{ __html: "A modern browser (Chrome, Firefox, Safari, Edge)" }} />
<li dangerouslySetInnerHTML={{ __html: "A JPEG, PNG, or WebP image (up to 20 MB, 25 megapixels max)" }} />
</ul>

<h2 id="step-1-open-the-playground" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Step 1: Open the playground" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Navigate to <strong>[your-deployed-url]/playground</strong> or run the project locally:" }} />

<CodeBlock code={'pnpm dev'} language="bash" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Then open <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">http://localhost:3000/playground</code>." }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "You'll see an upload panel with a drop zone and a \"Choose Image\" button." }} />

<h2 id="step-2-upload-an-image" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Step 2: Upload an image" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Click \"Choose Image\" or drag and drop a photo onto the upload panel. The image appears in the center preview with the effect library on the left sidebar." }} />

<Callout variant="info"><span dangerouslySetInnerHTML={{ __html: "Your image never leaves your device. All processing happens in-browser via a Web Worker." }} /></Callout>

<h2 id="step-3-apply-an-effect" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Step 3: Apply an effect" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "The left sidebar shows all 24+ presets grouped into categories:" }} />

<ul className="mt-2 space-y-1 text-sm text-body-muted list-disc list-inside">
<li dangerouslySetInnerHTML={{ __html: "<strong>Pixel & Dither</strong> — ordered dither, error diffusion, dot halftone" }} />
<li dangerouslySetInnerHTML={{ __html: "<strong>ASCII & Symbols</strong> — classic ASCII, blocks, dense, cyber, symbol glow" }} />
<li dangerouslySetInnerHTML={{ __html: "<strong>Print & Ink</strong> — stipple print, pencil grain, manga scanlines, riso offset" }} />
<li dangerouslySetInnerHTML={{ __html: "<strong>Distortion & Glass</strong> — cubic glass, wave slice" }} />
<li dangerouslySetInnerHTML={{ __html: "<strong>Color & Tone</strong> — duotone, noir grain, LED matrix, bitmap, inverted glow" }} />
<li dangerouslySetInnerHTML={{ __html: "<strong>Atmosphere & Glow</strong> — dream glow, grain, bloom" }} />
<li dangerouslySetInnerHTML={{ __html: "<strong>Retro Signal</strong> — CRT glitch, CRT dream, VHS bloom" }} />
</ul>

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Click any preset to apply it immediately. The right panel shows intensity and advanced controls." }} />

<h2 id="step-4-adjust-controls" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Step 4: Adjust controls" }} />

<ul className="mt-2 space-y-1 text-sm text-body-muted list-disc list-inside">
<li dangerouslySetInnerHTML={{ __html: "<strong>Intensity slider</strong> (0–100%) — scales the primary effect. At 0%, the effect is bypassed." }} />
<li dangerouslySetInnerHTML={{ __html: "<strong>Advanced controls</strong> — effect-specific parameters (cell size, threshold, dot size, colors)." }} />
<li dangerouslySetInnerHTML={{ __html: "<strong>Crop</strong> — below the preview: aspect ratio, zoom, and offset X/Y." }} />
</ul>

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "All adjustments update the preview in real time. The preview runs at a reduced resolution for responsiveness." }} />

<h2 id="step-5-export" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Step 5: Export" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Click the <strong>Export</strong> button in the top toolbar. Choose:" }} />

<div className="my-6 overflow-x-auto">
<table className="w-full text-sm">
<thead><tr className="border-b border-hairline">
<th className="px-4 py-2 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted" dangerouslySetInnerHTML={{ __html: "Option" }} />
<th className="px-4 py-2 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted" dangerouslySetInnerHTML={{ __html: "Values" }} />
</tr></thead>
<tbody>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Format" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "PNG (lossless), JPEG (lossy), WebP (lossy)" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Quality" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "50–100% (JPEG/WebP only)" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Resolution" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "1080px, Original, or 4K" }} />
</tr>
</tbody>
</table>
</div>

<Callout variant="info"><span dangerouslySetInnerHTML={{ __html: "You need to sign in to export. Sign up is free — no subscriptions, no watermarks, no hidden limits." }} /></Callout>

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "The exported image is generated via the Canvas <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">toBlob</code> API on your device." }} />

<h2 id="what-you-built" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "What you built" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "You've used the full EffectSoup pipeline: upload → crop → resolve parameters → render → export. The same pipeline runs programmatically via the npm packages — see <a href=\"/docs/getting-started/installation\" class=\"text-action-blue underline\">Installation</a> to integrate it into your own project." }} />

<h2 id="see-also" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "See Also" }} />

<ul className="mt-2 space-y-1 text-sm text-body-muted list-disc list-inside">
<li dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/guides/effect-controls\" class=\"text-action-blue underline\">Effect Controls Guide</a> — detailed control reference" }} />
<li dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/guides/exporting\" class=\"text-action-blue underline\">Exporting Guide</a> — format, quality, resolution details" }} />
<li dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/reference/editor-overview\" class=\"text-action-blue underline\">Editor Overview</a> — full UI walkthrough" }} />
</ul>
      </>
    )
  },
  "docs/guides/upload-and-crop": {
    title: "Upload & Crop",
    description: "Image loading, cropping, and zoom",
    component: () => (
      <>
        <p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "How to load images into the editor, replace them, and control the viewport crop." }} />

<h2 id="prerequisites" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Prerequisites" }} />

<ul className="mt-2 space-y-1 text-sm text-body-muted list-disc list-inside">
<li dangerouslySetInnerHTML={{ __html: "The playground is open and ready" }} />
<li dangerouslySetInnerHTML={{ __html: "A JPEG, PNG, or WebP image (up to 20 MB, 25 megapixels max)" }} />
</ul>

<h2 id="upload-an-image" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Upload an image" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "When you first open the playground, you see an upload panel. Drag and drop an image file onto the drop zone, or click \"Choose Image\" to select one from your file system." }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Once loaded, the image appears in the center preview. The effect library on the left and controls on the right become active." }} />

<Callout variant="info"><span dangerouslySetInnerHTML={{ __html: "For best results, upload images at or near your target export resolution. Upscaling a small image to 4K will produce pixelation." }} /></Callout>

<h2 id="replace-an-image" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Replace an image" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "After an image is loaded, the toolbar shows a <strong>Replace</strong> button. Click it to load a different image while keeping the current crop and effect settings. This is useful for testing the same effect on multiple photos." }} />

<h2 id="remove-an-image" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Remove an image" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "The <strong>Remove</strong> button (X icon) clears the current image and returns you to the upload panel, resetting all editor state (crop, effect, output options)." }} />

<h2 id="crop-controls" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Crop controls" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Below the preview, the crop bar provides these controls:" }} />

<h3 id="aspect-ratio" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary mt-8 mb-3" dangerouslySetInnerHTML={{ __html: "Aspect ratio" }} />

<div className="my-6 overflow-x-auto">
<table className="w-full text-sm">
<thead><tr className="border-b border-hairline">
<th className="px-4 py-2 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted" dangerouslySetInnerHTML={{ __html: "Option" }} />
<th className="px-4 py-2 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted" dangerouslySetInnerHTML={{ __html: "Behavior" }} />
</tr></thead>
<tbody>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Original" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Source-native aspect ratio" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Free" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Unconstrained; zoom determines crop-window size directly" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "1:1" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Square crop" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "4:5" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Portrait crop" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "9:16" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Vertical / mobile crop" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "16:9" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Widescreen crop" }} />
</tr>
</tbody>
</table>
</div>

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "The viewport transform uses <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">applyViewportTransform</code> from <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">@effectsoup/core</code> with bilinear sampling for smooth results at any zoom level. The crop window is always clamped to stay within source bounds." }} />

<h3 id="zoom" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary mt-8 mb-3" dangerouslySetInnerHTML={{ __html: "Zoom" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Magnifies into the image. Higher values show a tighter crop window. At Free aspect ratio, both width and height are divided by zoom equally with no aspect-ratio constraint — useful for custom non-standard sizes." }} />

<h3 id="offset-x--offset-y" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary mt-8 mb-3" dangerouslySetInnerHTML={{ __html: "Offset X / Offset Y" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Pan the crop window. Values range from -100% to 100% of the centered position. Clamped so the window never extends beyond the source bounds." }} />

<h2 id="api-reference" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "API reference" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "The viewport transform functions are exported from <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">@effectsoup/core</code>:" }} />

<ul className="mt-2 space-y-1 text-sm text-body-muted list-disc list-inside">
<li dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">applyViewportTransform(source, viewport, outputWidth, outputHeight): PixelBuffer</code> — applies crop/zoom/offset with bilinear interpolation" }} />
<li dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">parseAspectRatio(ratio): number | null</code> — parses a <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">CropConfig</code> aspect ratio to a numeric W/H value; returns <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">null</code> for \"original\"" }} />
<li dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">getCroppedOutputSize(sourceWidth, sourceHeight, aspectRatio, longestEdge, zoom?): { width, height }</code> — computes output dimensions" }} />
</ul>

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "See the <a href=\"/docs/api/core\" class=\"text-action-blue underline\">Core API Reference</a> for full signatures." }} />

<h2 id="see-also" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "See Also" }} />

<ul className="mt-2 space-y-1 text-sm text-body-muted list-disc list-inside">
<li dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/guides/effect-controls\" class=\"text-action-blue underline\">Effect Controls Guide</a> — adjusting intensity and advanced parameters" }} />
<li dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/guides/exporting\" class=\"text-action-blue underline\">Exporting Guide</a> — format, quality, and resolution options" }} />
<li dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/getting-started/quickstart\" class=\"text-action-blue underline\">Quickstart</a> — end-to-end walkthrough" }} />
</ul>
      </>
    )
  },
  "docs/guides/effect-controls": {
    title: "Effect Controls",
    description: "Intensity slider and advanced controls",
    component: () => (
      <>
        <p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "How to use the intensity slider and advanced controls to fine-tune any effect." }} />

<h2 id="prerequisites" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Prerequisites" }} />

<ul className="mt-2 space-y-1 text-sm text-body-muted list-disc list-inside">
<li dangerouslySetInnerHTML={{ __html: "An image is loaded in the playground" }} />
<li dangerouslySetInnerHTML={{ __html: "A preset is selected from the left sidebar" }} />
</ul>

<h2 id="intensity-slider" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Intensity slider" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Most presets have an <strong>Intensity</strong> slider ranging from 0–100%. At 0%, the effect is bypassed and the source image is returned unchanged." }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "The slider maps to the preset's internal parameters via its <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">intensityMapper</code> function, which may scale multiple parameters simultaneously. Each preset defines its own mapping." }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Some presets set <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">usesIntensity: false</code> in their <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">EffectPreset</code> definition. These have no intensity slider and are always fully active through their advanced controls. For example:" }} />

<ul className="mt-2 space-y-1 text-sm text-body-muted list-disc list-inside">
<li dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">stipplePrint</code> — Stipple Print" }} />
<li dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">ledMatrix</code> — LED Matrix" }} />
<li dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">bitmap</code> — Bitmap" }} />
</ul>

<h2 id="advanced-controls" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Advanced controls" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Each preset defines its own <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">advancedControlSchema</code> — an array of <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">AdvancedControlDefinition</code> objects that the right panel renders automatically." }} />

<h3 id="control-types" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary mt-8 mb-3" dangerouslySetInnerHTML={{ __html: "Control types" }} />

<div className="my-6 overflow-x-auto">
<table className="w-full text-sm">
<thead><tr className="border-b border-hairline">
<th className="px-4 py-2 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted" dangerouslySetInnerHTML={{ __html: "Type" }} />
<th className="px-4 py-2 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted" dangerouslySetInnerHTML={{ __html: "UI control" }} />
<th className="px-4 py-2 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted" dangerouslySetInnerHTML={{ __html: "Return type" }} />
</tr></thead>
<tbody>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">range</code>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Slider with min, max, step" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">number</code>" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">select</code>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Dropdown with predefined options" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">string</code>" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">color</code>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Color picker" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">string</code> (hex, e.g. <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">#ff006e</code>)" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">boolean</code>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Toggle checkbox" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">boolean</code> (<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">true</code> / <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">false</code>)" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">text</code>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Text input" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">string</code>" }} />
</tr>
</tbody>
</table>
</div>

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "The schema is defined at preset authoring time. See the <a href=\"/docs/guides/creating-an-effect\" class=\"text-action-blue underline\">Creating an Effect</a> guide for the full <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">AdvancedControlDefinition</code> type signature." }} />

<h3 id="common-controls" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary mt-8 mb-3" dangerouslySetInnerHTML={{ __html: "Common controls" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Many presets share controls from <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">shared.ts</code> in the <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">@effectsoup/presets</code> package:" }} />

<ul className="mt-2 space-y-1 text-sm text-body-muted list-disc list-inside">
<li dangerouslySetInnerHTML={{ __html: "<strong>Adjustment controls</strong> (<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">adjustmentControls</code>) — brightness, contrast, saturation — used by dither presets" }} />
<li dangerouslySetInnerHTML={{ __html: "<strong>Atmosphere controls</strong> (<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">atmosphereAdvancedControls</code>) — grain amount, glow amount — used by many presets" }} />
</ul>

<h2 id="resetting-controls" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Resetting controls" }} />

<ul className="mt-2 space-y-1 text-sm text-body-muted list-disc list-inside">
<li dangerouslySetInnerHTML={{ __html: "<strong>Reset effect</strong> — resets all advanced overrides back to the preset defaults while keeping the current effect selected. Available as a link in the control panel." }} />
<li dangerouslySetInnerHTML={{ __html: "<strong>Reset</strong> (toolbar) — resets everything: crop, effect, and output options." }} />
</ul>

<h2 id="how-parameters-are-resolved" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "How parameters are resolved" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "The resolution chain is:" }} />

<ol className="mt-2 space-y-1 text-sm text-body-muted list-decimal list-inside">
<li dangerouslySetInnerHTML={{ __html: "Editor takes the intensity slider value (0–100) and any advanced override values." }} />
<li dangerouslySetInnerHTML={{ __html: "Calls <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">preset.intensityMapper(intensity, overrides)</code> → returns <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">ResolvedPresetParameters</code>." }} />
<li dangerouslySetInnerHTML={{ __html: "Calls <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">preset.createPipeline(params)</code> → returns an <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">EffectPipeline</code> function." }} />
<li dangerouslySetInnerHTML={{ __html: "Calls the pipeline with the source buffer: <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">pipeline(source, params)</code> → output <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">PixelBuffer</code>." }} />
</ol>

<CodeBlock code={'const params = preset.intensityMapper(75, { dotSize: 8 });\nconst pipeline = preset.createPipeline(params);\nconst output = preset.createPipeline(params)(source, params);'} language="typescript" className="my-4" />

<h2 id="see-also" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "See Also" }} />

<ul className="mt-2 space-y-1 text-sm text-body-muted list-disc list-inside">
<li dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/guides/creating-an-effect\" class=\"text-action-blue underline\">Creating an Effect</a> — how to define custom controls for a new preset" }} />
<li dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/guides/upload-and-crop\" class=\"text-action-blue underline\">Upload & Crop Guide</a> — image loading and viewport controls" }} />
<li dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/api/presets\" class=\"text-action-blue underline\">Presets API Reference</a> — <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">IntensityMapper</code>, <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">ResolvedPresetParameters</code>, <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">AdvancedControlDefinition</code>" }} />
</ul>
      </>
    )
  },
  "docs/guides/exporting": {
    title: "Exporting",
    description: "Format, quality, and resolution options",
    component: () => (
      <>
        <p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "How to export your processed image in different formats, qualities, and resolutions." }} />

<h2 id="prerequisites" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Prerequisites" }} />

<ul className="mt-2 space-y-1 text-sm text-body-muted list-disc list-inside">
<li dangerouslySetInnerHTML={{ __html: "An image is loaded in the playground" }} />
<li dangerouslySetInnerHTML={{ __html: "A preset is applied with desired settings" }} />
<li dangerouslySetInnerHTML={{ __html: "You are signed in (required for export)" }} />
</ul>

<h2 id="open-the-export-dialog" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Open the export dialog" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Click the <strong>Export</strong> button in the editor toolbar. The dialog shows three configuration options." }} />

<h2 id="format" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Format" }} />

<div className="my-6 overflow-x-auto">
<table className="w-full text-sm">
<thead><tr className="border-b border-hairline">
<th className="px-4 py-2 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted" dangerouslySetInnerHTML={{ __html: "Format" }} />
<th className="px-4 py-2 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted" dangerouslySetInnerHTML={{ __html: "Type" }} />
<th className="px-4 py-2 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted" dangerouslySetInnerHTML={{ __html: "Best for" }} />
</tr></thead>
<tbody>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "PNG" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Lossless" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Graphics, text art, images with transparency. Largest file size." }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "JPEG" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Lossy (adjustable quality)" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Photos where file size matters more than pixel-perfect fidelity." }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "WebP" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Lossy (adjustable quality)" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Modern web use. Smaller files than JPEG at equivalent quality." }} />
</tr>
</tbody>
</table>
</div>

<h2 id="quality" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Quality" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Adjustable from 50–100%. Applies to JPEG and WebP only. PNG is always lossless regardless of this setting." }} />

<h2 id="resolution" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Resolution" }} />

<div className="my-6 overflow-x-auto">
<table className="w-full text-sm">
<thead><tr className="border-b border-hairline">
<th className="px-4 py-2 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted" dangerouslySetInnerHTML={{ __html: "Option" }} />
<th className="px-4 py-2 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted" dangerouslySetInnerHTML={{ __html: "Longest edge" }} />
<th className="px-4 py-2 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted" dangerouslySetInnerHTML={{ __html: "Use case" }} />
</tr></thead>
<tbody>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "1080" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "1080px" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Social media, web sharing" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Original" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Source resolution (subject to crop)" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Archival, full quality" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "4K" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "3840px" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Large displays, print" }} />
</tr>
</tbody>
</table>
</div>

<h2 id="how-export-works" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "How export works" }} />

<ol className="mt-2 space-y-1 text-sm text-body-muted list-decimal list-inside">
<li dangerouslySetInnerHTML={{ __html: "The editor crops your source image using the current <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">CropConfig</code>." }} />
<li dangerouslySetInnerHTML={{ __html: "The preset pipeline runs at full resolution (not preview resolution)." }} />
<li dangerouslySetInnerHTML={{ __html: "The result <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">PixelBuffer</code> is transferred from the Web Worker via zero-copy <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">ArrayBuffer</code> transfer." }} />
<li dangerouslySetInnerHTML={{ __html: "The buffer is drawn onto an offscreen canvas." }} />
<li dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">canvas.toBlob(callback, mimeType, quality)</code> produces the output blob." }} />
<li dangerouslySetInnerHTML={{ __html: "The resulting blob is downloaded as a file." }} />
</ol>

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "The export pipeline is handled entirely in the web app layer — no <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">@effectsoup/core</code> function is involved." }} />

<h2 id="see-also" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "See Also" }} />

<ul className="mt-2 space-y-1 text-sm text-body-muted list-disc list-inside">
<li dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/guides/effect-controls\" class=\"text-action-blue underline\">Effect Controls Guide</a> — adjusting controls before exporting" }} />
<li dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/guides/upload-and-crop\" class=\"text-action-blue underline\">Upload & Crop Guide</a> — setting the crop before export" }} />
<li dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/guides/performance\" class=\"text-action-blue underline\">Performance Guide</a> — understanding preview vs. export resolution" }} />
</ul>
      </>
    )
  },
  "docs/guides/creating-an-effect": {
    title: "Creating an Effect",
    description: "Anatomy of an EffectPreset",
    component: () => (
      <>
        <p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Every effect in EffectSoup is an <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">EffectPreset</code> object. This guide walks through the anatomy of a preset and how to add a new one." }} />

<h2 id="preset-structure" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Preset Structure" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "A preset is a plain object with these required fields:" }} />

<ul className="mt-2 space-y-1 text-sm text-body-muted list-disc list-inside">
<li dangerouslySetInnerHTML={{ __html: "<strong>id</strong> — Unique string identifier (kebab-case, e.g. <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">\"dotHalftone\"</code>)" }} />
<li dangerouslySetInnerHTML={{ __html: "<strong>name</strong> — Display name shown in the UI" }} />
<li dangerouslySetInnerHTML={{ __html: "<strong>description</strong> — Short description of the visual result" }} />
<li dangerouslySetInnerHTML={{ __html: "<strong>category</strong> — One of the <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">PresetCategory</code> values" }} />
<li dangerouslySetInnerHTML={{ __html: "<strong>defaultIntensity</strong> — Default slider value (0–100)" }} />
<li dangerouslySetInnerHTML={{ __html: "<strong>usesIntensity</strong> — Optional. Set to <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">false</code> to hide the slider" }} />
<li dangerouslySetInnerHTML={{ __html: "<strong>intensityMapper</strong> — Function that converts intensity + overrides to resolved params" }} />
<li dangerouslySetInnerHTML={{ __html: "<strong>advancedControlSchema</strong> — Array of control definitions for the UI to render" }} />
<li dangerouslySetInnerHTML={{ __html: "<strong>createPipeline</strong> — Function that returns the render pipeline from resolved params" }} />
</ul>

<h2 id="minimal-preset-example" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Minimal Preset Example" }} />

<CodeBlock code={'import {\n  clonePixelBuffer,\n  toGrayscale,\n  type PixelBuffer\n} from "@effectsoup/core";\nimport type {\n  EffectPipeline,\n  EffectPreset,\n  ResolvedPresetParameters\n} from "../../types.js";\n\nexport const myPreset: EffectPreset = {\n  id: "myEffect",\n  name: "My Effect",\n  description: "A custom grayscale effect",\n  category: "colorGlow",\n  defaultIntensity: 50,\n  advancedControlSchema: [\n    {\n      id: "brightness",\n      name: "Brightness",\n      type: "range",\n      min: -50,\n      max: 50,\n      step: 1,\n      defaultValue: 0\n    }\n  ],\n  intensityMapper: (intensity, overrides): ResolvedPresetParameters => ({\n    intensity,\n    advancedOverrides: overrides,\n    brightness: (overrides.brightness as number) ?? 0\n  }),\n  createPipeline: (params): EffectPipeline => {\n    return (source: PixelBuffer) => {\n      if (params.intensity === 0) return clonePixelBuffer(source);\n      const result = clonePixelBuffer(source);\n      toGrayscale(result);\n      return result;\n    };\n  }\n};'} language="typescript" className="my-4" />

<h2 id="registration" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Registration" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "To make your preset discoverable, import and add it to the <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">allPresets</code> array in <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">packages/effectsPresets/src/index.ts</code>:" }} />

<CodeBlock code={'import { myPreset } from "./presets/free/myPreset.js";\n\nexport const allPresets: EffectPreset[] = [\n  // ... existing presets\n  myPreset\n];'} language="typescript" className="my-4" />

<Callout variant="info"><span dangerouslySetInnerHTML={{ __html: "Presets are auto-discovered by the UI through the <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">allPresets</code> export. The advanced controls render automatically — no UI code changes needed." }} /></Callout>

<h2 id="best-practices" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Best Practices" }} />

<ul className="mt-2 space-y-1 text-sm text-body-muted list-disc list-inside">
<li dangerouslySetInnerHTML={{ __html: "Clone the source buffer before mutating (use <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">clonePixelBuffer</code>)." }} />
<li dangerouslySetInnerHTML={{ __html: "Return the source clone unchanged at intensity 0 — this is expected by test conventions and the UI." }} />
<li dangerouslySetInnerHTML={{ __html: "Use <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">runAtWorkingResolution</code> for per-pixel effects to keep performance consistent across image sizes." }} />
<li dangerouslySetInnerHTML={{ __html: "Use shared controls from <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">shared.ts</code> (<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">adjustmentControls</code>, <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">atmosphereAdvancedControls</code>) for consistency." }} />
<li dangerouslySetInnerHTML={{ __html: "Write deterministic effects — same input + same params = same output. This enables reliable testing and preview caching." }} />
<li dangerouslySetInnerHTML={{ __html: "Add tests to <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">presets.test.ts</code> following the existing patterns." }} />
</ul>

<h2 id="pipeline-conventions" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Pipeline Conventions" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "The pipeline receives a <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">PixelBuffer</code> that has already been cropped by the viewport transform. It should <strong>not</strong> modify the source buffer. The return value should be a new buffer (usually via <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">clonePixelBuffer</code> and then mutated, or by creating a fresh buffer)." }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Advanced controls are resolved via <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">resolveOverride</code> from <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">shared.ts</code>, which safely extracts typed values from the overrides record." }} />

<h2 id="see-also" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "See Also" }} />

<ul className="mt-2 space-y-1 text-sm text-body-muted list-disc list-inside">
<li dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/api/presets\" class=\"text-action-blue underline\">Presets API Reference</a> — <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">EffectPreset</code> types and lookup functions" }} />
<li dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/guides/testing-effects\" class=\"text-action-blue underline\">Testing Effects</a> — test patterns for presets" }} />
<li dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/reference/effects-catalog\" class=\"text-action-blue underline\">Effects Catalog</a> — all built-in presets" }} />
</ul>
      </>
    )
  },
  "docs/guides/testing-effects": {
    title: "Testing Effects",
    description: "Test conventions and best practices",
    component: () => (
      <>
        <p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "EffectSoup uses Vitest (core) and the built-in test suite (presets) with deterministic rendering tests." }} />

<h2 id="preset-tests" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Preset Tests" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Preset tests live in <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">packages/effectsPresets/src/presets.test.ts</code>. Each preset is tested for:" }} />

<ul className="mt-2 space-y-1 text-sm text-body-muted list-disc list-inside">
<li dangerouslySetInnerHTML={{ __html: "<strong>Zero-intensity identity</strong> — At 0% intensity, the pipeline returns the source unchanged (a clone)." }} />
<li dangerouslySetInnerHTML={{ __html: "<strong>Output dimensions</strong> — The pipeline produces output at the requested size for common resolutions." }} />
<li dangerouslySetInnerHTML={{ __html: "<strong>Rendering without errors</strong> — The pipeline runs successfully with default parameters." }} />
</ul>

<h2 id="core-tests" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Core Tests" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Core primitive tests use Vitest and are colocated with the source files (<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">dither.test.ts</code>, <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">color.test.ts</code>, etc.). These test individual functions with known inputs and expected outputs." }} />

<h2 id="test-pattern" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Test Pattern" }} />

<CodeBlock code={'import { describe, it, expect } from "vitest";\nimport { createPixelBuffer } from "@effectsoup/core";\nimport { myPreset } from "./presets/myPreset.js";\n\ndescribe("myPreset", () => {\n  it("returns source unchanged at 0% intensity", () => {\n    const source = createPixelBuffer(4, 4);\n    const params = myPreset.intensityMapper(0, {});\n    const pipeline = myPreset.createPipeline(params);\n    const result = pipeline(source, params);\n    expect(result).toEqual(source);\n  });\n\n  it("produces output at requested size", () => {\n    const source = createPixelBuffer(4, 4);\n    const params = myPreset.intensityMapper(50, {});\n    const pipeline = myPreset.createPipeline(params);\n    const result = pipeline(source, params);\n    expect(result.width).toBe(4);\n    expect(result.height).toBe(4);\n  });\n});'} language="typescript" className="my-4" />

<h2 id="running-tests" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Running Tests" }} />

<CodeBlock code={'# Run all tests\npnpm test\n\n# Run presets tests only\npnpm --filter @effectsoup/presets test\n\n# Run core tests only\npnpm --filter @effectsoup/core test\n\n# Run web app tests\npnpm --filter web test'} language="bash" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "All tests must pass before committing. The CI pipeline runs typecheck, lint, and test on all packages." }} />

<h2 id="see-also" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "See Also" }} />

<ul className="mt-2 space-y-1 text-sm text-body-muted list-disc list-inside">
<li dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/guides/creating-an-effect\" class=\"text-action-blue underline\">Creating an Effect</a> — preset anatomy and registration" }} />
<li dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/api/core\" class=\"text-action-blue underline\">Core API Reference</a> — core primitives and their types" }} />
</ul>
      </>
    )
  },
  "docs/guides/performance": {
    title: "Performance",
    description: "Worker, preview, and optimization tips",
    component: () => (
      <>
        <p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Tips for keeping EffectSoup rendering fast at every scale." }} />

<h2 id="web-workers" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Web Workers" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "EffectSoup runs all rendering in a Web Worker by default. This keeps the UI thread responsive during heavy computation. The worker handles crop, pipeline execution, and buffer creation — everything except canvas drawing and input decoding." }} />

<h2 id="preview-resolution" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Preview Resolution" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "While adjusting controls, the editor renders at a reduced preview resolution (<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">previewLongest</code>). This keeps the UI responsive even on large photos. Full-resolution rendering happens only when you export." }} />

<h2 id="working-resolution" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Working Resolution" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Per-pixel effects (dithering, halftone, ASCII) use <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">runAtWorkingResolution</code> — they downsample the source to a maximum longest edge (typically 800px), run the effect, then nearest-neighbor upscale back to the original size. This ensures consistent visual density and avoids O(width × height) cost on large images." }} />

<h2 id="buffer-allocation" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Buffer Allocation" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">PixelBuffer</code> uses <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">Uint8ClampedArray</code> — a typed array that is fast to allocate and transfer. When sending to a worker, the underlying <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">ArrayBuffer</code> is transferred (zero-copy). Avoid unnecessary clones: prefer in-place mutation when the source buffer is not needed afterward." }} />

<h2 id="optimization-tips" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Optimization Tips" }} />

<ul className="mt-2 space-y-1 text-sm text-body-muted list-disc list-inside">
<li dangerouslySetInnerHTML={{ __html: "Downsample before running effects on very large images (the editor already does this for previews)." }} />
<li dangerouslySetInnerHTML={{ __html: "Use nearest-neighbor upscale for pixel/dithered effects (preserves sharp edges)." }} />
<li dangerouslySetInnerHTML={{ __html: "Avoid creating many intermediate buffers in hot loops — reuse where possible." }} />
<li dangerouslySetInnerHTML={{ __html: "The worker handles one job at a time; rapid slider changes cancel previous renders automatically." }} />
<li dangerouslySetInnerHTML={{ __html: "All core functions are synchronous and pure — they can be called from any context (main thread, worker, Node.js)." }} />
</ul>

<h2 id="see-also" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "See Also" }} />

<ul className="mt-2 space-y-1 text-sm text-body-muted list-disc list-inside">
<li dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/guides/architecture\" class=\"text-action-blue underline\">Architecture</a> — render flow and worker lifecycle" }} />
<li dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/reference/editor-overview\" class=\"text-action-blue underline\">Editor Overview</a> — UI layout and compare toggle" }} />
<li dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/guides/exporting\" class=\"text-action-blue underline\">Exporting Guide</a> — format and resolution options" }} />
</ul>
      </>
    )
  },
  "docs/api/core": {
    title: "@effectsoup/core",
    description: "PixelBuffer, image primitives, and utilities",
    component: () => (
      <>
        <p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Pure TypeScript image-processing primitives. No DOM dependencies — safe in browsers and Node.js." }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "<strong>Exports:</strong> 39 functions, 22 types" }} />

<h2 id="pixelbuffer" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "PixelBuffer" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "The fundamental image currency. Every function reads or writes a <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">PixelBuffer</code>." }} />

<CodeBlock code={'type PixelBuffer = {\n  width: number;\n  height: number;\n  data: Uint8ClampedArray;\n};'} language="typescript" className="my-4" />

<h3 id="related-types" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary mt-8 mb-3" dangerouslySetInnerHTML={{ __html: "Related types" }} />

<CodeBlock code={'type RgbaColor = [number, number, number, number];\n// RGBA color tuple. Components are 0–255. Alpha is typically 255 for opaque colors.\n\ntype SupportedInputFormat = "image/jpeg" | "image/png" | "image/webp";\n\ntype CropConfig = {\n  aspectRatio: "original" | "free" | "1:1" | "4:5" | "9:16" | "16:9";\n  zoom: number;\n  offsetX: number;\n  offsetY: number;\n};\n\ntype OutputOptions = {\n  format: "png" | "jpeg" | "webp";\n  width: number;\n  height: number;\n  backgroundColor?: string;\n  quality?: number;\n};'} language="typescript" className="my-4" />

<h2 id="buffer-utilities" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Buffer Utilities" }} />

<CodeBlock code={'function createPixelBuffer(width: number, height: number, fill?: RgbaColor): PixelBuffer'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Create a new zero-initialized PixelBuffer. Optionally fill with a color." }} />

<CodeBlock code={'function clonePixelBuffer(buffer: PixelBuffer): PixelBuffer'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Deep-copy a PixelBuffer (new data array, same dimensions)." }} />

<CodeBlock code={'function fillPixelBuffer(buffer: PixelBuffer, color: RgbaColor): void'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Fill an existing buffer with a solid color in-place." }} />

<CodeBlock code={'function pixelIndex(buffer: PixelBuffer, x: number, y: number): number'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Get the data array index for pixel (x, y)." }} />

<CodeBlock code={'function clampByte(value: number): number'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Clamp a number to 0–255, rounding. Returns 0 for NaN/Infinity." }} />

<h2 id="color-transforms" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Color Transforms" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "All color functions modify the buffer <strong>in-place</strong> unless noted." }} />

<CodeBlock code={'function toGrayscale(buffer: PixelBuffer): void'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Convert to grayscale using luminance weights (0.299 R, 0.587 G, 0.114 B)." }} />

<CodeBlock code={'function adjustBrightnessContrast(buffer: PixelBuffer, brightness: number, contrast: number): void'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Adjust brightness (-255 to 255) and contrast (-1 to 1)." }} />

<CodeBlock code={'function adjustSaturation(buffer: PixelBuffer, saturation: number): void'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Adjust saturation (-1 to 1)." }} />

<CodeBlock code={'function applyDuotone(buffer: PixelBuffer, shadow: RgbaColor, highlight: RgbaColor): void'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Map luminance to a gradient between two colors." }} />

<CodeBlock code={'function applyPosterize(buffer: PixelBuffer, levels: number): void'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Reduce per-channel levels (2–256)." }} />

<CodeBlock code={'function reducePalette(buffer: PixelBuffer, colorCount: number): void'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Uniform per-channel quantization. colorCount 2–256. Actual output colors ≈ round(cbrt(colorCount))³." }} />

<CodeBlock code={'function applyTint(buffer: PixelBuffer, tint: RgbaColor, amount: number): void'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Blend each pixel toward a tint color. amount ranges 0–1." }} />

<CodeBlock code={'function averageColor(buffer: PixelBuffer): RgbaColor'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Compute the average RGBA color of a buffer." }} />

<h2 id="viewport-transform" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Viewport Transform" }} />

<CodeBlock code={'function applyViewportTransform(\n  source: PixelBuffer,\n  viewport: CropConfig,\n  outputWidth: number,\n  outputHeight: number\n): PixelBuffer'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Apply a non-destructive crop/zoom/offset to a source buffer. Returns a new buffer with bilinear interpolation." }} />

<CodeBlock code={'function getCroppedOutputSize(\n  sourceWidth: number,\n  sourceHeight: number,\n  aspectRatio: CropConfig["aspectRatio"],\n  longestEdge: number,\n  zoom?: number\n): { width: number; height: number }'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Compute output dimensions for a given aspect ratio and longest-edge constraint." }} />

<CodeBlock code={'function parseAspectRatio(ratio: CropConfig["aspectRatio"]): number | null'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Parse a CropConfig aspect ratio to a numeric W/H value. Returns null for \"original\"." }} />

<h2 id="dithering" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Dithering" }} />

<CodeBlock code={'function applyOrderedDither(buffer: PixelBuffer, threshold?: number): void'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Apply 8×8 Bayer ordered dither in-place. Default threshold: 128." }} />

<CodeBlock code={'function applyFloydSteinbergDither(buffer: PixelBuffer, threshold?: number): void'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Apply Floyd-Steinberg error diffusion dither in-place. Default threshold: 128." }} />

<CodeBlock code={'function applyFloydSteinbergColorDither(\n  buffer: PixelBuffer,\n  threshold?: number,\n  channels?: readonly number[]\n): void'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Apply Floyd-Steinberg error diffusion on per-channel basis. Default channels: <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">[0, 1, 2]</code>. Default threshold: 128." }} />

<CodeBlock code={'type OrderedColorDitherOptions = {\n  cellSize: number;\n  threshold: number;\n  invert: boolean;\n  monochrome: boolean;\n  coloredInactive?: boolean;\n};\n\nfunction applyOrderedColorDither(\n  source: PixelBuffer,\n  options: OrderedColorDitherOptions\n): PixelBuffer'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Cell-based ordered color dither with Bayer luminance offsets. Returns a new buffer." }} />

<h2 id="halftone" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Halftone" }} />

<CodeBlock code={'type HalftoneShape = "circle" | "square" | "diamond";\ntype HalftoneColorMode = "monochrome" | "source" | "palette";\n\ntype HalftoneOptions = {\n  dotSpacing: number;\n  maxDotSize: number;\n  inkColor: RgbaColor;\n  backgroundColor: RgbaColor;\n  angle?: number;\n  shape?: HalftoneShape;\n  colorMode?: HalftoneColorMode;\n  palette?: RgbaColor[];\n  saturationBoost?: number;\n};\n\nfunction renderHalftoneData(source: PixelBuffer, options: HalftoneOptions): PixelBuffer'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Render a colored dot halftone with configurable dot spacing, size, shape, palette, and color mode." }} />

<h2 id="ascii-rendering" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "ASCII Rendering" }} />

<CodeBlock code={'type AsciiColorMode = "monochrome" | "color" | "source";\ntype AsciiBackgroundMode = "solid" | "source" | "transparent";\n\ntype AsciiOptions = {\n  fontSize: number;\n  inkColor: RgbaColor;\n  backgroundColor: RgbaColor;\n  charset?: string;\n  colorMode?: AsciiColorMode;\n  backgroundMode?: AsciiBackgroundMode;\n  spacing?: number;\n  palette?: RgbaColor[];\n  invertLuminance?: boolean;\n  antialias?: boolean;\n  densityMap?: PixelBuffer;\n  minGlyphLuminance?: number;\n};\n\nfunction renderAscii(source: PixelBuffer, options: AsciiOptions): PixelBuffer'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Render an image as ASCII art with configurable charset, font size, color mode, ink color, and background." }} />

<CodeBlock code={'const ASCII_CHARSET_PRESETS: Record<string, string>'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Built-in character set presets: <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">dense</code>, <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">standard</code>, <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">technical</code>, <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">blocks</code>, <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">minimal</code>, <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">bloom</code>." }} />

<CodeBlock code={'function normalizeCustomCharset(input: string, fallback?: string): string'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Validate and normalize a custom character set for ASCII rendering." }} />

<h3 id="ascii-sub-effects" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary mt-8 mb-3" dangerouslySetInnerHTML={{ __html: "ASCII sub-effects" }} />

<CodeBlock code={'type SymbolGlowOptions = {\n  cellSize: number;\n  blur: number;\n  brightness: number;\n  charset: string;\n  colorBoost?: number;\n  colorMode?: "colored" | "monochrome";\n};\n\nfunction renderSymbolGlow(source: PixelBuffer, options: SymbolGlowOptions): PixelBuffer\n\ntype LuminousAsciiBloomOptions = {\n  fontSize: number;\n  density: number;\n  bloomRadius: number;\n  glowAmount: number;\n  baseOpacity?: number;\n  minGlyphLuminance?: number;\n  customCharset?: string;\n};\n\nfunction renderLuminousAsciiBloom(\n  source: PixelBuffer,\n  options: LuminousAsciiBloomOptions\n): PixelBuffer\n\ntype AsciiWeightMapOptions = {\n  highlightThreshold: number;\n  shadowThreshold: number;\n  edgeStrength: number;\n  shadowStrength: number;\n};\n\nfunction computeAsciiWeightMap(source: PixelBuffer, options: AsciiWeightMapOptions): PixelBuffer\nfunction computeLuminanceBuffer(source: PixelBuffer): PixelBuffer\nfunction computeGradientMagnitudeBuffer(source: PixelBuffer): PixelBuffer\nfunction computeHighlightMask(source: PixelBuffer, threshold: number, falloff: number, edgeStrength?: number): PixelBuffer'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Default edgeStrength: 0.5." }} />

<h2 id="glow--bloom" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Glow & Bloom" }} />

<CodeBlock code={'type GlowOptions = {\n  radius: number;\n  amount: number;\n  mode?: "screen" | "add" | "soft";\n  color?: RgbaColor;\n};\n\nfunction applyGlow(buffer: PixelBuffer, options: GlowOptions): void\n\ntype BloomOptions = {\n  radius: number;\n  threshold: number;\n  amount: number;\n  color?: RgbaColor;\n};\n\nfunction applyBloom(buffer: PixelBuffer, options: BloomOptions): void\n\ntype HeadroomBloomOptions = {\n  amount: number;\n};\n\nfunction applyHeadroomBloom(\n  base: PixelBuffer,\n  bloom: PixelBuffer,\n  options: HeadroomBloomOptions\n): PixelBuffer'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Additive screen composite that preserves headroom — only lifts channels below 255." }} />

<CodeBlock code={'type HighlightMaskOptions = {\n  threshold?: number;\n  knee?: number;\n  intensity?: number;\n  floor?: number;\n};\n\nfunction extractHighlightMask(source: PixelBuffer, options?: HighlightMaskOptions): PixelBuffer'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Extract a luminance-keyed highlight mask with configurable threshold and knee width." }} />

<CodeBlock code={'function applyBoxBlur(buffer: PixelBuffer, radius: number): void'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Apply a box blur in-place." }} />

<CodeBlock code={'function invertColor(r: number, g: number, b: number): [number, number, number]\nfunction applyBlueCyanGrade(r: number, g: number, b: number, intensity: number): [number, number, number]'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Utility color functions for glow effects." }} />

<h2 id="halftone-print-effects" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Halftone (Print Effects)" }} />

<CodeBlock code={'function renderHalftoneData(source: PixelBuffer, options: HalftoneOptions): PixelBuffer'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "(See Halftone section above for options type.)" }} />

<h2 id="stipple" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Stipple" }} />

<CodeBlock code={'type StippleOptions = {\n  dotSize: number;\n  spacing: number;\n  density: number;\n  inkColor: RgbaColor;\n  backgroundColor: RgbaColor;\n  seed?: number;\n};\n\nfunction renderStipple(source: PixelBuffer, options: StippleOptions): PixelBuffer'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Render a hand-drawn stipple illustration using dot density to model tone." }} />

<h2 id="distortion--glass" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Distortion & Glass" }} />

<CodeBlock code={'function applyCubicGlass(\n  source: PixelBuffer,\n  tileSize: number,\n  distortion?: number,\n  frost?: number\n): PixelBuffer'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Apply a faceted glass distortion effect with refraction-like offsets. Defaults: distortion=0, frost=0.6." }} />

<CodeBlock code={'type CrtGlitchOptions = {\n  sliceHeight: number;\n  shiftAmount: number;\n  rgbShift: number;\n  scanlineStrength: number;\n  noiseAmount: number;\n  seed?: number;\n};\n\nfunction applyCrtGlitch(source: PixelBuffer, options: CrtGlitchOptions): PixelBuffer\n\ntype WaveSliceDirection = "horizontal" | "vertical";\n\ntype WaveSliceOptions = {\n  amplitude: number;\n  frequency: number;\n  direction?: WaveSliceDirection;\n};\n\nfunction applyWaveSlice(source: PixelBuffer, options: WaveSliceOptions): PixelBuffer'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Apply a sinusoidal wave distortion effect." }} />

<h2 id="bitmap-pixelation" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Bitmap Pixelation" }} />

<CodeBlock code={'type BitmapOptions = {\n  cellSize: number;\n  colorLevels: number;\n  ditherThreshold?: number;\n};\n\nfunction applyBitmap(source: PixelBuffer, options: BitmapOptions): PixelBuffer'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Heavy pixelation with palette reduction and optional ordered dither." }} />

<h2 id="led-matrix" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "LED Matrix" }} />

<CodeBlock code={'type LedShape = "circle" | "square";\n\ntype LedMatrixOptions = {\n  cellSize: number;\n  shape?: LedShape;\n  colorMode?: "source" | "white" | "tint";\n  tint?: RgbaColor;\n  glowAmount?: number;\n  backgroundColor?: RgbaColor;\n};\n\nfunction applyLedMatrix(source: PixelBuffer, options: LedMatrixOptions): PixelBuffer'} language="typescript" className="my-4" />

<h2 id="grain--noise" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Grain & Noise" }} />

<CodeBlock code={'function createSeededRandom(seed: number): () => number\n\nfunction applyNoise(buffer: PixelBuffer, amount: number, seed?: number): void'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Default seed: 42." }} />

<CodeBlock code={'function applyGrain(buffer: PixelBuffer, amount: number, seed?: number): void'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Apply film grain noise in-place. amount 0–1. Default seed: 42." }} />

<h2 id="vignette" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Vignette" }} />

<CodeBlock code={'function applyVignette(buffer: PixelBuffer, strength: number): void'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Apply a radial vignette darkening in-place. strength 0–1." }} />

<h2 id="scanlines--rgb-shift" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Scanlines & RGB Shift" }} />

<CodeBlock code={'function applyScanlines(buffer: PixelBuffer, strength: number, lineHeight?: number): void'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Apply CRT scanline overlay in-place. Default lineHeight: 4." }} />

<CodeBlock code={'function applyRgbShift(buffer: PixelBuffer, shiftX: number): void'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Apply horizontal RGB channel separation." }} />

<h2 id="edge-detection" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Edge Detection" }} />

<CodeBlock code={'function applyEdgeDetect(buffer: PixelBuffer, strength: number): void'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Apply edge detection in-place. strength 0–1." }} />

<CodeBlock code={'function renderEdgeBuffer(buffer: PixelBuffer): PixelBuffer'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Return a new buffer containing edge detection output." }} />

<h2 id="blend" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Blend" }} />

<CodeBlock code={'type BlendMode = "normal" | "multiply" | "screen" | "overlay" | "soft" | "lighten";\n\nfunction blendPixelBuffers(\n  bottom: PixelBuffer,\n  top: PixelBuffer,\n  mode?: BlendMode,\n  amount?: number\n): PixelBuffer'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Blend two buffers with the given mode and opacity. Default mode: \"normal\", default amount: 1." }} />

<h2 id="grid-overlay" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Grid Overlay" }} />

<CodeBlock code={'type GridOverlayStyle = "darken" | "lighten" | "color";\n\ntype GridOverlayOptions = {\n  cellSize: number;\n  opacity: number;\n  style?: GridOverlayStyle;\n  color?: RgbaColor;\n  lineWidth?: number;\n};\n\nfunction applyGridOverlay(buffer: PixelBuffer, options: GridOverlayOptions): void'} language="typescript" className="my-4" />

<h2 id="pencil-grain" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Pencil Grain" }} />

<CodeBlock code={'type PencilGrainOptions = {\n  paperColor: RgbaColor;\n  edgeStrength: number;\n  grainAmount: number;\n};\n\nfunction applyPencilGrain(source: PixelBuffer, options: PencilGrainOptions): PixelBuffer'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Render a graphite pencil sketch effect." }} />

<h2 id="inverted-glow" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Inverted Glow" }} />

<CodeBlock code={'type InvertedGlowOptions = {\n  intensity: number;\n};\n\nfunction applyInvertedGlow(source: PixelBuffer, options: InvertedGlowOptions): PixelBuffer'} language="typescript" className="my-4" />

<h2 id="highlights--split-tone" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Highlights / Split Tone" }} />

<CodeBlock code={'type SplitToneOptions = {\n  shadowColor: RgbaColor;\n  highlightColor: RgbaColor;\n  shadowAmount?: number;\n  highlightAmount?: number;\n  shadowAnchor?: number;\n  highlightAnchor?: number;\n};\n\nfunction applySplitTone(source: PixelBuffer, options: SplitToneOptions): PixelBuffer'} language="typescript" className="my-4" />

<h2 id="manga-scanlines" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Manga Scanlines" }} />

<CodeBlock code={'type MangaScreenOptions = {\n  lineSpacing: number;\n  lineWidth: number;\n  angle?: number;\n  threshold?: number;\n  inkColor?: RgbaColor;\n  paperColor?: RgbaColor;\n};\n\nfunction applyMangaScreen(source: PixelBuffer, options: MangaScreenOptions): PixelBuffer'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Manga/comic-style screen tone pattern overlay." }} />

<h2 id="resize" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Resize" }} />

<CodeBlock code={'function resizeNearestNeighbor(\n  source: PixelBuffer,\n  targetWidth: number,\n  targetHeight: number\n): PixelBuffer\n\nfunction resizeBilinear(\n  source: PixelBuffer,\n  targetWidth: number,\n  targetHeight: number\n): PixelBuffer'} language="typescript" className="my-4" />

<h2 id="resolve-glyph-bitmap" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Resolve Glyph Bitmap" }} />

<CodeBlock code={'function resolveGlyphBitmap(char: string): number[]'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Resolve a character to a bitmap glyph representation for ASCII rendering." }} />

<h2 id="see-also" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "See Also" }} />

<ul className="mt-2 space-y-1 text-sm text-body-muted list-disc list-inside">
<li dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/api/presets\" class=\"text-action-blue underline\">Presets API Reference</a> — <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">EffectPreset</code>, <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">intensityMapper</code>, <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">createPipeline</code>" }} />
<li dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/api/worker\" class=\"text-action-blue underline\">Worker API Reference</a> — <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">EffectsWorkerClient</code> for off-thread rendering" }} />
<li dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/guides/architecture\" class=\"text-action-blue underline\">Concepts: Architecture</a> — render flow overview" }} />
</ul>
      </>
    )
  },
  "docs/api/presets": {
    title: "@effectsoup/presets",
    description: "EffectPreset, pipeline, and lookup",
    component: () => (
      <>
        <p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Effect presets that bundle core primitives into tunable pipelines. Each preset exposes an Intensity slider and optional advanced controls." }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "<strong>Exports:</strong> 9 types, 6 functions, 27 constants (24 preset objects + 3 shared consts)" }} />

<h2 id="effectpreset" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "EffectPreset" }} />

<CodeBlock code={'type EffectPreset = {\n  id: string;\n  name: string;\n  description: string;\n  category: PresetCategory;\n  defaultIntensity: number;\n  usesIntensity?: boolean;\n  intensityMapper: IntensityMapper;\n  advancedControlSchema: AdvancedControlDefinition[];\n  createPipeline: (resolvedParameters: ResolvedPresetParameters) => EffectPipeline;\n};'} language="typescript" className="my-4" />

<div className="my-6 overflow-x-auto">
<table className="w-full text-sm">
<thead><tr className="border-b border-hairline">
<th className="px-4 py-2 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted" dangerouslySetInnerHTML={{ __html: "Property" }} />
<th className="px-4 py-2 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted" dangerouslySetInnerHTML={{ __html: "Type" }} />
<th className="px-4 py-2 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted" dangerouslySetInnerHTML={{ __html: "Default" }} />
<th className="px-4 py-2 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted" dangerouslySetInnerHTML={{ __html: "Description" }} />
</tr></thead>
<tbody>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">id</code>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">string</code>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "—" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Unique identifier (kebab-case, e.g. <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">\"dotHalftone\"</code>)" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">name</code>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">string</code>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "—" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Human-readable display name" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">description</code>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">string</code>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "—" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Short description of the visual result" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">category</code>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">PresetCategory</code>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "—" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Category grouping" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">defaultIntensity</code>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">number</code>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "—" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Default intensity value (0–100)" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">usesIntensity</code>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">boolean</code>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">true</code>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Whether the intensity slider is shown (set to <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">false</code> to hide it)" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">intensityMapper</code>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">IntensityMapper</code>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "—" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Converts slider + advanced overrides to resolved parameters" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">advancedControlSchema</code>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">AdvancedControlDefinition[]</code>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">[]</code>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Control definitions rendered automatically by the UI" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">createPipeline</code>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">(params) => EffectPipeline</code>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "—" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Builds a render pipeline from resolved parameters" }} />
</tr>
</tbody>
</table>
</div>

<h2 id="presetcategory" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "PresetCategory" }} />

<CodeBlock code={'type PresetCategory =\n  | "pixelDither"\n  | "asciiSymbols"\n  | "printPaper"\n  | "distortionGlass"\n  | "colorGlow"\n  | "atmosphereGlow"\n  | "retroSignal";'} language="typescript" className="my-4" />

<h2 id="advancedcontroldefinition" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "AdvancedControlDefinition" }} />

<CodeBlock code={'type AdvancedControlType = "range" | "select" | "color" | "boolean" | "text";\n\ntype AdvancedControlDefinition = {\n  id: string;\n  name: string;\n  type: AdvancedControlType;\n  min?: number;        // for "range" type\n  max?: number;        // for "range" type\n  step?: number;       // for "range" type (default: 1)\n  options?: string[];  // for "select" type\n  defaultValue: number | string | boolean;\n};'} language="typescript" className="my-4" />

<h2 id="pipeline-types" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Pipeline Types" }} />

<CodeBlock code={'type IntensityMapper = (\n  intensity: number,\n  advancedOverrides: Record<string, number | string | boolean>\n) => ResolvedPresetParameters;\n\ntype ResolvedPresetParameters = {\n  intensity: number;\n  advancedOverrides: Record<string, number | string | boolean>;\n  [key: string]: unknown;\n};\n\ntype EffectPipeline = (\n  source: PixelBuffer,\n  params: ResolvedPresetParameters\n) => PixelBuffer;'} language="typescript" className="my-4" />

<h2 id="preset-lookup" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Preset Lookup" }} />

<CodeBlock code={'const allPresets: EffectPreset[]'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "All registered presets as an array (25 presets)." }} />

<CodeBlock code={'function getPresetById(id: string): EffectPreset | undefined'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Find a preset by its ID. Supports legacy ID migration (see <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">migratePresetId</code>)." }} />

<CodeBlock code={'function getPresetIds(): string[]'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Get an array of all preset IDs." }} />

<CodeBlock code={'function hasPresetId(id: string): boolean'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Check if a preset ID exists (supports legacy IDs)." }} />

<CodeBlock code={'function migratePresetId(id: string): string'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Map legacy IDs to modern replacements. Known migrations:" }} />

<ul className="mt-2 space-y-1 text-sm text-body-muted list-disc list-inside">
<li dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">\"monoDither\"</code> → <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">\"errorDiffusionDither\"</code>" }} />
<li dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">\"mangaGrid\"</code> → <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">\"pixelGrid\"</code>" }} />
</ul>

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Returns the input unchanged if no migration is needed." }} />

<h2 id="shared-controls--utilities" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Shared Controls & Utilities" }} />

<CodeBlock code={'const atmosphereAdvancedControls: AdvancedControlDefinition[]'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Standard atmosphere controls: <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">grainAmount</code> (range, 0–100) and <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">glowAmount</code> (range, 0–100). Importable for preset schemas to avoid duplication." }} />

<CodeBlock code={'const adjustmentControls: AdvancedControlDefinition[]'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Standard image adjustment controls: <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">brightness</code> (range, -50–50), <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">contrast</code> (range, -50–50), <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">saturation</code> (range, -100–100)." }} />

<CodeBlock code={'function resolveOverride<T>(\n  overrides: Record<string, number | string | boolean>,\n  key: string,\n  defaultValue: T\n): T'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Safely extract a typed value from the overrides record." }} />

<CodeBlock code={'function hexToRgba(hex: string): RgbaColor'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Convert a hex color string to an RGBA color tuple." }} />

<CodeBlock code={'function applyAtmosphereAdjustments(\n  buffer: PixelBuffer,\n  params: ResolvedPresetParameters\n): PixelBuffer'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Apply grain and glow from resolved parameters to a buffer." }} />

<CodeBlock code={'function runAtWorkingResolution(\n  source: PixelBuffer,\n  maxLongest: number,\n  apply: (small: PixelBuffer) => PixelBuffer\n): PixelBuffer'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Downsample source to <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">maxLongest</code>, run <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">apply</code>, then nearest-neighbor upscale back." }} />

<h2 id="color-presets" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Color Presets" }} />

<CodeBlock code={'const CYBER_TINT_PRESETS: Record<string, string>'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">{ terminalGreen: \"#00FF88\", electricCyan: \"#00f0ff\", amberCrt: \"#FFB000\", violetCode: \"#B388FF\" }</code>" }} />

<CodeBlock code={'const ATMOSPHERE_TINT_PRESETS: Record<string, string>'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">{ warmPink: \"#ff5c9a\", coolCyan: \"#00f0ff\", amberCrt: \"#FFB000\", mint: \"#7CFFC4\", custom: \"#ff5c9a\" }</code>" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Dream Glow also defines an internal <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">dreamGlowPalette</code> constant (<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">goldenDusk</code>, <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">roseBloom</code>, <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">coolHaze</code>) used by the preset itself — it is not re-exported from the package." }} />

<h2 id="usage" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Usage" }} />

<CodeBlock code={'import { getPresetById } from "@effectsoup/presets";\nimport type { PixelBuffer } from "@effectsoup/core";\n\nconst preset = getPresetById("dotHalftone")!;\n\n// Map the intensity slider (0–100) to internal params.\nconst params = preset.intensityMapper(75, {});\n\n// Build and run the pipeline.\nconst pipeline = preset.createPipeline(params);\nconst output: PixelBuffer = pipeline(source, params);'} language="typescript" className="my-4" />

<h3 id="overriding-advanced-controls" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary mt-8 mb-3" dangerouslySetInnerHTML={{ __html: "Overriding advanced controls" }} />

<CodeBlock code={'const preset = getPresetById("dotHalftone")!;\n\nconst overrides: Record<string, number | string | boolean> = {};\noverrides.dotSize = 8;\n\nconst params = preset.intensityMapper(75, overrides);\nconst output = preset.createPipeline(params)(source, params);'} language="typescript" className="my-4" />

<h2 id="all-presets-25" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "All presets (25)" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Free presets (14): <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">pixelGrid</code>, <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">errorDiffusionDither</code>, <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">orderedDither</code>, <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">dotHalftone</code>, <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">classicAscii</code>, <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">blocksAscii</code>, <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">denseAscii</code>, <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">duotone</code>, <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">noirGrain</code>, <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">ledMatrix</code>, <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">dreamGlow</code>, <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">stipplePrint</code>, <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">pencilGrain</code>, <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">crtGlitch</code>" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Premium presets (11): <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">bitmap</code>, <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">cyberAscii</code>, <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">luminousAsciiBloom</code>, <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">symbolGlow</code>, <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">crtDream</code>, <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">vhsBloom</code>, <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">risoOffset</code>, <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">cubicGlass</code>, <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">mangaScanlines</code>, <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">waveSlice</code>, <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">invertedGlow</code>" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "See the <a href=\"/docs/reference/effects-catalog\" class=\"text-action-blue underline\">Effects Catalog</a> for descriptions by category." }} />

<h2 id="see-also" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "See Also" }} />

<ul className="mt-2 space-y-1 text-sm text-body-muted list-disc list-inside">
<li dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/api/core\" class=\"text-action-blue underline\">Core API Reference</a> — functions used inside preset pipelines" }} />
<li dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/api/worker\" class=\"text-action-blue underline\">Worker API Reference</a> — rendering presets off the main thread" }} />
<li dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/guides/creating-an-effect\" class=\"text-action-blue underline\">Creating an Effect guide</a> — defining new presets" }} />
</ul>
      </>
    )
  },
  "docs/api/worker": {
    title: "@effectsoup/worker",
    description: "Web Worker client and rendering",
    component: () => (
      <>
        <p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Web Worker client that runs heavy rendering off the main thread. Handles job versioning, cancellation of stale renders, and buffer transfer." }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "<strong>Exports:</strong> 8 types, 1 class (4 methods)" }} />

<h2 id="effectsworkerclient" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "EffectsWorkerClient" }} />

<CodeBlock code={'class EffectsWorkerClient {\n  constructor(workerScriptUrl: string | URL);\n  render(options: RenderOptions): Promise<PixelBuffer>;\n  cancelObsolete(version: number): void;\n  terminate(): void;\n}'} language="typescript" className="my-4" />

<h3 id="constructor" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary mt-8 mb-3" dangerouslySetInnerHTML={{ __html: "Constructor" }} />

<CodeBlock code={'constructor(workerScriptUrl: string | URL): EffectsWorkerClient'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Creates a new Web Worker from the given script URL. The worker script is bundled separately — see the usage note below for bundler-specific paths." }} />

<h3 id="render" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary mt-8 mb-3" dangerouslySetInnerHTML={{ __html: "render" }} />

<CodeBlock code={'render(options: RenderOptions): Promise<PixelBuffer>'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Sends a render job to the worker. Returns a promise that resolves with the output <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">PixelBuffer</code>. Each call increments an internal version counter — if a new render is requested before a previous one completes, the stale result is silently discarded." }} />

<h3 id="cancelobsolete" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary mt-8 mb-3" dangerouslySetInnerHTML={{ __html: "cancelObsolete" }} />

<CodeBlock code={'cancelObsolete(version: number): void'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Signal that a specific version should be ignored if it completes later." }} />

<h3 id="terminate" className="scroll-mt-20 font-display text-lg font-medium tracking-tight text-ink-primary mt-8 mb-3" dangerouslySetInnerHTML={{ __html: "terminate" }} />

<CodeBlock code={'terminate(): void'} language="typescript" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Terminate the worker. Call when done to free resources. After termination, the client cannot be reused." }} />

<h2 id="renderoptions" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "RenderOptions" }} />

<CodeBlock code={'type RenderOptions = {\n  presetId: string;\n  resolvedParameters: ResolvedPresetParameters;\n  source: PixelBuffer;\n  crop: CropConfig;\n  targetWidth: number;\n  targetHeight: number;\n};'} language="typescript" className="my-4" />

<h2 id="worker-message-types" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Worker Message Types" }} />

<CodeBlock code={'type RenderJob = {\n  renderVersion: number;\n  source: PixelBuffer;\n  crop: CropConfig;\n  presetId: string;\n  resolvedParameters: ResolvedPresetParameters;\n  targetWidth: number;\n  targetHeight: number;\n};\n\ntype RenderRequestMessage = { type: "render"; job: RenderJob };\ntype CancelRequestMessage = { type: "cancel"; renderVersion: number };\ntype WorkerRequestMessage = RenderRequestMessage | CancelRequestMessage;\n\ntype RenderResultMessage = { type: "renderResult"; renderVersion: number; output: PixelBuffer };\ntype RenderErrorMessage = { type: "renderError"; renderVersion: number; error: string };\ntype WorkerResponseMessage = RenderResultMessage | RenderErrorMessage;'} language="typescript" className="my-4" />

<h2 id="usage" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Usage" }} />

<CodeBlock code={'import { EffectsWorkerClient } from "@effectsoup/worker";\n\n// Point the client at the worker script.\n// In Vite: new URL("@effectsoup/worker/dist/worker.js", import.meta.url)\n// In other setups: point to dist/worker.js in the package.\nconst client = new EffectsWorkerClient(\n  new URL("@effectsoup/worker/dist/worker.js", import.meta.url)\n);\n\nconst output = await client.render({\n  presetId: "dotHalftone",\n  resolvedParameters: params,\n  source,\n  crop: {\n    aspectRatio: "original",\n    zoom: 1,\n    offsetX: 0,\n    offsetY: 0\n  },\n  targetWidth: 1200,\n  targetHeight: 1600\n});\n\n// Clean up when done.\nclient.terminate();'} language="typescript" className="my-4" />

<Callout variant="info"><span dangerouslySetInnerHTML={{ __html: "The worker script URL depends on your bundler. In Vite you can use the <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">?worker</code> import syntax or <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">new URL(...)</code>. In other setups, point to <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">dist/worker.js</code> in the <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">@effectsoup/worker</code> package." }} /></Callout>

<h2 id="job-versioning--cancellation" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Job Versioning & Cancellation" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Each <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">render()</code> call increments an internal version counter inside the worker. When a render completes, the worker checks whether its version matches the current version — if a newer render was started, the stale result is silently discarded." }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Use <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">cancelObsolete(version)</code> to mark a specific version as obsolete before it completes." }} />

<h2 id="buffer-transfer" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Buffer Transfer" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "The worker transfers the source buffer's underlying <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">ArrayBuffer</code> via <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">postMessage</code> to avoid copying pixel data. This means the source buffer is emptied after posting. The result buffer is also transferred back." }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "After calling <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">render()</code>, the original <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">source</code> <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">PixelBuffer</code> will have its <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">data</code> array detached. Clone it first if you need to keep the original data." }} />

<h2 id="see-also" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "See Also" }} />

<ul className="mt-2 space-y-1 text-sm text-body-muted list-disc list-inside">
<li dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/api/core\" class=\"text-action-blue underline\">Core API Reference</a> — <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">PixelBuffer</code>, <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">CropConfig</code>, <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">ResolvedPresetParameters</code>" }} />
<li dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/api/presets\" class=\"text-action-blue underline\">Presets API Reference</a> — <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">getPresetById</code>, <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">intensityMapper</code>" }} />
<li dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/guides/architecture\" class=\"text-action-blue underline\">Architecture</a> — render flow and worker lifecycle" }} />
<li dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/guides/performance\" class=\"text-action-blue underline\">Performance Guide</a> — worker optimization tips" }} />
</ul>
      </>
    )
  },
  "docs/api/meta-package": {
    title: "@effectsoup/effectsoup",
    description: "All-in-one meta-package",
    component: () => (
      <>
        <p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "All-in-one meta-package that re-exports everything from <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">@effectsoup/core</code>, <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">@effectsoup/presets</code>, and <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">@effectsoup/worker</code>." }} />

<h2 id="installation" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Installation" }} />

<CodeBlock code={'pnpm add @effectsoup/effectsoup'} language="bash" className="my-4" />

<CodeBlock code={'npm install @effectsoup/effectsoup'} language="bash" className="my-4" />

<h2 id="usage" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Usage" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Import any symbol from the meta-package entry point:" }} />

<CodeBlock code={'// Core primitives\nimport { createPixelBuffer, toGrayscale } from "@effectsoup/effectsoup";\nimport type { PixelBuffer, RgbaColor } from "@effectsoup/effectsoup";\n\n// Presets\nimport { getPresetById, allPresets } from "@effectsoup/effectsoup";\nimport type { EffectPreset, EffectPipeline } from "@effectsoup/effectsoup";\n\n// Worker\nimport { EffectsWorkerClient } from "@effectsoup/effectsoup";'} language="typescript" className="my-4" />

<h2 id="when-to-use" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "When to use" }} />

<ul className="mt-2 space-y-1 text-sm text-body-muted list-disc list-inside">
<li dangerouslySetInnerHTML={{ __html: "<strong>Meta-package</strong>: Install once and get the entire engine. Best for quick setup and small projects." }} />
<li dangerouslySetInnerHTML={{ __html: "<strong>Individual packages</strong>: Recommended when you only need specific parts. For example, if you only need core primitives (<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">@effectsoup/core</code>) without the Worker or preset dependencies." }} />
</ul>

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "All 113+ exported symbols from the three sub-packages are available through <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">@effectsoup/effectsoup</code>." }} />

<h2 id="see-also" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "See Also" }} />

<ul className="mt-2 space-y-1 text-sm text-body-muted list-disc list-inside">
<li dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/api/core\" class=\"text-action-blue underline\">Core API Reference</a> — image primitives (39 functions)" }} />
<li dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/api/presets\" class=\"text-action-blue underline\">Presets API Reference</a> — <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">EffectPreset</code>, <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">getPresetById</code>, <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">allPresets</code>" }} />
<li dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/api/worker\" class=\"text-action-blue underline\">Worker API Reference</a> — <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">EffectsWorkerClient</code>" }} />
<li dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/getting-started/installation\" class=\"text-action-blue underline\">Installation Guide</a> — setup steps and minimal example" }} />
</ul>
      </>
    )
  },
  "docs/reference/editor-overview": {
    title: "Editor Overview",
    description: "UI layout, history, undo, compare, mobile",
    component: () => (
      <>
        <p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Reference guide to the EffectSoup playground editor UI." }} />

<h2 id="layout" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Layout" }} />

<div className="my-6 overflow-x-auto">
<table className="w-full text-sm">
<thead><tr className="border-b border-hairline">
<th className="px-4 py-2 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted" dangerouslySetInnerHTML={{ __html: "Region" }} />
<th className="px-4 py-2 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted" dangerouslySetInnerHTML={{ __html: "Description" }} />
</tr></thead>
<tbody>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<strong>Top toolbar</strong>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Back to homepage, undo/redo/reset, replace/remove image, GitHub link, account/user button, and Export button" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<strong>Left sidebar</strong>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Preset library showing all 24+ effects grouped by category. Click to apply" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<strong>Center preview</strong>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Your image with the effect applied in real time. Below: compare toggle and crop controls" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<strong>Right panel</strong>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Intensity slider and all advanced controls for the selected effect. Updates preview in real time" }} />
</tr>
</tbody>
</table>
</div>

<h2 id="history--undo" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "History & Undo" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "The editor maintains a history stack with up to 50 entries." }} />

<ul className="mt-2 space-y-1 text-sm text-body-muted list-disc list-inside">
<li dangerouslySetInnerHTML={{ __html: "<strong>Undo</strong> — navigates backward through crop, effect, and output state changes" }} />
<li dangerouslySetInnerHTML={{ __html: "<strong>Redo</strong> — navigates forward" }} />
<li dangerouslySetInnerHTML={{ __html: "<strong>Reset</strong> — clears all settings back to defaults (crop, effect, output)" }} />
</ul>

<h2 id="compare" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Compare" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Toggle <strong>Compare Before</strong> to see your original (uncropped, uneffected) image alongside the processed result. Useful for evaluating how much an effect changes the photo." }} />

<h2 id="mobile-layout" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Mobile Layout" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "On smaller screens:" }} />

<ul className="mt-2 space-y-1 text-sm text-body-muted list-disc list-inside">
<li dangerouslySetInnerHTML={{ __html: "The left preset sidebar is hidden by default" }} />
<li dangerouslySetInnerHTML={{ __html: "Tap <strong>Show library</strong> at the bottom to reveal the preset grid as an overlay" }} />
<li dangerouslySetInnerHTML={{ __html: "The right controls panel is hidden on narrow screens" }} />
<li dangerouslySetInnerHTML={{ __html: "All editing flows through the main preview with the library drawer" }} />
</ul>

<h2 id="keyboard-shortcuts" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Keyboard shortcuts" }} />

<div className="my-6 overflow-x-auto">
<table className="w-full text-sm">
<thead><tr className="border-b border-hairline">
<th className="px-4 py-2 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted" dangerouslySetInnerHTML={{ __html: "Shortcut" }} />
<th className="px-4 py-2 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted" dangerouslySetInnerHTML={{ __html: "Action" }} />
</tr></thead>
<tbody>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">Ctrl+Z</code> / <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">Cmd+Z</code>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Undo" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">Ctrl+Shift+Z</code> / <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">Cmd+Shift+Z</code>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Redo" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">Ctrl+K</code> / <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">Cmd+K</code>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Open search (docs only)" }} />
</tr>
</tbody>
</table>
</div>

<h2 id="see-also" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "See Also" }} />

<ul className="mt-2 space-y-1 text-sm text-body-muted list-disc list-inside">
<li dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/getting-started/quickstart\" class=\"text-action-blue underline\">Quickstart</a> — 5-minute walkthrough" }} />
<li dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/guides/upload-and-crop\" class=\"text-action-blue underline\">Upload & Crop Guide</a> — image loading and viewport controls" }} />
<li dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/guides/effect-controls\" class=\"text-action-blue underline\">Effect Controls Guide</a> — intensity and advanced controls" }} />
<li dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/guides/exporting\" class=\"text-action-blue underline\">Exporting Guide</a> — format, quality, resolution" }} />
</ul>
      </>
    )
  },
  "docs/reference/effects-catalog": {
    title: "Effects Catalog",
    description: "All 25 presets across 7 categories",
    component: () => (
      <>
        <p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "EffectSoup ships with 24+ presets across 7 categories. Each preset is a complete <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">EffectPreset</code> with configurable controls." }} />

<h2 id="pixel--dither" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Pixel & Dither" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Ordered dither, error diffusion, and color dither patterns. Best for high-contrast images and retro aesthetics." }} />

<div className="my-6 overflow-x-auto">
<table className="w-full text-sm">
<thead><tr className="border-b border-hairline">
<th className="px-4 py-2 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted" dangerouslySetInnerHTML={{ __html: "Preset" }} />
<th className="px-4 py-2 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted" dangerouslySetInnerHTML={{ __html: "Description" }} />
<th className="px-4 py-2 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted" dangerouslySetInnerHTML={{ __html: "Intensity" }} />
</tr></thead>
<tbody>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">pixelGrid</code>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Deliberate pixel-grid abstraction" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "50%" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">errorDiffusionDither</code>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Floyd-Steinberg error diffusion" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "50%" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">orderedDither</code>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "8×8 Bayer ordered dither" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "50%" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">dotHalftone</code>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Colored dot halftone with configurable shape and palette" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "75%" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">bitmap</code> ⭐" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Heavy pixelation with palette reduction and optional ordered dither" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Always on" }} />
</tr>
</tbody>
</table>
</div>

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "<strong>Best for:</strong> High-contrast images, retro aesthetics, print simulation" }} />

<h2 id="ascii--symbols" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "ASCII & Symbols" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Render images as character art using configurable character sets. Best for text-based art from photos." }} />

<div className="my-6 overflow-x-auto">
<table className="w-full text-sm">
<thead><tr className="border-b border-hairline">
<th className="px-4 py-2 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted" dangerouslySetInnerHTML={{ __html: "Preset" }} />
<th className="px-4 py-2 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted" dangerouslySetInnerHTML={{ __html: "Description" }} />
<th className="px-4 py-2 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted" dangerouslySetInnerHTML={{ __html: "Intensity" }} />
</tr></thead>
<tbody>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">classicAscii</code>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Standard ASCII art rendering" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "75%" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">blocksAscii</code>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Block-character ASCII art" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "75%" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">denseAscii</code>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Dense character ASCII rendering" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "75%" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">cyberAscii</code> ⭐" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Cyber-style ASCII with glow" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "75%" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">luminousAsciiBloom</code> ⭐" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Glowing ASCII with bloom effect" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "75%" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">symbolGlow</code> ⭐" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Glowing symbol overlay" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "75%" }} />
</tr>
</tbody>
</table>
</div>

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "<strong>Best for:</strong> Portraits with strong lighting, graphics, text art" }} />

<h2 id="print--ink" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Print & Ink" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Halftone dot patterns, stipple simulation, and ink-style rendering. Best for print aesthetics and illustrated looks." }} />

<div className="my-6 overflow-x-auto">
<table className="w-full text-sm">
<thead><tr className="border-b border-hairline">
<th className="px-4 py-2 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted" dangerouslySetInnerHTML={{ __html: "Preset" }} />
<th className="px-4 py-2 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted" dangerouslySetInnerHTML={{ __html: "Description" }} />
<th className="px-4 py-2 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted" dangerouslySetInnerHTML={{ __html: "Intensity" }} />
</tr></thead>
<tbody>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">stipplePrint</code>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Hand-drawn stipple illustration using dot density" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Always on" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">pencilGrain</code>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Graphite pencil sketch effect" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "50%" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">mangaScanlines</code> ⭐" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Manga/comic-style screen tone pattern overlay" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "75%" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">risoOffset</code> ⭐" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Risograph-style offset color print" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "75%" }} />
</tr>
</tbody>
</table>
</div>

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "<strong>Best for:</strong> Print aesthetics, illustrated looks, editorial design" }} />

<h2 id="distortion--glass" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Distortion & Glass" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Faceted glass distortion and wave distortion effects. Best for abstract and experimental looks." }} />

<div className="my-6 overflow-x-auto">
<table className="w-full text-sm">
<thead><tr className="border-b border-hairline">
<th className="px-4 py-2 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted" dangerouslySetInnerHTML={{ __html: "Preset" }} />
<th className="px-4 py-2 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted" dangerouslySetInnerHTML={{ __html: "Description" }} />
<th className="px-4 py-2 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted" dangerouslySetInnerHTML={{ __html: "Intensity" }} />
</tr></thead>
<tbody>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">cubicGlass</code> ⭐" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Faceted glass distortion with refraction" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "75%" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">waveSlice</code> ⭐" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Sinusoidal wave distortion" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "75%" }} />
</tr>
</tbody>
</table>
</div>

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "<strong>Best for:</strong> Abstract and experimental images, texture" }} />

<h2 id="color--tone" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Color & Tone" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Duotone, grain, posterize, LED matrix, and bitmap effects. Best for creative color grading." }} />

<div className="my-6 overflow-x-auto">
<table className="w-full text-sm">
<thead><tr className="border-b border-hairline">
<th className="px-4 py-2 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted" dangerouslySetInnerHTML={{ __html: "Preset" }} />
<th className="px-4 py-2 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted" dangerouslySetInnerHTML={{ __html: "Description" }} />
<th className="px-4 py-2 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted" dangerouslySetInnerHTML={{ __html: "Intensity" }} />
</tr></thead>
<tbody>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">duotone</code>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Two-color luminance gradient mapping" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "75%" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">noirGrain</code>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Black-and-white with film grain" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "75%" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">ledMatrix</code>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "LED dot matrix simulation" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Always on" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">invertedGlow</code> ⭐" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Inverted-style glow effect" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "75%" }} />
</tr>
</tbody>
</table>
</div>

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "<strong>Best for:</strong> Creative color grading, graphic effects" }} />

<h2 id="atmosphere--glow" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Atmosphere & Glow" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Glow, bloom, and atmospheric effects. Best for adding mood and texture." }} />

<div className="my-6 overflow-x-auto">
<table className="w-full text-sm">
<thead><tr className="border-b border-hairline">
<th className="px-4 py-2 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted" dangerouslySetInnerHTML={{ __html: "Preset" }} />
<th className="px-4 py-2 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted" dangerouslySetInnerHTML={{ __html: "Description" }} />
<th className="px-4 py-2 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted" dangerouslySetInnerHTML={{ __html: "Intensity" }} />
</tr></thead>
<tbody>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">dreamGlow</code>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Soft dreamy glow with palette presets" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "50%" }} />
</tr>
</tbody>
</table>
</div>

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "<strong>Best for:</strong> Portraits, adding mood and atmosphere" }} />

<h2 id="retro-signal" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Retro Signal" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "CRT and VHS-era effects with scanlines, noise, and glitch displacement." }} />

<div className="my-6 overflow-x-auto">
<table className="w-full text-sm">
<thead><tr className="border-b border-hairline">
<th className="px-4 py-2 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted" dangerouslySetInnerHTML={{ __html: "Preset" }} />
<th className="px-4 py-2 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted" dangerouslySetInnerHTML={{ __html: "Description" }} />
<th className="px-4 py-2 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted" dangerouslySetInnerHTML={{ __html: "Intensity" }} />
</tr></thead>
<tbody>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">crtGlitch</code>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "CRT display glitch with RGB separation and noise" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "50%" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">crtDream</code> ⭐" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "CRT with dreamy bloom" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "50%" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">vhsBloom</code> ⭐" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "VHS tape bloom with glitch" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "50%" }} />
</tr>
</tbody>
</table>
</div>

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "<strong>Best for:</strong> Retro-futuristic and VHS-era aesthetics" }} />

<Callout variant="info"><span dangerouslySetInnerHTML={{ __html: "⭐ = Premium preset" }} /></Callout>

<h2 id="see-also" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "See Also" }} />

<ul className="mt-2 space-y-1 text-sm text-body-muted list-disc list-inside">
<li dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/getting-started/quickstart\" class=\"text-action-blue underline\">Quickstart</a> — try effects in the playground" }} />
<li dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/api/presets\" class=\"text-action-blue underline\">Presets API Reference</a> — programmatic access to all presets" }} />
<li dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/guides/creating-an-effect\" class=\"text-action-blue underline\">Creating an Effect guide</a> — adding new presets to <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">allPresets</code>" }} />
</ul>
      </>
    )
  },
  "docs/guides/architecture": {
    title: "Architecture",
    description: "Monorepo structure and rendering flow",
    component: () => (
      <>
        <p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "The EffectSoup monorepo structure and rendering flow." }} />

<h2 id="monorepo-structure" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Monorepo Structure" }} />

<CodeBlock code={'effectsoup/\n  apps/\n    web/ — Next.js app (playground, editor, docs, home)\n  packages/\n    effectsCore/ — Pure TS image primitives\n    effectsPresets/ — Effect presets and schema\n    effectsWorker/ — Web Worker bridge\n    effectsoup/ — Meta-package (re-exports)'} language="text" className="my-4" />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "All four packages are pure TypeScript, browser-safe, and tree-shakeable. No package has a DOM, Node.js, or framework dependency." }} />

<h2 id="package-boundaries" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Package Boundaries" }} />

<ul className="mt-2 space-y-1 text-sm text-body-muted list-disc list-inside">
<li dangerouslySetInnerHTML={{ __html: "The web app imports from packages; packages never import from the app." }} />
<li dangerouslySetInnerHTML={{ __html: "Packages depend only on <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">@effectsoup/core</code> for types and primitives." }} />
<li dangerouslySetInnerHTML={{ __html: "The worker package is the only package that imports from both core and presets." }} />
</ul>

<h2 id="render-flow" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Render Flow" }} />

<ol className="mt-2 space-y-1 text-sm text-body-muted list-decimal list-inside">
<li dangerouslySetInnerHTML={{ __html: "<strong>Decode</strong> — User uploads an image → decoded into <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">PixelBuffer</code> via Canvas 2D API." }} />
<li dangerouslySetInnerHTML={{ __html: "<strong>Crop</strong> — User adjusts crop/zoom/offset → <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">CropConfig</code> updated in editor state." }} />
<li dangerouslySetInnerHTML={{ __html: "<strong>Resolve</strong> — User selects a preset → intensity defaults applied. Editor calls <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">intensityMapper(intensity, overrides)</code> → <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">ResolvedPresetParameters</code>." }} />
<li dangerouslySetInnerHTML={{ __html: "<strong>Render</strong> — Client sends a <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">RenderJob</code> to the Web Worker via <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">postMessage</code>. The worker applies the viewport transform, builds the pipeline from the preset's <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">createPipeline</code>, runs the effect, and transfers the result back via zero-copy <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">ArrayBuffer</code> transfer." }} />
<li dangerouslySetInnerHTML={{ __html: "<strong>Display</strong> — Main thread draws the result to a canvas for preview or export." }} />
</ol>

<h2 id="preset-lifecycle" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Preset Lifecycle" }} />

<ul className="mt-2 space-y-1 text-sm text-body-muted list-disc list-inside">
<li dangerouslySetInnerHTML={{ __html: "<strong>Definition time:</strong> Each preset is a static <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">EffectPreset</code> object with an <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">intensityMapper</code>, <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">advancedControlSchema</code>, and <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">createPipeline</code> factory function." }} />
<li dangerouslySetInnerHTML={{ __html: "<strong>Registration:</strong> Presets are added to the <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">allPresets</code> array in <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">packages/effectsPresets/src/index.ts</code>." }} />
<li dangerouslySetInnerHTML={{ __html: "<strong>Render time:</strong> <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">intensityMapper</code> resolves parameters → <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">createPipeline(params)</code> returns an <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">EffectPipeline</code> → pipeline is called with the source buffer and resolved params." }} />
</ul>

<h2 id="worker-lifecycle" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Worker Lifecycle" }} />

<ul className="mt-2 space-y-1 text-sm text-body-muted list-disc list-inside">
<li dangerouslySetInnerHTML={{ __html: "Created when <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">EffectsWorkerClient</code> is instantiated with a worker script URL." }} />
<li dangerouslySetInnerHTML={{ __html: "Listens for <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">\"render\"</code> messages containing a <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">RenderJob</code>." }} />
<li dangerouslySetInnerHTML={{ __html: "Listens for <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">\"cancel\"</code> messages to mark jobs as obsolete via version comparison." }} />
<li dangerouslySetInnerHTML={{ __html: "Each render increments a version counter; stale results are silently discarded." }} />
<li dangerouslySetInnerHTML={{ __html: "Results are posted back as <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">\"renderResult\"</code> with the output buffer." }} />
<li dangerouslySetInnerHTML={{ __html: "Call <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">client.terminate()</code> to clean up the worker when done." }} />
</ul>

<h2 id="why-web-workers" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Why Web Workers?" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "EffectSoup runs rendering in a Web Worker by default to keep the UI thread responsive during heavy computation. The worker handles crop, pipeline execution, and buffer creation. Canvas drawing and input decoding remain on the main thread (they require DOM APIs that workers don't have access to)." }} />

<h2 id="why-not-webgl-or-wasm" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Why not WebGL or WASM?" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "The engine is pure TypeScript for portability, tree-shakeability, and ease of contribution. No WebGL, no WASM, no native dependencies. This means:" }} />

<ul className="mt-2 space-y-1 text-sm text-body-muted list-disc list-inside">
<li dangerouslySetInnerHTML={{ __html: "Every function can be called from any context: main thread, worker, Node.js, or edge runtime." }} />
<li dangerouslySetInnerHTML={{ __html: "The engine is fully deterministic — no GPU driver variance, no floating-point inconsistencies across platforms." }} />
<li dangerouslySetInnerHTML={{ __html: "Bundlers can tree-shake unused functions." }} />
</ul>

<h2 id="see-also" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "See Also" }} />

<ul className="mt-2 space-y-1 text-sm text-body-muted list-disc list-inside">
<li dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/api/core\" class=\"text-action-blue underline\">Core API Reference</a> — PixelBuffer and all primitives" }} />
<li dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/api/presets\" class=\"text-action-blue underline\">Presets API Reference</a> — EffectPreset lifecycle" }} />
<li dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/api/worker\" class=\"text-action-blue underline\">Worker API Reference</a> — EffectsWorkerClient internals" }} />
<li dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/guides/performance\" class=\"text-action-blue underline\">Performance Guide</a> — optimization tips" }} />
</ul>
      </>
    )
  },
  "docs/troubleshooting": {
    title: "Troubleshooting",
    description: "Common issues and solutions",
    component: () => (
      <>
        <p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Common issues and their solutions when using EffectSoup." }} />

<h2 id="effect-appears-weak-or-too-strong" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Effect appears weak or too strong" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "<strong>Symptom:</strong> The effect barely changes the image, or overwhelms it even at low intensity." }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "<strong>Cause:</strong> The default intensity may not suit your image. Some effects are tuned for specific image types." }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "<strong>Solution:</strong> Adjust the Intensity slider incrementally. If the effect is still too strong at 0%, check if the preset has <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">usesIntensity: false</code> — some effects are always-on (e.g., Stipple Print, LED Matrix). For those, use the advanced controls to reduce the effect strength." }} />

<h2 id="preview-differs-from-exported-result" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Preview differs from exported result" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "<strong>Symptom:</strong> The preview looks different from the downloaded image." }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "<strong>Cause:</strong> The preview runs at a reduced resolution for responsiveness. A lower-res preview can look sharper or softer than the full export." }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "<strong>Solution:</strong> This is expected behavior. Export at your desired resolution to see the final result." }} />

<h2 id="image-upload-fails" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Image upload fails" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "<strong>Symptom:</strong> Error message when trying to upload an image." }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "<strong>Cause:</strong> The file is over 20 MB, exceeds 25 megapixels decoded size, or is not a JPEG/PNG/WebP." }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "<strong>Solution:</strong> Check the file format and size. Resize very large images before uploading. Only JPEG, PNG, and WebP are accepted." }} />

<h2 id="slow-performance-on-large-images" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Slow performance on large images" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "<strong>Symptom:</strong> The editor feels sluggish when adjusting controls on high-resolution photos." }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "<strong>Cause:</strong> Very large images (e.g., 4000×6000px) require more processing time, especially for per-pixel effects." }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "<strong>Solution:</strong> Use smaller source images for faster previews. The preview already runs at reduced resolution. Export at full resolution when ready." }} />

<h2 id="export-fails" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Export fails" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "<strong>Symptom:</strong> Export button does nothing or shows an error." }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "<strong>Cause:</strong> You need to sign in to export. The Canvas <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">toBlob</code> API may fail on some browsers for very large images." }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "<strong>Solution:</strong> Sign in with your account. If export fails on a very large image, try a lower resolution setting or a different format." }} />

<h2 id="worker-not-available" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Worker not available" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "<strong>Symptom:</strong> Rendering fails or the app never loads." }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "<strong>Cause:</strong> The browser does not support Web Workers, or the worker script failed to load." }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "<strong>Solution:</strong> Use a modern browser (Chrome, Firefox, Safari, Edge). The worker script is required for rendering. Check the browser console for specific error messages." }} />

<h2 id="package-import-errors" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Package import errors" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "<strong>Symptom:</strong> TypeScript or build errors when importing from <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">@effectsoup/*</code> packages." }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "<strong>Cause:</strong> Missing dependencies, incorrect import paths, or the package is not built." }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "<strong>Solution:</strong> Ensure the packages are installed (<code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">node_modules</code> exists). Run <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">pnpm build</code> from the monorepo root to build all packages. In the monorepo, run <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">pnpm install</code> from the root." }} />

<h2 id="preset-not-found" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Preset not found" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "<strong>Symptom:</strong> <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">getPresetById</code> returns <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">undefined</code>." }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "<strong>Cause:</strong> The preset ID is misspelled, uses a legacy ID that was not migrated, or the preset is not registered in <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">allPresets</code>." }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "<strong>Solution:</strong> Check <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">getPresetIds()</code> for all valid IDs. Legacy IDs from before migration are supported via <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">migratePresetId</code>. Known migrations: <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">\"monoDither\"</code> → <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">\"errorDiffusionDither\"</code>, <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">\"mangaGrid\"</code> → <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">\"pixelGrid\"</code>. If the preset was removed, use its replacement." }} />

<h2 id="see-also" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "See Also" }} />

<ul className="mt-2 space-y-1 text-sm text-body-muted list-disc list-inside">
<li dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/faq\" class=\"text-action-blue underline\">FAQ</a> — frequently asked questions" }} />
<li dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/getting-started/quickstart\" class=\"text-action-blue underline\">Quickstart</a> — basic playground usage" }} />
<li dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/guides/performance\" class=\"text-action-blue underline\">Performance Guide</a> — optimization tips" }} />
</ul>
      </>
    )
  },
  "docs/faq": {
    title: "FAQ",
    description: "Frequently asked questions",
    component: () => (
      <>
        <h2 id="is-effectsoup-ai-based" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Is EffectSoup AI-based?" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "No. Every effect is a deterministic mathematical pipeline. No machine learning, no neural networks, no AI generation. The same image with the same settings always produces the same pixel output." }} />

<h2 id="is-rendering-localclient-side" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Is rendering local/client-side?" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Yes. All rendering happens in your browser using a Web Worker. Your image is never sent to a server." }} />

<h2 id="are-images-uploaded-to-a-server" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Are images uploaded to a server?" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "No. Image processing is entirely client-side. The only network requests are for loading the application itself. The exported image is created via the Canvas <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">toBlob</code> API on your device." }} />

<h2 id="which-image-formats-are-supported" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Which image formats are supported?" }} />

<ul className="mt-2 space-y-1 text-sm text-body-muted list-disc list-inside">
<li dangerouslySetInnerHTML={{ __html: "<strong>Input:</strong> JPEG, PNG, WebP" }} />
<li dangerouslySetInnerHTML={{ __html: "<strong>Output:</strong> PNG (lossless), JPEG (lossy), WebP (lossy)" }} />
<li dangerouslySetInnerHTML={{ __html: "<strong>Limits:</strong> Maximum input file size is 20 MB with a 25-megapixel decoded dimension cap." }} />
</ul>

<h2 id="can-i-use-the-npm-packages-commercially" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Can I use the npm packages commercially?" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Yes. The packages are published under the MIT license. You can use them in commercial projects, modify them, and distribute them." }} />

<h2 id="how-do-i-create-an-effect" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "How do I create an effect?" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Effects are <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">EffectPreset</code> objects. See the <a href=\"/docs/guides/creating-an-effect\" class=\"text-action-blue underline\">Creating an Effect guide</a> for a walkthrough. Presets are defined in <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">packages/effectsPresets/src/presets/</code> and registered in the <code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">allPresets</code> array." }} />

<h2 id="why-does-the-same-effect-look-different-across-images" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Why does the same effect look different across images?" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Effect parameters are responsive to the image content. Dither thresholds, halftone dot sizes, ASCII luminance mapping, and glow bloom all depend on the source image's lighting, contrast, and colors. An image with flat lighting produces less bloom than one with strong highlights." }} />

<h2 id="which-effects-work-best-for-portraits" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Which effects work best for portraits?" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Dream Glow, Noir Grain, Duotone, and the dither presets. ASCII effects produce recognizable results with strong facial lighting." }} />

<h2 id="which-effects-work-best-for-landscapes" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Which effects work best for landscapes?" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Pixel Grid, Dot Halftone, Stipple Print, Cubic Glass, Wave Slice. CRT Glitch and VHS Bloom can add retro atmosphere to outdoor scenes." }} />

<h2 id="which-effects-work-best-for-graphics-and-text" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Which effects work best for graphics and text?" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "ASCII effects, LED Matrix, Bitmap, and Manga Scanlines. Pixel Grid gives a deliberate retro-game look." }} />

<h2 id="do-i-need-an-account" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Do I need an account?" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "An account is currently required to export images." }} />

<h2 id="is-effectsoup-free" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Is EffectSoup free?" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Yes. Every effect is free. There are no subscriptions, watermarks, or hidden limits in the editor." }} />

<h2 id="see-also" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "See Also" }} />

<ul className="mt-2 space-y-1 text-sm text-body-muted list-disc list-inside">
<li dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/troubleshooting\" class=\"text-action-blue underline\">Troubleshooting</a> — common issues and solutions" }} />
<li dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/getting-started/quickstart\" class=\"text-action-blue underline\">Quickstart</a> — getting started in 5 minutes" }} />
</ul>
      </>
    )
  },
  "docs": {
    title: "Documentation",
    description: "EffectSoup documentation: getting started, guides, API reference, and concepts.",
    component: () => (
      <>
        <p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "EffectSoup is a browser-based, non-AI image transformation engine. Every pixel is processed in a Web Worker on your device — no uploads, no AI, no hidden limits." }} />

<h2 id="getting-started" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Getting Started" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "New here? Start with these:" }} />

<div className="my-6 overflow-x-auto">
<table className="w-full text-sm">
<thead><tr className="border-b border-hairline">
<th className="px-4 py-2 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted" dangerouslySetInnerHTML={{ __html: "Page" }} />
<th className="px-4 py-2 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted" dangerouslySetInnerHTML={{ __html: "What you'll learn" }} />
</tr></thead>
<tbody>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/getting-started/introduction\" class=\"text-action-blue underline\">Introduction</a>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "What EffectSoup is, how rendering works, package overview" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/getting-started/installation\" class=\"text-action-blue underline\">Installation</a>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "npm/pnpm setup, requirements, minimal example" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/getting-started/quickstart\" class=\"text-action-blue underline\">Quickstart</a>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Open the playground, apply an effect, export — in 5 minutes" }} />
</tr>
</tbody>
</table>
</div>

<h2 id="guides" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Guides" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Goal-oriented how-to guides:" }} />

<div className="my-6 overflow-x-auto">
<table className="w-full text-sm">
<thead><tr className="border-b border-hairline">
<th className="px-4 py-2 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted" dangerouslySetInnerHTML={{ __html: "Page" }} />
<th className="px-4 py-2 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted" dangerouslySetInnerHTML={{ __html: "What you'll learn" }} />
</tr></thead>
<tbody>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/guides/upload-and-crop\" class=\"text-action-blue underline\">Upload & Crop Guide</a>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Load, replace, remove images; crop, zoom, offset" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/guides/effect-controls\" class=\"text-action-blue underline\">Effect Controls Guide</a>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Intensity slider, advanced controls, resetting" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/guides/exporting\" class=\"text-action-blue underline\">Exporting Guide</a>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Format, quality, and resolution options" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/guides/creating-an-effect\" class=\"text-action-blue underline\">Creating an Effect</a>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "EffectPreset anatomy, registration, best practices" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/guides/testing-effects\" class=\"text-action-blue underline\">Testing Effects</a>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Vitest patterns for presets and core" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/guides/performance\" class=\"text-action-blue underline\">Performance</a>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Workers, preview resolution, buffer tips" }} />
</tr>
</tbody>
</table>
</div>

<h2 id="reference" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Reference" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Complete API and configuration documentation:" }} />

<div className="my-6 overflow-x-auto">
<table className="w-full text-sm">
<thead><tr className="border-b border-hairline">
<th className="px-4 py-2 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted" dangerouslySetInnerHTML={{ __html: "Page" }} />
<th className="px-4 py-2 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted" dangerouslySetInnerHTML={{ __html: "What you'll find" }} />
</tr></thead>
<tbody>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/reference/editor-overview\" class=\"text-action-blue underline\">Editor Overview</a>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "UI layout, history/undo, compare, mobile" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/reference/effects-catalog\" class=\"text-action-blue underline\">Effects Catalog</a>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "All 24+ presets by category" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/api/core\" class=\"text-action-blue underline\"><code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">@effectsoup/core</code></a>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "39 functions, 22 types — buffer, color, dither, ASCII, glow, distortion" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/api/presets\" class=\"text-action-blue underline\"><code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">@effectsoup/presets</code></a>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "EffectPreset types, lookup functions, shared controls" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/api/worker\" class=\"text-action-blue underline\"><code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">@effectsoup/worker</code></a>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "EffectsWorkerClient, render options, versioning" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/api/meta-package\" class=\"text-action-blue underline\"><code class=\"rounded-sm bg-soft-stone px-1.5 py-0.5 font-mono text-sm text-ink-primary\">@effectsoup/effectsoup</code></a>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Meta-package re-exports" }} />
</tr>
</tbody>
</table>
</div>

<h2 id="concepts" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mt-10 mb-4" dangerouslySetInnerHTML={{ __html: "Concepts" }} />

<p className="mt-1 text-sm leading-relaxed text-body-muted" dangerouslySetInnerHTML={{ __html: "Explanations of how EffectSoup works:" }} />

<div className="my-6 overflow-x-auto">
<table className="w-full text-sm">
<thead><tr className="border-b border-hairline">
<th className="px-4 py-2 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted" dangerouslySetInnerHTML={{ __html: "Page" }} />
<th className="px-4 py-2 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted" dangerouslySetInnerHTML={{ __html: "What you'll learn" }} />
</tr></thead>
<tbody>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/guides/architecture\" class=\"text-action-blue underline\">Architecture</a>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Monorepo layout, render flow, worker lifecycle" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/troubleshooting\" class=\"text-action-blue underline\">Troubleshooting</a>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Common issues and their solutions" }} />
</tr>
<tr className="border-b border-hairline/50">
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "<a href=\"/docs/faq\" class=\"text-action-blue underline\">FAQ</a>" }} />
<td className="px-4 py-2.5 text-sm text-body-muted" dangerouslySetInnerHTML={{ __html: "Frequently asked questions" }} />
</tr>
</tbody>
</table>
</div>
      </>
    )
  },
};

const aliases: Record<string, string> = {
  "docs/effects": "docs/reference/effects-catalog",
  "docs/getting-started/playground": "docs/getting-started/quickstart",
  "docs/getting-started/packages": "docs/getting-started/installation",
  "docs/playground": "docs/reference/editor-overview",
};

export function getPageContent(slug: string): PageContent | undefined {
  const target = aliases[slug] ?? slug;
  return content[target];
}
