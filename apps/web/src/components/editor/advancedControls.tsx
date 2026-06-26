"use client";

import type { JSX } from "react";
import { getPresetById, type AdvancedControlDefinition } from "@imageeffects/presets";
import { useEditorStore } from "@/store/editorStore";
import {
  RangeControl,
  SelectControl,
  ColorControl,
  BooleanControl,
  TextControl
} from "./controlFields";

function isControlVisible(
  control: AdvancedControlDefinition,
  resolvedValues: Record<string, number | string | boolean>
): boolean {
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
}

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

  const renderControl = (control: AdvancedControlDefinition) => {
    if (!isControlVisible(control, resolvedValues)) return null;
    const currentValue = resolvedValues[control.id];

    const commonProps = {
      control,
      value: currentValue,
      onChange: (value: number | string | boolean) => setAdvancedOverride(control.id, value),
      onSetKey: (key: string, value: number | string | boolean) => setAdvancedOverride(key, value),
      onCommit: snapshotHistory
    };

    switch (control.type) {
      case "range":
        return <RangeControl key={control.id} {...commonProps} />;
      case "select":
        return <SelectControl key={control.id} {...commonProps} />;
      case "color":
        return <ColorControl key={control.id} {...commonProps} />;
      case "boolean":
        return <BooleanControl key={control.id} {...commonProps} />;
      case "text":
        return <TextControl key={control.id} {...commonProps} />;
      default:
        return null;
    }
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
