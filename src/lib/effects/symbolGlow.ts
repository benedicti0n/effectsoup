import { EffectProcessor } from "./types";
import {
  computeAverageBrightness,
  computeAverageColor,
  hexToRgb,
} from "@/lib/image/imageDataUtils";

export const symbolGlow: EffectProcessor<"symbolGlow"> = (
  { ctx, sourceImageData, sourceImage, width, height },
  settings
) => {
  const { fontSize, symbolSet, glowRadius, colorMode } = settings;

  ctx.filter = `blur(${glowRadius}px)`;
  ctx.drawImage(sourceImage, 0, 0, width, height);
  ctx.filter = "none";

  const symbols = symbolSet.length > 0 ? symbolSet : "2*+/=e";
  const cols = Math.max(1, Math.floor(width / fontSize));
  const rows = Math.max(1, Math.floor(height / fontSize));
  const cellWidth = width / cols;
  const cellHeight = height / rows;

  ctx.font = `${fontSize}px monospace`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";

  const glowColor = hexToRgb("#ffffff");
  ctx.shadowColor = `rgb(${glowColor.r}, ${glowColor.g}, ${glowColor.b})`;
  ctx.shadowBlur = glowRadius;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = Math.floor(col * cellWidth);
      const y = Math.floor(row * cellHeight);

      const brightness = computeAverageBrightness(
        sourceImageData,
        x,
        y,
        Math.ceil(cellWidth),
        Math.ceil(cellHeight)
      );

      const symbolIndex = Math.floor(
        ((255 - brightness) / 255) * (symbols.length - 1)
      );
      const symbol = symbols[
        Math.max(0, Math.min(symbols.length - 1, symbolIndex))
      ];

      const centerX = col * cellWidth + cellWidth / 2;
      const centerY = row * cellHeight + cellHeight / 2;

      if (colorMode === "colored") {
        const color = computeAverageColor(
          sourceImageData,
          x,
          y,
          Math.ceil(cellWidth),
          Math.ceil(cellHeight)
        );
        ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
      } else {
        ctx.fillStyle = "#ffffff";
      }

      ctx.fillText(symbol, centerX, centerY);
    }
  }

  ctx.shadowBlur = 0;
};
