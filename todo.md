# EffectSoup — Implementation Todo

## Phase 0: Project Setup

### 0.1 Initialize Next.js project
- [ ] Run `npx shadcn@latest init --yes --template next --base-color zinc` in the repo root.
- [ ] Confirm `next.config.js` / `next.config.ts` exists.
- [ ] Verify TypeScript is configured.
- [ ] Verify Tailwind CSS is configured.
- [ ] Verify `src/` directory is used.
- [ ] Run the dev server once to confirm the default page loads.

### 0.2 Install dependencies
- [ ] Install zustand: `npm install zustand`.
- [ ] Install shadcn/ui components:
  - [ ] `button`
  - [ ] `slider`
  - [ ] `select`
  - [ ] `card`
  - [ ] `label`
  - [ ] `separator`
  - [ ] `tooltip` (optional)
- [ ] Verify `package.json` reflects installed dependencies.

### 0.3 Clean up boilerplate
- [ ] Replace default `src/app/page.tsx` content with a minimal placeholder.
- [ ] Remove unused default assets (e.g., `public/` boilerplate if any).
- [ ] Confirm `src/app/layout.tsx` uses a clean root layout.

---

## Phase 1: Core Infrastructure

### 1.1 Create image utility modules
- [ ] Create `src/lib/image/loadImage.ts`.
  - [ ] Write `loadImage(file: File): Promise<HTMLImageElement>`.
  - [ ] Use `URL.createObjectURL` to create a blob URL.
  - [ ] Set `img.onload` and `img.onerror`.
  - [ ] Revoke object URL after loading to avoid memory leaks.
- [ ] Create `src/lib/image/canvasUtils.ts`.
  - [ ] Write `createCanvas(width: number, height: number): HTMLCanvasElement`.
  - [ ] Write `getContext2D(canvas: HTMLCanvasElement): CanvasRenderingContext2D` with `willReadFrequently: true`.
  - [ ] Write `drawImageToCanvas(img, canvas): void`.
  - [ ] Write `canvasToDataURL(canvas): string` for PNG export.
- [ ] Create `src/lib/image/imageDataUtils.ts`.
  - [ ] Write `getImageData(canvas, ctx): ImageData`.
  - [ ] Write `putImageData(ctx, imageData): void`.
  - [ ] Write `createImageData(width, height): ImageData`.
  - [ ] Write helper `getPixelIndex(x, y, width)`.
  - [ ] Write helper `setPixel(rgbaArray, index, r, g, b, a)`.
  - [ ] Write `computeAverageColor(imageData, x, y, blockWidth, blockHeight)`.
  - [ ] Write `computeAverageBrightness(imageData, x, y, blockWidth, blockHeight)`.
  - [ ] Write `rgbToLuminance(r, g, b)`.
  - [ ] Write `hexToRgb(hex)` and `rgbToHex(r, g, b)` helpers.

### 1.2 Define effect types
- [ ] Create `src/lib/effects/types.ts`.
  - [ ] Define `EffectType` enum or union: `"pixelate" | "ascii" | "orderedDither" | "halftone" | "duotone" | "symbolGlow"`.
  - [ ] Define base `EffectSettings` interface.
  - [ ] Define per-effect settings interfaces:
    - [ ] `PixelateSettings`
    - [ ] `AsciiSettings`
    - [ ] `OrderedDitherSettings`
    - [ ] `HalftoneSettings`
    - [ ] `DuotoneSettings`
    - [ ] `SymbolGlowSettings`
  - [ ] Define `EffectParams` discriminated union of all settings.
  - [ ] Define `ProcessedImage` / `ImageSource` type for the loaded image.
  - [ ] Define `EffectRenderFn` type signature: `(ctx, imageData, settings, sourceImage) => void`.

### 1.3 Implement each effect processor
- [ ] Create `src/lib/effects/pixelate.ts`.
  - [ ] Implement downsample-by-block algorithm.
  - [ ] Average each block color and fill the block.
  - [ ] Add optional grid overlay.
  - [ ] Respect `blockSize` and `showGrid` settings.
