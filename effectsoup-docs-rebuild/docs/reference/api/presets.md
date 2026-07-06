# `@effectsoup/presets`

Effect presets that bundle core primitives into tunable pipelines. Each preset exposes an Intensity slider and optional advanced controls.

**Exports:** 9 types, 6 functions, 27 constants (24 preset objects + 3 shared consts)

## EffectPreset

```typescript
type EffectPreset = {
  id: string;
  name: string;
  description: string;
  category: PresetCategory;
  defaultIntensity: number;
  usesIntensity?: boolean;
  intensityMapper: IntensityMapper;
  advancedControlSchema: AdvancedControlDefinition[];
  createPipeline: (resolvedParameters: ResolvedPresetParameters) => EffectPipeline;
};
```

| Property | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | — | Unique identifier (kebab-case, e.g. `"dotHalftone"`) |
| `name` | `string` | — | Human-readable display name |
| `description` | `string` | — | Short description of the visual result |
| `category` | `PresetCategory` | — | Category grouping |
| `defaultIntensity` | `number` | — | Default intensity value (0–100) |
| `usesIntensity` | `boolean` | `true` | Whether the intensity slider is shown (set to `false` to hide it) |
| `intensityMapper` | `IntensityMapper` | — | Converts slider + advanced overrides to resolved parameters |
| `advancedControlSchema` | `AdvancedControlDefinition[]` | `[]` | Control definitions rendered automatically by the UI |
| `createPipeline` | `(params) => EffectPipeline` | — | Builds a render pipeline from resolved parameters |

## PresetCategory

```typescript
type PresetCategory =
  | "pixelDither"
  | "asciiSymbols"
  | "printPaper"
  | "distortionGlass"
  | "colorGlow"
  | "atmosphereGlow"
  | "retroSignal";
```

## AdvancedControlDefinition

```typescript
type AdvancedControlType = "range" | "select" | "color" | "boolean" | "text";

type AdvancedControlDefinition = {
  id: string;
  name: string;
  type: AdvancedControlType;
  min?: number;        // for "range" type
  max?: number;        // for "range" type
  step?: number;       // for "range" type (default: 1)
  options?: string[];  // for "select" type
  defaultValue: number | string | boolean;
};
```

## Pipeline Types

```typescript
type IntensityMapper = (
  intensity: number,
  advancedOverrides: Record<string, number | string | boolean>
) => ResolvedPresetParameters;

type ResolvedPresetParameters = {
  intensity: number;
  advancedOverrides: Record<string, number | string | boolean>;
  [key: string]: unknown;
};

type EffectPipeline = (
  source: PixelBuffer,
  params: ResolvedPresetParameters
) => PixelBuffer;
```

## Preset Lookup

```typescript
const allPresets: EffectPreset[]
```
All registered presets as an array (25 presets).

```typescript
function getPresetById(id: string): EffectPreset | undefined
```
Find a preset by its ID. Supports legacy ID migration (see `migratePresetId`).

```typescript
function getPresetIds(): string[]
```
Get an array of all preset IDs.

```typescript
function hasPresetId(id: string): boolean
```
Check if a preset ID exists (supports legacy IDs).

```typescript
function migratePresetId(id: string): string
```
Map legacy IDs to modern replacements. Known migrations:
- `"monoDither"` → `"errorDiffusionDither"`
- `"mangaGrid"` → `"pixelGrid"`

Returns the input unchanged if no migration is needed.

## Shared Controls & Utilities

```typescript
const atmosphereAdvancedControls: AdvancedControlDefinition[]
```
Standard atmosphere controls: `grainAmount` (range, 0–100) and `glowAmount` (range, 0–100). Importable for preset schemas to avoid duplication.

```typescript
const adjustmentControls: AdvancedControlDefinition[]
```
Standard image adjustment controls: `brightness` (range, -50–50), `contrast` (range, -50–50), `saturation` (range, -100–100).

```typescript
function resolveOverride<T>(
  overrides: Record<string, number | string | boolean>,
  key: string,
  defaultValue: T
): T
```
Safely extract a typed value from the overrides record.

```typescript
function hexToRgba(hex: string): RgbaColor
```
Convert a hex color string to an RGBA color tuple.

```typescript
function applyAtmosphereAdjustments(
  buffer: PixelBuffer,
  params: ResolvedPresetParameters
): PixelBuffer
```
Apply grain and glow from resolved parameters to a buffer.

```typescript
function runAtWorkingResolution(
  source: PixelBuffer,
  maxLongest: number,
  apply: (small: PixelBuffer) => PixelBuffer
): PixelBuffer
```
Downsample source to `maxLongest`, run `apply`, then nearest-neighbor upscale back.

## Color Presets

```typescript
const CYBER_TINT_PRESETS: Record<string, string>
```
`{ terminalGreen: "#00FF88", electricCyan: "#00f0ff", amberCrt: "#FFB000", violetCode: "#B388FF" }`

```typescript
const ATMOSPHERE_TINT_PRESETS: Record<string, string>
```
`{ warmPink: "#ff5c9a", coolCyan: "#00f0ff", amberCrt: "#FFB000", mint: "#7CFFC4", custom: "#ff5c9a" }`

Dream Glow also defines an internal `dreamGlowPalette` constant (`goldenDusk`, `roseBloom`, `coolHaze`) used by the preset itself — it is not re-exported from the package.

## Usage

```typescript
import { getPresetById } from "@effectsoup/presets";
import type { PixelBuffer } from "@effectsoup/core";

const preset = getPresetById("dotHalftone")!;

// Map the intensity slider (0–100) to internal params.
const params = preset.intensityMapper(75, {});

// Build and run the pipeline.
const pipeline = preset.createPipeline(params);
const output: PixelBuffer = pipeline(source, params);
```

### Overriding advanced controls

```typescript
const preset = getPresetById("dotHalftone")!;

const overrides: Record<string, number | string | boolean> = {};
overrides.dotSize = 8;

const params = preset.intensityMapper(75, overrides);
const output = preset.createPipeline(params)(source, params);
```

## All presets (25)

Free presets (14): `pixelGrid`, `errorDiffusionDither`, `orderedDither`, `dotHalftone`, `classicAscii`, `blocksAscii`, `denseAscii`, `duotone`, `noirGrain`, `ledMatrix`, `dreamGlow`, `stipplePrint`, `pencilGrain`, `crtGlitch`

Premium presets (11): `bitmap`, `cyberAscii`, `luminousAsciiBloom`, `symbolGlow`, `crtDream`, `vhsBloom`, `risoOffset`, `cubicGlass`, `mangaScanlines`, `waveSlice`, `invertedGlow`

See the [Effects Catalog](../effects-catalog.md) for descriptions by category.

## See Also

- [Core API Reference](core.md) — functions used inside preset pipelines
- [Worker API Reference](worker.md) — rendering presets off the main thread
- [Creating an Effect guide](../../guides/creating-an-effect.md) — defining new presets
