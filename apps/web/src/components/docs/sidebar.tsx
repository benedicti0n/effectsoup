"use client";

import { useEffect, useState, type JSX } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getSections } from "@/lib/docs/navigation";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, Menu01Icon, Search01Icon } from "@hugeicons/core-free-icons";

export function DocsSidebar({
  onSearchOpen
}: {
  onSearchOpen: () => void;
}): JSX.Element {
  const pathname = usePathname();
  const sections = getSections();

  return (
    <nav className="w-64 shrink-0 overflow-y-auto border-r border-hairline bg-canvas px-4 py-8" aria-label="Documentation">
      <div className="mb-6 px-3">
        <button
          onClick={onSearchOpen}
          className="flex w-full items-center gap-2 rounded-lg border border-hairline px-3 py-2 text-sm text-muted hover:border-accent/30 hover:text-ink-primary transition-colors"
        >
          <HugeiconsIcon icon={Search01Icon} className="h-4 w-4" />
          <span>Search docs...</span>
          <kbd className="ml-auto hidden rounded-sm border border-hairline px-1.5 py-0.5 text-[10px] sm:inline">
            ⌘K
          </kbd>
        </button>
      </div>

      {sections.map((section) => (
        <div key={section.id} className="mb-6">
          <h3 className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-widest text-muted">
            {section.title}
          </h3>
          <ul className="space-y-0.5">
            {section.pages.map((page) => {
              const isActive = pathname === `/${page.slug}`;
              return (
                <li key={page.slug}>
                  <Link
                    href={`/${page.slug}`}
                    className={cn(
                      "block rounded-sm px-3 py-1.5 text-sm transition-colors",
                      isActive
                        ? "bg-soft-stone font-medium text-ink-primary"
                        : "text-body-muted hover:bg-soft-stone hover:text-ink-primary"
                    )}
                  >
                    {page.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function DocsMobileNav({
  onSearchOpen
}: {
  onSearchOpen: () => void;
}): JSX.Element {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const sections = getSections();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <div className="flex items-center gap-2 border-b border-hairline bg-white px-4 py-3 md:hidden">
        <button
          onClick={() => setOpen(true)}
          className="rounded-sm p-1.5 text-ink-primary hover:bg-soft-stone"
          aria-label="Open navigation menu"
        >
          <HugeiconsIcon icon={Menu01Icon} className="h-5 w-5" />
        </button>
        <button
          onClick={onSearchOpen}
          className="rounded-sm p-1.5 text-ink-primary hover:bg-soft-stone"
          aria-label="Search documentation"
        >
          <HugeiconsIcon icon={Search01Icon} className="h-5 w-5" />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-white md:hidden">
          <div className="flex items-center justify-between border-b border-hairline px-4 py-3">
            <span className="font-serif-display text-base text-ink-primary">Docs</span>
            <button
              onClick={() => setOpen(false)}
              className="rounded-sm p-1.5 text-ink-primary"
              aria-label="Close navigation menu"
            >
              <HugeiconsIcon icon={Cancel01Icon} className="h-5 w-5" />
            </button>
          </div>
          <nav className="overflow-y-auto bg-white px-4 py-6">
            {sections.map((section) => (
              <div key={section.id} className="mb-6">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted">
                  {section.title}
                </h3>
                <ul className="space-y-1">
                  {section.pages.map((page) => (
                    <li key={page.slug}>
                      <Link
                        href={`/${page.slug}`}
                        className={cn(
                          "block rounded-sm px-3 py-2 text-sm",
                          pathname === `/${page.slug}`
                            ? "bg-soft-stone font-medium text-ink-primary"
                            : "text-body-muted hover:bg-soft-stone hover:text-ink-primary"
                        )}
                      >
                        {page.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
