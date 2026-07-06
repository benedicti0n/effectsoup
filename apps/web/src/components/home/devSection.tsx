"use client";

import { useState, type JSX } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

type PkgManager = "npm" | "pnpm" | "yarn";

const commands: Record<PkgManager, string> = {
  npm: "npm install @effectsoup/effectsoup",
  pnpm: "pnpm add @effectsoup/effectsoup",
  yarn: "yarn add @effectsoup/effectsoup"
};

export function DevSection(): JSX.Element {
  const [pkg, setPkg] = useState<PkgManager>("npm");

  return (
    <section className="border-y border-hairline bg-soft-stone/40">
      <div className="mx-auto max-w-container px-4 py-16 lg:px-8 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-lg">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-accent md:text-xs">
              For developers
            </p>
            <h2 className="font-serif-display text-3xl leading-[1.2] tracking-tight text-ink-primary md:text-4xl">
              Developer friendly. <br />
              <span className="italic text-accent">npm</span> ready.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-body-muted">
              The same deterministic pixel pipeline that powers the UI is available
              as TypeScript packages. Import EffectSoup into your own app, script,
              or automation workflow.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link
                  href="https://www.npmjs.com/package/@effectsoup/effectsoup"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on npm
                </Link>
              </Button>
              <Button asChild>
                <Link href="/docs">
                  Read the docs
                  <HugeiconsIcon icon={ArrowRight01Icon} className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-hairline bg-canvas p-5 shadow-sm">
            {/* Tab bar */}
            <div className="mb-3 flex items-center gap-3 border-b border-hairline pb-3">
              {(["npm", "pnpm", "yarn"] as const).map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setPkg(name)}
                  className={cn(
                    "rounded-sm px-2.5 py-1 text-[11px] font-medium transition-colors",
                    pkg === name
                      ? "bg-ink-primary text-on-primary"
                      : "text-muted hover:text-ink-primary"
                  )}
                >
                  {name}
                </button>
              ))}
            </div>
            <pre className="overflow-x-auto text-sm leading-relaxed text-ink-primary">
              <code>{commands[pkg]}</code>
            </pre>
            <p className="mt-3 text-xs text-muted">
              Then import any effect and apply it to your images.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
