# Exporting Guide

How to export your processed image in different formats, qualities, and resolutions.

## Prerequisites

- An image is loaded in the playground
- A preset is applied with desired settings
- You are signed in (required for export)

## Open the export dialog

Click the **Export** button in the editor toolbar. The dialog shows three configuration options.

## Format

| Format | Type | Best for |
|---|---|---|
| PNG | Lossless | Graphics, text art, images with transparency. Largest file size. |
| JPEG | Lossy (adjustable quality) | Photos where file size matters more than pixel-perfect fidelity. |
| WebP | Lossy (adjustable quality) | Modern web use. Smaller files than JPEG at equivalent quality. |

## Quality

Adjustable from 50–100%. Applies to JPEG and WebP only. PNG is always lossless regardless of this setting.

## Resolution

| Option | Longest edge | Use case |
|---|---|---|
| 1080 | 1080px | Social media, web sharing |
| Original | Source resolution (subject to crop) | Archival, full quality |
| 4K | 3840px | Large displays, print |

## How export works

1. The editor crops your source image using the current `CropConfig`.
2. The preset pipeline runs at full resolution (not preview resolution).
3. The result `PixelBuffer` is transferred from the Web Worker via zero-copy `ArrayBuffer` transfer.
4. The buffer is drawn onto an offscreen canvas.
5. `canvas.toBlob(callback, mimeType, quality)` produces the output blob.
6. The resulting blob is downloaded as a file.

The export pipeline is handled entirely in the web app layer — no `@effectsoup/core` function is involved.

## See Also

- [Effect Controls Guide](effect-controls.md) — adjusting controls before exporting
- [Upload & Crop Guide](upload-and-crop.md) — setting the crop before export
- [Performance Guide](performance.md) — understanding preview vs. export resolution
