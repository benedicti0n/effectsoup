"use client";

import { useState, type JSX } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  Download01Icon,
  Upload01Icon
} from "@hugeicons/core-free-icons";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { SignInDialog } from "@/components/auth/signInDialog";
import { authClient } from "@/lib/authClient";
import NextImage from "next/image";
import { cn } from "@/lib/utils";
import { useMiniPlayground } from "@/hooks/useMiniPlayground";

export function MiniPlayground(): JSX.Element {
  const {
    canvasRef,
    fileInputRef,
    presetId,
    intensity,
    isRendering,
    error,
    presets,
    selectedDemo,
    onFileChange,
    handleDownload,
    setPresetId,
    setIntensity,
    setSelectedDemo
  } = useMiniPlayground();
  const [showSignIn, setShowSignIn] = useState(false);
  const { data: session } = authClient.useSession();

  const onDownload = () => {
    if (session) {
      void handleDownload();
    } else {
      setShowSignIn(true);
    }
  };

  return (
    <>
      {showSignIn && (
        <SignInDialog
          onClose={() => setShowSignIn(false)}
          onSuccess={() => setShowSignIn(false)}
        />
      )}
      <div className="rounded-sm border border-card-border bg-canvas p-4 shadow-sm md:p-6">
      <div className="grid gap-4 md:grid-cols-[1fr_280px]">
        <div className="relative flex items-center justify-center overflow-hidden rounded-sm bg-soft-stone">
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
              {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
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
            <Button className="w-full" onClick={onDownload} disabled={isRendering}>
              <HugeiconsIcon icon={Download01Icon} className="h-4 w-4" />
              Download preview
            </Button>
            <Button variant="outline" asChild>
          <Link href="/playground">
            Open full playground
            <HugeiconsIcon icon={ArrowRight01Icon} className="h-4 w-4" />
          </Link>
        </Button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
