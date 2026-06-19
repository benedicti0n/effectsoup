"use client";

import * as React from "react";
import { useRef } from "react";
import {
  AppShell,
  AppMain,
  AppSidebar,
  SidebarSection,
} from "@/components/appShell";
import { UploadPanel } from "@/components/uploadPanel";
import { EffectControls } from "@/components/effectControls";
import { CanvasPreview } from "@/components/canvasPreview";
import { PresetGrid } from "@/components/presetGrid";
import { ExportButton } from "@/components/exportButton";
import { useEditorStore } from "@/store/useEditorStore";

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sourceImage = useEditorStore((state) => state.sourceImage);
  const effectType = useEditorStore((state) => state.effectType);
  const settings = useEditorStore((state) => state.settings);

  return (
    <AppShell>
      <AppMain>
        <CanvasPreview
          ref={canvasRef}
          sourceImage={sourceImage}
          effectType={effectType}
          settings={settings}
        />
      </AppMain>
      <AppSidebar>
        <SidebarSection title="Upload">
          <UploadPanel />
        </SidebarSection>

        <SidebarSection title="Effect">
          <EffectControls />
        </SidebarSection>

        <SidebarSection title="Presets">
          <PresetGrid />
        </SidebarSection>

        <div className="mt-auto">
          <ExportButton canvasRef={canvasRef} disabled={!sourceImage} />
        </div>
      </AppSidebar>
    </AppShell>
  );
}
