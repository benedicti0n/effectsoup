import type { DocsSection, DocsPage } from "./types";

const sections: DocsSection[] = [
  {
    id: "overview",
    title: "Overview",
    pages: [
      { slug: "docs", title: "What is EffectSoup?", description: "Browser-based non-AI image effects studio" }
    ]
  },
  {
    id: "getting-started",
    title: "Getting Started",
    pages: [
      { slug: "docs/getting-started/playground", title: "Using the Playground", description: "Upload, apply effects, and export" },
      { slug: "docs/getting-started/packages", title: "Installing the Packages", description: "npm packages for developers" }
    ]
  },
  {
    id: "playground",
    title: "Playground Guide",
    pages: [
      { slug: "docs/playground", title: "Editor Overview", description: "Full walkthrough of the editor" },
      { slug: "docs/playground/upload-and-crop", title: "Upload & Crop", description: "Image loading, cropping, and zoom" },
      { slug: "docs/playground/controls", title: "Effect Controls", description: "Intensity slider and advanced controls" },
      { slug: "docs/playground/exporting", title: "Exporting", description: "Format, quality, and resolution options" }
    ]
  },
  {
    id: "effects",
    title: "Effects Catalog",
    pages: [
      { slug: "docs/effects", title: "All Effects", description: "Browse every preset effect" }
    ]
  },
  {
    id: "api",
    title: "API Reference",
    pages: [
      { slug: "docs/api/core", title: "@effectsoup/core", description: "PixelBuffer, image primitives, and utilities" },
      { slug: "docs/api/presets", title: "@effectsoup/presets", description: "EffectPreset, pipeline, and lookup" },
      { slug: "docs/api/worker", title: "@effectsoup/worker", description: "Web Worker client and rendering" },
      { slug: "docs/api/meta-package", title: "@effectsoup/effectsoup", description: "All-in-one meta-package" }
    ]
  },
  {
    id: "guides",
    title: "Guides",
    pages: [
      { slug: "docs/guides/creating-an-effect", title: "Creating an Effect", description: "Anatomy of an EffectPreset" },
      { slug: "docs/guides/testing-effects", title: "Testing Effects", description: "Test conventions and best practices" },
      { slug: "docs/guides/architecture", title: "Architecture", description: "Monorepo structure and rendering flow" },
      { slug: "docs/guides/performance", title: "Performance", description: "Worker, preview, and optimization tips" }
    ]
  },
  {
    id: "support",
    title: "Support",
    pages: [
      { slug: "docs/troubleshooting", title: "Troubleshooting", description: "Common issues and solutions" },
      { slug: "docs/faq", title: "FAQ", description: "Frequently asked questions" }
    ]
  }
];

export function getSections(): DocsSection[] {
  return sections;
}

export function getFlattenedPages(): DocsPage[] {
  return sections.flatMap((s) => s.pages);
}

export function findPage(slug: string): DocsPage | undefined {
  return getFlattenedPages().find((p) => p.slug === slug);
}

export function getSectionForPage(slug: string): { section: DocsSection; index: number } | undefined {
  for (const section of sections) {
    const index = section.pages.findIndex((p) => p.slug === slug);
    if (index !== -1) return { section, index };
  }
}

export function getPreviousNext(slug: string): { prev: DocsPage | null; next: DocsPage | null } {
  const all = getFlattenedPages();
  const idx = all.findIndex((p) => p.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? all[idx - 1] : null,
    next: idx < all.length - 1 ? all[idx + 1] : null
  };
}
