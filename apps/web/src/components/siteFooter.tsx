"use client";

import Link from "next/link";
import type { JSX } from "react";

export function SiteFooter(): JSX.Element {
  const links = [
    { href: "/playground", label: "Playground" },
    { href: "/docs", label: "Docs" },
    { href: "/account", label: "Account" },
    { href: "https://github.com", label: "GitHub" }
  ];

  return (
    <footer className="border-t border-hairline bg-canvas">
      <div className="mx-auto max-w-container px-4 py-12 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <Link href="/" className="font-display text-lg font-medium tracking-tight text-ink-primary">
            EffectSoup
          </Link>
          <nav className="flex flex-wrap gap-6">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-body-muted hover:text-ink transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-8 border-t border-hairline pt-8 text-sm text-muted">
          &copy; {new Date().getFullYear()} EffectSoup. Beautiful image effects, made in the browser.
        </div>
      </div>
    </footer>
  );
}
