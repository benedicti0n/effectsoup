# @effectsoup/presets

Product-level image effect presets built on top of `@effectsoup/core`. Each preset exposes a single Intensity slider and optional advanced controls — ready to drop into any UI.

> [API Reference](https://effectsoup.com/docs/api/presets) · [Effects Catalog](https://effectsoup.com/docs/reference/effects-catalog) · [Full Documentation](https://effectsoup.com/docs)

---

## Installation

```bash
npm install @effectsoup/presets
```

Also requires `@effectsoup/core` (listed as a peer dependency):

```bash
npm install @effectsoup/core @effectsoup/presets
```

Or install the meta-package for everything:

```bash
npm install @effectsoup/effectsoup
```

---

## Quick Start

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

---

## API

### Preset Lookup

| Function | Returns | Description |
|---|---|---|
| `allPresets` | `EffectPreset[]` | Every registered preset (25 presets) |
| `getPresetById(id)` | `EffectPreset \| undefined` | Look up by ID (supports legacy IDs) |
| `getPresetIds()` | `string[]` | List every preset ID |
| `hasPresetId(id)` | `boolean` | Check if a preset exists |
| `migratePresetId(id)` | `string` | Map legacy IDs to current ones |
| `sortPresets(presets)` | `EffectPreset[]` | Sort presets by category order |

### Key Types

```ts
type EffectPreset = {
  id: string;
  name: string;
  description: string;
  category: PresetCategory;
  defaultIntensity: number;       // 0–100
  usesIntensity?: boolean;        // false hides the slider
  intensityMapper: IntensityMapper;
  advancedControlSchema: AdvancedControlDefinition[];
  createPipeline: (params) => EffectPipeline;
};

type PresetCategory =
  | "pixelDither"
  | "asciiSymbols"
  | "printPaper"
  | "distortionGlass"
  | "colorGlow"
  | "atmosphereGlow"
  | "retroSignal";
```

### Control Schema

The `advancedControlSchema` array tells a UI what controls to render:

```ts
type AdvancedControlDefinition = {
  id: string;
  name: string;
  type: "range" | "select" | "color" | "boolean" | "text";
  min?: number;           // for "range"
  max?: number;           // for "range"
  step?: number;          // for "range" (default: 1)
  options?: string[];     // for "select"
  defaultValue: number | string | boolean;
};
```

---

## Categories

| Category | Presets | Description |
|---|---|---|
| `pixelDither` | pixelGrid, errorDiffusionDither, orderedDither, dotHalftone, bitmap | Pixel grids, halftones, and structured dithering |
| `asciiSymbols` | classicAscii, blocksAscii, denseAscii, cyberAscii, luminousAsciiBloom, symbolGlow | Luminance-to-glyph ASCII art rendering |
| `printPaper` | stipplePrint, pencilGrain, mangaScanlines, risoOffset | Stipple, pencil, and risograph-inspired effects |
| `distortionGlass` | cubicGlass, waveSlice | Refractive geometric distortion effects |
| `colorGlow` | duotone, noirGrain, ledMatrix, invertedGlow | Duotone, film grain, LED matrix, and color grading |
| `atmosphereGlow` | dreamGlow | Cinematic bloom and atmospheric lighting |
| `retroSignal` | crtGlitch, crtDream, vhsBloom | CRT, glitch, VHS, and analog broadcast effects |

**25 presets total** — 14 free, 11 premium.

---

## Advanced Overrides

Start from the schema defaults, then tweak individual controls:

```ts
const preset = getPresetById("dotHalftone")!;

const overrides: Record<string, number | string | boolean> = {};
overrides.dotSize = 8;

const params = preset.intensityMapper(75, overrides);
const output = preset.createPipeline(params)(source, params);
```

---

## Shared Controls & Utilities

```ts
// Reusable control definitions
const atmosphereAdvancedControls: AdvancedControlDefinition[];
const adjustmentControls: AdvancedControlDefinition[];

// Utility functions
function resolveOverride<T>(overrides, key, defaultValue): T;
function hexToRgba(hex: string): RgbaColor;
function applyAtmosphereAdjustments(buffer, params): PixelBuffer;
function runAtWorkingResolution(source, maxLongest, apply): PixelBuffer;
```

The built-in `adjustmentControls` cover brightness (-50 to 50), contrast (-50 to 50), and saturation (-100 to 100).

---

## Color Preset Maps

```ts
const CYBER_TINT_PRESETS: Record<string, string>;
// { terminalGreen, electricCyan, amberCrt, violetCode }

const ATMOSPHERE_TINT_PRESETS: Record<string, string>;
// { warmPink, coolCyan, amberCrt, mint, custom }
```

---

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

---

## License

MIT
