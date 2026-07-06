# Effects Catalog

EffectSoup ships with 24+ presets across 7 categories. Each preset is a complete `EffectPreset` with configurable controls.

## Pixel & Dither

Ordered dither, error diffusion, and color dither patterns. Best for high-contrast images and retro aesthetics.

| Preset | Description | Intensity |
|---|---|---|
| `pixelGrid` | Deliberate pixel-grid abstraction | 50% |
| `errorDiffusionDither` | Floyd-Steinberg error diffusion | 50% |
| `orderedDither` | 8×8 Bayer ordered dither | 50% |
| `dotHalftone` | Colored dot halftone with configurable shape and palette | 75% |
| `bitmap` ⭐ | Heavy pixelation with palette reduction and optional ordered dither | Always on |

**Best for:** High-contrast images, retro aesthetics, print simulation

## ASCII & Symbols

Render images as character art using configurable character sets. Best for text-based art from photos.

| Preset | Description | Intensity |
|---|---|---|
| `classicAscii` | Standard ASCII art rendering | 75% |
| `blocksAscii` | Block-character ASCII art | 75% |
| `denseAscii` | Dense character ASCII rendering | 75% |
| `cyberAscii` ⭐ | Cyber-style ASCII with glow | 75% |
| `luminousAsciiBloom` ⭐ | Glowing ASCII with bloom effect | 75% |
| `symbolGlow` ⭐ | Glowing symbol overlay | 75% |

**Best for:** Portraits with strong lighting, graphics, text art

## Print & Ink

Halftone dot patterns, stipple simulation, and ink-style rendering. Best for print aesthetics and illustrated looks.

| Preset | Description | Intensity |
|---|---|---|
| `stipplePrint` | Hand-drawn stipple illustration using dot density | Always on |
| `pencilGrain` | Graphite pencil sketch effect | 50% |
| `mangaScanlines` ⭐ | Manga/comic-style screen tone pattern overlay | 75% |
| `risoOffset` ⭐ | Risograph-style offset color print | 75% |

**Best for:** Print aesthetics, illustrated looks, editorial design

## Distortion & Glass

Faceted glass distortion and wave distortion effects. Best for abstract and experimental looks.

| Preset | Description | Intensity |
|---|---|---|
| `cubicGlass` ⭐ | Faceted glass distortion with refraction | 75% |
| `waveSlice` ⭐ | Sinusoidal wave distortion | 75% |

**Best for:** Abstract and experimental images, texture

## Color & Tone

Duotone, grain, posterize, LED matrix, and bitmap effects. Best for creative color grading.

| Preset | Description | Intensity |
|---|---|---|
| `duotone` | Two-color luminance gradient mapping | 75% |
| `noirGrain` | Black-and-white with film grain | 75% |
| `ledMatrix` | LED dot matrix simulation | Always on |
| `invertedGlow` ⭐ | Inverted-style glow effect | 75% |

**Best for:** Creative color grading, graphic effects

## Atmosphere & Glow

Glow, bloom, and atmospheric effects. Best for adding mood and texture.

| Preset | Description | Intensity |
|---|---|---|
| `dreamGlow` | Soft dreamy glow with palette presets | 50% |

**Best for:** Portraits, adding mood and atmosphere

## Retro Signal

CRT and VHS-era effects with scanlines, noise, and glitch displacement.

| Preset | Description | Intensity |
|---|---|---|
| `crtGlitch` | CRT display glitch with RGB separation and noise | 50% |
| `crtDream` ⭐ | CRT with dreamy bloom | 50% |
| `vhsBloom` ⭐ | VHS tape bloom with glitch | 50% |

**Best for:** Retro-futuristic and VHS-era aesthetics

> ⭐ = Premium preset

## See Also

- [Quickstart](../getting-started/quickstart.md) — try effects in the playground
- [Presets API Reference](api/presets.md) — programmatic access to all presets
- [Creating an Effect guide](../guides/creating-an-effect.md) — adding new presets to `allPresets`
