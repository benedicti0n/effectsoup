import { EditorShell } from "@/components/editor/editorShell";
import { SiteHeader } from "@/components/siteHeader";
import type { JSX } from "react";

export default function PlaygroundPage(): JSX.Element {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <SiteHeader />
      <EditorShell className="flex-1 overflow-hidden" />
    </div>
  );
}
