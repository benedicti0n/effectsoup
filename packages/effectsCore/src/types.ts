/**
 * Portable raw pixel buffer. No DOM or framework dependencies.
 */
export type PixelBuffer = {
  width: number;
  height: number;
  data: Uint8ClampedArray;
};

/**
 * RGBA color tuple. Components are 0-255.
 */
export type RgbaColor = [number, number, number, number];

/**
 * Supported image file formats for input validation.
 */
export type SupportedInputFormat = "image/jpeg" | "image/png" | "image/webp";

/**
 * Crop configuration for non-destructive editing.
 */
export type CropConfig = {
  aspectRatio: "original" | "1:1" | "4:5" | "9:16" | "16:9";
  zoom: number;
  offsetX: number;
  offsetY: number;
};

/**
 * Output options for final export.
 */
export type OutputOptions = {
  format: "png" | "jpeg" | "webp";
  width: number;
  height: number;
  backgroundColor?: string;
  quality?: number;
};
