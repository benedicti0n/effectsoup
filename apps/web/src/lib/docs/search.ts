import { allPresets } from "@effectsoup/presets";
import { getFlattenedPages, getSections } from "./navigation";

export type SearchResult = {
  slug: string;
  title: string;
  description: string;
  section: string;
  type: "page" | "effect" | "api";
};

const pageResults: SearchResult[] = getFlattenedPages().map((p) => {
  const sectionId = getSections().find((s) => s.pages.some((sp) => sp.slug === p.slug))?.id ?? "";
  return {
    slug: p.slug,
    title: p.title,
    description: p.description,
    section: sectionId,
    type: (sectionId === "api" ? "api" : "page") as "page" | "api"
  };
});

const effectResults: SearchResult[] = allPresets.map((p) => ({
  slug: `docs/effects/${p.id}`,
  title: p.name,
  description: p.description,
  section: "effects",
  type: "effect" as const
}));

export const searchIndex: SearchResult[] = [...pageResults, ...effectResults];

export function searchDocs(query: string): SearchResult[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return searchIndex.filter((item) => {
    const inTitle = item.title.toLowerCase().includes(q);
    const inDesc = item.description.toLowerCase().includes(q);
    return inTitle || inDesc;
  }).slice(0, 20);
}
