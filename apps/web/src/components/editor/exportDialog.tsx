"use client";

import type { JSX } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { UpgradeDialog } from "@/components/billing/upgradeDialog";
import { useExport } from "@/hooks/useExport";

export function ExportDialog({ onClose }: { onClose: () => void }): JSX.Element {
  const {
    session,
    isPremium,
    format,
    setFormat,
    quality,
    setQuality,
    resolution,
    setResolution,
    isExporting,
    error,
    showUpgrade,
    setShowUpgrade,
    requiresUpgrade,
    exportImage
  } = useExport(onClose);

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
