# @effectsoup/presets

Product-level image effect presets built on top of `@effectsoup/core`. Each preset exposes a single Intensity slider and optional advanced controls.

**→ [API Reference](https://effectsoup-web.vercel.app/docs/api/presets)**
**→ [Effects Catalog](https://effectsoup-web.vercel.app/docs/effects)**
**→ [Full Docs](https://effectsoup-web.vercel.app/docs)**

## Install

```bash
npm install @effectsoup/presets
```

Or install everything at once:

```bash
npm install @effectsoup/effectsoup
```

## Quick start

```ts
import { getPresetById } from "@effectsoup/presets";
import type { PixelBuffer } from "@effectsoup/core";

const preset = getPresetById("dotHalftone")!;

// Map the UI Intensity slider (0-100) to internal parameters
const params = preset.intensityMapper(75, {});

// Build and run the pipeline
const pipeline = preset.createPipeline(params);
const output: PixelBuffer = pipeline(source, params);
```

## Advanced overrides

Start from the schema defaults, then tweak individual controls:

```ts
const overrides = preset.advancedControlSchema.reduce(
  (acc, control) => {
    acc[control.id] = control.defaultValue;
    return acc;
  },
  {} as Record<string, number | string | boolean>
);

overrides.dotSize = 8;

const params = preset.intensityMapper(75, overrides);
const output = pipeline(source, params);
```

## API

- `allPresets` — every registered preset
- `getPresetById(id)` — look up a preset by ID (supports legacy IDs)
- `migratePresetId(id)` — map legacy preset IDs to current ones
- `getPresetIds()` — list every preset id
- `hasPresetId(id)` — check whether a preset (or migrated variant) exists

## Categories

| Category | Description |
|---|---|
| `pixelDither` | Pixel grids, halftones, and structured dithering |
| `asciiSymbols` | Luminance-to-glyph ASCII art rendering |
| `printPaper` | Stipple, pencil, and risograph-inspired effects |
| `distortionGlass` | Refractive geometric distortion effects |
| `colorGlow` | Duotone, film grain, LED matrix, and color grading |
| `atmosphereGlow` | Cinematic bloom and atmospheric lighting |
| `retroSignal` | CRT, glitch, VHS, and analog broadcast effects |

## Development

```bash
# Build
pnpm build

# Type check
pnpm typecheck

# Test
pnpm test

# Lint
pnpm lint
```

## License

MIT
