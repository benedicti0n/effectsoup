"use client";

import Link from "next/link";
import { useState, type JSX } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon, Cancel01Icon, Menu01Icon } from "@hugeicons/core-free-icons";

function Wordmark(): JSX.Element {
  return (
    <pre className="whitespace-pre font-mono text-sm font-bold leading-none tracking-tight text-ink">
      {`[effectLab]`}
    </pre>
  );
}

export function SiteHeader(): JSX.Element {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/editor", label: "Editor" },
    { href: "/account", label: "Account" }
  ];

  return (
    <header className="sticky top-0 z-50 h-14 border-b border-hairline bg-canvas">
      <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2" aria-label="effectLab home">
          <Wordmark />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-base font-medium text-ink hover:text-mute"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/editor"
            className="inline-flex h-9 items-center gap-2 rounded-sm bg-ink px-5 font-mono text-base font-medium text-canvas hover:bg-ink-deep"
          >
            <HugeiconsIcon icon={ArrowDown01Icon} className="h-4 w-4" />
            Open
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen((s) => !s)}
          className="flex h-9 w-9 items-center justify-center rounded-sm border border-hairline md:hidden"
          aria-label="Toggle menu"
        >
          <HugeiconsIcon icon={menuOpen ? Cancel01Icon : Menu01Icon} className="h-5 w-5" />
        </button>
      </div>

      {menuOpen && (
        <div className="border-b border-hairline bg-canvas md:hidden">
          <div className="mx-auto max-w-5xl px-4 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block py-2 font-mono text-base font-medium text-ink hover:text-mute"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/editor"
              onClick={() => setMenuOpen(false)}
              className="mt-2 inline-flex h-9 items-center gap-2 rounded-sm bg-ink px-5 font-mono text-base font-medium text-canvas"
            >
              <HugeiconsIcon icon={ArrowDown01Icon} className="h-4 w-4" />
              Open Editor
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
