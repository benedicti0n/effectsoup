"use client";

import type { JSX } from "react";
import { useEditorStore } from "@/store/editorStore";
import { cn } from "@/lib/utils";
import { EditableSlider } from "./editableSlider";

const ASPECT_RATIOS: Array<{ value: CropValue; label: string }> = [
  { value: "original", label: "Original" },
  { value: "1:1", label: "1:1" },
  { value: "4:5", label: "4:5" },
  { value: "9:16", label: "9:16" },
  { value: "16:9", label: "16:9" }
];

type CropValue = "original" | "1:1" | "4:5" | "9:16" | "16:9";

export function CropControls(): JSX.Element {
  const crop = useEditorStore((state) => state.crop);
  const setCrop = useEditorStore((state) => state.setCrop);
  const snapshotHistory = useEditorStore((state) => state.snapshotHistory);

  const updateCrop = (updates: Partial<typeof crop>) => {
    setCrop({ ...crop, ...updates });
  };

  return (
    <div className="space-y-4 rounded-sm border border-hairline bg-soft-stone/30 p-4">
      <h4 className="text-sm font-medium text-ink-primary">Crop</h4>

      <div className="grid grid-cols-5 gap-1">
        {ASPECT_RATIOS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => {
              updateCrop({ aspectRatio: value });
              snapshotHistory();
            }}
            className={cn(
              "rounded-sm border px-2 py-1.5 text-xs font-medium transition-colors",
              crop.aspectRatio === value
                ? "border-ink-primary bg-ink-primary text-on-primary"
                : "border-hairline bg-canvas text-muted hover:border-muted"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <EditableSlider
        id="zoom"
        label="Zoom"
        value={crop.zoom}
        min={1}
        max={3}
        step={0.05}
        unit="x"
        onChange={(value) => updateCrop({ zoom: value })}
        onCommit={snapshotHistory}
      />

      <div className="grid grid-cols-2 gap-3">
        <EditableSlider
          id="offsetX"
          label="Offset X"
          value={crop.offsetX}
          min={-1}
          max={1}
          step={0.05}
          onChange={(value) => updateCrop({ offsetX: value })}
          onCommit={snapshotHistory}
        />
        <EditableSlider
          id="offsetY"
          label="Offset Y"
          value={crop.offsetY}
          min={-1}
          max={1}
          step={0.05}
          onChange={(value) => updateCrop({ offsetY: value })}
          onCommit={snapshotHistory}
        />
      </div>
    </div>
  );
}
