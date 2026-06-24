"use client";

import type { JSX } from "react";
import { useState } from "react";
import { authClient } from "@/lib/authClient";
import { createProject, createSignedUploadUrl, uploadToSignedUrl } from "@/lib/projectClient";
import { useEditorStore } from "@/store/editorStore";
import { SignInDialog } from "@/components/auth/signInDialog";
import { UpgradeDialog } from "@/components/billing/upgradeDialog";

function dataUrlToBlob(dataUrl: string): Blob {
  const byteString = atob(dataUrl.split(",")[1] ?? "");
  const mimeString = dataUrl.split(",")[0]?.split(":")[1]?.split(";")[0] ?? "image/png";
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

async function generateThumbnail(objectUrl: string): Promise<Blob> {
  const image = new Image();
  image.src = objectUrl;
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("Failed to load image"));
  });

  const canvas = document.createElement("canvas");
  const size = 400;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  const scale = Math.max(size / image.width, size / image.height);
  const w = image.width * scale;
  const h = image.height * scale;
  const x = (size - w) / 2;
  const y = (size - h) / 2;
  ctx.drawImage(image, x, y, w, h);

  const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
  return dataUrlToBlob(dataUrl);
}

export function SaveProjectDialog({ onClose }: { onClose: () => void }): JSX.Element {
  const source = useEditorStore((state) => state.source);
  const crop = useEditorStore((state) => state.crop);
  const effect = useEditorStore((state) => state.effect);
  const output = useEditorStore((state) => state.output);
  const { data: session } = authClient.useSession();
  const [title, setTitle] = useState(source?.fileName.replace(/\.[^/.]+$/, "") ?? "My Project");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  // Production: derive from /api/me/entitlements.
  const isPremium = false;

  const save = async () => {
    if (!session) {
      setShowSignIn(true);
      return;
    }
    if (!isPremium) {
      setShowUpgrade(true);
      return;
    }
    if (!source) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch original source file as Blob.
      const sourceResponse = await fetch(source.objectUrl);
      const sourceBlob = await sourceResponse.blob();

      // Generate thumbnail.
      const thumbnailBlob = await generateThumbnail(source.objectUrl);

      // Get signed URLs and upload.
      const sourceUpload = await createSignedUploadUrl({
        fileName: source.fileName,
        contentType: sourceBlob.type as "image/jpeg" | "image/png" | "image/webp",
        fileSize: sourceBlob.size
      });
      await uploadToSignedUrl(sourceUpload.uploadUrl, sourceBlob);

      const thumbnailUpload = await createSignedUploadUrl({
        fileName: "thumbnail.jpg",
        contentType: "image/jpeg",
        fileSize: thumbnailBlob.size
      });
      await uploadToSignedUrl(thumbnailUpload.uploadUrl, thumbnailBlob);

      // Save project metadata.
      const effectGraphJson = JSON.stringify({
        presetId: effect.presetId,
        intensity: effect.intensity,
        advancedOverrides: effect.advancedOverrides,
        crop,
        output
      });

      await createProject({
        title,
        sourceImageKey: sourceUpload.key,
        thumbnailKey: thumbnailUpload.key,
        aspectRatio: crop.aspectRatio,
        effectGraphJson
      });

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setLoading(false);
    }
  };

  if (showSignIn) {
    return (
      <SignInDialog
        onClose={() => setShowSignIn(false)}
        onSuccess={() => {
          setShowSignIn(false);
          void save();
        }}
      />
    );
  }

  if (showUpgrade) {
    return <UpgradeDialog onClose={() => setShowUpgrade(false)} />;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-surface p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-bold">Save Project</h2>
        <p className="mb-4 text-sm text-white/70">
          Cloud projects are a Premium feature. Your source image, crop, preset, and settings are
          saved so you can edit later.
        </p>

        <label className="mb-1 block text-xs text-white/70">Project title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-4 w-full rounded-md border border-white/10 bg-ink px-3 py-2 text-sm text-white outline-none focus:border-neon-blue"
        />

        {error && <p className="mb-3 text-sm text-red-400">{error}</p>}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={loading}
            className="rounded-lg bg-neon-pink px-6 py-2 text-sm font-semibold text-white hover:bg-neon-pink/90 disabled:opacity-50"
          >
            {loading ? "Saving…" : session ? (isPremium ? "Save" : "Upgrade to Save") : "Sign in to Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