- [ ] Create `src/lib/effects/ascii.ts`.
  - [ ] Divide image into cells based on `fontSize`.
  - [ ] Compute average brightness per cell.
  - [ ] Map brightness to character in `charSet`.
  - [ ] Render characters onto canvas with `fillText`.
  - [ ] Support `colorMode`: `"monochrome"` and `"colored"`.
- [ ] Create `src/lib/effects/orderedDither.ts`.
  - [ ] Convert image to grayscale.
  - [ ] Use a Bayer matrix threshold map.
  - [ ] Compare luminance against threshold.
  - [ ] Output black/white or palette colors.
  - [ ] Support `levels` setting.
- [ ] Create `src/lib/effects/halftone.ts`.
  - [ ] Divide image into grid cells.
  - [ ] Compute brightness per cell.
  - [ ] Draw circles with size based on darkness.
  - [ ] Support `colorMode`: `"blackAndWhite"` and `"colored"`.
- [ ] Create `src/lib/effects/duotone.ts`.
  - [ ] Compute luminance per pixel.
  - [ ] Interpolate between `shadowColor` and `highlightColor`.
  - [ ] Optionally preserve original saturation or tint.
- [ ] Create `src/lib/effects/symbolGlow.ts`.
  - [ ] Render a blurred version of the image as background (use canvas filter).
  - [ ] Divide into cells and compute brightness.
  - [ ] Map brightness to symbol in `symbolSet`.
  - [ ] Render symbols with text shadow/glow.
  - [ ] Use symbol set like `"2*+/=e"`.

### 1.4 Create presets
- [ ] Create `src/lib/presets/presets.ts`.
  - [ ] Define `Preset` interface: `{ id, name, effectType, settings }`.
  - [ ] Implement preset: **Dream ASCII**.
  - [ ] Implement preset: **Newspaper Dither**.
  - [ ] Implement preset: **Dark Dot Poster**.
  - [ ] Implement preset: **Pixel Anime**.
  - [ ] Implement preset: **Soft Duotone**.
  - [ ] Implement preset: **Symbol Glow Flower**.
  - [ ] Export `PRESETS` array.

---

## Phase 2: State Management

### 2.1 Create zustand store
- [ ] Create `src/store/useEditorStore.ts`.
  - [ ] Define `EditorState` interface.
  - [ ] State fields:
    - [ ] `sourceImage: HTMLImageElement | null`
    - [ ] `effectType: EffectType`
    - [ ] `settings: EffectParams`
    - [ ] `selectedPresetId: string | null`
  - [ ] Actions:
    - [ ] `setSourceImage(image)`
    - [ ] `setEffectType(type)`
    - [ ] `updateSettings(partialSettings)`
    - [ ] `applyPreset(preset)`
    - [ ] `resetSettings()`
  - [ ] Persist nothing in MVP.
  - [ ] Ensure store is typed.

### 2.2 Wire effect defaults
- [ ] Create `src/lib/effects/defaultSettings.ts`.
  - [ ] Export `getDefaultSettings(effectType): EffectParams`.
  - [ ] Provide sensible defaults for each effect.
- [ ] Use defaults in store initialization and when switching effects.

---

## Phase 3: UI Components

### 3.1 Build layout shell
- [ ] Create `src/components/appShell.tsx`.
  - [ ] Dark theme wrapper.
  - [ ] Two-column layout: canvas area (main) + sidebar (controls).
  - [ ] Responsive at least to typical desktop widths.
  - [ ] Use Tailwind for spacing, borders, and background colors.

### 3.2 Build upload panel
- [ ] Create `src/components/uploadPanel.tsx`.
  - [ ] Hidden file input.
  - [ ] Visible upload button / drag target area.
  - [ ] Accept image file types.
  - [ ] Call `loadImage` and store result in zustand.
  - [ ] Show current filename when an image is loaded.

### 3.3 Build effect selector
- [ ] (Can live inside `effectControls.tsx` or standalone.)
- [ ] Render list of effect buttons or select dropdown.
- [ ] Highlight active effect.
- [ ] On change, update store `effectType` and reset settings to defaults.

