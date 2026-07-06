# Upload & Crop Guide

How to load images into the editor, replace them, and control the viewport crop.

## Prerequisites

- The playground is open and ready
- A JPEG, PNG, or WebP image (up to 20 MB, 25 megapixels max)

## Upload an image

When you first open the playground, you see an upload panel. Drag and drop an image file onto the drop zone, or click "Choose Image" to select one from your file system.

Once loaded, the image appears in the center preview. The effect library on the left and controls on the right become active.

> For best results, upload images at or near your target export resolution. Upscaling a small image to 4K will produce pixelation.

## Replace an image

After an image is loaded, the toolbar shows a **Replace** button. Click it to load a different image while keeping the current crop and effect settings. This is useful for testing the same effect on multiple photos.

## Remove an image

The **Remove** button (X icon) clears the current image and returns you to the upload panel, resetting all editor state (crop, effect, output options).

## Crop controls

Below the preview, the crop bar provides these controls:

### Aspect ratio

| Option | Behavior |
|---|---|
| Original | Source-native aspect ratio |
| Free | Unconstrained; zoom determines crop-window size directly |
| 1:1 | Square crop |
| 4:5 | Portrait crop |
| 9:16 | Vertical / mobile crop |
| 16:9 | Widescreen crop |

The viewport transform uses `applyViewportTransform` from `@effectsoup/core` with bilinear sampling for smooth results at any zoom level. The crop window is always clamped to stay within source bounds.

### Zoom

Magnifies into the image. Higher values show a tighter crop window. At Free aspect ratio, both width and height are divided by zoom equally with no aspect-ratio constraint — useful for custom non-standard sizes.

### Offset X / Offset Y

Pan the crop window. Values range from -100% to 100% of the centered position. Clamped so the window never extends beyond the source bounds.

## API reference

The viewport transform functions are exported from `@effectsoup/core`:

- `applyViewportTransform(source, viewport, outputWidth, outputHeight): PixelBuffer` — applies crop/zoom/offset with bilinear interpolation
- `parseAspectRatio(ratio): number | null` — parses a `CropConfig` aspect ratio to a numeric W/H value; returns `null` for "original"
- `getCroppedOutputSize(sourceWidth, sourceHeight, aspectRatio, longestEdge, zoom?): { width, height }` — computes output dimensions

See the [Core API Reference](../reference/api/core.md) for full signatures.

## See Also

- [Effect Controls Guide](effect-controls.md) — adjusting intensity and advanced parameters
- [Exporting Guide](exporting.md) — format, quality, and resolution options
- [Quickstart](../getting-started/quickstart.md) — end-to-end walkthrough
