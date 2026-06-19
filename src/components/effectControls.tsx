"use client";

import * as React from "react";
import { useEditorStore } from "@/store/useEditorStore";
import {
  EffectType,
  EFFECT_LABELS,
  PixelateSettings,
  AsciiSettings,
  OrderedDitherSettings,
  HalftoneSettings,
  DuotoneSettings,
  SymbolGlowSettings,
} from "@/lib/effects/types";
import { Label } from "@/components/ui/label";
import { RangeSlider } from "@/components/ui/rangeSlider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const EFFECT_OPTIONS: EffectType[] = [
  "pixelate",
  "ascii",
  "orderedDither",
  "halftone",
  "duotone",
  "symbolGlow",
];

export function EffectControls() {
  const effectType = useEditorStore((state) => state.effectType);
  const settings = useEditorStore((state) => state.settings);
  const setEffectType = useEditorStore((state) => state.setEffectType);
  const updateSettings = useEditorStore((state) => state.updateSettings);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label>Effect</Label>
        <Select
          value={effectType}
          onValueChange={(value) => setEffectType(value as EffectType)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select effect" />
          </SelectTrigger>
          <SelectContent>
            {EFFECT_OPTIONS.map((type) => (
              <SelectItem key={type} value={type}>
                {EFFECT_LABELS[type]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {effectType === "pixelate" && (
        <PixelateControls
          settings={settings as PixelateSettings}
          onChange={updateSettings}
        />
      )}

      {effectType === "ascii" && (
        <AsciiControls
          settings={settings as AsciiSettings}
          onChange={updateSettings}
        />
      )}

      {effectType === "orderedDither" && (
        <OrderedDitherControls
          settings={settings as OrderedDitherSettings}
          onChange={updateSettings}
        />
      )}

      {effectType === "halftone" && (
        <HalftoneControls
          settings={settings as HalftoneSettings}
          onChange={updateSettings}
        />
      )}

      {effectType === "duotone" && (
        <DuotoneControls
          settings={settings as DuotoneSettings}
          onChange={updateSettings}
        />
      )}

      {effectType === "symbolGlow" && (
        <SymbolGlowControls
          settings={settings as SymbolGlowSettings}
          onChange={updateSettings}
        />
      )}
    </div>
  );
}

function PixelateControls({
  settings,
  onChange,
}: {
  settings: PixelateSettings;
  onChange: (settings: Partial<PixelateSettings>) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <ControlSlider
        label="Block size"
        value={settings.blockSize}
        min={2}
        max={64}
        onChange={(value) => onChange({ blockSize: value })}
      />
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={settings.showGrid}
          onChange={(e) => onChange({ showGrid: e.target.checked })}
          className="size-4 rounded border-input"
        />
        Show grid
      </label>
    </div>
  );
}

function AsciiControls({
  settings,
  onChange,
}: {
  settings: AsciiSettings;
  onChange: (settings: Partial<AsciiSettings>) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <ControlSlider
        label="Font size"
        value={settings.fontSize}
        min={4}
        max={32}
        onChange={(value) => onChange({ fontSize: value })}
      />
      <div className="flex flex-col gap-2">
        <Label>Character set</Label>
        <input
          type="text"
          value={settings.charSet}
          onChange={(e) => onChange({ charSet: e.target.value })}
          className="rounded-md border border-input bg-transparent px-3 py-2 text-sm"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Color mode</Label>
        <Select
          value={settings.colorMode}
          onValueChange={(value) =>
            onChange({ colorMode: value as "monochrome" | "colored" })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monochrome">Monochrome</SelectItem>
            <SelectItem value="colored">Colored</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {settings.colorMode === "monochrome" && (
        <ColorInput
          label="Foreground color"
          value={settings.foregroundColor}
          onChange={(value) => onChange({ foregroundColor: value })}
        />
      )}
    </div>
  );
}

function OrderedDitherControls({
  settings,
  onChange,
}: {
  settings: OrderedDitherSettings;
  onChange: (settings: Partial<OrderedDitherSettings>) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <ControlSlider
        label="Levels"
        value={settings.levels}
        min={2}
        max={8}
        onChange={(value) => onChange({ levels: value })}
      />
      <div className="flex flex-col gap-2">
        <Label>Color mode</Label>
        <Select
          value={settings.colorMode}
          onValueChange={(value) =>
            onChange({ colorMode: value as "blackAndWhite" | "colored" })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="blackAndWhite">Black & white</SelectItem>
            <SelectItem value="colored">Colored</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function HalftoneControls({
  settings,
  onChange,
}: {
  settings: HalftoneSettings;
  onChange: (settings: Partial<HalftoneSettings>) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <ControlSlider
        label="Cell size"
        value={settings.cellSize}
        min={4}
        max={64}
        onChange={(value) => onChange({ cellSize: value })}
      />
      <div className="flex flex-col gap-2">
        <Label>Color mode</Label>
        <Select
          value={settings.colorMode}
          onValueChange={(value) =>
            onChange({ colorMode: value as "blackAndWhite" | "colored" })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="blackAndWhite">Black & white</SelectItem>
            <SelectItem value="colored">Colored</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function DuotoneControls({
  settings,
  onChange,
}: {
  settings: DuotoneSettings;
  onChange: (settings: Partial<DuotoneSettings>) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <ColorInput
        label="Shadow color"
        value={settings.shadowColor}
        onChange={(value) => onChange({ shadowColor: value })}
      />
      <ColorInput
        label="Highlight color"
        value={settings.highlightColor}
        onChange={(value) => onChange({ highlightColor: value })}
      />
    </div>
  );
}

function SymbolGlowControls({
  settings,
  onChange,
}: {
  settings: SymbolGlowSettings;
  onChange: (settings: Partial<SymbolGlowSettings>) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <ControlSlider
        label="Font size"
        value={settings.fontSize}
        min={6}
        max={32}
        onChange={(value) => onChange({ fontSize: value })}
      />
      <ControlSlider
        label="Glow radius"
        value={settings.glowRadius}
        min={0}
        max={32}
        onChange={(value) => onChange({ glowRadius: value })}
      />
      <div className="flex flex-col gap-2">
        <Label>Symbol set</Label>
        <input
          type="text"
          value={settings.symbolSet}
          onChange={(e) => onChange({ symbolSet: e.target.value })}
          className="rounded-md border border-input bg-transparent px-3 py-2 text-sm"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Color mode</Label>
        <Select
          value={settings.colorMode}
          onValueChange={(value) =>
            onChange({ colorMode: value as "monochrome" | "colored" })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monochrome">Monochrome</SelectItem>
            <SelectItem value="colored">Colored</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function ControlSlider({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <span className="text-xs text-muted-foreground">{value}</span>
      </div>
      <RangeSlider
        value={value}
        min={min}
        max={max}
        step={1}
        onChange={onChange}
      />
    </div>
  );
}

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="size-9 cursor-pointer rounded-md border border-input bg-transparent"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 rounded-md border border-input bg-transparent px-3 py-2 text-sm"
        />
      </div>
    </div>
  );
}
