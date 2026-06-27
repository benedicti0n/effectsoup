import type { CropConfig, PixelBuffer } from "@effectsoup/core";
import type { ResolvedPresetParameters } from "@effectsoup/presets";

export type RenderJob = {
  renderVersion: number;
  source: PixelBuffer;
  crop: CropConfig;
  presetId: string;
  resolvedParameters: ResolvedPresetParameters;
  targetWidth: number;
  targetHeight: number;
};

export type RenderRequestMessage = {
  type: "render";
  job: RenderJob;
};

export type CancelRequestMessage = {
  type: "cancel";
  renderVersion: number;
};

export type WorkerRequestMessage = RenderRequestMessage | CancelRequestMessage;

export type RenderResultMessage = {
  type: "renderResult";
  renderVersion: number;
  output: PixelBuffer;
};

export type RenderErrorMessage = {
  type: "renderError";
  renderVersion: number;
  error: string;
};

export type WorkerResponseMessage = RenderResultMessage | RenderErrorMessage;
