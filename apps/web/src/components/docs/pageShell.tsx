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
        className="min-w-0 flex-1 max-w-[720px] prose-headings:font-display prose-headings:font-medium prose-headings:tracking-tight prose-headings:text-ink-primary prose-h2:mt-12 prose-h2:mb-4 prose-h2:text-2xl prose-h2:tracking-tight prose-h3:mt-10 prose-h3:mb-3 prose-h3:text-xl prose-h3:tracking-tight prose-h4:mt-8 prose-h4:mb-2 prose-h4:text-lg prose-p:text-body-muted prose-p:leading-relaxed prose-p:text-base prose-a:text-action-blue prose-a:underline prose-a:transition-colors hover:prose-a:text-action-blue/80 prose-strong:text-ink prose-ul:text-body-muted prose-ul:text-base prose-ol:text-body-muted prose-ol:text-base prose-li:my-1"
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
