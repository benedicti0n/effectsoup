import { EffectProcessor } from "./types";
import {
  computeAverageBrightness,
  computeAverageColor,
  hexToRgb,
} from "@/lib/image/imageDataUtils";

export const ascii: EffectProcessor<"ascii"> = (
  { ctx, sourceImageData, width, height },
  settings
) => {
  const { fontSize, charSet, colorMode, foregroundColor } = settings;

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, width, height);

  const chars = charSet.length > 0 ? charSet : " .:-=+*#%@";
  const cols = Math.max(1, Math.floor(width / fontSize));
  const rows = Math.max(1, Math.floor(height / fontSize));
  const cellWidth = width / cols;
  const cellHeight = height / rows;

  ctx.font = `${fontSize}px monospace`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";

  const fgColor = hexToRgb(foregroundColor);

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

      const charIndex = Math.floor(
        ((255 - brightness) / 255) * (chars.length - 1)
      );
      const char = chars[Math.max(0, Math.min(chars.length - 1, charIndex))];

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
        ctx.fillStyle = `rgb(${fgColor.r}, ${fgColor.g}, ${fgColor.b})`;
      }

      ctx.fillText(char, centerX, centerY);
    }
  }
};
