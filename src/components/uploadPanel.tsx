"use client";

import * as React from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { loadImage } from "@/lib/image/loadImage";
import { useEditorStore } from "@/store/useEditorStore";

export function UploadPanel() {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const setSourceImage = useEditorStore((state) => state.setSourceImage);
  const sourceImage = useEditorStore((state) => state.sourceImage);
  const [fileName, setFileName] = React.useState<string | null>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const image = await loadImage(file);
      setFileName(file.name);
      setSourceImage(image);
    } catch (error) {
      console.error("Failed to load image", error);
    }

    event.target.value = "";
  }

  function handleClick() {
    inputRef.current?.click();
  }

  return (
    <div className="flex flex-col gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button
        variant="outline"
        className="w-full justify-start gap-2"
        onClick={handleClick}
      >
        <Upload className="size-4" />
        Upload image
      </Button>
      {sourceImage && fileName && (
        <p className="truncate text-xs text-muted-foreground">{fileName}</p>
      )}
    </div>
  );
}
