import type { PixelBuffer } from "@imageeffects/core";

export async function loadImageSource(src: string): Promise<PixelBuffer> {
  const image = new Image();
  image.src = src;
  image.crossOrigin = "anonymous";
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("Failed to load image"));
  });

  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");
  ctx.drawImage(image, 0, 0);
  const imageData = ctx.getImageData(0, 0, image.width, image.height);
  return {
    width: image.width,
    height: image.height,
    data: imageData.data
  };
}

export function getPreviewDimensions(
  width: number,
  height: number,
  previewLongest: number
): { width: number; height: number } {
  const longest = Math.max(width, height);
  const scale = longest > previewLongest ? previewLongest / longest : 1;
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale))
  };
}

export function getExportDimensions(
  sourceWidth: number,
  sourceHeight: number,
  requestedLongest: number
): { width: number; height: number } {
  const longest = Math.max(sourceWidth, sourceHeight);
  const scale = requestedLongest / longest;
  return {
    width: Math.round(sourceWidth * scale),
    height: Math.round(sourceHeight * scale)
  };
}

export function pixelBufferToBlob(
  buffer: PixelBuffer,
  format: "png" | "jpeg" | "webp",
  quality: number
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = buffer.width;
  canvas.height = buffer.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");
  ctx.putImageData(
    new ImageData(new Uint8ClampedArray(buffer.data), buffer.width, buffer.height),
    0,
    0
  );

  const mimeType =
    format === "png" ? "image/png" : format === "jpeg" ? "image/jpeg" : "image/webp";
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Export failed"));
      },
      mimeType,
      quality / 100
    );
  });
}
