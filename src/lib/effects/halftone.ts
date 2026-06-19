import { EffectProcessor } from "./types";
import {
  computeAverageBrightness,
  computeAverageColor,
} from "@/lib/image/imageDataUtils";

export const halftone: EffectProcessor<"halftone"> = (
  { ctx, sourceImageData, width, height },
  settings
) => {
  const { cellSize, colorMode } = settings;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  const cols = Math.ceil(width / cellSize);
  const rows = Math.ceil(height / cellSize);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * cellSize;
      const y = row * cellSize;

      const brightness = computeAverageBrightness(
        sourceImageData,
        x,
        y,
        cellSize,
        cellSize
      );
      const darkness = 1 - brightness / 255;
      const radius = (cellSize / 2) * darkness;

      const centerX = x + cellSize / 2;
      const centerY = y + cellSize / 2;

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);

      if (colorMode === "colored") {
        const color = computeAverageColor(
          sourceImageData,
          x,
          y,
          cellSize,
          cellSize
        );
        ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
      } else {
        ctx.fillStyle = "#000000";
      }

      ctx.fill();
    }
  }
};
