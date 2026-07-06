# Quickstart

Open the playground, upload a photo, and export an effect — in under 5 minutes, no installation required.

## Prerequisites

- A modern browser (Chrome, Firefox, Safari, Edge)
- A JPEG, PNG, or WebP image (up to 20 MB, 25 megapixels max)

## Step 1: Open the playground

Navigate to **[your-deployed-url]/playground** or run the project locally:

```bash
pnpm dev
```

Then open `http://localhost:3000/playground`.

You'll see an upload panel with a drop zone and a "Choose Image" button.

## Step 2: Upload an image

Click "Choose Image" or drag and drop a photo onto the upload panel. The image appears in the center preview with the effect library on the left sidebar.

> Your image never leaves your device. All processing happens in-browser via a Web Worker.

## Step 3: Apply an effect

The left sidebar shows all 24+ presets grouped into categories:

- **Pixel & Dither** — ordered dither, error diffusion, dot halftone
- **ASCII & Symbols** — classic ASCII, blocks, dense, cyber, symbol glow
- **Print & Ink** — stipple print, pencil grain, manga scanlines, riso offset
- **Distortion & Glass** — cubic glass, wave slice
- **Color & Tone** — duotone, noir grain, LED matrix, bitmap, inverted glow
- **Atmosphere & Glow** — dream glow, grain, bloom
- **Retro Signal** — CRT glitch, CRT dream, VHS bloom

Click any preset to apply it immediately. The right panel shows intensity and advanced controls.

## Step 4: Adjust controls

- **Intensity slider** (0–100%) — scales the primary effect. At 0%, the effect is bypassed.
- **Advanced controls** — effect-specific parameters (cell size, threshold, dot size, colors).
- **Crop** — below the preview: aspect ratio, zoom, and offset X/Y.

All adjustments update the preview in real time. The preview runs at a reduced resolution for responsiveness.

## Step 5: Export

Click the **Export** button in the top toolbar. Choose:

| Option | Values |
|---|---|
| Format | PNG (lossless), JPEG (lossy), WebP (lossy) |
| Quality | 50–100% (JPEG/WebP only) |
| Resolution | 1080px, Original, or 4K |

> You need to sign in to export. Sign up is free — no subscriptions, no watermarks, no hidden limits.

The exported image is generated via the Canvas `toBlob` API on your device.

## What you built

You've used the full EffectSoup pipeline: upload → crop → resolve parameters → render → export. The same pipeline runs programmatically via the npm packages — see [Installation](installation.md) to integrate it into your own project.

## See Also

- [Effect Controls Guide](../guides/effect-controls.md) — detailed control reference
- [Exporting Guide](../guides/exporting.md) — format, quality, resolution details
- [Editor Overview](../reference/editor-overview.md) — full UI walkthrough
