export type DocsPage = {
  slug: string;
  title: string;
  description: string;
};

export type DocsSection = {
  id: string;
  title: string;
  pages: DocsPage[];
};

export type EffectDocPage = DocsPage & {
  presetName: string;
  presetId: string;
};
