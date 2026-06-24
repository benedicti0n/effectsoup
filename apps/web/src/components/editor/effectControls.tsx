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
      <div className="flex items-center justify-between border-b border-hairline pb-3">
        <h3 className="font-mono text-base font-bold text-ink">{presetName}</h3>
        <button
          onClick={resetEffect}
          className="font-mono text-xs text-mute underline hover:text-ink"
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
        className="flex w-full items-center justify-between rounded-sm border border-hairline bg-surface-soft px-4 py-2 font-mono text-sm text-ink hover:bg-surface-card"
      >
        <span>Advanced Controls</span>
        <span className="text-mute">{showAdvanced ? "[-]" : "[+]"}</span>
      </button>

      <CropControls />

      {showAdvanced && <AdvancedControls />}
    </div>
  );
}
