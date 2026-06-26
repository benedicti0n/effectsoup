"use client";

import type { JSX } from "react";
import { useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { CrownIcon } from "@hugeicons/core-free-icons";
import { allPresets, type EffectPreset, type PresetCategory } from "@imageeffects/presets";
import { useEditorStore } from "@/store/editorStore";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const categoryLabels: Record<PresetCategory, string> = {
  printGrid: "Print & Dither",
  asciiSymbols: "ASCII & Symbols",
  atmosphereGlow: "Atmosphere & Retro",
  glassFrost: "Glass & Frost",
  printLab: "Print Lab",
  signalLab: "Signal Lab",
  lightLab: "Light Lab"
};

export function PresetGrid(): JSX.Element {
  const presetId = useEditorStore((state) => state.effect.presetId);
  const setPresetId = useEditorStore((state) => state.setPresetId);
  const snapshotHistory = useEditorStore((state) => state.snapshotHistory);
  const [search, setSearch] = useState("");

  const selectPreset = (id: string) => {
    setPresetId(id);
    snapshotHistory();
  };

  const grouped = useMemo(() => {
    const filtered = allPresets.filter(
      (preset) =>
        preset.name.toLowerCase().includes(search.toLowerCase()) ||
        preset.description.toLowerCase().includes(search.toLowerCase())
    );
    return filtered.reduce<Record<PresetCategory, EffectPreset[]>>((acc, preset) => {
      acc[preset.category] = acc[preset.category] ?? [];
      acc[preset.category].push(preset);
      return acc;
    }, { printGrid: [], asciiSymbols: [], atmosphereGlow: [], glassFrost: [], printLab: [], signalLab: [], lightLab: [] });
  }, [search]);

  const hasResults = Object.values(grouped).some((group) => group.length > 0);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="mb-3 font-display text-lg font-medium text-ink-primary">Effects</h2>
        <Input
          placeholder="Search presets…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {!hasResults && (
        <p className="text-sm text-muted">No presets match your search.</p>
      )}

      {(Object.keys(grouped) as PresetCategory[]).map((category) => {
        const presets = grouped[category];
        if (presets.length === 0) return null;
        return (
          <div key={category}>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">
              {categoryLabels[category]}
            </p>
            <div className="grid grid-cols-1 gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => selectPreset(preset.id)}
                  className={cn(
                    "flex items-start justify-between rounded-sm border p-3 text-left transition-colors",
                    presetId === preset.id
                      ? "border-ink-primary bg-ink-primary text-on-primary"
                      : "border-hairline bg-canvas text-ink hover:border-muted"
                  )}
                >
                  <div>
                    <span className="block text-sm font-medium">{preset.name}</span>
                    <span
                      className={cn(
                        "block text-xs",
                        presetId === preset.id ? "text-on-dark/70" : "text-muted"
                      )}
                    >
                      {preset.description}
                    </span>
                  </div>
                  {preset.access === "premium" && (
                    <HugeiconsIcon
                      icon={CrownIcon}
                      className={cn(
                        "h-4 w-4 shrink-0",
                        presetId === preset.id ? "text-on-dark/70" : "text-muted"
                      )}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        );
      })}

      <div className="rounded-sm border border-card-border bg-soft-stone/50 p-3">
        <p className="text-xs text-body-muted">
          <Badge variant="premium" className="mr-2">Premium</Badge>
          presets require a subscription.
        </p>
      </div>
    </div>
  );
}
