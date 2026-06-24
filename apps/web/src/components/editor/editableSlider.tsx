"use client";

import type { JSX } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

export type EditableSliderProps = {
  id?: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: "%" | "px" | "x" | "";
  onChange: (value: number) => void;
  onCommit?: () => void;
  disabled?: boolean;
};

function snapToStep(value: number, step: number): number {
  if (step === 0) return value;
  const inverse = 1 / step;
  return Math.round(value * inverse) / inverse;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function formatValue(value: number, unit: string): string {
  const rounded = Number.isInteger(value) ? value : parseFloat(value.toFixed(2));
  if (unit === "%") return `${rounded}%`;
  if (unit === "x") return `${rounded}x`;
  return String(rounded);
}

function parseInput(raw: string, unit: string): number | null {
  let cleaned = raw.trim();
  if (unit === "%" && cleaned.endsWith("%")) {
    cleaned = cleaned.slice(0, -1).trim();
  }
  if (cleaned === "") return null;
  const parsed = Number(cleaned);
  if (Number.isNaN(parsed)) return null;
  return parsed;
}

export function EditableSlider({
  id,
  label,
  value,
  min,
  max,
  step,
  unit = "",
  onChange,
  onCommit,
  disabled = false
}: EditableSliderProps): JSX.Element {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));
  const inputRef = useRef<HTMLInputElement>(null);
  const labelId = id ? `${id}-label` : undefined;
  const valueId = id ? `${id}-value` : undefined;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const commitValue = useCallback(
    (raw: string) => {
      const parsed = parseInput(raw, unit);
      if (parsed !== null) {
        const clamped = clamp(parsed, min, max);
        const snapped = snapToStep(clamped, step);
        if (snapped !== value) {
          onChange(snapped);
        }
      }
      setIsEditing(false);
      onCommit?.();
    },
    [max, min, onChange, onCommit, step, unit, value]
  );

  const cancelEdit = useCallback(() => {
    setIsEditing(false);
    setDraft(String(value));
  }, [value]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        commitValue(draft);
      } else if (event.key === "Escape") {
        event.preventDefault();
        cancelEdit();
      }
    },
    [cancelEdit, commitValue, draft]
  );

  const handleBlur = useCallback(() => {
    commitValue(draft);
  }, [commitValue, draft]);

  const handleSliderChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(Number(event.target.value));
    },
    [onChange]
  );

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-mute">
        <label id={labelId} htmlFor={id} className="font-mono">
          {label}
        </label>
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            inputMode="decimal"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            aria-label={`Edit ${label.toLowerCase()} value`}
            className="w-16 rounded-sm border border-ink bg-canvas px-1 py-0.5 text-right font-mono text-xs text-ink outline-none"
          />
        ) : (
          <button
            id={valueId}
            type="button"
            onDoubleClick={() => {
              setDraft(String(value));
              setIsEditing(true);
            }}
            aria-label={`Edit ${label.toLowerCase()} value`}
            className="rounded-sm px-1 py-0.5 font-mono text-ink hover:bg-surface-soft focus:bg-surface-soft focus:outline-none"
          >
            {formatValue(value, unit)}
          </button>
        )}
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={handleSliderChange}
        onMouseUp={onCommit}
        onTouchEnd={onCommit}
        aria-labelledby={labelId}
        className="w-full accent-ink disabled:opacity-50"
      />
    </div>
  );
}
