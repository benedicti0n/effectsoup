"use client";

import { useCallback, useState } from "react";
import { getPresetById } from "@effectsoup/presets";
import { getCroppedOutputSize } from "@effectsoup/core";
import { useEditorStore } from "@/store/editorStore";
import { renderEffectSync } from "@/lib/renderEffect";
import { authClient } from "@/lib/authClient";
import { useToast } from "@/components/ui/toast";
import {
  loadImageSource,
  pixelBufferToBlob
} from "@/lib/imageExport";

const PREMIUM_EXPORT_LONGEST = 4096;

export type ExportFormat = "png" | "jpeg" | "webp";
export type ExportResolution = "1080" | "original" | "4k";

export function useExport(onClose: () => void) {
  const source = useEditorStore((state) => state.source);
  const crop = useEditorStore((state) => state.crop);
  const effect = useEditorStore((state) => state.effect);
  const [format, setFormat] = useState<ExportFormat>("png");
  const [quality, setQuality] = useState(90);
  const [resolution, setResolution] = useState<ExportResolution>("1080");
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = authClient.useSession();
  const { showToast } = useToast();

  const exportImage = useCallback(async () => {
    if (!source) return;
    if (!session) return;
    setIsExporting(true);
    setError(null);

    try {
      const sourceBuffer = await loadImageSource(source.objectUrl);
      const preset = getPresetById(effect.presetId);
      if (!preset) throw new Error("Unknown preset");

      const resolved = preset.intensityMapper(effect.intensity, effect.advancedOverrides);

      let longest = 1080;
      if (resolution === "4k") longest = PREMIUM_EXPORT_LONGEST;
      else if (resolution === "original") longest = Math.max(sourceBuffer.width, sourceBuffer.height);

      const { width, height } = getCroppedOutputSize(
        sourceBuffer.width,
        sourceBuffer.height,
        crop.aspectRatio,
        longest
      );
      const output = renderEffectSync(sourceBuffer, crop, effect.presetId, resolved, width, height);
      const blob = await pixelBufferToBlob(output, format, quality);

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${source.fileName.replace(/\.[^/.]+$/, "")}-${effect.presetId}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast("Image exported successfully", "success");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed");
    } finally {
      setIsExporting(false);
    }
  }, [source, crop, effect, format, quality, resolution, session, onClose, showToast]);

  return {
    session,
    format,
    setFormat,
    quality,
    setQuality,
    resolution,
    setResolution,
    isExporting,
    error,
    exportImage
  };
}
