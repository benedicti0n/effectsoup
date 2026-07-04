import type { JSX } from "react";
import {
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_TAGLINE,
  canonical
} from "@/lib/seo";

/**
 * JSON-LD structured data describing the EffectSoup web app.
 * Drops in as a `<script type="application/ld+json">` block.
 */
export function SoftwareApplicationJsonLd(): JSX.Element {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE_NAME,
    url: canonical("/"),
    description: SITE_DESCRIPTION,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any (web browser)",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock"
    },
    featureList: [
      "Browser-based image effects",
      "25+ aesthetic presets",
      "Pixel grid, halftone, ASCII art, glitch, CRT, bloom, and more",
      "Crop, zoom, and pan before applying effects",
      "Export to PNG, JPEG, and WebP up to 4K",
      "No account required for the editor",
      "No images uploaded to any server"
    ],
    browserRequirements:
      "Requires WebAssembly and Web Worker support. Modern Chrome, Firefox, Safari, or Edge.",
    applicationSuite: SITE_NAME,
    keywords: SITE_TAGLINE,
    inLanguage: "en",
    isAccessibleForFree: true
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * JSON-LD describing a creative work / software FAQ for richer SERP.
 */
export function FaqJsonLd({
  faqs
}: {
  faqs: Array<{ question: string; answer: string }>;
}): JSX.Element {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer }
    }))
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
