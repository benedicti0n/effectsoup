"use client";

import type { JSX } from "react";
import { getPresetById } from "@effectsoup/presets";
import { useEditorStore } from "@/store/editorStore";
import { Button } from "@/components/ui/button";
import { AdvancedControls } from "./advancedControls";
import { CropControls } from "./cropControls";

export function EffectControls(): JSX.Element {
  const effect = useEditorStore((state) => state.effect);
  const resetEffect = useEditorStore((state) => state.resetEffect);

  const preset = getPresetById(effect.presetId);
  const presetName = preset?.name ?? effect.presetId;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between border-b border-hairline pb-3">
        <div>
          <h3 className="font-serif-display text-lg tracking-tight text-ink-primary">{presetName}</h3>
        </div>
        <Button variant="secondary" onClick={resetEffect}>
          Reset
        </Button>
      </div>

      <CropControls />

      <AdvancedControls />
    </div>
  );
}
