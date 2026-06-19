import { create } from "zustand";
import {
  EffectType,
  EffectParams,
  SettingsForType,
} from "@/lib/effects/types";
import { getDefaultSettings } from "@/lib/effects/defaultSettings";
import { Preset } from "@/lib/presets/presets";

interface EditorState {
  sourceImage: HTMLImageElement | null;
  effectType: EffectType;
  settings: EffectParams["settings"];
  selectedPresetId: string | null;

  setSourceImage: (image: HTMLImageElement) => void;
  setEffectType: (type: EffectType) => void;
  updateSettings: (partialSettings: Partial<EffectParams["settings"]>) => void;
  applyPreset: (preset: Preset) => void;
  resetSettings: () => void;
}

const initialEffectType: EffectType = "pixelate";
const initialParams = getDefaultSettings(initialEffectType);

export const useEditorStore = create<EditorState>((set) => ({
  sourceImage: null,
  effectType: initialEffectType,
  settings: initialParams.settings,
  selectedPresetId: null,

  setSourceImage: (image) =>
    set({
      sourceImage: image,
      selectedPresetId: null,
    }),

  setEffectType: (type) => {
    const defaults = getDefaultSettings(type);
    set({
      effectType: type,
      settings: defaults.settings,
      selectedPresetId: null,
    });
  },

  updateSettings: (partialSettings) =>
    set((state) => ({
      settings: { ...(state.settings as object), ...partialSettings } as EffectParams["settings"],
      selectedPresetId: null,
    })),

  applyPreset: (preset) =>
    set({
      effectType: preset.effectType,
      settings: { ...preset.settings },
      selectedPresetId: preset.id,
    }),

  resetSettings: () =>
    set((state) => {
      const defaults = getDefaultSettings(state.effectType);
      return {
        settings: defaults.settings,
        selectedPresetId: null,
      };
    }),
}));

export function useTypedSettings<T extends EffectType>(): SettingsForType<T> {
  const settings = useEditorStore((state) => state.settings);
  return settings as SettingsForType<T>;
}
