"use client";

import { useState, type JSX } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { useExport } from "@/hooks/useExport";
import { SignInDialog } from "@/components/auth/signInDialog";

export function ExportDialog({ onClose }: { onClose: () => void }): JSX.Element {
  const {
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
  } = useExport(onClose);
  const [showSignIn, setShowSignIn] = useState(false);

  return (
    <>
      {showSignIn && (
        <SignInDialog
          onClose={() => setShowSignIn(false)}
          onSuccess={() => setShowSignIn(false)}
        />
      )}
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

          {!session && (
            <div className="mb-4 rounded-sm border border-hairline bg-surface-soft p-3 font-mono text-sm text-body">
              Sign in to export your image.
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
                {(["1080", "original", "4k"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setResolution(r)}
                    className={`flex-1 rounded-sm border px-3 py-1.5 font-mono text-sm capitalize ${
                      resolution === r
                        ? "border-ink bg-surface-soft text-ink"
                        : "border-hairline text-mute hover:border-ink"
                    }`}
                  >
                    {r === "4k" ? "4K" : r}
                  </button>
                ))}
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
            <button
              onClick={session ? exportImage : () => setShowSignIn(true)}
              disabled={isExporting}
              className="rounded-sm bg-ink px-6 py-2 font-mono text-sm font-medium text-canvas hover:bg-ink-deep disabled:bg-surface-card disabled:text-ash"
            >
              {isExporting ? "Exporting…" : session ? "Export" : "Sign in to Export"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
