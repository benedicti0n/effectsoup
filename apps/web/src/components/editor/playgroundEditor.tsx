"use client";

import type { JSX } from "react";
import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import NextImage from "next/image";
import { useEditorStore } from "@/store/editorStore";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  Download01Icon,
  RedoIcon,
  UndoIcon,
  Upload01Icon,
  UserIcon
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUser, UserButton, SignInButton } from "@clerk/nextjs";
import { CanvasPreview } from "./canvasPreview";
import { EffectControls } from "./effectControls";
import { ExportDialog } from "./exportDialog";
import { PresetGrid } from "./presetGrid";
import { UploadPanel } from "./uploadPanel";

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const GITHUB_REPO_URL = "https://github.com/benedicti0n/effectsoup";

function GitHubIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4 fill-current">
      <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

export function PlaygroundEditor({ className }: { className?: string } = {}): JSX.Element {
  const source = useEditorStore((state) => state.source);
  const isRendering = useEditorStore((state) => state.isRendering);
  const undo = useEditorStore((state) => state.undo);
  const redo = useEditorStore((state) => state.redo);
  const resetAll = useEditorStore((state) => state.resetAll);
  const replaceSource = useEditorStore((state) => state.replaceSource);
  const removeSource = useEditorStore((state) => state.removeSource);
  const [showExport, setShowExport] = useState(false);
  const [showMobileLibrary, setShowMobileLibrary] = useState(false);
  const [showMobileControls, setShowMobileControls] = useState(false);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const { user } = useUser();

  const handleReplaceFile = useCallback(
    async (file: File) => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        alert("Only JPEG, PNG, and WebP images are supported.");
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        alert("File size must be under 20 MB.");
        return;
      }

      const objectUrl = URL.createObjectURL(file);
      try {
        const image = new Image();
        image.src = objectUrl;
        await new Promise<void>((resolve, reject) => {
          image.onload = () => resolve();
          image.onerror = () => reject(new Error("Failed to load image"));
        });

        const megapixels = (image.width * image.height) / 1_000_000;
        if (megapixels > 25) {
          alert("Image is too large. Maximum decoded size is 25 megapixels.");
          URL.revokeObjectURL(objectUrl);
          return;
        }

        replaceSource({
          localId: crypto.randomUUID(),
          fileName: file.name,
          width: image.width,
          height: image.height,
          objectUrl
        });
      } catch (error) {
        URL.revokeObjectURL(objectUrl);
        throw error;
      }
    },
    [replaceSource]
  );

  const onReplaceChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) void handleReplaceFile(file);
      if (replaceInputRef.current) {
        replaceInputRef.current.value = "";
      }
    },
    [handleReplaceFile]
  );

  return (
    <div className={cn("flex flex-col bg-canvas text-ink-primary", className ?? "h-screen")}>
      {/* Header — editorial style matching SiteHeader */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-hairline bg-canvas px-4 lg:px-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <NextImage
              src="/icon.png"
              alt="EffectSoup"
              width={32}
              height={32}
              className="h-8 w-8 shrink-0"
            />
            <span className="font-serif-display text-lg tracking-tight text-ink-primary">
              EffectSoup
            </span>
          </Link>
          <span className="hidden text-sm text-muted md:inline">/</span>
          <span className="hidden text-sm font-medium text-ink-primary md:inline">
            Playground
          </span>
          {source && (
            <span className="hidden truncate text-sm text-body-muted lg:inline">
              {source.fileName}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Desktop editor tools */}
          <div className="hidden items-center gap-1 md:flex">
            <button
              type="button"
              onClick={undo}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-soft-stone hover:text-ink-primary"
              aria-label="Undo"
              title="Undo"
            >
              <HugeiconsIcon icon={UndoIcon} className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={redo}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-soft-stone hover:text-ink-primary"
              aria-label="Redo"
              title="Redo"
            >
              <HugeiconsIcon icon={RedoIcon} className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={resetAll}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-soft-stone hover:text-ink-primary"
              aria-label="Reset"
              title="Reset"
            >
              <HugeiconsIcon icon={Cancel01Icon} className="h-4 w-4" />
            </button>
          </div>

          <div className="hidden h-6 w-px bg-hairline md:block" />

          {source && (
            <>
              <label className="hidden md:inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-hairline bg-canvas px-3 text-sm font-medium text-ink-primary transition-colors hover:bg-soft-stone">
                <HugeiconsIcon icon={Upload01Icon} className="h-4 w-4" />
                <span className="hidden sm:inline">Replace</span>
                <input
                  ref={replaceInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={onReplaceChange}
                />
              </label>
              <button
                type="button"
                onClick={removeSource}
                className="hidden md:inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-soft-stone hover:text-ink-primary"
                aria-label="Remove image"
                title="Remove image"
              >
                <HugeiconsIcon icon={Cancel01Icon} className="h-4 w-4" />
              </button>
            </>
          )}

          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            title="View on GitHub"
            aria-label="View on GitHub"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-hairline bg-canvas text-ink-primary transition-colors hover:bg-soft-stone"
          >
            <GitHubIcon />
          </a>
          {user ? (
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8 rounded-lg border border-hairline",
                  userButtonTrigger: "focus:shadow-none"
                }
              }}
            />
          ) : (
            <SignInButton mode="modal">
              <Button variant="primary" size="sm">
                <HugeiconsIcon icon={UserIcon} className="h-4 w-4" />
                Sign In
              </Button>
            </SignInButton>
          )}

          {/* Desktop Export */}
          <Button
            onClick={() => setShowExport(true)}
            disabled={!source}
            size="sm"
            className="hidden md:inline-flex"
          >
            <HugeiconsIcon icon={Download01Icon} className="h-4 w-4" />
            Export
          </Button>
        </div>
      </header>

      {/* Mobile: control slab — 2 rows of 3 */}
      <div className="flex flex-col gap-1.5 border-b border-hairline px-4 py-2 md:hidden">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={undo}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-hairline bg-canvas px-2.5 py-1.5 text-sm font-medium text-ink-primary transition-colors hover:bg-soft-stone"
            aria-label="Undo"
            title="Undo"
          >
            <HugeiconsIcon icon={UndoIcon} className="h-4 w-4" />
            <span>Undo</span>
          </button>
          <button
            type="button"
            onClick={redo}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-hairline bg-canvas px-2.5 py-1.5 text-sm font-medium text-ink-primary transition-colors hover:bg-soft-stone"
            aria-label="Redo"
            title="Redo"
          >
            <HugeiconsIcon icon={RedoIcon} className="h-4 w-4" />
            <span>Redo</span>
          </button>
          <button
            type="button"
            onClick={resetAll}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-hairline bg-canvas px-2.5 py-1.5 text-sm font-medium text-ink-primary transition-colors hover:bg-soft-stone"
            aria-label="Reset"
            title="Reset"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="h-4 w-4" />
            <span>Reset</span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <label className="inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-hairline bg-canvas px-2.5 py-1.5 text-sm font-medium text-ink-primary transition-colors hover:bg-soft-stone disabled:cursor-not-allowed disabled:opacity-40">
            <HugeiconsIcon icon={Upload01Icon} className="h-4 w-4" />
            <span>Replace</span>
            <input
              ref={replaceInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={onReplaceChange}
              disabled={!source}
            />
          </label>
          <button
            type="button"
            onClick={removeSource}
            disabled={!source}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-hairline bg-canvas px-2.5 py-1.5 text-sm font-medium text-ink-primary transition-colors hover:bg-soft-stone disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Remove image"
            title="Remove image"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="h-4 w-4" />
            <span>Remove</span>
          </button>
          <button
            type="button"
            onClick={() => setShowExport(true)}
            disabled={!source}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-hairline bg-canvas px-2.5 py-1.5 text-sm font-medium text-ink-primary transition-colors hover:bg-soft-stone disabled:cursor-not-allowed disabled:opacity-40"
          >
            <HugeiconsIcon icon={Download01Icon} className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Main editor area */}
      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden min-h-0 w-72 flex-col gap-4 overflow-y-auto border-r border-hairline bg-soft-stone/20 p-4 md:flex">
          <PresetGrid />
        </aside>

        <main className="relative flex min-h-0 flex-1 flex-col p-4">
          {!source ? <UploadPanel /> : <CanvasPreview />}
          {isRendering && (
            <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-lg border border-hairline bg-canvas px-4 py-2 text-xs font-medium text-muted shadow-sm">
              Rendering…
            </div>
          )}
        </main>

        <aside className="hidden min-h-0 w-80 overflow-y-auto border-l border-hairline bg-canvas p-4 lg:block">
          <EffectControls />
        </aside>
      </div>

      {/* Mobile toolbar — 2 buttons */}
      <div className="flex items-center justify-between border-t border-hairline p-3 md:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => { setShowMobileLibrary((s) => !s); setShowMobileControls(false); }}
        >
          {showMobileLibrary ? "Hide library" : "Show library"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => { setShowMobileControls((s) => !s); setShowMobileLibrary(false); }}
        >
          {showMobileControls ? "Hide controls" : "Show controls"}
        </Button>
      </div>

      {showMobileLibrary && (
        <div className="max-h-[50dvh] overflow-y-auto border-t border-hairline bg-soft-stone/20 p-4 md:hidden">
          <PresetGrid />
        </div>
      )}

      {showMobileControls && (
        <div className="max-h-[50dvh] overflow-y-auto border-t border-hairline bg-canvas p-4 md:hidden">
          <EffectControls />
        </div>
      )}

      {showExport && <ExportDialog onClose={() => setShowExport(false)} />}
    </div>
  );
}
