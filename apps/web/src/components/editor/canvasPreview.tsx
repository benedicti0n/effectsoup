"use client";

import type { JSX } from "react";
import { useEffect, useRef, useState } from "react";
import type { PixelBuffer } from "@effectsoup/core";
import { getPresetById } from "@effectsoup/presets";
import { HugeiconsIcon } from "@hugeicons/react";
import { EyeIcon } from "@hugeicons/core-free-icons";
import { useEditorStore } from "@/store/editorStore";
import { renderEffectSync } from "@/lib/renderEffect";
import { useEffectsWorker } from "@/hooks/useEffectsWorker";
import { useAdaptiveQuality } from "@/hooks/useAdaptiveQuality";

function getPreviewSize(
  sourceWidth: number,
  sourceHeight: number,
  isMobile: boolean,
  qualityScale: number
): { width: number; height: number } {
  const maxLongest = (isMobile ? 960 : 1400) * qualityScale;
  const longest = Math.max(sourceWidth, sourceHeight);
  const scale = longest > maxLongest ? maxLongest / longest : 1;
  return {
    width: Math.max(1, Math.round(sourceWidth * scale)),
    height: Math.max(1, Math.round(sourceHeight * scale))
  };
}

async function loadSourceBuffer(
  source: { objectUrl: string; width: number; height: number },
  signal?: AbortSignal
): Promise<PixelBuffer> {
  const image = new Image();
  image.src = source.objectUrl;
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("Failed to load image"));
    if (signal) {
      signal.addEventListener("abort", () => reject(new Error("Aborted")));
    }
  });
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");
  ctx.drawImage(image, 0, 0);
  const imageData = ctx.getImageData(0, 0, image.width, image.height);
  return { width: image.width, height: image.height, data: imageData.data };
}

export function CanvasPreview(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalRef = useRef<HTMLCanvasElement>(null);
  const source = useEditorStore((state) => state.source);
  const crop = useEditorStore((state) => state.crop);
  const effect = useEditorStore((state) => state.effect);
  const setIsRendering = useEditorStore((state) => state.setIsRendering);
  const { render: renderInWorker } = useEffectsWorker();
  const { scale: qualityScale, reportDuration } = useAdaptiveQuality();
  const [showingOriginal, setShowingOriginal] = useState(false);

  // Render the processed effect whenever inputs change.
  useEffect(() => {
    if (!source || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cancelled = false;
    const abortController = new AbortController();

    const render = async () => {
      setIsRendering(true);
      try {
        const sourceBuffer = await loadSourceBuffer(
          { objectUrl: source.objectUrl, width: source.width, height: source.height },
          abortController.signal
        );
        if (cancelled) return;

        const preset = getPresetById(effect.presetId);
        if (!preset) return;
        const resolved = preset.intensityMapper(effect.intensity, effect.advancedOverrides);

        const { width, height } = getPreviewSize(
          sourceBuffer.width,
          sourceBuffer.height,
          window.innerWidth < 768,
          qualityScale
        );

        const startTime = performance.now();

        let output: PixelBuffer;
        try {
          output = await renderInWorker({
            source: sourceBuffer,
            crop,
            presetId: effect.presetId,
            resolvedParameters: resolved,
            targetWidth: width,
            targetHeight: height
          });
        } catch {
          output = renderEffectSync(sourceBuffer, crop, effect.presetId, resolved, width, height);
        }

        if (cancelled) return;

        canvas.width = width;
        canvas.height = height;
        const outputData = new ImageData(
          new Uint8ClampedArray(output.data),
          output.width,
          output.height
        );
        ctx.putImageData(outputData, 0, 0);

        reportDuration(performance.now() - startTime);
      } catch (error) {
        if (error instanceof Error && error.message === "Aborted") return;
        console.error("Render failed:", error);
      } finally {
        if (!cancelled) setIsRendering(false);
      }
    };

    void render();

    return () => {
      cancelled = true;
      abortController.abort();
    };
  }, [source, crop, effect, setIsRendering, renderInWorker, qualityScale, reportDuration]);

  // Render the original image (cropped + downscaled to preview size) into a
  // separate hidden canvas. Painted into the visible canvas whenever the user
  // holds or toggles the eye button.
  useEffect(() => {
    if (!source || !originalRef.current) return;

    const canvas = originalRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cancelled = false;
    const abortController = new AbortController();

    const render = async () => {
      try {
        const sourceBuffer = await loadSourceBuffer(
          { objectUrl: source.objectUrl, width: source.width, height: source.height },
          abortController.signal
        );
        if (cancelled) return;

        const { width, height } = getPreviewSize(
          sourceBuffer.width,
          sourceBuffer.height,
          window.innerWidth < 768,
          qualityScale
        );

        // Apply only the crop (no effect) so what you see matches what was
        // rendered before any effect was applied.
        const { applyViewportTransform } = await import("@effectsoup/core");
        const cropped = applyViewportTransform(sourceBuffer, crop, width, height);

        canvas.width = cropped.width;
        canvas.height = cropped.height;
        ctx.putImageData(
          new ImageData(new Uint8ClampedArray(cropped.data), cropped.width, cropped.height),
          0,
          0
        );
      } catch (error) {
        if (error instanceof Error && error.message === "Aborted") return;
        console.error("Failed to render original preview:", error);
      }
    };

    void render();

    return () => {
      cancelled = true;
      abortController.abort();
    };
  }, [source, crop, qualityScale]);

  // While the eye is "held" we paint the original buffer on top of the
  // processed canvas using an offscreen draw — small enough to do sync.
  useEffect(() => {
    if (!showingOriginal) return;
    if (!canvasRef.current || !originalRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    const originalCtx = originalRef.current.getContext("2d");
    if (!ctx || !originalCtx) return;
    if (originalRef.current.width === 0 || originalRef.current.height === 0) return;
    canvasRef.current.width = originalRef.current.width;
    canvasRef.current.height = originalRef.current.height;
    ctx.drawImage(originalRef.current, 0, 0);
  }, [showingOriginal]);

  if (!source) {
    return (
      <div className="flex h-full items-center justify-center rounded-sm border border-hairline bg-surface-soft p-8 font-mono text-mute">
        Upload an image to start editing.
      </div>
    );
  }

  const onEyePress = () => setShowingOriginal(true);
  const onEyeRelease = () => setShowingOriginal(false);

  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden rounded-sm border border-hairline bg-surface-soft">
      <canvas
        ref={canvasRef}
        className="max-h-full max-w-full object-contain"
        aria-hidden={showingOriginal}
      />
      <canvas ref={originalRef} className="hidden" aria-hidden="true" />

      <button
        type="button"
        onMouseDown={onEyePress}
        onMouseUp={onEyeRelease}
        onMouseLeave={onEyeRelease}
        onTouchStart={(e) => {
          e.preventDefault();
          onEyePress();
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          onEyeRelease();
        }}
        onClick={() => setShowingOriginal((s) => !s)}
        aria-label={showingOriginal ? "Show processed image" : "Show original image"}
        aria-pressed={showingOriginal}
        className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-hairline bg-canvas/90 text-ink shadow-sm backdrop-blur transition-colors hover:bg-canvas"
      >
        <HugeiconsIcon icon={EyeIcon} className="h-4 w-4" />
      </button>

      {showingOriginal && (
        <span className="pointer-events-none absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-sm border border-hairline bg-canvas/90 px-2.5 py-1 text-xs font-medium text-ink shadow-sm backdrop-blur">
          Original
        </span>
      )}
    </div>
  );
}
