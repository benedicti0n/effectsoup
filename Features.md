# EffectSoup — Product Features

## Product Promise

EffectSoup is a browser-based, non-AI image transformation studio. Upload a photo, choose a retro-digital aesthetic, adjust one smart Intensity slider, and export a shareable result in under a minute. Your image stays on your device while editing. The product is styled with the Cohere design system and centered around a `/playground` workspace plus a marketing homepage with an interactive mini-playground.

## Guest-first Behavior

Users are never forced to sign in before trying the product.

**Guests can:**
- Upload JPEG, PNG, and WebP images
- Crop and reposition images
- Preview all free and premium effects
- Use all free effects
- Export free effects locally at up to 1080px
- Use the main Intensity slider
- Compare before/after

**Sign-in is required only when users attempt to:**
- Save a cloud project
- Export a premium effect
- Export at original resolution or 4K
- Access full advanced controls
- Subscribe to Premium

No watermark on free exports.

## Launch Effect Catalog

Effects are built from reusable, deterministic image-processing primitives. Each preset exposes a single Intensity slider that drives a bundle of parameters.

### Categories

Presets are grouped into seven visual families:

- **Print & Dither** — pixel, halftone, dither, and grid-driven looks
- **ASCII & Symbols** — text-based rendering with luminance-to-glyph mapping
- **Atmosphere & Retro** — color grading, bloom, grain, CRT/VHS nostalgia, and tint presets
- **Glass & Frost** — translucent refractive tiles and frosted surfaces
- **Print Lab** — analog print processes such as LED matrices, stippling, and bitmap posterization
- **Signal Lab** — signal-degradation and screen-print looks including CRT glitch, electric neon edges, and manga tones
- **Light Lab** — directional glow, smear, and light-trail effects

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
| `ledMatrix` | LED Matrix | Print Lab | cell averaging, shaped LEDs, optional glow |
| `stipplePrint` | Stipple Print | Print Lab | density-based dot placement, ink/paper colors |
| `crtGlitch` | CRT Glitch | Signal Lab | sliced horizontal shifts, RGB separation, scanlines, noise |
| `neonSmear` | Neon Smear | Light Lab | directional motion smear, neon tint, screen blend |
| `pencilGrain` | Pencil Grain | Print Lab | Sobel edges, paper color, graphite darkening, film grain |
| `flowlineGlow` | Flowline Glow | Light Lab | per-pixel flow field, directional smear, neon glow |

### Premium Presets

| ID | Name | Category | Core Primitives |
|----|------|----------|-----------------|
| `cyberAscii` | Cyber ASCII | ASCII & Symbols | technical glyph set, colored glyphs, scanline grid, glow |
| `luminousAsciiBloom` | Luminous ASCII Bloom | ASCII & Symbols | source-colored ASCII, thresholded bloom |
| `symbolGlow` | Symbol Glow | ASCII & Symbols | glowing symbols over a blurred source image |
| `crtDream` | CRT Dream | Atmosphere & Retro | pixel grid, scanlines, bloom, RGB shift, vignette, tint presets |
| `vhsBloom` | VHS Bloom | Atmosphere & Retro | chromatic aberration, haze, noise, bloom, tint presets |
| `risoOffset` | Riso Offset | Print & Dither | duotone, channel offset, grain, registration shift |
| `cubicGlass` | Cubic Glass | Glass & Frost | frosted cubic tiles, deterministic refraction, beveled edges |
| `bitmap` | Bitmap | Print Lab | heavy pixelation, palette reduction, optional ordered dither |
| `electricDream` | Electric Dream | Signal Lab | Sobel edges, neon tint, thresholded bloom, screen blend |
| `mangaScanlines` | Manga Scanlines | Signal Lab | rotated screen-tone lines, ink/paper colors, threshold |
| `waveSlice` | Wave Slice | Signal Lab | sine-wave displacement across horizontal or vertical slices |
| `contourHatch` | Contour Hatch | Print Lab | gradient-aligned hatch strokes following image contours |
| `neonPointCloud` | Neon Point Cloud | Light Lab | brightness-weighted points connected by neon lines |

Premium effects are previewable by free users; premium export and full advanced controls are gated.

## Free vs Premium Matrix

| Capability | Guest / Free | Premium |
|------------|--------------|---------|
| Upload & crop | Yes | Yes |
| Free presets | 16 | 16 |
| Premium presets | Preview only | 13 |
| Premium preview | Yes | Yes |
| Premium export | No | Yes |
| Export up to 1080px | Yes | Yes |
| Export original / 4K | No | Yes |
| Advanced controls teaser | Yes | Yes |
| Full advanced controls | No | Yes |
| Cloud projects | No | Yes |
| Saved custom presets | No | Yes |
| Watermark | None | None |

## Editor Capabilities

- Drag-and-drop or click-to-upload image input
- Replace Image and Remove Image actions in the editor header
- Non-destructive crop with aspect ratios: Original, 1:1, 4:5, 9:16, 16:9
- Pan and zoom inside crop frame
- Preset grid with free/premium labels
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
- Free: PNG/JPEG/WebP, longest side up to 1080px, free presets only.
- Premium: PNG/JPEG/WebP, original resolution or up to 4K, all presets, full advanced controls.
- Meaningful filename based on original image and preset.
- JPEG background fallback when alpha is present.

## Auth Behavior

- Better Auth with Google OAuth and email/password.
- Guest-first: no login modal before value.
- Account page with sign-out.
- Premium gating derived from subscription state.

## Billing Behavior

- Dodo Payments subscription at $3/month.
- Checkout created server-side; webhook verified.
- Premium granted only after verified webhook.
- Customer portal for subscription management.
- Local development uses isolated test mode; production requires real webhooks.

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
