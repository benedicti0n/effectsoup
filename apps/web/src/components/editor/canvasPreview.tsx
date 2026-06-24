"use client";

import { useEffect, useRef } from "react";
import type { JSX } from "react";
import type { PixelBuffer } from "@imageeffects/core";
import { getPresetById } from "@imageeffects/presets";
import { useEditorStore } from "@/store/editorStore";
import { renderEffectSync } from "@/lib/renderEffect";

function getPreviewSize(
  sourceWidth: number,
  sourceHeight: number,
  isMobile: boolean
): { width: number; height: number } {
  const maxLongest = isMobile ? 960 : 1400;
  const longest = Math.max(sourceWidth, sourceHeight);
  const scale = longest > maxLongest ? maxLongest / longest : 1;
  return {
    width: Math.round(sourceWidth * scale),
    height: Math.round(sourceHeight * scale)
  };
}

export function CanvasPreview(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const source = useEditorStore((state) => state.source);
  const crop = useEditorStore((state) => state.crop);
  const effect = useEditorStore((state) => state.effect);
  const compareBefore = useEditorStore((state) => state.compareBefore);
  const setIsRendering = useEditorStore((state) => state.setIsRendering);

  useEffect(() => {
    if (!source || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cancelled = false;

    const render = async () => {
      setIsRendering(true);
      const image = new Image();
      image.src = source.objectUrl;
      await new Promise<void>((resolve) => {
        image.onload = () => resolve();
      });
      if (cancelled) return;

      const offscreen = document.createElement("canvas");
      offscreen.width = image.width;
      offscreen.height = image.height;
      const offCtx = offscreen.getContext("2d");
      if (!offCtx) return;
      offCtx.drawImage(image, 0, 0);
      const imageData = offCtx.getImageData(0, 0, image.width, image.height);
      const sourceBuffer: PixelBuffer = {
        width: image.width,
        height: image.height,
        data: imageData.data
      };

      const preset = getPresetById(effect.presetId);
      if (!preset) return;
      const resolved = preset.intensityMapper(effect.intensity, effect.advancedOverrides);

      const { width, height } = getPreviewSize(image.width, image.height, window.innerWidth < 768);

      try {
        const output = renderEffectSync(sourceBuffer, crop, effect.presetId, resolved, width, height);
        if (cancelled) return;

        canvas.width = width;
        canvas.height = height;
        const outputData = new ImageData(
          new Uint8ClampedArray(output.data),
          output.width,
          output.height
        );
        ctx.putImageData(outputData, 0, 0);
      } catch (error) {
        console.error("Render failed:", error);
      } finally {
        setIsRendering(false);
      }
    };

    void render();

    return () => {
      cancelled = true;
    };
  }, [source, crop, effect, compareBefore, setIsRendering]);

  if (!source) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl border border-white/10 bg-surface p-8 text-white/50">
        Upload an image to start editing.
      </div>
    );
  }

  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-ink">
      <canvas ref={canvasRef} className="max-h-full max-w-full object-contain" />
    </div>
  );
}
