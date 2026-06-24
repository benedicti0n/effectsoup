"use client";

import type { JSX } from "react";
import { useCallback, useRef, useState } from "react";
import { useEditorStore } from "@/store/editorStore";
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
    <div className="flex h-screen flex-col bg-charcoal text-neon-cream">
      <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="font-mono text-lg font-bold text-neon-pink">effectLab</div>
        <div className="flex items-center gap-3">
          <button
            onClick={undo}
            className="rounded-md border border-white/10 px-3 py-1.5 text-sm hover:bg-white/5"
          >
            Undo
          </button>
          <button
            onClick={redo}
            className="rounded-md border border-white/10 px-3 py-1.5 text-sm hover:bg-white/5"
          >
            Redo
          </button>
          <button
            onClick={resetAll}
            className="rounded-md border border-white/10 px-3 py-1.5 text-sm hover:bg-white/5"
          >
            Reset
          </button>
          {source && (
            <>
              <label className="cursor-pointer rounded-md border border-white/10 px-3 py-1.5 text-sm hover:bg-white/5">
                Replace
                <input
                  ref={replaceInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={onReplaceChange}
                />
              </label>
              <button
                onClick={removeSource}
                className="rounded-md border border-white/10 px-3 py-1.5 text-sm hover:bg-white/5"
              >
                Remove
              </button>
            </>
          )}
          <button
            onClick={() => setShowSave(true)}
            disabled={!source}
            className="rounded-md border border-white/10 px-4 py-1.5 text-sm hover:bg-white/5 disabled:opacity-50"
          >
            Save
          </button>
          <button
            onClick={() => setShowExport(true)}
            disabled={!source}
            className="rounded-md bg-neon-pink px-4 py-1.5 text-sm font-semibold text-white hover:bg-neon-pink/90 disabled:opacity-50"
          >
            Export
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden w-72 flex-col gap-4 overflow-y-auto border-r border-white/10 p-4 md:flex">
          <h2 className="font-mono text-sm text-white/50">Presets</h2>
          <PresetGrid />
        </aside>

        <main className="flex flex-1 flex-col p-4">
          {!source ? (
            <UploadPanel />
          ) : (
            <CanvasPreview />
          )}
          {isRendering && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-surface px-4 py-2 text-xs font-mono text-white/70">
              Rendering…
            </div>
          )}
        </main>

        <aside className="w-80 overflow-y-auto border-l border-white/10 p-4">
          <EffectControls />
        </aside>
      </div>

      <div className="border-t border-white/10 p-4 md:hidden">
        <PresetGrid />
      </div>

      {showExport && <ExportDialog onClose={() => setShowExport(false)} />}
      {showSave && <SaveProjectDialog onClose={() => setShowSave(false)} />}
    </div>
  );
}
