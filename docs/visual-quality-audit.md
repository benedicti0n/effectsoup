# Visual Quality Audit — EffectLab Image Effects

## Rendering Pipeline

1. **Decode**: Source image is loaded into an `HTMLImageElement` and drawn to an offscreen canvas.
2. **Crop / Resize**: `applyCropAndResize` extracts the cropped region and scales to the target output size.
3. **PixelBuffer**: The canvas pixels are read into a `PixelBuffer` (`ImageData`) for CPU-side processing.
4. **Effect Passes**: Each preset builds a pipeline of pure functions from `packages/effectsCore` (color transforms, ASCII, halftone, grid, glow, etc.).
5. **Intensity Blend**: Most presets apply an intensity-blend between the source `PixelBuffer` and the processed result.
6. **Encode**: The final `PixelBuffer` is written back to a canvas and exported as PNG/JPEG/WebP.

## Root Cause Findings

### Pixel Grid
- **Problem**: Colors are burned and posterized because the pipeline applies `reducePalette` with a low color count and then multiplies a strong grid overlay on top of already reduced colors.
- **Impact**: Faces lose skin-tone nuance; shadows clip to pure black; highlights clip to pure white.
- **Fix**: Preserve source colors by downsampling to large cells and averaging the source pixels inside each cell. Apply the grid as a subtle opacity overlay rather than a multiply.

### Classic ASCII
- **Problem**: The bitmap font is only 3x5 pixels per glyph and the default character ramp contains only a few symbols, so fine details (eyes, hair, texture) collapse into blobs.
- **Impact**: Low recognizability, especially on faces and small objects.
- **Fix**: Use a taller 5x7 bitmap font and a dense 10-level luminance ramp. Maintain the cell aspect ratio so glyphs are not stretched.

### Dot Halftone
- **Problem**: The primitive currently samples a single pixel per cell and renders black dots on white, producing a harsh monochrome newspaper look.
- **Impact**: Source color is lost; photos look like 1-bit fax output.
- **Fix**: Sample the average cell color and render dots in the source hue with controllable saturation. Add palette presets and shuffle so it can look like CMYK, warm duotone, or monochrome newsprint.

### Dream Glow
- **Problem**: A hardcoded pink overlay is blended at high opacity, so every photo looks artificially tinted regardless of the subject.
- **Impact**: Skin tones look sunburned; white clothing turns pink.
- **Fix**: Replace the pink tint with a soft diffused glow using a blurred luminance layer. Provide palette presets (Golden Dusk default, Rose Bloom, Cool Haze) and a deterministic shuffle per image.

### Cyber ASCII
- **Problem**: Same coarse 3x5 font as Classic ASCII and a limited green/cyan color palette.
- **Impact**: Technical "cyber" aesthetic is undermined by chunky glyphs and flat color.
- **Fix**: Use a denser technical glyph set, colored foreground based on local luminance, and a subtle scanline overlay.

### Manga Grid
- **Problem**: Edge detection is applied at high opacity on top of heavy posterization, making halftone-like dots and grid lines dominate the image and crush mid-tones.
- **Impact**: Photographs become high-contrast graphic posters with lost facial detail.
- **Fix**: Use controlled 4–6 level posterization, light ink-outline overlay, and a faint grid. Keep source color mostly intact.

### Intensity at 0%
- **Problem**: Some presets apply brightness/contrast or palette reductions before the final blend, so even at 0% intensity the output is not pixel-identical to the source.
- **Impact**: Users cannot reliably view the unmodified image with the compare toggle.
- **Fix**: Ensure every non-destructive transform is blended by intensity; the base pipeline should start from the source and only apply changes proportional to intensity.

## New Effect Plan

### Luminous ASCII Bloom
- Combine the improved ASCII renderer with a soft additive bloom.
- Glyphs are chosen by luminance; bright areas emit a colored glow matching the source hue.
- Uses the same 5x7 font and 10-level ramp as Classic ASCII for consistency.

## Preset Reorganization

Current categories are loosely grouped. Proposed categories:

1. **Print & Grid** — Pixel Grid, Dot Halftone, Manga Grid
2. **ASCII & Symbols** — Classic ASCII, Cyber ASCII, Luminous ASCII Bloom
3. **Atmosphere & Glow** — Dream Glow

## Removed Effects

- `posterPop` — posterization alone is not visually distinctive enough.
- `pinkDotMatrix` — color noise effect duplicates Dot Halftone after upgrade.
- `blueNoirDither` — monochrome blue dither is too niche and hard to tune.
- `cloudPrint` — dreamy blur competes with Dream Glow without adding clarity.

## Follow-up Quality Pass Findings

### Effect Defaults
- Default intensity values were re-tuned so presets open at a usable starting point instead of a washed-out or over-cooked state:
  - Pixel Grid: 5%
  - Dot Halftone: 21% with source-colored dots, CMYK palette, dot spacing 6
  - Manga Grid: 5% with 4 poster levels, 25 edge emphasis, 20 grid opacity

### Classic ASCII
- Default color mode changed to `originalColors` so faces and textures keep their identity.
- Added dense ordered character ramp (`$@B%8&WM#*oahkbdpqwmZ0OQLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,"^\`'. `).
- Added Character Set presets (dense, standard, technical, blocks, minimal, custom) and a Custom Character Array input.
- Added Color Mode selector: original colors, monochrome, or tint.

### Cyber ASCII
- Default color mode changed to `originalColors`.
- Added Color Mode selector and Tint Presets (terminal green, electric cyan, amber CRT, violet code).

### Symbol Glow
- New premium preset in ASCII & Symbols.
- Builds a blurred base layer, renders transparent glyphs on top, then composites a soft colored glow using per-pixel alpha blending.
- Supports multiple symbol sets and color palettes plus a custom-symbol mode.

### Editable Slider
- Every numeric slider (intensity, advanced controls, crop controls) supports double-click-to-edit.
- Values clamp to the valid range, snap to step, and accept `%` suffix.

## Action Items

1. Refactor `packages/effectsCore/src/ascii.ts` with 5x7 font and dense ramp.
2. Refactor `packages/effectsCore/src/halftone.ts` to support colored dots.
3. Refactor `packages/effectsCore/src/color.ts` utilities for safer brightness/contrast that preserves 0% intensity identity.
4. Rewrite affected presets in `freePresets.ts` and `premiumPresets.ts`.
5. Add `luminousAsciiBloom` and `symbolGlow` presets.
6. Remove weak presets from registry and update `Features.md`.
7. Add Replace Image / Remove Image actions in the editor header.
8. Add EditableSlider with double-click numeric editing to all sliders.
9. Update tests and run full verification.
