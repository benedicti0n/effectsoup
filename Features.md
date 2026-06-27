# EffectSoup — Product Features

## Product Promise

EffectSoup is a browser-based, non-AI image transformation studio. Upload a photo, choose a retro-digital aesthetic, adjust one smart Intensity slider, and export a shareable result in under a minute. Your image stays on your device while editing. The product is styled with the Cohere design system and centered around a `/playground` workspace plus a marketing homepage with an interactive mini-playground.

## Guest-first Behavior

Users are never forced to sign in before trying the product.

**Guests can:**
- Upload JPEG, PNG, and WebP images
- Crop and reposition images
- Preview and use every effect
- Export effects locally at up to 1080px
- Use the main Intensity slider
- Compare before/after

**Sign-in is required only when users attempt to:**
- Access full advanced controls (some presets expose these inline)

No watermark on exports.

## Launch Effect Catalog

Effects are built from reusable, deterministic image-processing primitives. Each preset exposes a single Intensity slider that drives a bundle of parameters.

### Categories

Presets are grouped into seven visual families:

- **Print & Dither** — pixel, halftone, dither, and grid-driven looks
- **ASCII & Symbols** — text-based rendering with luminance-to-glyph mapping
- **Atmosphere & Retro** — color grading, bloom, grain, CRT/VHS nostalgia, and tint presets
- **Glass & Frost** — translucent refractive tiles and frosted surfaces
- **Print Lab** — analog print processes such as stippling, bitmap posterization, and pencil grain
- **Signal Lab** — signal-degradation and screen-print looks including CRT glitch, manga tones, and wave displacement
- **Glow & Light** — LED matrices and inverted glow looks

### Free Presets

| ID | Name | Category | Core Primitives |
|----|------|----------|-----------------|
| `pixelGrid` | Pixel Grid | Print & Dither | cell averaging, subtle grid overlay |
| `errorDiffusionDither` | Error Diffusion | Print & Dither | grayscale, contrast, Floyd-Steinberg dither |
| `orderedDither` | Ordered Dither | Print & Dither | grayscale, contrast, Bayer dither, inversion |
| `classicAscii` | Classic ASCII | ASCII & Symbols | 5x7 bitmap font, standard luminance ramp |
| `blocksAscii` | Blocks ASCII | ASCII & Symbols | 5x7 bitmap font, block-shade glyphs |
| `minimalAscii` | Minimal ASCII | ASCII & Symbols | 5x7 bitmap font, sparse high-contrast glyphs |
| `dotHalftone` | Dot Halftone | Print & Dither | colored dots, palette presets, saturation boost |
| `duotone` | Duotone | Atmosphere & Retro | luminance mapping, two-color interpolation |
| `dreamGlow` | Dream Glow | Atmosphere & Retro | blur, soft glow, palette presets, grain |
| `noirGrain` | Noir Grain | Atmosphere & Retro | monochrome, contrast, grain, vignette |
| `ledMatrix` | LED Matrix | Glow & Light | cell averaging, shaped LEDs, optional glow |
| `stipplePrint` | Stipple Print | Print Lab | density-based dot placement, ink/paper colors |
| `crtGlitch` | CRT Glitch | Signal Lab | sliced horizontal shifts, RGB separation, scanlines, noise |
| `pencilGrain` | Pencil Grain | Print Lab | Sobel edges, paper color, graphite darkening, film grain |

All presets are free.

## Editor Capabilities

- Drag-and-drop or click-to-upload image input
- Replace Image and Remove Image actions in the editor header
- Non-destructive crop with aspect ratios: Original, 1:1, 4:5, 9:16, 16:9
- Pan and zoom inside crop frame
- Preset grid with category grouping and search
- Primary Intensity slider (0–100) per preset
- Double-click any slider value to type a precise number
- Before/after compare
- Undo/redo of configuration changes
- Reset effect / reset all edits
- Advanced accordion with per-preset controls
- Export dialog with format, quality, and resolution options
- Responsive desktop and mobile layouts

## Export Behavior

- All exports happen locally in the browser.
- PNG/JPEG/WebP export formats.
- Longest side presets: 1080px, original, or up to 4K.
- Meaningful filename based on original image and preset.
- JPEG background fallback when alpha is present.

## Auth Behavior

- Better Auth with Google OAuth and email/password.
- Guest-first: no login modal before value.
- Account page with sign-out.

## Non-Goals

These are intentionally not in the MVP:

- AI image generation or transformation
- AI background removal / subject replacement / outpainting
- Video or GIF processing
- Batch processing
- Public gallery or creator profiles
- Team workspaces
- Browser extension, desktop app, Figma/Photoshop plugins
- Public REST API
- Credit-based image generation
- Complex Photoshop-like layer stack
