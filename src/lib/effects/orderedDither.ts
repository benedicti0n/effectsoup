import { EffectProcessor } from "./types";
import {
  getPixelIndex,
  rgbToLuminance,
  setPixel,
} from "@/lib/image/imageDataUtils";

const BAYER_4X4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

export const orderedDither: EffectProcessor<"orderedDither"> = (
  { ctx, sourceImageData, width, height },
  settings
) => {
  const { levels, colorMode } = settings;

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

      const threshold =
        ((BAYER_4X4[y % 4][x % 4] + 0.5) / 16) * (255 / levels);
      const quantized = Math.floor((luminance + threshold) / (256 / levels));
      const value = Math.min(levels - 1, Math.max(0, quantized));
      const outputValue = Math.round((value / (levels - 1)) * 255);

      if (colorMode === "blackAndWhite") {
        setPixel(
          outputData.data,
          index,
          outputValue,
          outputValue,
          outputValue,
          255
        );
      } else {
        const factor = outputValue / 255;
        setPixel(
          outputData.data,
          index,
          Math.round(r * factor),
          Math.round(g * factor),
          Math.round(b * factor),
          255
        );
      }
    }
  }

  offscreenCtx.putImageData(outputData, 0, 0);
  ctx.drawImage(offscreenCanvas, 0, 0, width, height);
};
