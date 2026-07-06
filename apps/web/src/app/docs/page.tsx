import type { JSX } from "react";
import type { Metadata } from "next";
import { DocsPageShell } from "@/components/docs/pageShell";
import { getPageContent } from "@/lib/docs/content";

export const metadata: Metadata = {
  title: "Documentation",
  description: "EffectSoup documentation: playground guide, effects catalog, API reference, and developer guides.",
  alternates: { canonical: "/docs" }
};

export default function DocsPage(): JSX.Element {
  const content = getPageContent("docs");

  if (!content) {
    return (
      <DocsPageShell slug="docs">
        <h1 className="font-display text-2xl font-medium text-ink-primary">Page not found</h1>
        <p className="mt-2 text-body-muted">This documentation page does not exist.</p>
      </DocsPageShell>
    );
  }

  return (
    <DocsPageShell slug="docs">
      {content.component()}
    </DocsPageShell>
  );
}
