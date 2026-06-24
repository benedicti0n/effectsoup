"use client";

import type { JSX } from "react";
import { useCallback, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import type { PixelBuffer } from "@imageeffects/core";
import { getPresetById } from "@imageeffects/presets";
import { useEditorStore } from "@/store/editorStore";
import { renderEffectSync } from "@/lib/renderEffect";
import { authClient } from "@/lib/authClient";
import { UpgradeDialog } from "@/components/billing/upgradeDialog";
import { useToast } from "@/components/ui/toast";

const PREMIUM_EXPORT_LONGEST = 4096;
const FREE_EXPORT_LONGEST = 1080;

async function loadImageSource(objectUrl: string): Promise<PixelBuffer> {
  const image = new Image();
  image.src = objectUrl;
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

function getExportDimensions(
  sourceWidth: number,
  sourceHeight: number,
  requestedLongest: number
): { width: number; height: number } {
  const longest = Math.max(sourceWidth, sourceHeight);
  const scale = requestedLongest / longest;
  return {
    width: Math.round(sourceWidth * scale),
    height: Math.round(sourceHeight * scale)
  };
}

function pixelBufferToBlob(
  buffer: PixelBuffer,
  format: "png" | "jpeg" | "webp",
  quality: number
): Promise<Blob> {
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

  const mimeType =
    format === "png" ? "image/png" : format === "jpeg" ? "image/jpeg" : "image/webp";
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Export failed"));
      },
      mimeType,
      quality / 100
    );
  });
}

export function ExportDialog({ onClose }: { onClose: () => void }): JSX.Element {
  const source = useEditorStore((state) => state.source);
  const crop = useEditorStore((state) => state.crop);
  const effect = useEditorStore((state) => state.effect);
  const [format, setFormat] = useState<"png" | "jpeg" | "webp">("png");
  const [quality, setQuality] = useState(90);
  const [resolution, setResolution] = useState<"1080" | "original" | "4k">("1080");
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const { data: session } = authClient.useSession();
  const { showToast } = useToast();

  const isPremium = false;
  const selectedPreset = getPresetById(effect.presetId);
  const isPremiumPreset = selectedPreset?.access === "premium";

  const requiresUpgrade = isPremiumPreset || resolution === "original" || resolution === "4k";

  const exportImage = useCallback(async () => {
    if (!source) return;
    setIsExporting(true);
    setError(null);

    try {
      const sourceBuffer = await loadImageSource(source.objectUrl);
      const preset = getPresetById(effect.presetId);
      if (!preset) throw new Error("Unknown preset");

      const resolved = preset.intensityMapper(effect.intensity, effect.advancedOverrides);

      let longest = FREE_EXPORT_LONGEST;
      if (isPremium) {
        if (resolution === "4k") longest = PREMIUM_EXPORT_LONGEST;
        else if (resolution === "original") longest = Math.max(sourceBuffer.width, sourceBuffer.height);
      }

      const { width, height } = getExportDimensions(sourceBuffer.width, sourceBuffer.height, longest);
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
  }, [source, crop, effect, format, quality, resolution, isPremium, onClose, showToast]);

  if (showUpgrade) {
    return <UpgradeDialog onClose={() => setShowUpgrade(false)} />;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4">
      <div className="w-full max-w-md rounded-sm border border-hairline bg-canvas p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-mono text-xl font-bold text-ink">Export</h2>
          <button onClick={onClose} className="text-mute hover:text-ink" aria-label="Close">
            <HugeiconsIcon icon={Cancel01Icon} className="h-5 w-5" />
          </button>
        </div>

        {session && (
          <p className="mb-3 font-mono text-xs text-mute">Signed in as {session.user.email}</p>
        )}

        {requiresUpgrade && (
          <div className="mb-4 rounded-sm border border-hairline bg-surface-soft p-3 font-mono text-sm text-body">
            This export requires <span className="font-bold text-ink">Premium</span>. Preview is free;
            upgrade to export.
          </div>
        )}

        <div className="mb-4 space-y-3">
          <div>
            <label className="mb-1 block font-mono text-xs text-mute">Format</label>
            <div className="flex gap-2">
              {(["png", "jpeg", "webp"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`flex-1 rounded-sm border px-3 py-1.5 font-mono text-sm capitalize ${
                    format === f
                      ? "border-ink bg-surface-soft text-ink"
                      : "border-hairline text-mute hover:border-ink"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block font-mono text-xs text-mute">Quality</label>
            <input
              type="range"
              min={50}
              max={100}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full accent-ink"
            />
            <div className="text-right font-mono text-xs text-mute">{quality}%</div>
          </div>

          <div>
            <label className="mb-1 block font-mono text-xs text-mute">Resolution</label>
            <div className="flex gap-2">
              {(["1080", "original", "4k"] as const).map((r) => {
                const disabled = !isPremium && r !== "1080";
                return (
                  <button
                    key={r}
                    disabled={disabled}
                    onClick={() => setResolution(r)}
                    className={`flex-1 rounded-sm border px-3 py-1.5 font-mono text-sm capitalize ${
                      resolution === r
                        ? "border-ink bg-surface-soft text-ink"
                        : disabled
                          ? "cursor-not-allowed border-hairline text-ash"
                          : "border-hairline text-mute hover:border-ink"
                    }`}
                  >
                    {r === "4k" ? "4K" : r}
                    {disabled && " [lock]"}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {error && <p className="mb-3 font-mono text-sm text-danger">{error}</p>}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-sm border border-hairline bg-canvas px-4 py-2 font-mono text-sm text-ink hover:bg-surface-soft"
          >
            Cancel
          </button>
          {requiresUpgrade ? (
            <button
              onClick={() => setShowUpgrade(true)}
              className="rounded-sm bg-ink px-6 py-2 font-mono text-sm font-medium text-canvas hover:bg-ink-deep"
            >
              Upgrade to Export
            </button>
          ) : (
            <button
              onClick={exportImage}
              disabled={isExporting}
              className="rounded-sm bg-ink px-6 py-2 font-mono text-sm font-medium text-canvas hover:bg-ink-deep disabled:bg-surface-card disabled:text-ash"
            >
              {isExporting ? "Exporting…" : "Export"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
