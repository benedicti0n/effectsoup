import { PlaygroundEditor } from "@/components/editor/playgroundEditor";
import type { JSX } from "react";
import type { Metadata } from "next";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  canonical
} from "@/lib/seo";

export const metadata: Metadata = {
  title: "Image Effects Playground",
  description:
    "Open the EffectSoup playground: upload an image, crop, pick from 25+ aesthetic presets, and export to PNG, JPEG, or WebP. Runs entirely in your browser — no upload, no AI.",
  alternates: { canonical: "/playground" },
  openGraph: {
    title: `Image Effects Playground | ${SITE_NAME}`,
    description: SITE_DESCRIPTION,
    url: canonical("/playground"),
    type: "website",
    siteName: SITE_NAME,
    images: [
      {
        url: "/effectsoupbanner.png?v=1",
        width: 1200,
        height: 630,
        alt: "EffectSoup — Beautiful Image Effects"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: `Image Effects Playground | ${SITE_NAME}`,
    description: SITE_DESCRIPTION,
    images: ["/effectsoupbanner.png?v=1"]
  }
};

export default function PlaygroundPage(): JSX.Element {
  return (
    <div className="flex h-screen flex-col bg-canvas">
      <PlaygroundEditor className="flex-1 overflow-hidden" />
    </div>
  );
}
