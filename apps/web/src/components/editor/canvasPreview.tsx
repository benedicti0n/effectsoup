"use client";

import type { JSX } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PixelBuffer } from "@effectsoup/core";
import { applyViewportTransform, getCroppedOutputSize } from "@effectsoup/core";
import { getPresetById } from "@effectsoup/presets";
import { HugeiconsIcon } from "@hugeicons/react";
import { EyeIcon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editorStore";
import { renderEffectSync } from "@/lib/renderEffect";
import { useEffectsWorker } from "@/hooks/useEffectsWorker";
import { useAdaptiveQuality } from "@/hooks/useAdaptiveQuality";

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

// Quick taps toggle (click) — sustained presses (>this) hold to view.
// Matches what desktop image editors and other "eye" toggles feel like.
const HOLD_THRESHOLD_MS = 180;

export function CanvasPreview(): JSX.Element {
  const processedRef = useRef<HTMLCanvasElement>(null);
  const originalRef = useRef<HTMLCanvasElement>(null);
  const source = useEditorStore((state) => state.source);
  const crop = useEditorStore((state) => state.crop);
  const effect = useEditorStore((state) => state.effect);
  const setIsRendering = useEditorStore((state) => state.setIsRendering);
  const { render: renderInWorker } = useEffectsWorker();
  const { scale: qualityScale, reportDuration } = useAdaptiveQuality();
  const [showingOriginal, setShowingOriginal] = useState(false);

  // Disambiguate "click to toggle" from "hold to view".
  // - pressStartRef: timestamp of the most recent pointer-down
  // - isHoldingRef: true once the press has lasted past HOLD_THRESHOLD_MS
  // - longPressTimerRef: timer that flips isHoldingRef to true
  const pressStartRef = useRef<number | null>(null);
  const isHoldingRef = useRef(false);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelLongPressTimer = useCallback(() => {
    if (longPressTimerRef.current !== null) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  const handlePressStart = useCallback(() => {
    cancelLongPressTimer();
    pressStartRef.current = Date.now();
    isHoldingRef.current = false;
    longPressTimerRef.current = setTimeout(() => {
      isHoldingRef.current = true;
      setShowingOriginal(true);
    }, HOLD_THRESHOLD_MS);
  }, [cancelLongPressTimer]);

  const handlePressEnd = useCallback(() => {
    cancelLongPressTimer();
    const wasHolding = isHoldingRef.current;
    isHoldingRef.current = false;
    pressStartRef.current = null;
    if (wasHolding) {
      setShowingOriginal(false);
    } else {
      // Short press: treat as a click toggle.
      setShowingOriginal((s) => !s);
    }
  }, [cancelLongPressTimer]);

  const handlePressCancel = useCallback(() => {
    // Pointer left the button while still pressed: revert to processed view.
    cancelLongPressTimer();
    if (isHoldingRef.current) {
      isHoldingRef.current = false;
      setShowingOriginal(false);
    }
    pressStartRef.current = null;
  }, [cancelLongPressTimer]);

  // Clean up the long-press timer if the component unmounts mid-press.
  useEffect(() => {
    return () => {
      cancelLongPressTimer();
    };
  }, [cancelLongPressTimer]);

  // Render the processed effect whenever its inputs change.
  useEffect(() => {
    if (!source || !processedRef.current) return;

    const canvas = processedRef.current;
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

        const previewLongest = (window.innerWidth < 768 ? 960 : 1400) * qualityScale;
        const { width, height } = getCroppedOutputSize(
          sourceBuffer.width,
          sourceBuffer.height,
          crop.aspectRatio,
          previewLongest
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

  // Render the cropped original into its own canvas. Both canvases are
  // layered with absolute positioning — toggling the eye just swaps their
  // visibility, so neither one's pixel data is ever destroyed.
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

        const previewLongest = (window.innerWidth < 768 ? 960 : 1400) * qualityScale;
        const { width, height } = getCroppedOutputSize(
          sourceBuffer.width,
          sourceBuffer.height,
          crop.aspectRatio,
          previewLongest
        );

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

  // Escape key dismisses the held preview for keyboard users.
  useEffect(() => {
    if (!showingOriginal) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        isHoldingRef.current = false;
        cancelLongPressTimer();
        setShowingOriginal(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showingOriginal, cancelLongPressTimer]);

  if (!source) {
    return (
      <div className="flex h-full items-center justify-center rounded-sm border border-hairline bg-surface-soft p-8 font-mono text-mute">
        Upload an image to start editing.
      </div>
    );
  }

  const processedVisible = !showingOriginal;

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-sm border border-hairline bg-surface-soft">
      <canvas
        ref={processedRef}
        className="max-h-full max-w-full object-contain"
        aria-hidden={!processedVisible}
        style={{ visibility: processedVisible ? "visible" : "hidden" }}
      />
      <canvas
        ref={originalRef}
        aria-hidden={showingOriginal}
        className="max-h-full max-w-full object-contain"
        style={{ visibility: showingOriginal ? "visible" : "hidden", position: "absolute", inset: 0, margin: "auto" }}
      />

      <button
        type="button"
        onPointerDown={handlePressStart}
        onPointerUp={handlePressEnd}
        onPointerLeave={handlePressCancel}
        onPointerCancel={handlePressCancel}
        onContextMenu={(e) => e.preventDefault()}
        onClick={(e) => e.preventDefault()}
        aria-label={showingOriginal ? "Show processed image" : "Show original image"}
        aria-pressed={showingOriginal}
        title={showingOriginal ? "Showing original — release to compare" : "Click to toggle, hold to compare"}
        className={cn(
          "absolute right-3 top-3 z-10 inline-flex h-9 w-9 select-none items-center justify-center rounded-full border border-hairline bg-canvas/90 text-ink shadow-sm backdrop-blur transition-colors hover:bg-canvas",
          showingOriginal && "bg-ink-primary text-on-primary border-ink-primary hover:bg-ink-primary"
        )}
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
