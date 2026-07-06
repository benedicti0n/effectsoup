import type { JSX } from "react";
import type { Metadata } from "next";
import { DocsPageShell } from "@/components/docs/pageShell";
import { getPageContent } from "@/lib/docs/content";

type Props = {
  params: Promise<{ slug?: string[] }>;
};

export async function generateStaticParams(): Promise<{ slug?: string[] }[]> {
  return [
    { slug: ["getting-started", "playground"] },
    { slug: ["getting-started", "packages"] },
    { slug: ["playground"] },
    { slug: ["playground", "upload-and-crop"] },
    { slug: ["playground", "controls"] },
    { slug: ["playground", "exporting"] },
    { slug: ["effects"] },
    { slug: ["api", "core"] },
    { slug: ["api", "presets"] },
    { slug: ["api", "worker"] },
    { slug: ["api", "meta-package"] },
    { slug: ["guides", "creating-an-effect"] },
    { slug: ["guides", "testing-effects"] },
    { slug: ["guides", "architecture"] },
    { slug: ["guides", "performance"] },
    { slug: ["troubleshooting"] },
    { slug: ["faq"] }
  ];
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
