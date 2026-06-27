import { useCallback, useEffect, useRef } from "react";
import { clonePixelBuffer, type CropConfig, type PixelBuffer } from "@effectsoup/core";
import type { ResolvedPresetParameters } from "@effectsoup/presets";
import type {
  RenderErrorMessage,
  RenderResultMessage,
  WorkerRequestMessage
} from "@effectsoup/worker";

export type RenderOptions = {
  source: PixelBuffer;
  crop: CropConfig;
  presetId: string;
  resolvedParameters: ResolvedPresetParameters;
  targetWidth: number;
  targetHeight: number;
};

export function useEffectsWorker() {
  const workerRef = useRef<Worker | null>(null);
  const versionRef = useRef(0);
  const pendingRef = useRef<
    Map<number, { resolve: (buffer: PixelBuffer) => void; reject: (error: string) => void }>
  >(new Map());

  useEffect(() => {
    try {
      workerRef.current = new Worker(
        new URL("../workers/effects.worker.ts", import.meta.url),
        { type: "module" }
      );
    } catch {
      // Worker not supported; callers should fall back to sync rendering.
      return;
    }

    workerRef.current.onmessage = (
      event: MessageEvent<RenderResultMessage | RenderErrorMessage>
    ) => {
      const message = event.data;
      if (message.type === "renderResult") {
        const pending = pendingRef.current.get(message.renderVersion);
        if (pending) {
          pendingRef.current.delete(message.renderVersion);
          pending.resolve(message.output);
        }
      } else if (message.type === "renderError") {
        const pending = pendingRef.current.get(message.renderVersion);
        if (pending) {
          pendingRef.current.delete(message.renderVersion);
          pending.reject(message.error);
        }
      }
    };

    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  const render = useCallback((options: RenderOptions): Promise<PixelBuffer> => {
    const worker = workerRef.current;
    if (!worker) {
      return Promise.reject(new Error("Worker not available"));
    }

    versionRef.current += 1;
    const version = versionRef.current;

    // Cancel any pending jobs older than this one.
    for (const [pendingVersion] of pendingRef.current) {
      if (pendingVersion < version) {
        worker.postMessage({ type: "cancel", renderVersion: pendingVersion } satisfies WorkerRequestMessage);
      }
    }

    return new Promise((resolve, reject) => {
      pendingRef.current.set(version, { resolve, reject });

      // Clone the source so the original buffer stays intact for sync fallback
      // and future renders. Transfer the clone to the worker.
      const sourceForWorker = clonePixelBuffer(options.source);

      const message: WorkerRequestMessage = {
        type: "render",
        job: {
          renderVersion: version,
          source: sourceForWorker,
          crop: options.crop,
          presetId: options.presetId,
          resolvedParameters: options.resolvedParameters,
          targetWidth: options.targetWidth,
          targetHeight: options.targetHeight
        }
      };

      try {
        worker.postMessage(message, [sourceForWorker.data.buffer]);
      } catch (error) {
        pendingRef.current.delete(version);
        const messageText = error instanceof Error ? error.message : String(error);
        reject(new Error(`Failed to post render job: ${messageText}`));
      }
    });
  }, []);

  return { render, isSupported: Boolean(workerRef.current) };
}
