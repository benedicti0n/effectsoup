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
    <section className="bg-soft-stone/40">
      {showSignIn && (
        <SignInDialog
          onClose={() => setShowSignIn(false)}
          onSuccess={() => setShowSignIn(false)}
        />
      )}
      <div className="mx-auto max-w-container px-4 py-16 lg:px-8 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: editorial copy as a bigger card */}
          <div className="rounded-lg border border-hairline bg-canvas p-6 shadow-sm lg:p-8">
            <h1 className="font-serif-display text-3xl leading-[1.2] tracking-tight text-ink-primary md:text-4xl lg:text-5xl">
              Beautiful results <br />
              <span className="italic text-accent">in a few clicks.</span>
            </h1>
            <p className="mt-4 text-base leading-relaxed text-body-muted md:text-lg">
              Made for creators, developers, and curious visual people.
            </p>
            <div className="mt-6 space-y-2">
              {["No subscriptions", "No watermarks", "No hidden limits"].map(
                (item) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs text-accent">
                      ✓
                    </span>
                    <span className="text-sm font-medium text-ink">{item}</span>
                  </div>
                )
              )}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/playground">Try Playground</Link>
              </Button>
            </div>
          </div>

          {/* Right: live interactive preview */}
          <div className="rounded-lg border border-hairline bg-canvas p-4 shadow-sm lg:p-6">
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
                        "rounded-pill border px-2.5 py-1 text-[11px] font-medium transition-colors",
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
            <div className="flex items-center gap-4 border-t border-hairline pt-3">
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
            <div className="mt-3 flex items-center gap-2">
              <span className="shrink-0 text-[11px] font-medium text-muted">Photo</span>
              <div className="flex gap-1.5 overflow-x-auto">
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
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-hairline pt-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={onFileChange}
              />
              <Button
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <HugeiconsIcon icon={Upload01Icon} className="h-3.5 w-3.5" />
                Upload
              </Button>
              <Button
                size="sm"
                onClick={onDownload}
                disabled={isRendering}
              >
                <HugeiconsIcon icon={Download01Icon} className="h-3.5 w-3.5" />
                Download
              </Button>
              <Button variant="outline" size="sm" className="ml-auto" asChild>
                <Link href="/playground">
                  Open Playground
                  <HugeiconsIcon icon={ArrowRight01Icon} className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
