import { createPixelBuffer, resizeBilinear, type PixelBuffer } from "@imageeffects/core";
import { getPresetById } from "@imageeffects/presets";
import type { RenderJob, WorkerRequestMessage, WorkerResponseMessage } from "./types.js";

let currentVersion = 0;

function applyCrop(source: PixelBuffer, targetWidth: number, targetHeight: number): PixelBuffer {
  // Simple center crop to target aspect ratio, then scale to target size.
  const srcAspect = source.width / source.height;
  const dstAspect = targetWidth / targetHeight;
  let cropW = source.width;
  let cropH = source.height;
  let cropX = 0;
  let cropY = 0;

  if (srcAspect > dstAspect) {
    cropW = Math.round(source.height * dstAspect);
    cropX = Math.round((source.width - cropW) / 2);
  } else {
    cropH = Math.round(source.width / dstAspect);
    cropY = Math.round((source.height - cropH) / 2);
  }

  const cropped = createPixelBuffer(cropW, cropH);
  for (let y = 0; y < cropH; y++) {
    const srcY = cropY + y;
    for (let x = 0; x < cropW; x++) {
      const srcX = cropX + x;
      const srcIdx = (srcY * source.width + srcX) * 4;
      const dstIdx = (y * cropW + x) * 4;
      cropped.data[dstIdx] = source.data[srcIdx];
      cropped.data[dstIdx + 1] = source.data[srcIdx + 1];
      cropped.data[dstIdx + 2] = source.data[srcIdx + 2];
      cropped.data[dstIdx + 3] = source.data[srcIdx + 3];
    }
  }

  return resizeBilinear(cropped, targetWidth, targetHeight);
}

function runJob(job: RenderJob): PixelBuffer {
  const preset = getPresetById(job.presetId);
  if (!preset) {
    throw new Error(`Unknown preset: ${job.presetId}`);
  }

  const cropped = applyCrop(job.source, job.targetWidth, job.targetHeight);
  const pipeline = preset.createPipeline(job.resolvedParameters);
  return pipeline(cropped, job.resolvedParameters);
}

function postResponse(message: WorkerResponseMessage, transfer: Transferable[] = []): void {
  self.postMessage(message, transfer);
}

self.onmessage = (event: MessageEvent<WorkerRequestMessage>) => {
  const message = event.data;

  if (message.type === "cancel") {
    if (message.renderVersion >= currentVersion) {
      currentVersion = message.renderVersion;
    }
    return;
  }

  if (message.type === "render") {
    const job = message.job;
    const version = job.renderVersion;
    currentVersion = version;

    try {
      const output = runJob(job);

      if (version < currentVersion) {
        // Stale result; discard.
        return;
      }

      postResponse(
        {
          type: "renderResult",
          renderVersion: version,
          output
        },
        [output.data.buffer]
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      postResponse({
        type: "renderError",
        renderVersion: version,
        error: errorMessage
      });
    }
  }
};
