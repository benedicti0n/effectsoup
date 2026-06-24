"use client";

import type { JSX } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  Download01Icon,
  Upload01Icon
} from "@hugeicons/core-free-icons";
import type { CropConfig, PixelBuffer } from "@imageeffects/core";
import { allPresets, getPresetById } from "@imageeffects/presets";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffectsWorker } from "@/hooks/useEffectsWorker";
import { renderEffectSync } from "@/lib/renderEffect";
import { useToast } from "@/components/ui/toast";
import NextImage from "next/image";
import { cn } from "@/lib/utils";

const DEMO_COUNT = 12;
const PREVIEW_LONGEST = 720;
const FREE_EXPORT_LONGEST = 1080;

const defaultCrop: CropConfig = {
  aspectRatio: "original",
  zoom: 1,
  offsetX: 0,
  offsetY: 0
};

async function loadImageSource(src: string): Promise<PixelBuffer> {
  const image = new Image();
  image.src = src;
  image.crossOrigin = "anonymous";
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("Failed to load image"));
  });

  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");
  ctx.drawImage(image, 0, 0);
  const imageData = ctx.getImageData(0, 0, image.width, image.height);
  return {
    width: image.width,
    height: image.height,
    data: imageData.data
  };
}

function getPreviewDimensions(width: number, height: number): { width: number; height: number } {
  const longest = Math.max(width, height);
  const scale = longest > PREVIEW_LONGEST ? PREVIEW_LONGEST / longest : 1;
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale))
  };
}

function pixelBufferToBlob(buffer: PixelBuffer, format: "png" | "jpeg"): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = buffer.width;
  canvas.height = buffer.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");
  ctx.putImageData(
    new ImageData(new Uint8ClampedArray(buffer.data), buffer.width, buffer.height),
    0,
    0
  );
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Export failed"));
      },
      format === "png" ? "image/png" : "image/jpeg",
      0.92
    );
  });
}

