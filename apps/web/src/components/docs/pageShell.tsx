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
        className="min-w-0 flex-1 max-w-[720px]"
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
