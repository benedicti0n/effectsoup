"use client";

import { useCallback } from "react";
import type { JSX } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Upload01Icon } from "@hugeicons/core-free-icons";
import { useEditorStore } from "@/store/editorStore";

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
      className="flex flex-col items-center justify-center rounded-sm border border-dashed border-hairline-strong bg-surface-soft p-12 text-center hover:border-ink"
    >
      <HugeiconsIcon icon={Upload01Icon} className="mb-4 h-10 w-10 text-mute" />
      <p className="mb-2 font-mono text-base font-medium text-ink">
        Drop an image here, or click to upload
      </p>
      <p className="mb-6 font-mono text-sm text-mute">JPEG, PNG, WebP. Max 20 MB.</p>
      <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-sm bg-ink px-5 font-mono text-base font-medium text-canvas hover:bg-ink-deep">
        Choose Image
        <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={onChange} />
      </label>
    </div>
  );
}
