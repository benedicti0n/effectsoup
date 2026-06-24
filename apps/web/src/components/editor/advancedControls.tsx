"use client";

import type { JSX } from "react";
import { getPresetById, type AdvancedControlDefinition } from "@imageeffects/presets";
import { useEditorStore } from "@/store/editorStore";
import { EditableSlider } from "./editableSlider";

export function AdvancedControls(): JSX.Element {
  const effect = useEditorStore((state) => state.effect);
  const setAdvancedOverride = useEditorStore((state) => state.setAdvancedOverride);
  const resetAdvancedOverrides = useEditorStore((state) => state.resetAdvancedOverrides);
  const snapshotHistory = useEditorStore((state) => state.snapshotHistory);

  const preset = getPresetById(effect.presetId);
  const schema = preset?.advancedControlSchema ?? [];
  const resolvedValues: Record<string, number | string | boolean> = {};
  for (const control of schema) {
    resolvedValues[control.id] = effect.advancedOverrides[control.id] ?? control.defaultValue;
  }

  const isVisible = (control: AdvancedControlDefinition): boolean => {
    if (control.id === "customCharset") {
      return resolvedValues.characterSet === "custom";
    }
    if (control.id === "customSymbols") {
      return resolvedValues.symbolSet === "custom";
    }
    if (control.id === "tintColor" || control.id === "tintPreset") {
      return resolvedValues.colorMode === "tint";
    }
    if (control.id === "inkColor") {
      return resolvedValues.colorMode === "monochrome";
    }
    if (control.id === "palette") {
      return resolvedValues.colorMode === "palette";
    }
    if (control.id === "glyphColor") {
      return resolvedValues.colorMode !== "palette";
    }
    if (control.id === "accentColor") {
      return resolvedValues.colorMode === "tint";
    }
    return true;
  };

  const renderControl = (control: AdvancedControlDefinition) => {
    if (!isVisible(control)) return null;
    const currentValue = resolvedValues[control.id];

    if (control.type === "range") {
      const min = control.min ?? 0;
      const max = control.max ?? 100;
      const step = control.step ?? 1;
      const unit =
        control.name.toLowerCase().includes("opacity") ||
        control.name.toLowerCase().includes("strength") ||
        control.name.toLowerCase().includes("saturation") ||
        control.name.toLowerCase().includes("amount") ||
        control.id === "glowStrength" ||
        control.id === "baseOpacity"
          ? "%"
          : "";
      return (
        <EditableSlider
          key={control.id}
          id={control.id}
          label={control.name}
          value={currentValue as number}
          min={min}
          max={max}
          step={step}
          unit={unit}
          onChange={(value) => setAdvancedOverride(control.id, value)}
          onCommit={snapshotHistory}
        />
      );
    }

    if (control.type === "select") {
      return (
        <div key={control.id} className="space-y-1">
          <label htmlFor={control.id} className="font-mono text-xs text-mute">
            {control.name}
          </label>
          <select
            id={control.id}
            value={currentValue as string}
            onChange={(e) => {
              const value = e.target.value;
              setAdvancedOverride(control.id, value);
              if (control.id === "tintPreset") {
                const colors: Record<string, string> = {
                  terminalGreen: "#00FF88",
                  electricCyan: "#00f0ff",
                  amberCrt: "#FFB000",
                  violetCode: "#B388FF"
                };
                if (colors[value]) {
                  setAdvancedOverride("tintColor", colors[value]);
                }
              }
              snapshotHistory();
            }}
            className="h-10 w-full rounded-sm border border-hairline bg-surface-soft px-3 font-mono text-sm text-ink outline-none focus:border-ink"
          >
            {control.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      );
    }

    if (control.type === "color") {
      const shuffleColor = () => {
        const randomHex =
          "#" +
          Array.from({ length: 3 }, () =>
            Math.floor(Math.random() * 256)
              .toString(16)
              .padStart(2, "0")
          ).join("");
        setAdvancedOverride(control.id, randomHex);
        snapshotHistory();
      };
      const showShuffle = control.id === "shadowColor" || control.id === "highlightColor";

      return (
        <div key={control.id} className="flex items-center justify-between">
          <label htmlFor={control.id} className="font-mono text-xs text-mute">
            {control.name}
          </label>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-mute">{String(currentValue)}</span>
            {showShuffle && (
              <button
                type="button"
                onClick={shuffleColor}
                title={`Shuffle ${control.name}`}
                className="rounded-sm border border-hairline bg-surface-soft px-2 py-1 font-mono text-xs text-mute hover:border-ink hover:text-ink"
              >
                Shuffle
              </button>
            )}
            <input
              id={control.id}
              type="color"
              value={currentValue as string}
              onChange={(e) => setAdvancedOverride(control.id, e.target.value)}
              onBlur={snapshotHistory}
              className="h-8 w-8 cursor-pointer rounded-sm border border-hairline bg-transparent"
            />
          </div>
        </div>
      );
    }

    if (control.type === "boolean") {
      return (
        <div key={control.id} className="flex items-center justify-between">
          <label htmlFor={control.id} className="font-mono text-xs text-mute">
            {control.name}
          </label>
          <input
            id={control.id}
            type="checkbox"
            checked={currentValue as boolean}
            onChange={(e) => {
              setAdvancedOverride(control.id, e.target.checked);
              snapshotHistory();
            }}
            className="h-4 w-4 accent-ink"
          />
        </div>
      );
    }

    if (control.type === "text") {
      return (
        <div key={control.id} className="space-y-1">
          <label htmlFor={control.id} className="font-mono text-xs text-mute">
            {control.name}
          </label>
          <input
            id={control.id}
            type="text"
            value={String(currentValue)}
            onChange={(e) => setAdvancedOverride(control.id, e.target.value)}
            onBlur={snapshotHistory}
            className="h-10 w-full rounded-sm border border-hairline bg-surface-soft px-3 font-mono text-sm text-ink outline-none focus:border-ink"
          />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-4 rounded-sm border border-hairline bg-surface-soft p-4">
      <div className="flex items-center justify-between border-b border-hairline pb-2">
        <h4 className="font-mono text-sm font-bold text-ink">Advanced</h4>
        <button
          onClick={resetAdvancedOverrides}
          className="font-mono text-xs text-mute underline hover:text-ink"
        >
          Reset overrides
        </button>
      </div>
      <div className="space-y-4">{schema.map(renderControl)}</div>
    </div>
  );
}
