"use client";

import type { JSX } from "react";
import { useState } from "react";
import { getPresetById } from "@effectsoup/presets";
import { useEditorStore } from "@/store/editorStore";
import { Button } from "@/components/ui/button";
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
  const showIntensitySlider = preset?.usesIntensity !== false;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between border-b border-hairline pb-3">
        <div>
          <h3 className="font-display text-lg font-medium text-ink-primary">{presetName}</h3>
        </div>
        <Button variant="secondary" onClick={resetEffect}>
          Reset
        </Button>
      </div>

      {showIntensitySlider && (
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
      )}

      <CropControls />

      {showIntensitySlider ? (
        <>
          <Button
            variant="outline"
            onClick={() => setShowAdvanced((s) => !s)}
            className="w-full justify-between"
          >
            <span>Advanced Controls</span>
            <span className="text-muted">{showAdvanced ? "−" : "+"}</span>
          </Button>

          {showAdvanced && <AdvancedControls />}
        </>
      ) : (
        <AdvancedControls />
      )}
    </div>
  );
}