export function MiniPlayground(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [source, setSource] = useState<PixelBuffer | null>(null);
  const [sourceName, setSourceName] = useState<string>("demo");
  const [selectedDemo, setSelectedDemo] = useState(1);
  const [presetId, setPresetId] = useState("pixelGrid");
  const [intensity, setIntensity] = useState(50);
  const [isRendering, setIsRendering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { render: renderInWorker } = useEffectsWorker();
  const { showToast } = useToast();

  const preset = getPresetById(presetId);
  const presets = allPresets.filter((p) => p.access === "free").slice(0, 6);

  // Load default demo image on mount.
  useEffect(() => {
    let cancelled = false;
    setError(null);
    loadImageSource(`/assets/showcase/img${selectedDemo}.png`)
      .then((buffer) => {
        if (!cancelled) {
          setSource(buffer);
          setSourceName(`demo-${selectedDemo}`);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load image");
      });
    return () => {
      cancelled = true;
    };
  }, [selectedDemo]);

  // Apply default intensity when preset changes.
  useEffect(() => {
    if (preset) {
      setIntensity(preset.defaultIntensity);
    }
  }, [presetId, preset]);

  // Render effect whenever source, preset, or intensity changes.
  useEffect(() => {
    if (!source || !canvasRef.current || !preset) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cancelled = false;

    const render = async () => {
      setIsRendering(true);
      setError(null);
      try {
        const resolved = preset.intensityMapper(intensity, {});
        const { width, height } = getPreviewDimensions(source.width, source.height);

        let output: PixelBuffer;
        try {
          output = await renderInWorker({
            source,
            crop: defaultCrop,
            presetId,
            resolvedParameters: resolved,
            targetWidth: width,
            targetHeight: height
          });
        } catch {
          output = renderEffectSync(source, defaultCrop, presetId, resolved, width, height);
        }

        if (cancelled) return;
        canvas.width = output.width;
        canvas.height = output.height;
        ctx.putImageData(
          new ImageData(new Uint8ClampedArray(output.data), output.width, output.height),
          0,
          0
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Render failed");
      } finally {
        setIsRendering(false);
      }
    };

    void render();

    return () => {
      cancelled = true;
    };
  }, [source, presetId, intensity, preset, renderInWorker]);

  const handleUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Only image files are supported.");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError("Image must be under 20 MB.");
      return;
    }

    try {
      const url = URL.createObjectURL(file);
      const buffer = await loadImageSource(url);
      URL.revokeObjectURL(url);
      setSource(buffer);
      setSourceName(file.name.replace(/\.[^/.]+$/, ""));
      setSelectedDemo(0);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    }
  }, []);

  const onFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) void handleUpload(file);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [handleUpload]
  );

  const handleDownload = useCallback(async () => {
    if (!source || !preset) return;
    try {
      const resolved = preset.intensityMapper(intensity, {});
      const longest = Math.max(source.width, source.height);
      const scale = longest > FREE_EXPORT_LONGEST ? FREE_EXPORT_LONGEST / longest : 1;
      const width = Math.round(source.width * scale);
      const height = Math.round(source.height * scale);
      const output = renderEffectSync(source, defaultCrop, presetId, resolved, width, height);
      const blob = await pixelBufferToBlob(output, "png");
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${sourceName}-${presetId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast("Preview downloaded", "success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed");
      showToast(err instanceof Error ? err.message : "Download failed", "error");
    }
  }, [source, preset, intensity, presetId, sourceName, showToast]);

  return (
    <div className="rounded-sm border border-card-border bg-canvas p-4 shadow-sm md:p-6">
      <div className="mb-4 grid gap-4 md:grid-cols-[1fr_280px]">
        <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-sm bg-soft-stone">
          {error && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-canvas/90 p-4 text-center text-sm text-error">
              {error}
            </div>
          )}
          <canvas
            ref={canvasRef}
            className={cn(
              "max-h-full max-w-full object-contain transition-opacity",
              isRendering && "opacity-60"
            )}
          />
          {isRendering && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-hairline border-t-ink-primary" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted">
              Effect
            </label>
            <div className="flex flex-wrap gap-2">
              {presets.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPresetId(p.id)}
                  className={cn(
                    "rounded-pill border px-3 py-1.5 text-xs font-medium transition-colors",
                    presetId === p.id
                      ? "border-ink-primary bg-ink-primary text-on-primary"
                      : "border-hairline bg-canvas text-ink hover:bg-soft-stone"
                  )}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-medium uppercase tracking-wide text-muted">
                Intensity
              </label>
              <span className="text-xs font-medium text-ink">{intensity}%</span>
            </div>
            <Slider
              value={intensity}
              min={0}
              max={100}
              step={1}
              onChange={(event) => setIntensity(Number(event.target.value))}
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted">
              Demo photo
            </label>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: DEMO_COUNT }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setSelectedDemo(num)}
                  className={cn(
                    "h-10 w-10 overflow-hidden rounded-sm border transition-colors",
                    selectedDemo === num ? "border-ink-primary" : "border-hairline hover:border-muted"
                  )}
                  aria-label={`Select demo image ${num}`}
                >
                  <NextImage
                    src={`/assets/showcase/img${num}.png`}
                    alt=""
                    width={40}
                    height={40}
                    unoptimized
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto flex flex-col gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={onFileChange}
            />
            <Button variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()}>
              <HugeiconsIcon icon={Upload01Icon} className="h-4 w-4" />
              Upload your image
            </Button>
            <Button className="w-full" onClick={handleDownload} disabled={!source || isRendering}>
              <HugeiconsIcon icon={Download01Icon} className="h-4 w-4" />
              Download preview
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-4">
        <p className="text-sm text-body-muted">
          <Badge variant="muted">Free preview</Badge>
          <span className="ml-2">Exports up to 1080px. Premium presets in the playground.</span>
        </p>
        <Button variant="outline" asChild>
          <a href="/playground">
            Open full playground
            <HugeiconsIcon icon={ArrowRight01Icon} className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  );
}
