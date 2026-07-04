import { EditorShell } from "@/components/editor/editorShell";
import type { JSX } from "react";

export default function PlaygroundPage(): JSX.Element {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <EditorShell className="flex-1 overflow-hidden" />
    </div>
  );
}
