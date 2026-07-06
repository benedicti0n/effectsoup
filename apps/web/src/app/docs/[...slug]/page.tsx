import type { JSX } from "react";
import type { Metadata } from "next";
import { DocsPageShell } from "@/components/docs/pageShell";
import { getPageContent } from "@/lib/docs/content";
import { getFlattenedPages } from "@/lib/docs/navigation";

type Props = {
  params: Promise<{ slug?: string[] }>;
};

export async function generateStaticParams(): Promise<{ slug?: string[] }[]> {
  return getFlattenedPages().map((p) => ({
    slug: p.slug.replace("docs/", "").split("/")
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pageSlug = slug ? `docs/${slug.join("/")}` : "docs";
  const content = getPageContent(pageSlug);

  return {
    title: content ? `${content.title} | EffectSoup Docs` : "Docs | EffectSoup",
    description: content?.description ?? "EffectSoup documentation",
    alternates: { canonical: `/${pageSlug}` }
  };
}

export default async function DocsCatchAllPage({ params }: Props): Promise<JSX.Element> {
  const { slug } = await params;
  const pageSlug = slug ? `docs/${slug.join("/")}` : "docs";
  const content = getPageContent(pageSlug);

  if (!content) {
    return (
      <DocsPageShell slug={pageSlug}>
        <h1 className="font-display text-2xl font-medium text-ink-primary">Page not found</h1>
        <p className="mt-2 text-body-muted">This documentation page does not exist.</p>
      </DocsPageShell>
    );
  }

  return (
    <DocsPageShell slug={pageSlug}>
      {content.component()}
    </DocsPageShell>
  );
}
