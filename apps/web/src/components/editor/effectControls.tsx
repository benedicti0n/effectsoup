"use client";

import type { JSX } from "react";
import { getPresetById } from "@imageeffects/presets";
import { useEditorStore } from "@/store/editorStore";

export function EffectControls(): JSX.Element {
  const effect = useEditorStore((state) => state.effect);
  const setIntensity = useEditorStore((state) => state.setIntensity);
  const snapshotHistory = useEditorStore((state) => state.snapshotHistory);
  const resetEffect = useEditorStore((state) => state.resetEffect);

  const preset = getPresetById(effect.presetId);
  const presetName = preset?.name ?? effect.presetId;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-mono text-neon-lavender">{presetName}</h3>
        <button
          onClick={resetEffect}
          className="text-xs text-white/50 hover:text-white underline"
        >
          Reset
        </button>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Intensity</label>
        <input
          type="range"
          min={0}
          max={100}
          value={effect.intensity}
          onChange={(e) => setIntensity(Number(e.target.value))}
          onMouseUp={snapshotHistory}
          onTouchEnd={snapshotHistory}
          className="w-full accent-neon-pink"
        />
        <div className="mt-1 text-right font-mono text-xs text-white/50">{effect.intensity}%</div>
      </div>

      <div className="rounded-lg border border-white/10 bg-ink p-4">
        <p className="text-xs text-white/50">
          Advanced controls and export options will appear here as the editor evolves.
        </p>
      </div>
    </div>
  );
}
