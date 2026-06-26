import type { EditorState, HistoryEntry } from "./editorTypes";

export function revokeSourceUrl(source: EditorState["source"]): void {
  if (source?.objectUrl) {
    URL.revokeObjectURL(source.objectUrl);
  }
}

export function createSnapshot(state: EditorState): HistoryEntry {
  return {
    crop: state.crop,
    effect: state.effect,
    output: state.output
  };
}
