"use client";

import type { JSX } from "react";
import { useCallback, useRef, useState } from "react";
import { useEditorStore } from "@/store/editorStore";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Cancel01Icon,
  Download01Icon,
  Folder01Icon,
  RedoIcon,
  UndoIcon,
  Upload01Icon
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { CanvasPreview } from "./canvasPreview";
import { EffectControls } from "./effectControls";
import { ExportDialog } from "./exportDialog";
import { PresetGrid } from "./presetGrid";
import { SaveProjectDialog } from "./saveProjectDialog";
import { UploadPanel } from "./uploadPanel";

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function EditorShell(): JSX.Element {
  const source = useEditorStore((state) => state.source);
  const isRendering = useEditorStore((state) => state.isRendering);
  const undo = useEditorStore((state) => state.undo);
  const redo = useEditorStore((state) => state.redo);
  const resetAll = useEditorStore((state) => state.resetAll);
  const replaceSource = useEditorStore((state) => state.replaceSource);
  const removeSource = useEditorStore((state) => state.removeSource);
  const [showExport, setShowExport] = useState(false);
  const [showSave, setShowSave] = useState(false);
  const replaceInputRef = useRef<HTMLInputElement>(null);

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
    <div className="flex h-screen flex-col bg-canvas text-ink">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-hairline px-4">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="inline-flex h-8 items-center gap-1 rounded-sm border border-hairline px-2 font-mono text-sm font-bold text-ink hover:bg-surface-soft"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="h-4 w-4" />
            effectLab
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <IconButton onClick={undo} label="Undo" icon={<HugeiconsIcon icon={UndoIcon} className="h-4 w-4" />} />
          <IconButton onClick={redo} label="Redo" icon={<HugeiconsIcon icon={RedoIcon} className="h-4 w-4" />} />
          <IconButton onClick={resetAll} label="Reset" icon={<HugeiconsIcon icon={Cancel01Icon} className="h-4 w-4" />} />
          {source && (
            <>
              <label className="inline-flex h-8 cursor-pointer items-center gap-1 rounded-sm border border-hairline bg-canvas px-3 font-mono text-sm text-ink hover:bg-surface-soft">
                <HugeiconsIcon icon={Upload01Icon} className="h-4 w-4" />
                Replace
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
          <IconButton
            onClick={() => setShowSave(true)}
            label="Save"
            disabled={!source}
            icon={<HugeiconsIcon icon={Folder01Icon} className="h-4 w-4" />}
          />
          <button
            onClick={() => setShowExport(true)}
            disabled={!source}
            className="inline-flex h-8 items-center gap-1 rounded-sm bg-ink px-4 font-mono text-sm font-medium text-canvas hover:bg-ink-deep disabled:bg-surface-card disabled:text-ash"
          >
            <HugeiconsIcon icon={Download01Icon} className="h-4 w-4" />
            Export
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden w-64 flex-col gap-4 overflow-y-auto border-r border-hairline p-4 md:flex">
          <h2 className="font-mono text-sm font-bold text-mute">Presets</h2>
          <PresetGrid />
        </aside>

        <main className="relative flex flex-1 flex-col p-4">
          {!source ? <UploadPanel /> : <CanvasPreview />}
          {isRendering && (
            <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-sm border border-hairline bg-canvas px-4 py-2 font-mono text-xs text-mute shadow-sm">
              Rendering…
            </div>
          )}
        </main>

        <aside className="w-80 overflow-y-auto border-l border-hairline p-4">
          <EffectControls />
        </aside>
      </div>

      <div className="border-t border-hairline p-4 md:hidden">
        <PresetGrid />
      </div>

      {showExport && <ExportDialog onClose={() => setShowExport(false)} />}
      {showSave && <SaveProjectDialog onClose={() => setShowSave(false)} />}
    </div>
  );
}

function IconButton({
  onClick,
  label,
  icon,
  disabled = false
}: {
  onClick: () => void;
  label: string;
  icon: JSX.Element;
  disabled?: boolean;
}): JSX.Element {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      className="inline-flex h-8 items-center gap-1 rounded-sm border border-hairline bg-canvas px-3 font-mono text-sm text-ink hover:bg-surface-soft disabled:bg-surface-card disabled:text-ash"
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
