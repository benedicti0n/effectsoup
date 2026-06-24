"use client";

import type { JSX } from "react";
import { useState } from "react";
import { useEditorStore } from "@/store/editorStore";
import { CanvasPreview } from "./canvasPreview";
import { EffectControls } from "./effectControls";
import { ExportDialog } from "./exportDialog";
import { PresetGrid } from "./presetGrid";
import { UploadPanel } from "./uploadPanel";

export function EditorShell(): JSX.Element {
  const source = useEditorStore((state) => state.source);
  const isRendering = useEditorStore((state) => state.isRendering);
  const undo = useEditorStore((state) => state.undo);
  const redo = useEditorStore((state) => state.redo);
  const resetAll = useEditorStore((state) => state.resetAll);
  const [showExport, setShowExport] = useState(false);

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
    </div>
  );
}
