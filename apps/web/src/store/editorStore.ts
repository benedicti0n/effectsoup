import { create } from "zustand";
import type { CropConfig } from "@imageeffects/core";
import { getPresetById } from "@imageeffects/presets";

export type EditorDocument = {
  source: {
    localId: string;
    fileName: string;
    width: number;
    height: number;
    objectUrl: string;
  } | null;
  crop: CropConfig;
  effect: {
    presetId: string;
    intensity: number;
    advancedOverrides: Record<string, number | string | boolean>;
  };
  output: {
    format: "png" | "jpeg" | "webp";
    width: number;
    backgroundColor?: string;
  };
};

type HistoryEntry = {
  crop: CropConfig;
  effect: EditorDocument["effect"];
  output: EditorDocument["output"];
};

type EditorState = EditorDocument & {
  isRendering: boolean;
  compareBefore: boolean;
  history: HistoryEntry[];
  historyIndex: number;
  setSource: (source: EditorDocument["source"]) => void;
  replaceSource: (source: EditorDocument["source"]) => void;
  removeSource: () => void;
  setCrop: (crop: CropConfig) => void;
  setPresetId: (presetId: string) => void;
  setIntensity: (intensity: number) => void;
  setAdvancedOverride: (key: string, value: number | string | boolean) => void;
  resetAdvancedOverrides: () => void;
  setOutput: (output: Partial<EditorDocument["output"]>) => void;
  setIsRendering: (isRendering: boolean) => void;
  setCompareBefore: (compare: boolean) => void;
  undo: () => void;
  redo: () => void;
  resetEffect: () => void;
  resetAll: () => void;
  snapshotHistory: () => void;
};

const defaultCrop: CropConfig = {
  aspectRatio: "original",
  zoom: 1,
  offsetX: 0,
  offsetY: 0
};

const defaultEffect: EditorDocument["effect"] = {
  presetId: "pixelGrid",
  intensity: 5,
  advancedOverrides: {}
};

const defaultOutput: EditorDocument["output"] = {
  format: "png",
  width: 1080
};

function revokeSourceUrl(source: EditorDocument["source"]): void {
  if (source?.objectUrl) {
    URL.revokeObjectURL(source.objectUrl);
  }
}

function createSnapshot(state: EditorState): HistoryEntry {
  return {
    crop: state.crop,
    effect: state.effect,
    output: state.output
  };
}

export const useEditorStore = create<EditorState>((set) => ({
  source: null,
  crop: { ...defaultCrop },
  effect: { ...defaultEffect, advancedOverrides: {} },
  output: { ...defaultOutput },
  isRendering: false,
  compareBefore: false,
  history: [],
  historyIndex: -1,

  setSource: (source) =>
    set((state) => {
      revokeSourceUrl(state.source);
      return { source, crop: { ...defaultCrop }, effect: { ...defaultEffect } };
    }),

  replaceSource: (source) =>
    set((state) => {
      revokeSourceUrl(state.source);
      return { source, crop: { ...defaultCrop } };
    }),

  removeSource: () =>
    set((state) => {
      revokeSourceUrl(state.source);
      return {
        source: null,
        crop: { ...defaultCrop },
        effect: { ...defaultEffect },
        output: { ...defaultOutput }
      };
    }),

  setCrop: (crop) => set({ crop }),

  setPresetId: (presetId) =>
    set(() => {
      const preset = getPresetById(presetId);
      const defaultIntensity = preset?.defaultIntensity ?? 50;
      return {
        effect: {
          presetId,
          intensity: defaultIntensity,
          advancedOverrides: {}
        }
      };
    }),

  setIntensity: (intensity) =>
    set((state) => ({
      effect: { ...state.effect, intensity }
    })),

  setAdvancedOverride: (key, value) =>
    set((state) => ({
      effect: {
        ...state.effect,
        advancedOverrides: { ...state.effect.advancedOverrides, [key]: value }
      }
    })),

  resetAdvancedOverrides: () =>
    set((state) => ({
      effect: { ...state.effect, advancedOverrides: {} }
    })),

  setOutput: (output) =>
    set((state) => ({
      output: { ...state.output, ...output }
    })),

  setIsRendering: (isRendering) => set({ isRendering }),
  setCompareBefore: (compareBefore) => set({ compareBefore }),

  undo: () =>
    set((state) => {
      if (state.historyIndex <= 0) return state;
      const entry = state.history[state.historyIndex - 1];
      return {
        historyIndex: state.historyIndex - 1,
        crop: entry.crop,
        effect: entry.effect,
        output: entry.output
      };
    }),

  redo: () =>
    set((state) => {
      if (state.historyIndex >= state.history.length - 1) return state;
      const entry = state.history[state.historyIndex + 1];
      return {
        historyIndex: state.historyIndex + 1,
        crop: entry.crop,
        effect: entry.effect,
        output: entry.output
      };
    }),

  snapshotHistory: () =>
    set((state) => {
      const entry = createSnapshot(state);
      const history = state.history.slice(0, state.historyIndex + 1);
      history.push(entry);
      return { history, historyIndex: history.length - 1 };
    }),

  resetEffect: () =>
    set((state) => {
      const preset = getPresetById(state.effect.presetId);
      const defaultIntensity = preset?.defaultIntensity ?? 50;
      return {
        effect: { presetId: state.effect.presetId, intensity: defaultIntensity, advancedOverrides: {} }
      };
    }),

  resetAll: () =>
    set(() => ({
      crop: { ...defaultCrop },
      effect: { ...defaultEffect },
      output: { ...defaultOutput }
    }))
}));
