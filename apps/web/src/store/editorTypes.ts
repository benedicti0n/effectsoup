import type { CropConfig } from "@effectsoup/core";

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

export type HistoryEntry = {
  crop: CropConfig;
  effect: EditorDocument["effect"];
  output: EditorDocument["output"];
};

export type EditorState = EditorDocument & {
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

export const defaultCrop: CropConfig = {
  aspectRatio: "original",
  zoom: 1,
  offsetX: 0,
  offsetY: 0
};

export const defaultEffect: EditorDocument["effect"] = {
  presetId: "pixelGrid",
  intensity: 5,
  advancedOverrides: {}
};

export const defaultOutput: EditorDocument["output"] = {
  format: "png",
  width: 1080
};
