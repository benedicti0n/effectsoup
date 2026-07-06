# Troubleshooting

Common issues and their solutions when using EffectSoup.

## Effect appears weak or too strong

**Symptom:** The effect barely changes the image, or overwhelms it even at low intensity.

**Cause:** The default intensity may not suit your image. Some effects are tuned for specific image types.

**Solution:** Adjust the Intensity slider incrementally. If the effect is still too strong at 0%, check if the preset has `usesIntensity: false` — some effects are always-on (e.g., Stipple Print, LED Matrix). For those, use the advanced controls to reduce the effect strength.

## Preview differs from exported result

**Symptom:** The preview looks different from the downloaded image.

**Cause:** The preview runs at a reduced resolution for responsiveness. A lower-res preview can look sharper or softer than the full export.

**Solution:** This is expected behavior. Export at your desired resolution to see the final result.

## Image upload fails

**Symptom:** Error message when trying to upload an image.

**Cause:** The file is over 20 MB, exceeds 25 megapixels decoded size, or is not a JPEG/PNG/WebP.

**Solution:** Check the file format and size. Resize very large images before uploading. Only JPEG, PNG, and WebP are accepted.

## Slow performance on large images

**Symptom:** The editor feels sluggish when adjusting controls on high-resolution photos.

**Cause:** Very large images (e.g., 4000×6000px) require more processing time, especially for per-pixel effects.

**Solution:** Use smaller source images for faster previews. The preview already runs at reduced resolution. Export at full resolution when ready.

## Export fails

**Symptom:** Export button does nothing or shows an error.

**Cause:** You need to sign in to export. The Canvas `toBlob` API may fail on some browsers for very large images.

**Solution:** Sign in with your account. If export fails on a very large image, try a lower resolution setting or a different format.

## Worker not available

**Symptom:** Rendering fails or the app never loads.

**Cause:** The browser does not support Web Workers, or the worker script failed to load.

**Solution:** Use a modern browser (Chrome, Firefox, Safari, Edge). The worker script is required for rendering. Check the browser console for specific error messages.

## Package import errors

**Symptom:** TypeScript or build errors when importing from `@effectsoup/*` packages.

**Cause:** Missing dependencies, incorrect import paths, or the package is not built.

**Solution:** Ensure the packages are installed (`node_modules` exists). Run `pnpm build` from the monorepo root to build all packages. In the monorepo, run `pnpm install` from the root.

## Preset not found

**Symptom:** `getPresetById` returns `undefined`.

**Cause:** The preset ID is misspelled, uses a legacy ID that was not migrated, or the preset is not registered in `allPresets`.

**Solution:** Check `getPresetIds()` for all valid IDs. Legacy IDs from before migration are supported via `migratePresetId`. Known migrations: `"monoDither"` → `"errorDiffusionDither"`, `"mangaGrid"` → `"pixelGrid"`. If the preset was removed, use its replacement.

## See Also

- [FAQ](faq.md) — frequently asked questions
- [Quickstart](../getting-started/quickstart.md) — basic playground usage
- [Performance Guide](../guides/performance.md) — optimization tips
