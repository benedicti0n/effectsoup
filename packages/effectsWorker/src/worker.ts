import { applyViewportTransform, type PixelBuffer } from "@imageeffects/core";
import { getPresetById } from "@imageeffects/presets";
import type { RenderJob, WorkerRequestMessage, WorkerResponseMessage } from "./types.js";

let currentVersion = 0;

function runJob(job: RenderJob): PixelBuffer {
  const preset = getPresetById(job.presetId);
  if (!preset) {
    throw new Error(`Unknown preset: ${job.presetId}`);
  }

  const cropped = applyViewportTransform(job.source, job.crop, job.targetWidth, job.targetHeight);
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
