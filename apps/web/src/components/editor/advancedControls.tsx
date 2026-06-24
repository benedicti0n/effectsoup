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
    // Hide custom charset/symbols inputs unless the corresponding set is "custom".
    if (control.id === "customCharset") {
      return resolvedValues.characterSet === "custom";
    }
    if (control.id === "customSymbols") {
      return resolvedValues.symbolSet === "custom";
    }
    // Hide tint controls unless Color Mode is "tint".
    if (control.id === "tintColor" || control.id === "tintPreset") {
      return resolvedValues.colorMode === "tint";
    }
    // Hide ink color unless Color Mode is "monochrome".
    if (control.id === "inkColor") {
      return resolvedValues.colorMode === "monochrome";
    }
    // Symbol Glow: palette picker only matters in palette mode.
    if (control.id === "palette") {
      return resolvedValues.colorMode === "palette";
    }
    // Symbol Glow: glyph color is the symbol tint in non-palette modes.
    if (control.id === "glyphColor") {
      return resolvedValues.colorMode !== "palette";
    }
    // Hide accent color unless Cyber ASCII tint mode is active.
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
          <label htmlFor={control.id} className="text-xs text-white/70">
            {control.name}
          </label>
          <select
            id={control.id}
            value={currentValue as string}
            onChange={(e) => {
              const value = e.target.value;
              setAdvancedOverride(control.id, value);
              // Cyber ASCII tint preset changes should update the tint color too.
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
            className="w-full rounded-md border border-white/10 bg-ink px-3 py-2 text-sm text-white outline-none focus:border-neon-blue"
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
      return (
        <div key={control.id} className="flex items-center justify-between">
          <label htmlFor={control.id} className="text-xs text-white/70">
            {control.name}
          </label>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-white/50">{String(currentValue)}</span>
            <input
              id={control.id}
              type="color"
              value={currentValue as string}
              onChange={(e) => setAdvancedOverride(control.id, e.target.value)}
              onBlur={snapshotHistory}
              className="h-8 w-8 cursor-pointer rounded border border-white/10 bg-transparent"
            />
          </div>
        </div>
      );
    }

    if (control.type === "boolean") {
      return (
        <div key={control.id} className="flex items-center justify-between">
          <label htmlFor={control.id} className="text-xs text-white/70">
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
            className="h-4 w-4 accent-neon-pink"
          />
        </div>
      );
    }

    if (control.type === "text") {
      return (
        <div key={control.id} className="space-y-1">
          <label htmlFor={control.id} className="text-xs text-white/70">
            {control.name}
          </label>
          <input
            id={control.id}
            type="text"
            value={String(currentValue)}
            onChange={(e) => setAdvancedOverride(control.id, e.target.value)}
            onBlur={snapshotHistory}
            className="w-full rounded-md border border-white/10 bg-ink px-3 py-2 text-sm text-white outline-none focus:border-neon-blue"
          />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-4 rounded-lg border border-white/10 bg-ink p-4">
      <div className="flex items-center justify-between">
        <h4 className="font-mono text-sm text-neon-lavender">Advanced</h4>
        <button
          onClick={resetAdvancedOverrides}
          className="text-xs text-white/50 hover:text-white underline"
        >
          Reset overrides
        </button>
      </div>
      <div className="space-y-4">{schema.map(renderControl)}</div>
    </div>
  );
}
