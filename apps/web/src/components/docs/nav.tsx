"use client";

import type { JSX } from "react";
import Link from "next/link";
import { getPreviousNext, getSectionForPage } from "@/lib/docs/navigation";

export function DocsBreadcrumbs({ slug }: { slug: string }): JSX.Element {
  const sectionInfo = getSectionForPage(slug);
  if (!sectionInfo) return <></>;

  return (
    <nav className="mb-4 flex items-center gap-2 text-xs text-muted" aria-label="Breadcrumb">
      <Link href="/docs" className="hover:text-ink transition-colors">
        Docs
      </Link>
      <span aria-hidden="true">/</span>
      <span className="text-ink-primary font-medium">{sectionInfo.section.title}</span>
    </nav>
  );
}

export function DocsPrevNext({ slug }: { slug: string }): JSX.Element {
  const { prev, next } = getPreviousNext(slug);

  return (
    <nav className="mt-16 flex items-center justify-between border-t border-hairline pt-8" aria-label="Previous and next pages">
      <div>
        {prev && (
          <Link
            href={`/${prev.slug}`}
            className="group flex flex-col gap-1 text-sm"
          >
            <span className="text-xs text-muted">Previous</span>
            <span className="font-medium text-ink group-hover:text-action-blue transition-colors">
              ← {prev.title}
            </span>
          </Link>
        )}
      </div>
      <div className="text-right">
        {next && (
          <Link
            href={`/${next.slug}`}
            className="group flex flex-col gap-1 text-sm"
          >
            <span className="text-xs text-muted">Next</span>
            <span className="font-medium text-ink group-hover:text-action-blue transition-colors">
              {next.title} →
            </span>
          </Link>
        )}
      </div>
    </nav>
  );
}
