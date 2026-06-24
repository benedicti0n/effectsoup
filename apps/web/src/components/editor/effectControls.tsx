"use client";

import type { JSX } from "react";
import { useState } from "react";
import { getPresetById } from "@imageeffects/presets";
import { useEditorStore } from "@/store/editorStore";
import { AdvancedControls } from "./advancedControls";
import { CropControls } from "./cropControls";
import { EditableSlider } from "./editableSlider";

export function EffectControls(): JSX.Element {
  const effect = useEditorStore((state) => state.effect);
  const setIntensity = useEditorStore((state) => state.setIntensity);
  const snapshotHistory = useEditorStore((state) => state.snapshotHistory);
  const resetEffect = useEditorStore((state) => state.resetEffect);
  const [showAdvanced, setShowAdvanced] = useState(false);

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

      <EditableSlider
        id="intensity"
        label="Intensity"
        value={effect.intensity}
        min={0}
        max={100}
        step={1}
        unit="%"
        onChange={setIntensity}
        onCommit={snapshotHistory}
      />

      <button
        onClick={() => setShowAdvanced((s) => !s)}
        className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-surface px-4 py-2 text-sm hover:bg-white/5"
      >
        <span>Advanced Controls</span>
        <span className="text-white/50">{showAdvanced ? "−" : "+"}</span>
      </button>

      <CropControls />

      {showAdvanced && <AdvancedControls />}
    </div>
  );
}
