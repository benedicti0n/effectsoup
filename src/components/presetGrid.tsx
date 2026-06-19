"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { PRESETS } from "@/lib/presets/presets";
import { useEditorStore } from "@/store/useEditorStore";
import { Card } from "@/components/ui/card";

export function PresetGrid() {
  const applyPreset = useEditorStore((state) => state.applyPreset);
  const selectedPresetId = useEditorStore((state) => state.selectedPresetId);

  return (
    <div className="grid grid-cols-2 gap-2">
      {PRESETS.map((preset) => (
        <Card
          key={preset.id}
          onClick={() => applyPreset(preset)}
          className={cn(
            "cursor-pointer p-3 transition-colors hover:bg-accent",
            selectedPresetId === preset.id && "ring-2 ring-primary"
          )}
        >
          <p className="text-sm font-medium">{preset.name}</p>
        </Card>
      ))}
    </div>
  );
}
