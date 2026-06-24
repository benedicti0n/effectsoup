"use client";

import Link from "next/link";
import type { JSX } from "react";

export function SiteFooter(): JSX.Element {
  const links = [
    { href: "https://github.com", label: "GitHub" },
    { href: "/editor", label: "Editor" },
    { href: "/account", label: "Account" }
  ];

  return (
    <footer className="border-t border-hairline bg-canvas">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid gap-px bg-hairline sm:grid-cols-3">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex h-12 items-center justify-center bg-canvas font-mono text-sm text-mute hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-hairline pt-6 text-sm text-mute sm:flex-row">
          <span className="font-mono">&copy; 2026 effectLab</span>
          <span className="font-mono">No AI. Your image stays on your device.</span>
        </div>
      </div>
    </footer>
  );
}
