"use client";

import Link from "next/link";
import NextImage from "next/image";
import type { JSX } from "react";

export function SiteFooter(): JSX.Element {
  return (
    <footer className="border-t border-hairline bg-canvas">
      <div className="mx-auto max-w-container px-4 py-14 lg:px-8 lg:py-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <NextImage
                src="/icon.png"
                alt="EffectSoup"
                width={28}
                height={28}
                className="h-7 w-7 shrink-0"
              />
              <span className="font-serif-display text-lg tracking-tight text-ink-primary">
                EffectSoup
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-body-muted">
              A browser-based image effects studio. No AI, no uploads, no limits.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted">Product</h4>
            <ul className="space-y-3">
              <li><Link href="/docs/reference/effects-catalog" className="text-sm text-body-muted hover:text-ink transition-colors">Effects</Link></li>
              <li><Link href="/playground" className="text-sm text-body-muted hover:text-ink transition-colors">Playground</Link></li>
              <li><Link href="https://github.com/benedicti0n/effectsoup/releases" className="text-sm text-body-muted hover:text-ink transition-colors">Changelog</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted">Resources</h4>
            <ul className="space-y-3">
              <li><Link href="/docs" className="text-sm text-body-muted hover:text-ink transition-colors">Docs</Link></li>
              <li><Link href="/docs/api/core" className="text-sm text-body-muted hover:text-ink transition-colors">API Reference</Link></li>
              <li><Link href="/docs/guides/creating-an-effect" className="text-sm text-body-muted hover:text-ink transition-colors">Examples</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted">Connect</h4>
            <ul className="space-y-3">
              <li><Link href="https://github.com/benedicti0n/effectsoup" target="_blank" rel="noopener noreferrer" className="text-sm text-body-muted hover:text-ink transition-colors">GitHub</Link></li>
              <li><Link href="/docs" className="text-sm text-body-muted hover:text-ink transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="text-sm text-body-muted hover:text-ink transition-colors">Privacy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-hairline pt-8 text-sm text-muted">
          &copy; {new Date().getFullYear()} EffectSoup. Beautiful image effects, made in the browser.
        </div>
      </div>
    </footer>
  );
}
