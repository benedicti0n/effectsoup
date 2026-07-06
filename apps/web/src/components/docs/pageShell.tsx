"use client";

import type { JSX } from "react";
import { DocsBreadcrumbs, DocsPrevNext } from "@/components/docs/nav";
import { useTableOfContents, TableOfContents } from "@/components/docs/toc";

export function DocsPageShell({
  slug,
  children
}: {
  slug: string;
  children: React.ReactNode;
}): JSX.Element {
  const tocItems = useTableOfContents("#docs-content");

  return (
    <div className="flex gap-12">
      <article
        id="docs-content"
        className="min-w-0 flex-1 max-w-[720px] prose prose-neutral prose-headings:font-serif-display prose-headings:tracking-tight prose-h1:text-ink-primary prose-h2:text-ink-primary prose-h3:text-ink-primary prose-p:text-body-muted prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-strong:text-ink-primary prose-code:text-ink-primary"
      >
        <DocsBreadcrumbs slug={slug} />
        {children}
        <DocsPrevNext slug={slug} />
      </article>

      <aside className="hidden xl:block">
        <TableOfContents items={tocItems} />
      </aside>
    </div>
  );
}
