"use client";

import type { JSX } from "react";
import type { AdvancedControlDefinition } from "@imageeffects/presets";
import { EditableSlider } from "./editableSlider";

const TINT_PRESET_COLORS: Record<string, string> = {
  terminalGreen: "#00FF88",
  electricCyan: "#00f0ff",
  amberCrt: "#FFB000",
  violetCode: "#B388FF"
};

type ControlProps = {
  control: AdvancedControlDefinition;
  value: number | string | boolean;
  onChange: (value: number | string | boolean) => void;
  onSetKey: (key: string, value: number | string | boolean) => void;
  onCommit: () => void;
};

export function RangeControl({ control, value, onChange, onCommit }: ControlProps): JSX.Element {
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
      id={control.id}
      label={control.name}
      value={value as number}
      min={min}
      max={max}
      step={step}
      unit={unit}
      onChange={(newValue) => onChange(newValue)}
      onCommit={onCommit}
    />
  );
}

export function SelectControl({ control, value, onChange, onSetKey, onCommit }: ControlProps): JSX.Element {
  return (
    <div className="space-y-1">
      <label htmlFor={control.id} className="font-mono text-xs text-mute">
        {control.name}
      </label>
      <select
        id={control.id}
        value={value as string}
        onChange={(e) => {
          const newValue = e.target.value;
          onChange(newValue);
          if (control.id === "tintPreset" && TINT_PRESET_COLORS[newValue]) {
            onSetKey("tintColor", TINT_PRESET_COLORS[newValue]);
          }
          onCommit();
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

export function ColorControl({ control, value, onChange, onCommit }: ControlProps): JSX.Element {
  const shuffleColor = () => {
    const randomHex =
      "#" +
      Array.from({ length: 3 }, () =>
        Math.floor(Math.random() * 256)
          .toString(16)
          .padStart(2, "0")
      ).join("");
    onChange(randomHex);
    onCommit();
  };
  const showShuffle = control.id === "shadowColor" || control.id === "highlightColor";

  return (
    <div className="flex items-center justify-between">
      <label htmlFor={control.id} className="font-mono text-xs text-mute">
        {control.name}
      </label>
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs text-mute">{String(value)}</span>
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
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onCommit}
          className="h-8 w-8 cursor-pointer rounded-sm border border-hairline bg-transparent"
        />
      </div>
    </div>
  );
}

export function BooleanControl({ control, value, onChange, onCommit }: ControlProps): JSX.Element {
  return (
    <div className="flex items-center justify-between">
      <label htmlFor={control.id} className="font-mono text-xs text-mute">
        {control.name}
      </label>
      <input
        id={control.id}
        type="checkbox"
        checked={value as boolean}
        onChange={(e) => {
          onChange(e.target.checked);
          onCommit();
        }}
        className="h-4 w-4 accent-ink"
      />
    </div>
  );
}

export function TextControl({ control, value, onChange, onCommit }: ControlProps): JSX.Element {
  return (
    <div className="space-y-1">
      <label htmlFor={control.id} className="font-mono text-xs text-mute">
        {control.name}
      </label>
      <input
        id={control.id}
        type="text"
        value={String(value)}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onCommit}
        className="h-10 w-full rounded-sm border border-hairline bg-surface-soft px-3 font-mono text-sm text-ink outline-none focus:border-ink"
      />
    </div>
  );
}
