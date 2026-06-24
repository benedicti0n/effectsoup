"use client";

import type { JSX } from "react";
import { useCallback, useState } from "react";
import type { PixelBuffer } from "@imageeffects/core";
import { getPresetById } from "@imageeffects/presets";
import { useEditorStore } from "@/store/editorStore";
import { renderEffectSync } from "@/lib/renderEffect";
import { authClient } from "@/lib/authClient";
import { UpgradeDialog } from "@/components/billing/upgradeDialog";

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

  // Production: derive from /api/me/entitlements.
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

      const { width, height } = getExportDimensions(
        sourceBuffer.width,
        sourceBuffer.height,
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
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed");
    } finally {
      setIsExporting(false);
    }
  }, [source, crop, effect, format, quality, resolution, isPremium, onClose]);

  if (showUpgrade) {
    return <UpgradeDialog onClose={() => setShowUpgrade(false)} />;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-surface p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-bold">Export</h2>

        {session && (
          <p className="mb-3 text-xs text-white/50">Signed in as {session.user.email}</p>
        )}

        {requiresUpgrade && (
          <div className="mb-4 rounded-lg border border-neon-lavender/30 bg-neon-lavender/10 p-3 text-sm">
            This export requires{" "}
            <span className="font-semibold text-neon-lavender">Premium</span>. Preview is free;
            upgrade to export.
          </div>
        )}

        <div className="mb-4 space-y-3">
          <div>
            <label className="mb-1 block text-xs text-white/70">Format</label>
            <div className="flex gap-2">
              {(["png", "jpeg", "webp"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`flex-1 rounded-md border px-3 py-1.5 text-sm capitalize ${
                    format === f
                      ? "border-neon-pink bg-neon-pink/10 text-white"
                      : "border-white/10 text-white/70 hover:bg-white/5"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs text-white/70">Quality</label>
            <input
              type="range"
              min={50}
              max={100}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full accent-neon-blue"
            />
            <div className="text-right font-mono text-xs text-white/50">{quality}%</div>
          </div>

          <div>
            <label className="mb-1 block text-xs text-white/70">Resolution</label>
            <div className="flex gap-2">
              {(["1080", "original", "4k"] as const).map((r) => {
                const disabled = !isPremium && r !== "1080";
                return (
                  <button
                    key={r}
                    disabled={disabled}
                    onClick={() => setResolution(r)}
                    className={`flex-1 rounded-md border px-3 py-1.5 text-sm capitalize ${
                      resolution === r
                        ? "border-neon-pink bg-neon-pink/10 text-white"
                        : disabled
                          ? "border-white/5 text-white/30 cursor-not-allowed"
                          : "border-white/10 text-white/70 hover:bg-white/5"
                    }`}
                  >
                    {r === "4k" ? "4K" : r}
                    {disabled && " 🔒"}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {error && <p className="mb-3 text-sm text-red-400">{error}</p>}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
          >
            Cancel
          </button>
          {requiresUpgrade ? (
            <button
              onClick={() => setShowUpgrade(true)}
              className="rounded-lg bg-neon-lavender px-6 py-2 text-sm font-semibold text-white hover:bg-neon-lavender/90"
            >
              Upgrade to Export
            </button>
          ) : (
            <button
              onClick={exportImage}
              disabled={isExporting}
              className="rounded-lg bg-neon-pink px-6 py-2 text-sm font-semibold text-white hover:bg-neon-pink/90 disabled:opacity-50"
            >
              {isExporting ? "Exporting…" : "Export"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
