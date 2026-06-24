"use client";

import type { JSX } from "react";
import { useEditorStore } from "@/store/editorStore";

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
    <div className="space-y-4 rounded-lg border border-white/10 bg-ink p-4">
      <h4 className="font-mono text-sm text-neon-lavender">Crop</h4>

      <div className="grid grid-cols-5 gap-1">
        {ASPECT_RATIOS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => {
              updateCrop({ aspectRatio: value });
              snapshotHistory();
            }}
            className={`rounded-md px-2 py-1.5 text-xs ${
              crop.aspectRatio === value
                ? "bg-neon-pink/20 text-neon-pink"
                : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div>
        <label className="mb-1 block text-xs text-white/70">Zoom</label>
        <input
          type="range"
          min={1}
          max={3}
          step={0.05}
          value={crop.zoom}
          onChange={(e) => updateCrop({ zoom: Number(e.target.value) })}
          onMouseUp={snapshotHistory}
          onTouchEnd={snapshotHistory}
          className="w-full accent-neon-blue"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs text-white/70">Offset X</label>
          <input
            type="range"
            min={-1}
            max={1}
            step={0.05}
            value={crop.offsetX}
            onChange={(e) => updateCrop({ offsetX: Number(e.target.value) })}
            onMouseUp={snapshotHistory}
            onTouchEnd={snapshotHistory}
            className="w-full accent-neon-blue"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-white/70">Offset Y</label>
          <input
            type="range"
            min={-1}
            max={1}
            step={0.05}
            value={crop.offsetY}
            onChange={(e) => updateCrop({ offsetY: Number(e.target.value) })}
            onMouseUp={snapshotHistory}
            onTouchEnd={snapshotHistory}
            className="w-full accent-neon-blue"
          />
        </div>
      </div>
    </div>
  );
}
