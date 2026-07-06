import type { DocsSection, DocsPage } from "./types";

const sections: DocsSection[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    pages: [
      { slug: "docs/getting-started/introduction", title: "What is EffectSoup?", description: "Browser-based non-AI image effects studio" },
      { slug: "docs/getting-started/installation", title: "Installation", description: "npm packages, requirements, and setup" },
      { slug: "docs/getting-started/quickstart", title: "Quickstart", description: "First 5 minutes in the playground" }
    ]
  },
  {
    id: "guides",
    title: "Guides",
    pages: [
      { slug: "docs/guides/upload-and-crop", title: "Upload & Crop", description: "Image loading, cropping, and zoom" },
      { slug: "docs/guides/effect-controls", title: "Effect Controls", description: "Intensity slider and advanced controls" },
      { slug: "docs/guides/exporting", title: "Exporting", description: "Format, quality, and resolution options" },
      { slug: "docs/guides/creating-an-effect", title: "Creating an Effect", description: "Anatomy of an EffectPreset" },
      { slug: "docs/guides/testing-effects", title: "Testing Effects", description: "Test conventions and best practices" },
      { slug: "docs/guides/performance", title: "Performance", description: "Worker, preview, and optimization tips" }
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
    id: "reference",
    title: "Reference",
    pages: [
      { slug: "docs/reference/editor-overview", title: "Editor Overview", description: "UI layout, history, undo, compare, mobile" },
      { slug: "docs/reference/effects-catalog", title: "Effects Catalog", description: "All 25 presets across 7 categories" }
    ]
  },
  {
    id: "concepts",
    title: "Concepts",
    pages: [
      { slug: "docs/guides/architecture", title: "Architecture", description: "Monorepo structure and rendering flow" },
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
