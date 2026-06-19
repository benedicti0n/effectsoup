import { EffectProcessor } from "./types";
import {
  computeAverageColor,
  getPixelIndex,
  setPixel,
} from "@/lib/image/imageDataUtils";

export const pixelate: EffectProcessor<"pixelate"> = (
  { ctx, sourceImageData, width, height },
  settings
) => {
  const { blockSize, showGrid } = settings;

  const offscreenCanvas = document.createElement("canvas");
  offscreenCanvas.width = width;
  offscreenCanvas.height = height;
  const offscreenCtx = offscreenCanvas.getContext("2d", {
    willReadFrequently: true,
  });
  if (!offscreenCtx) return;

  const outputData = offscreenCtx.createImageData(width, height);

  for (let y = 0; y < height; y += blockSize) {
    for (let x = 0; x < width; x += blockSize) {
      const color = computeAverageColor(
        sourceImageData,
        x,
        y,
        blockSize,
        blockSize
      );

      const maxX = Math.min(x + blockSize, width);
      const maxY = Math.min(y + blockSize, height);

      for (let by = y; by < maxY; by++) {
        for (let bx = x; bx < maxX; bx++) {
          const index = getPixelIndex(bx, by, width);
          setPixel(outputData.data, index, color.r, color.g, color.b, 255);
        }
      }
    }
  }

  offscreenCtx.putImageData(outputData, 0, 0);

  ctx.drawImage(offscreenCanvas, 0, 0, width, height);

  if (showGrid) {
    ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
    ctx.lineWidth = 1;
    ctx.beginPath();

    for (let x = 0; x <= width; x += blockSize) {
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, height);
    }

    for (let y = 0; y <= height; y += blockSize) {
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(width, y + 0.5);
    }

    ctx.stroke();
  }
};
