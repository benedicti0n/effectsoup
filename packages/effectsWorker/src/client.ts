import type { CropConfig, PixelBuffer } from "@effectsoup/core";
import type { ResolvedPresetParameters } from "@effectsoup/presets";
import type {
  RenderErrorMessage,
  RenderResultMessage,
  WorkerRequestMessage
} from "./types.js";

export type RenderOptions = {
  presetId: string;
  resolvedParameters: ResolvedPresetParameters;
  source: PixelBuffer;
  crop: CropConfig;
  targetWidth: number;
  targetHeight: number;
};

export type RenderCallbacks = {
  onResult: (output: PixelBuffer) => void;
  onError: (error: string) => void;
};

export class EffectsWorkerClient {
  private worker: Worker;
  private version = 0;
  private pending = new Map<
    number,
    { resolve: (output: PixelBuffer) => void; reject: (error: string) => void }
  >();

  constructor(workerScriptUrl: string | URL) {
    this.worker = new Worker(workerScriptUrl, { type: "module" });
    this.worker.onmessage = (event: MessageEvent<RenderResultMessage | RenderErrorMessage>) => {
      const message = event.data;
      if (message.type === "renderResult") {
        const pending = this.pending.get(message.renderVersion);
        if (pending) {
          this.pending.delete(message.renderVersion);
          pending.resolve(message.output);
        }
      } else if (message.type === "renderError") {
        const pending = this.pending.get(message.renderVersion);
        if (pending) {
          this.pending.delete(message.renderVersion);
          pending.reject(message.error);
        }
      }
    };
  }

  render(options: RenderOptions): Promise<PixelBuffer> {
    this.version += 1;
    const version = this.version;

    return new Promise((resolve, reject) => {
      this.pending.set(version, { resolve, reject });

      const message: WorkerRequestMessage = {
        type: "render",
        job: {
          renderVersion: version,
          source: options.source,
          crop: options.crop,
          presetId: options.presetId,
          resolvedParameters: options.resolvedParameters,
          targetWidth: options.targetWidth,
          targetHeight: options.targetHeight
        }
      };

      this.worker.postMessage(message, [options.source.data.buffer]);
    });
  }

  cancelObsolete(version: number): void {
    const message: WorkerRequestMessage = { type: "cancel", renderVersion: version };
    this.worker.postMessage(message);
  }

  terminate(): void {
    this.worker.terminate();
  }
}
