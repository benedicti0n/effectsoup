"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CropConfig, PixelBuffer } from "@effectsoup/core";
import { allPresets, getPresetById } from "@effectsoup/presets";
import { useEffectsWorker } from "@/hooks/useEffectsWorker";
import { renderEffectSync } from "@/lib/renderEffect";
import { useToast } from "@/components/ui/toast";
import {
  getPreviewDimensions,
  loadImageSource,
  pixelBufferToBlob
} from "@/lib/imageExport";

const PREVIEW_LONGEST = 720;
const FREE_EXPORT_LONGEST = 1080;
const UPLOADED_IMAGE_ID = -1;

// Presets exposed on the home mini playground. Curated subset of the
// full registry — the goal is to give visitors a quick taste of the
// effect vocabulary without showing every variant.
export const MINI_PLAYGROUND_PRESETS: readonly string[] = [
  "pixelGrid",
  "orderedDither",
  "colorDither",
  "classicAscii",
  "cyberAscii",
  "symbolGlow",
  "cubicGlass",
  "duotone",
  "dreamGlow",
  "ledMatrix",
  "noirGrain"
];

const defaultCrop: CropConfig = {
  aspectRatio: "original",
  zoom: 1,
  offsetX: 0,
  offsetY: 0
};

export type MiniPlaygroundState = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  source: PixelBuffer | null;
  sourceName: string;
  presetId: string;
  intensity: number;
  isRendering: boolean;
  error: string | null;
  presets: typeof allPresets;
  preset: ReturnType<typeof getPresetById>;
  selectedDemo: number;
  handleUpload: (file: File) => Promise<void>;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDownload: () => Promise<void>;
  setPresetId: (id: string) => void;
  setIntensity: (value: number) => void;
  setSelectedDemo: (value: number) => void;
};

export function useMiniPlayground(): MiniPlaygroundState {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [source, setSource] = useState<PixelBuffer | null>(null);
  const [sourceName, setSourceName] = useState<string>("demo");
  const [selectedDemo, setSelectedDemoState] = useState(1);
  const [presetId, setPresetId] = useState("pixelGrid");
  const [intensity, setIntensity] = useState(50);
  const [isRendering, setIsRendering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { render: renderInWorker } = useEffectsWorker();
  const { showToast } = useToast();

  const setSelectedDemo = useCallback((value: number) => {
    setSelectedDemoState(value);
  }, []);

  const preset = getPresetById(presetId);
  const presets = allPresets.filter((p) => MINI_PLAYGROUND_PRESETS.includes(p.id));

  // Load the demo image (or skip when an upload owns the source).
  useEffect(() => {
    let cancelled = false;
    setError(null);
    if (selectedDemo === UPLOADED_IMAGE_ID) return;
    if (selectedDemo < 1) return;
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
        const { width, height } = getPreviewDimensions(source.width, source.height, PREVIEW_LONGEST);

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
      setSelectedDemoState(UPLOADED_IMAGE_ID);
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
      const blob = await pixelBufferToBlob(output, "png", 92);
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

  return {
    canvasRef,
    fileInputRef,
    source,
    sourceName,
    selectedDemo,
    presetId,
    intensity,
    isRendering,
    error,
    presets,
    preset,
    handleUpload,
    onFileChange,
    handleDownload,
    setPresetId,
    setIntensity,
    setSelectedDemo
  };
}
