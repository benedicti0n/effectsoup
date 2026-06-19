"use client";

import * as React from "react";
import { forwardRef, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { createCanvas, getContext2D } from "@/lib/image/canvasUtils";
import { renderEffect } from "@/lib/effects";
import { EffectType, EffectParams } from "@/lib/effects/types";

interface CanvasPreviewProps {
  sourceImage: HTMLImageElement | null;
  effectType: EffectType;
  settings: EffectParams["settings"];
  className?: string;
}

export const CanvasPreview = forwardRef<HTMLCanvasElement, CanvasPreviewProps>(
  function CanvasPreview({ sourceImage, effectType, settings, className }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mergedRef = useMergedRef(ref, canvasRef);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas || !sourceImage) return;

      const width = sourceImage.naturalWidth;
      const height = sourceImage.naturalHeight;

      canvas.width = width;
      canvas.height = height;

      const offscreenCanvas = createCanvas(width, height);
      const offscreenCtx = getContext2D(offscreenCanvas);
      offscreenCtx.drawImage(sourceImage, 0, 0, width, height);
      const sourceImageData = offscreenCtx.getImageData(0, 0, width, height);

      const ctx = getContext2D(canvas);
      ctx.clearRect(0, 0, width, height);

      renderEffect(effectType, {
        ctx,
        sourceImageData,
        sourceImage,
        width,
        height,
      }, settings);
    }, [sourceImage, effectType, settings]);

    if (!sourceImage) {
      return (
        <div
          className={cn(
            "flex aspect-video w-full max-w-4xl items-center justify-center rounded-xl border bg-card text-muted-foreground",
            className
          )}
        >
          <p className="text-sm">Upload an image to preview effects</p>
        </div>
      );
    }

    return (
      <canvas
        ref={mergedRef}
        className={cn(
          "max-h-full max-w-full rounded-xl border object-contain shadow-lg",
          className
        )}
      />
    );
  }
);

function useMergedRef<T>(
  ...refs: Array<React.Ref<T> | React.MutableRefObject<T | null>>
): React.RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref && "current" in ref) {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
}
