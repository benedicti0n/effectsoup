# FAQ

## Is EffectSoup AI-based?

No. Every effect is a deterministic mathematical pipeline. No machine learning, no neural networks, no AI generation. The same image with the same settings always produces the same pixel output.

## Is rendering local/client-side?

Yes. All rendering happens in your browser using a Web Worker. Your image is never sent to a server.

## Are images uploaded to a server?

No. Image processing is entirely client-side. The only network requests are for loading the application itself. The exported image is created via the Canvas `toBlob` API on your device.

## Which image formats are supported?

- **Input:** JPEG, PNG, WebP
- **Output:** PNG (lossless), JPEG (lossy), WebP (lossy)
- **Limits:** Maximum input file size is 20 MB with a 25-megapixel decoded dimension cap.

## Can I use the npm packages commercially?

Yes. The packages are published under the MIT license. You can use them in commercial projects, modify them, and distribute them.

## How do I create an effect?

Effects are `EffectPreset` objects. See the [Creating an Effect guide](../guides/creating-an-effect.md) for a walkthrough. Presets are defined in `packages/effectsPresets/src/presets/` and registered in the `allPresets` array.

## Why does the same effect look different across images?

Effect parameters are responsive to the image content. Dither thresholds, halftone dot sizes, ASCII luminance mapping, and glow bloom all depend on the source image's lighting, contrast, and colors. An image with flat lighting produces less bloom than one with strong highlights.

## Which effects work best for portraits?

Dream Glow, Noir Grain, Duotone, and the dither presets. ASCII effects produce recognizable results with strong facial lighting.

## Which effects work best for landscapes?

Pixel Grid, Dot Halftone, Stipple Print, Cubic Glass, Wave Slice. CRT Glitch and VHS Bloom can add retro atmosphere to outdoor scenes.

## Which effects work best for graphics and text?

ASCII effects, LED Matrix, Bitmap, and Manga Scanlines. Pixel Grid gives a deliberate retro-game look.

## Do I need an account?

The editor and mini-playground work without an account. An account is optional and currently required to export images.

## Is EffectSoup free?

Yes. Every effect is free. There are no subscriptions, watermarks, or hidden limits in the editor.

## See Also

- [Troubleshooting](troubleshooting.md) — common issues and solutions
- [Quickstart](../getting-started/quickstart.md) — getting started in 5 minutes
