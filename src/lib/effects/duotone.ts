import { EffectProcessor } from "./types";
import {
  getPixelIndex,
  hexToRgb,
  rgbToLuminance,
  setPixel,
} from "@/lib/image/imageDataUtils";

export const duotone: EffectProcessor<"duotone"> = (
  { ctx, sourceImageData, width, height },
  settings
) => {
  const { shadowColor, highlightColor } = settings;

  const shadow = hexToRgb(shadowColor);
  const highlight = hexToRgb(highlightColor);

  const offscreenCanvas = document.createElement("canvas");
  offscreenCanvas.width = width;
  offscreenCanvas.height = height;
  const offscreenCtx = offscreenCanvas.getContext("2d", {
    willReadFrequently: true,
  });
  if (!offscreenCtx) return;

  const outputData = offscreenCtx.createImageData(width, height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = getPixelIndex(x, y, width);
      const r = sourceImageData.data[index];
      const g = sourceImageData.data[index + 1];
      const b = sourceImageData.data[index + 2];
      const luminance = rgbToLuminance(r, g, b);
      const factor = luminance / 255;

      const outR = Math.round(shadow.r + (highlight.r - shadow.r) * factor);
      const outG = Math.round(shadow.g + (highlight.g - shadow.g) * factor);
      const outB = Math.round(shadow.b + (highlight.b - shadow.b) * factor);

      setPixel(outputData.data, index, outR, outG, outB, 255);
    }
  }

  offscreenCtx.putImageData(outputData, 0, 0);
  ctx.drawImage(offscreenCanvas, 0, 0, width, height);
};
