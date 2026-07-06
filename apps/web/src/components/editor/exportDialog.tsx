"use client";

import type { JSX } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { useUser, SignInButton } from "@clerk/nextjs";
import { useExport } from "@/hooks/useExport";
import { cn } from "@/lib/utils";

export function ExportDialog({ onClose }: { onClose: () => void }): JSX.Element {
  const {
    isSignedIn,
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
  const { user } = useUser();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4">
      <div className="w-full max-w-md rounded-lg border border-hairline bg-canvas p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between border-b border-hairline pb-3">
          <h2 className="font-serif-display text-xl tracking-tight text-ink-primary">
            Export
          </h2>
          <button onClick={onClose} className="text-muted transition-colors hover:text-ink-primary" aria-label="Close">
            <HugeiconsIcon icon={Cancel01Icon} className="h-5 w-5" />
          </button>
        </div>

        {isSignedIn && user && (
          <p className="mb-3 text-xs text-muted">Signed in as {user.emailAddresses?.[0]?.emailAddress}</p>
        )}

        {!isSignedIn && (
          <div className="mb-4 rounded-lg border border-hairline bg-soft-stone/30 p-3 text-sm text-body-muted">
            Sign in to export your image.
          </div>
        )}

        <div className="mb-4 space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Format</label>
            <div className="flex gap-2">
              {(["png", "jpeg", "webp"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={cn(
                    "flex-1 rounded-lg border px-3 py-1.5 text-sm capitalize transition-colors",
                    format === f
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-hairline text-muted hover:border-muted hover:text-ink-primary"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Quality</label>
            <input
              type="range"
              min={50}
              max={100}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full accent-accent"
            />
            <div className="text-right text-xs text-muted">{quality}%</div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Resolution</label>
            <div className="flex gap-2">
              {(["1080", "original", "4k"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setResolution(r)}
                  className={cn(
                    "flex-1 rounded-lg border px-3 py-1.5 text-sm capitalize transition-colors",
                    resolution === r
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-hairline text-muted hover:border-muted hover:text-ink-primary"
                  )}
                >
                  {r === "4k" ? "4K" : r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && <p className="mb-3 text-sm text-error">{error}</p>}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-hairline bg-canvas px-4 py-2 text-sm text-ink-primary transition-colors hover:bg-soft-stone"
          >
            Cancel
          </button>
          {isSignedIn ? (
            <button
              onClick={exportImage}
              disabled={isExporting}
              className="rounded-lg bg-ink px-6 py-2 text-sm font-medium text-canvas transition-colors hover:bg-ink-deep disabled:bg-surface-card disabled:text-muted"
            >
              {isExporting ? "Exporting…" : "Export"}
            </button>
          ) : (
            <SignInButton mode="modal">
              <button className="rounded-lg bg-ink px-6 py-2 text-sm font-medium text-canvas transition-colors hover:bg-ink-deep">
                Sign in to Export
              </button>
            </SignInButton>
          )}
        </div>
      </div>
    </div>
  );
}
