# EffectSoup — Architecture

## Goals

- Keep image processing entirely in the browser using the Canvas API.
- Build a clean, modular effect system that can later be extracted into its own package.
- Use a single source of truth for editor state via zustand.
- Compose the UI from small, focused components.

---

## High-Level Flow

```
User uploads image
       ↓
loadImage(file) → HTMLImageElement
       ↓
useEditorStore.sourceImage = image
       ↓
CanvasPreview renders
       ↓
Offscreen canvas draws original image
       ↓
Selected effect processor reads ImageData
       ↓
Processed result drawn to visible canvas
       ↓
User adjusts settings or picks a preset
       ↓
Store updates → CanvasPreview re-renders
       ↓
User clicks Export → canvas.toDataURL("image/png") → download
```

---

## Folder Structure

```
src/
  app/
    page.tsx            # Main editor page, composes all UI
    layout.tsx          # Root layout, dark theme, metadata

  components/
    appShell.tsx        # Layout wrapper: canvas + sidebar
    uploadPanel.tsx     # File input + upload trigger
    effectControls.tsx  # Dynamic controls for active effect
    canvasPreview.tsx   # Visible canvas + render pipeline
    presetGrid.tsx      # Preset selector cards
    exportButton.tsx    # PNG export trigger

  lib/
    image/
      loadImage.ts      # File → HTMLImageElement loader
      canvasUtils.ts    # Canvas creation / context helpers
      imageDataUtils.ts # Pixel-level helpers (avg color, brightness, etc.)

    effects/
      types.ts          # Shared types for effects and settings
      pixelate.ts       # Pixelate processor
      ascii.ts          # ASCII art processor
      orderedDither.ts  # Bayer ordered dither processor
      halftone.ts       # Halftone dot processor
      duotone.ts        # Duotone processor
      symbolGlow.ts     # Symbol glow processor

    presets/
      presets.ts        # Preset definitions

  store/
    useEditorStore.ts   # Zustand store for editor state
```

All filenames are camelCase to match the project convention.

---

## Image Processing Pipeline

### 1. Loading
`loadImage.ts` converts a `File` into an `HTMLImageElement` using `URL.createObjectURL`. The object URL is revoked after the image loads to prevent memory leaks.

### 2. Offscreen preparation
`canvasUtils.ts` creates an offscreen canvas sized to the natural dimensions of the source image. The source image is drawn onto this canvas so we can read pixel data with `getImageData`.

### 3. Effect processing
Each effect processor receives:
- `ctx` — the visible canvas rendering context
- `sourceImageData` — the `ImageData` from the offscreen canvas
- `settings` — the active effect settings
- `sourceImage` — the original `HTMLImageElement` (useful for re-drawing or scaling)

Processors manipulate pixels directly or use canvas drawing commands (e.g., `fillText`, `arc`). Processors are pure functions: given the same inputs they produce the same output.

### 4. Rendering to screen
The visible canvas in `CanvasPreview` is sized to fit its container while preserving aspect ratio. The effect processor draws the final result onto it. The preview re-renders whenever `sourceImage`, `effectType`, or `settings` change.

### 5. Export
Export uses the visible canvas's `toDataURL("image/png")` to generate a downloadable PNG. A temporary anchor element triggers the browser download.

---

## Component Structure

### `appShell.tsx`
- Root visual container.
- Uses a two-column grid: main canvas area (flexible) and a fixed-width sidebar.
- Applies dark theme background, subtle borders, and consistent spacing.

### `uploadPanel.tsx`
- Wraps a hidden `<input type="file" accept="image/*">`.
- Provides a styled trigger area/button.
- Calls `loadImage` and dispatches the result to the store.

### `canvasPreview.tsx`
- Owns the visible `<canvas>` ref.
- Subscribes to store values.
- Runs the render effect pipeline in a `useEffect`.
- Shows a placeholder when no image is loaded.

### `effectControls.tsx`
- Reads `effectType` and `settings` from the store.
- Renders a different control panel for each effect.
- All inputs call `updateSettings`.
- Includes an effect selector at the top.

### `presetGrid.tsx`
- Reads the `PRESETS` list.
- Renders preset cards.
- On selection, calls `applyPreset`.

### `exportButton.tsx`
- Receives a reference to the visible canvas.
- Generates a PNG data URL and triggers download.
- Disabled when no image is loaded.

---

## State Management

### Store: `useEditorStore.ts`

Managed with zustand. Single store keeps the editor simple and predictable.

```ts
interface EditorState {
  sourceImage: HTMLImageElement | null;
  effectType: EffectType;
  settings: EffectParams;
  selectedPresetId: string | null;

  setSourceImage: (image: HTMLImageElement) => void;
  setEffectType: (type: EffectType) => void;
  updateSettings: (settings: Partial<EffectParams>) => void;
  applyPreset: (preset: Preset) => void;
  resetSettings: () => void;
}
```

### State rules
- Only one effect is active at a time.
- Settings are always valid for the current `effectType`.
- Switching effects resets settings to that effect's defaults.
- Applying a preset sets `effectType`, `settings`, and `selectedPresetId`.
- The store does not persist data in the MVP.

---

## Effect System

### Types

All effect types live in `src/lib/effects/types.ts`.

```ts
type EffectType =
  | "pixelate"
  | "ascii"
  | "orderedDither"
  | "halftone"
  | "duotone"
  | "symbolGlow";

interface EffectRenderContext {
  ctx: CanvasRenderingContext2D;
  sourceImageData: ImageData;
  sourceImage: HTMLImageElement;
  width: number;
  height: number;
}

type EffectProcessor<T extends EffectParams> = (
  context: EffectRenderContext,
  settings: T
) => void;
```

### Adding a new effect later

1. Add the effect name to `EffectType`.
2. Create a settings interface.
3. Implement the processor in `src/lib/effects/{name}.ts`.
4. Add default settings in `defaultSettings.ts`.
5. Add controls in `effectControls.tsx`.
6. Optionally add presets in `presets.ts`.

Because each processor is self-contained, the entire effects directory can be moved to a separate package with minimal changes.

---

## Rendering Details

### Pixel-based effects (Pixelate, Ordered Dither, Duotone)
- Read `ImageData` from the offscreen canvas.
- Iterate pixels or blocks.
- Write results directly into a new `ImageData` buffer.
- Use `ctx.putImageData` to draw to the visible canvas.

### Drawing-based effects (ASCII, Halftone, Symbol Glow)
- Read `ImageData` for brightness / color sampling.
- Use canvas drawing commands (`fillText`, `arc`) to build the output.
- For Symbol Glow, draw a blurred copy of the source first using `ctx.filter`.

### Aspect ratio
The visible canvas is sized via CSS, while the internal canvas dimensions follow the source image aspect ratio. Processors operate on the source resolution for consistent output.

---

## Dependencies

- `next` — framework and dev server
- `react` / `react-dom` — UI library
- `typescript` — type safety
- `tailwindcss` — utility-first styling
- `shadcn/ui` — base UI primitives
- `zustand` — state management
- Canvas API — image processing (built into browsers)

No backend runtime, no AI APIs, no auth libraries, no payment libraries.
