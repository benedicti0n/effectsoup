# effectLab — Product Features

## Product Promise

effectLab is a browser-based, non-AI image transformation studio. Upload a photo, choose a retro-digital aesthetic, adjust one smart Intensity slider, and export a shareable result in under a minute. Your image stays on your device while editing.

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

### Free Presets

| ID | Name | Category | Core Primitives |
|----|------|----------|-----------------|
| `pixelGrid` | Pixel Grid | pixel | pixelation, palette reduction, grid overlay |
| `monoDither` | Mono Dither | dither | grayscale, contrast, Bayer dither, inversion |
| `classicAscii` | Classic ASCII | ascii | downsample, luminance-to-glyph mapping |
| `dotHalftone` | Dot Halftone | print | luminance sampling, dot radius by brightness |
| `duotone` | Duotone | dreamy | luminance mapping, two-color interpolation |
| `dreamGlow` | Dream Glow | dreamy | blur, bloom, warm tint, grain |
| `noirGrain` | Noir Grain | retro | monochrome, contrast, grain, vignette |
| `posterPop` | Poster Pop | pixel | posterization, palette reduction, edge emphasis |

### Premium Presets

| ID | Name | Category | Core Primitives |
|----|------|----------|-----------------|
| `pinkDotMatrix` | Pink Dot Matrix | dither | custom palette, ordered dither, glow, grain |
| `blueNoirDither` | Blue Noir Dither | dither | blue palette, contrast, dither, bloom |
| `cyberAscii` | Cyber ASCII | ascii | colored glyph rendering, bloom, grain |
| `cloudPrint` | Cloud Print | print | soft blur, palette reduction, halftone, grain |
| `crtDream` | CRT Dream | retro | pixel grid, scanlines, bloom, RGB shift, vignette |
| `vhsBloom` | VHS Bloom | retro | chromatic aberration, haze, noise, bloom |
| `risoOffset` | Riso Offset | print | duotone, channel offset, grain, registration shift |
| `mangaGrid` | Manga Grid | pixel | posterization, edge emphasis, limited palette, grid |

Premium effects are previewable by free users; premium export and full advanced controls are gated.

## Free vs Premium Matrix

| Capability | Guest / Free | Premium |
|------------|--------------|---------|
| Upload & crop | Yes | Yes |
| Free presets | 8 | 8 |
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
- Non-destructive crop with aspect ratios: Original, 1:1, 4:5, 9:16, 16:9
- Pan and zoom inside crop frame
- Preset grid with free/premium labels
- Primary Intensity slider (0–100) per preset
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
