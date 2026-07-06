"use client";

import { useState, type JSX } from "react";
import Link from "next/link";
import NextImage from "next/image";
import { allPresets } from "@effectsoup/presets";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  Download01Icon,
  Upload01Icon
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { SignInDialog } from "@/components/auth/signInDialog";
import { useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { useMiniPlayground, MINI_PLAYGROUND_PRESETS } from "@/hooks/useMiniPlayground";

export function HeroSection(): JSX.Element {
  const {
    canvasRef,
    fileInputRef,
    presetId,
    intensity,
    isRendering,
    error,
    preset,
    selectedDemo,
    onFileChange,
    handleDownload,
    setPresetId,
    setIntensity,
    setSelectedDemo
  } = useMiniPlayground();
  const [showSignIn, setShowSignIn] = useState(false);
  const { isSignedIn } = useUser();

  const onDownload = () => {
    if (isSignedIn) {
      void handleDownload();
    } else {
      setShowSignIn(true);
    }
  };

  const activePreset = preset;

  return (
    <section className="overflow-hidden bg-soft-stone/40">
      {showSignIn && (
        <SignInDialog
          onClose={() => setShowSignIn(false)}
          onSuccess={() => setShowSignIn(false)}
        />
      )}
      <div className="mx-auto max-w-container px-4 py-10 lg:px-8 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          {/* Left: editorial copy */}
          <div className="max-w-lg">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-accent md:text-xs">
              Image Effects for Creators &amp; Developers
            </p>
            <h1 className="font-serif-display text-4xl leading-[1.15] tracking-tight text-ink-primary md:text-5xl lg:text-6xl">
              Turn ordinary images into <br />
              <span className="italic text-accent">beautiful</span> effects.
            </h1>
            <p className="mt-5 text-base leading-relaxed text-body-muted md:text-lg">
              Upload a photo, pick a look, and export in seconds. No AI, no uploads
              to a server — every pixel is processed right in your browser.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/playground">Try Playground</Link>
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-muted">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                No credit card
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Instant results
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Export anywhere
              </span>
            </div>
          </div>

          {/* Right: live interactive preview */}
          <div className="min-w-0 rounded-lg border border-hairline bg-canvas p-3 shadow-sm lg:p-6">
            {/* Toolbar */}
            <div className="mb-4 flex items-center gap-2 border-b border-hairline pb-3">
              <span className="h-3 w-3 rounded-full bg-accent/60" />
              <span className="h-3 w-3 rounded-full bg-muted/30" />
              <span className="h-3 w-3 rounded-full bg-muted/30" />
              <span className="ml-auto text-xs font-medium text-muted">
                {activePreset?.name ?? "EffectSoup"}
              </span>
            </div>

            {/* Canvas */}
            <div className="relative mb-4 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-sm bg-soft-stone/60">
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

            {/* Effect selection pills */}
            <div className="mb-3">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted">
                Effects
              </p>
              <div className="flex flex-wrap gap-1.5">
                {MINI_PLAYGROUND_PRESETS.map((id) => {
                  const p = allPresets.find((pr) => pr.id === id);
                  if (!p) return null;
                  const isActive = presetId === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setPresetId(id)}
                      className={cn(
                        "rounded-pill border px-2 py-0.5 text-[10px] font-medium transition-colors md:px-2.5 md:py-1 md:text-[11px]",
                        isActive
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-hairline text-muted hover:border-muted hover:text-ink"
                      )}
                    >
                      {p.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Controls row: intensity + demo photos */}
            <div className="flex items-center gap-3 border-t border-hairline pt-2 lg:pt-3">
              <div className="flex-1">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-muted">Intensity</span>
                  <span className="text-[11px] font-medium text-ink">{intensity}%</span>
                </div>
                <Slider
                  value={intensity}
                  min={0}
                  max={100}
                  step={1}
                  onChange={(event) => setIntensity(Number(event.target.value))}
                />
              </div>
            </div>

            {/* Demo photo thumbnails */}
            <div className="mt-3 flex items-start gap-2">
              <span className="shrink-0 text-[11px] font-medium text-muted">Photo</span>
              <div className="flex flex-wrap gap-1.5">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setSelectedDemo(num)}
                    className={cn(
                      "h-8 w-8 shrink-0 overflow-hidden rounded-sm border transition-colors",
                      selectedDemo === num ? "border-accent" : "border-hairline hover:border-muted"
                    )}
                    aria-label={`Select demo image ${num}`}
                    title={`Demo photo ${num}`}
                  >
                    <NextImage
                      src={`/assets/showcase/img${num}.png`}
                      alt=""
                      width={32}
                      height={32}
                      unoptimized
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-3 flex flex-col gap-2 border-t border-hairline pt-2 md:flex-row md:items-center lg:pt-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={onFileChange}
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1"
                >
                  <HugeiconsIcon icon={Upload01Icon} className="h-3.5 w-3.5" />
                  Upload
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDownload}
                  disabled={isRendering}
                  className="flex-1"
                >
                  <HugeiconsIcon icon={Download01Icon} className="h-3.5 w-3.5" />
                  Download
                </Button>
              </div>
              <div className="w-full md:w-auto">
                <Button size="sm" asChild className="w-full">
                  <Link href="/playground">
                    Open Playground
                    <HugeiconsIcon icon={ArrowRight01Icon} className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
