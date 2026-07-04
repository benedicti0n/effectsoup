"use client";

import type { JSX } from "react";
import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { useEditorStore } from "@/store/editorStore";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Cancel01Icon,
  Download01Icon,
  RedoIcon,
  UndoIcon,
  Upload01Icon,
  UserIcon
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/authClient";
import { CanvasPreview } from "./canvasPreview";
import { EffectControls } from "./effectControls";
import { ExportDialog } from "./exportDialog";
import { PresetGrid } from "./presetGrid";
import { UploadPanel } from "./uploadPanel";
import { IconButton } from "./iconButton";

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const GITHUB_REPO_URL = "https://github.com/benedicti0n/effectsoup";

function GitHubIcon(): JSX.Element {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="h-4 w-4 fill-current"
    >
      <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

export function EditorShell({ className }: { className?: string } = {}): JSX.Element {
  const source = useEditorStore((state) => state.source);
  const isRendering = useEditorStore((state) => state.isRendering);
  const undo = useEditorStore((state) => state.undo);
  const redo = useEditorStore((state) => state.redo);
  const resetAll = useEditorStore((state) => state.resetAll);
  const replaceSource = useEditorStore((state) => state.replaceSource);
  const removeSource = useEditorStore((state) => state.removeSource);
  const [showExport, setShowExport] = useState(false);
  const [showMobileLibrary, setShowMobileLibrary] = useState(false);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const { data: session } = authClient.useSession();

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
    <div className={cn("flex flex-col overflow-hidden bg-canvas text-ink", className ?? "h-screen")}>
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-hairline px-4">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="inline-flex h-8 items-center gap-1.5 rounded-sm border border-hairline px-3 text-sm font-medium text-ink hover:bg-soft-stone"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="h-4 w-4" />
            EffectSoup
          </Link>
          {source && (
            <span className="hidden truncate text-sm text-body-muted md:inline">
              {source.fileName}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <IconButton onClick={undo} label="Undo" icon={<HugeiconsIcon icon={UndoIcon} className="h-4 w-4" />} />
          <IconButton onClick={redo} label="Redo" icon={<HugeiconsIcon icon={RedoIcon} className="h-4 w-4" />} />
          <IconButton onClick={resetAll} label="Reset" icon={<HugeiconsIcon icon={Cancel01Icon} className="h-4 w-4" />} />

          {source && (
            <>
              <label className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-sm border border-hairline bg-canvas px-3 text-sm font-medium text-ink hover:bg-soft-stone">
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
              <IconButton
                onClick={removeSource}
                label="Remove"
                icon={<HugeiconsIcon icon={Cancel01Icon} className="h-4 w-4" />}
              />
            </>
          )}

          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            title="View on GitHub"
            aria-label="View on GitHub"
            className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-hairline bg-canvas text-ink hover:bg-soft-stone"
          >
            <GitHubIcon />
          </a>
          <Link
            href="/account"
            title={session?.user.email ?? "Account"}
            aria-label="Account"
            className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-hairline bg-canvas text-ink hover:bg-soft-stone"
          >
            <HugeiconsIcon icon={UserIcon} className="h-4 w-4" />
          </Link>

          <Button
            onClick={() => setShowExport(true)}
            disabled={!source}
            size="sm"
          >
            <HugeiconsIcon icon={Download01Icon} className="h-4 w-4" />
            Export
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden min-h-0 w-72 flex-col gap-4 overflow-y-auto border-r border-hairline bg-soft-stone/20 p-4 md:flex">
          <PresetGrid />
        </aside>

        <main className="relative flex min-h-0 flex-1 flex-col p-4">
          {!source ? <UploadPanel /> : <CanvasPreview />}
          {isRendering && (
            <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-sm border border-hairline bg-canvas px-4 py-2 text-xs font-medium text-muted shadow-sm">
              Rendering…
            </div>
          )}
        </main>

        <aside className="hidden min-h-0 w-80 overflow-y-auto border-l border-hairline bg-canvas p-4 lg:block">
          <EffectControls />
        </aside>
      </div>

      <div className="flex items-center justify-between border-t border-hairline p-3 md:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowMobileLibrary((s) => !s)}
        >
          {showMobileLibrary ? "Hide library" : "Show library"}
        </Button>
        <Button variant="outline" size="sm" onClick={() => setShowExport(true)} disabled={!source}>
          Export
        </Button>
      </div>

      {showMobileLibrary && (
        <div className="border-t border-hairline bg-soft-stone/20 p-4 md:hidden">
          <PresetGrid />
        </div>
      )}

      {showExport && <ExportDialog onClose={() => setShowExport(false)} />}
    </div>
  );
}
