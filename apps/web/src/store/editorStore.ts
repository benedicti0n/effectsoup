import { create } from "zustand";
import { getPresetById } from "@effectsoup/presets";
import {
  defaultCrop,
  defaultEffect,
  defaultOutput,
  type EditorState
} from "./editorTypes";
import { createSnapshot, revokeSourceUrl } from "./editorUtils";

export * from "./editorTypes";

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