### 3.4 Build effect controls
- [ ] Create `src/components/effectControls.tsx`.
  - [ ] Render controls based on current `effectType`.
  - [ ] Pixelate controls: block size slider, grid overlay toggle.
  - [ ] ASCII controls: font size slider, char set input, color mode toggle.
  - [ ] Ordered Dither controls: levels slider, palette selection.
  - [ ] Halftone controls: cell size slider, color mode toggle.
  - [ ] Duotone controls: shadow color picker/input, highlight color picker/input.
  - [ ] Symbol Glow controls: font size slider, symbol set input, glow radius slider.
  - [ ] Each control calls `updateSettings`.

### 3.5 Build canvas preview
- [ ] Create `src/components/canvasPreview.tsx`.
  - [ ] Accept `sourceImage`, `effectType`, `settings`.
  - [ ] Use `useRef` for canvas.
  - [ ] Use `useEffect` to re-render when dependencies change.
  - [ ] Draw source image to offscreen canvas.
  - [ ] Apply selected effect processor.
  - [ ] Draw result to visible canvas.
  - [ ] Handle high-DPI rendering cleanly (canvas width vs. style width).
  - [ ] Show placeholder when no image is uploaded.

### 3.6 Build preset grid
- [ ] Create `src/components/presetGrid.tsx`.
  - [ ] Import `PRESETS`.
  - [ ] Render preset cards with names.
  - [ ] Highlight selected preset.
  - [ ] On click, call `applyPreset` and update `selectedPresetId`.

### 3.7 Build export button
- [ ] Create `src/components/exportButton.tsx`.
  - [ ] Accept visible canvas ref or export callback.
  - [ ] Trigger PNG export on click.
  - [ ] Use `canvas.toDataURL("image/png")`.
  - [ ] Create temporary `<a>` download link.
  - [ ] Default filename: `effectsoup-export.png`.
  - [ ] Disable if no image is loaded.

---

## Phase 4: Page Assembly

### 4.1 Update main page
- [ ] Rewrite `src/app/page.tsx`.
  - [ ] Import `AppShell`, `UploadPanel`, `EffectControls`, `CanvasPreview`, `PresetGrid`, `ExportButton`.
  - [ ] Read state from `useEditorStore`.
  - [ ] Compose components into the app shell layout.
  - [ ] Pass canvas ref to `ExportButton`.

### 4.2 Update root layout
- [ ] Ensure `src/app/layout.tsx` applies dark class and base metadata.
  - [ ] Add `<html className="dark">` or use `dark` class on body.
  - [ ] Set title and description.

---

## Phase 5: Polish & Verification

### 5.1 Styling pass
- [ ] Verify dark creative-tool aesthetic.
- [ ] Ensure canvas preview is the visual focus.
- [ ] Add hover / active states to interactive elements.
- [ ] Check spacing and typography.
- [ ] Ensure controls are compact and usable.

### 5.2 Performance checks
- [ ] Debounce or throttle slider updates if needed.
- [ ] Offscreen canvas is reused where possible.
- [ ] No memory leaks from object URLs.
- [ ] Effects re-render efficiently.

### 5.3 Acceptance testing
- [ ] App runs locally (`npm run dev`).
- [ ] User can upload an image.
- [ ] User can select Pixelate, ASCII, and Ordered Dither.
- [ ] Sliders update the preview live.
- [ ] Presets apply correctly.
- [ ] Export downloads a PNG.
- [ ] No backend calls are made.
- [ ] No AI APIs are used.

### 5.4 Code review
- [ ] All filenames use camelCase.
- [ ] All variables, functions, and components use camelCase.
- [ ] Effect modules are independent and can be extracted later.
- [ ] No unnecessary dependencies.
- [ ] TypeScript compiles without errors.

---

## Phase 6: Documentation

### 6.1 Update README
- [ ] Update `README.md` with a short project description.
- [ ] Add run instructions.
- [ ] List MVP effects.
- [ ] Mention tech stack.
