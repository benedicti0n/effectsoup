"use client";

import type { JSX } from "react";
import { allPresets } from "@imageeffects/presets";
import { useEditorStore } from "@/store/editorStore";
import { cn } from "@/lib/utils";

export function PresetGrid(): JSX.Element {
  const presetId = useEditorStore((state) => state.effect.presetId);
  const setPresetId = useEditorStore((state) => state.setPresetId);
  const snapshotHistory = useEditorStore((state) => state.snapshotHistory);

  const selectPreset = (id: string) => {
    setPresetId(id);
    snapshotHistory();
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {allPresets.map((preset) => (
        <button
          key={preset.id}
          onClick={() => selectPreset(preset.id)}
          className={cn(
            "rounded-xl border p-4 text-left transition hover:border-neon-blue/50",
            presetId === preset.id
              ? "border-neon-pink bg-neon-pink/10"
              : "border-white/10 bg-surface"
          )}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium text-sm">{preset.name}</span>
            {preset.access === "premium" && (
              <span className="rounded bg-neon-lavender/20 px-1.5 py-0.5 text-[10px] font-mono text-neon-lavender">
                PRO
              </span>
            )}
          </div>
          <p className="text-xs text-white/50">{preset.description}</p>
        </button>
      ))}
    </div>
  );
}
