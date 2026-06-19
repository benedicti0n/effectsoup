export function createCanvas(
  width: number,
  height: number
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

export function getContext2D(
  canvas: HTMLCanvasElement
): CanvasRenderingContext2D {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    throw new Error("Failed to get 2D canvas context");
  }
  return ctx;
}

export function drawImageToCanvas(
  image: HTMLImageElement,
  canvas: HTMLCanvasElement
): void {
  const ctx = getContext2D(canvas);
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
}

export function canvasToDataURL(canvas: HTMLCanvasElement): string {
  return canvas.toDataURL("image/png");
}
