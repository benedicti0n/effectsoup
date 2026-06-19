"use client";

import * as React from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { canvasToDataURL } from "@/lib/image/canvasUtils";

interface ExportButtonProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  disabled?: boolean;
}

export function ExportButton({ canvasRef, disabled }: ExportButtonProps) {
  function handleExport() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvasToDataURL(canvas);
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "effectsoup-export.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <Button
      className="w-full gap-2"
      onClick={handleExport}
      disabled={disabled}
    >
      <Download className="size-4" />
      Export PNG
    </Button>
  );
}
