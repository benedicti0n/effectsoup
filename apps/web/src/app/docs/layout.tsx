"use client";

import { useState, useEffect, type JSX } from "react";
import Link from "next/link";
import { DocsSidebar, DocsMobileNav } from "@/components/docs/sidebar";
import { SearchModal } from "@/components/docs/search";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";

export default function DocsLayout({
  children
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((s) => !s);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink-primary">
      <header className="sticky top-0 z-30 border-b border-hairline bg-canvas/95 backdrop-blur">
        <div className="mx-auto flex h-12 max-w-container items-center gap-3 px-4 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-primary transition-colors hover:text-muted"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="h-4 w-4" />
            <span className="font-serif-display">EffectSoup</span>
          </Link>
          <span className="text-sm text-muted">/</span>
          <Link href="/docs" className="font-serif-display text-sm text-ink-primary">
            Docs
          </Link>
        </div>
        <DocsMobileNav onSearchOpen={() => setSearchOpen(true)} />
      </header>

      <div className="mx-auto flex w-full max-w-container flex-1">
        <aside className="hidden md:block">
          <DocsSidebar onSearchOpen={() => setSearchOpen(true)} />
        </aside>
        <main className="min-w-0 flex-1 px-4 py-8 lg:px-8 lg:py-12">
          {children}
        </main>
      </div>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
