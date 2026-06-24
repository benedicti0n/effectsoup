"use client";

import type { JSX } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { CrownIcon } from "@hugeicons/core-free-icons";
import { allPresets, type EffectPreset, type PresetCategory } from "@imageeffects/presets";
import { useEditorStore } from "@/store/editorStore";
import { cn } from "@/lib/utils";

const categoryLabels: Record<PresetCategory, string> = {
  printGrid: "Print & Grid",
  asciiSymbols: "ASCII & Symbols",
  atmosphereGlow: "Atmosphere & Glow"
};

export function PresetGrid(): JSX.Element {
  const presetId = useEditorStore((state) => state.effect.presetId);
  const setPresetId = useEditorStore((state) => state.setPresetId);
  const snapshotHistory = useEditorStore((state) => state.snapshotHistory);

  const selectPreset = (id: string) => {
    setPresetId(id);
    snapshotHistory();
  };

  const grouped = allPresets.reduce<Record<PresetCategory, EffectPreset[]>>((acc, preset) => {
    acc[preset.category] = acc[preset.category] ?? [];
    acc[preset.category].push(preset);
    return acc;
  }, { printGrid: [], asciiSymbols: [], atmosphereGlow: [] });

  return (
    <div className="space-y-6">
      {(Object.keys(grouped) as PresetCategory[]).map((category) => (
        <div key={category}>
          <h3 className="mb-2 font-mono text-xs font-bold uppercase tracking-wider text-mute">
            {categoryLabels[category]}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {grouped[category].map((preset) => (
              <button
                key={preset.id}
                onClick={() => selectPreset(preset.id)}
                className={cn(
                  "rounded-sm border p-3 text-left transition hover:border-ink",
                  presetId === preset.id
                    ? "border-ink bg-surface-soft"
                    : "border-hairline bg-canvas"
                )}
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-mono text-sm font-medium text-ink">{preset.name}</span>
                  {preset.access === "premium" && (
                    <HugeiconsIcon icon={CrownIcon} className="h-3.5 w-3.5 text-mute" />
                  )}
                </div>
                <p className="font-mono text-xs text-mute">{preset.description}</p>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
