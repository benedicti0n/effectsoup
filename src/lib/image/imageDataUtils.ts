export function getPixelIndex(x: number, y: number, width: number): number {
  return (y * width + x) * 4;
}

export function setPixel(
  data: Uint8ClampedArray,
  index: number,
  r: number,
  g: number,
  b: number,
  a: number
): void {
  data[index] = r;
  data[index + 1] = g;
  data[index + 2] = b;
  data[index + 3] = a;
}

export function computeAverageColor(
  imageData: ImageData,
  startX: number,
  startY: number,
  blockWidth: number,
  blockHeight: number
): { r: number; g: number; b: number; a: number } {
  let r = 0;
  let g = 0;
  let b = 0;
  let a = 0;
  let count = 0;

  const maxX = Math.min(startX + blockWidth, imageData.width);
  const maxY = Math.min(startY + blockHeight, imageData.height);

  for (let y = startY; y < maxY; y++) {
    for (let x = startX; x < maxX; x++) {
      const index = getPixelIndex(x, y, imageData.width);
      r += imageData.data[index];
      g += imageData.data[index + 1];
      b += imageData.data[index + 2];
      a += imageData.data[index + 3];
      count++;
    }
  }

  if (count === 0) {
    return { r: 0, g: 0, b: 0, a: 255 };
  }

  return {
    r: Math.round(r / count),
    g: Math.round(g / count),
    b: Math.round(b / count),
    a: Math.round(a / count),
  };
}

export function computeAverageBrightness(
  imageData: ImageData,
  startX: number,
  startY: number,
  blockWidth: number,
  blockHeight: number
): number {
  let sum = 0;
  let count = 0;

  const maxX = Math.min(startX + blockWidth, imageData.width);
  const maxY = Math.min(startY + blockHeight, imageData.height);

  for (let y = startY; y < maxY; y++) {
    for (let x = startX; x < maxX; x++) {
      const index = getPixelIndex(x, y, imageData.width);
      const r = imageData.data[index];
      const g = imageData.data[index + 1];
      const b = imageData.data[index + 2];
      sum += rgbToLuminance(r, g, b);
      count++;
    }
  }

  if (count === 0) {
    return 0;
  }

  return sum / count;
}

export function rgbToLuminance(r: number, g: number, b: number): number {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const normalized = hex.replace("#", "");

  if (normalized.length === 3) {
    const r = parseInt(normalized[0] + normalized[0], 16);
    const g = parseInt(normalized[1] + normalized[1], 16);
    const b = parseInt(normalized[2] + normalized[2], 16);
    return { r, g, b };
  }

  const r = parseInt(normalized.substring(0, 2), 16);
  const g = parseInt(normalized.substring(2, 4), 16);
  const b = parseInt(normalized.substring(4, 6), 16);
  return { r, g, b };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (value: number) => value.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
