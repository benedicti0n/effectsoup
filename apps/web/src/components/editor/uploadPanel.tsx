"use client";

import { useCallback } from "react";
import type { JSX } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Upload01Icon } from "@hugeicons/core-free-icons";
import { useEditorStore } from "@/store/editorStore";
import { Button } from "@/components/ui/button";

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function UploadPanel(): JSX.Element {
  const setSource = useEditorStore((state) => state.setSource);

  const handleFile = useCallback(
    async (file: File) => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        alert("Only JPEG, PNG, and WebP images are supported.");
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        alert("File size must be under 20 MB.");
        return;
      }

      const objectUrl = URL.createObjectURL(file);
      const image = new Image();
      image.src = objectUrl;
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error("Failed to load image"));
      });

      const megapixels = (image.width * image.height) / 1_000_000;
      if (megapixels > 25) {
        alert("Image is too large. Maximum decoded size is 25 megapixels.");
        URL.revokeObjectURL(objectUrl);
        return;
      }

      setSource({
        localId: crypto.randomUUID(),
        fileName: file.name,
        width: image.width,
        height: image.height,
        objectUrl
      });
    },
    [setSource]
  );

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const file = event.dataTransfer.files?.[0];
      if (file) void handleFile(file);
    },
    [handleFile]
  );

  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) void handleFile(file);
    },
    [handleFile]
  );

  return (
    <div
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
      className="flex flex-1 flex-col items-center justify-center rounded-sm border border-dashed border-hairline bg-soft-stone/30 p-8 text-center transition-colors hover:border-muted md:p-12"
    >
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-soft-stone">
        <HugeiconsIcon icon={Upload01Icon} className="h-7 w-7 text-ink-primary" />
      </div>
      <h2 className="mb-2 font-display text-xl font-medium text-ink-primary">
        Drop an image here
      </h2>
      <p className="mb-6 max-w-xs text-sm text-body-muted">
        or click to upload. Supports JPEG, PNG, and WebP up to 20 MB.
      </p>
      <label className="cursor-pointer">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={onChange}
        />
        <Button asChild>
          <span>Choose Image</span>
        </Button>
      </label>
    </div>
  );
}
