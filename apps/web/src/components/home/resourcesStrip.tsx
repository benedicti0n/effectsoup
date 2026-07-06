import type { JSX } from "react";
import Link from "next/link";

const resources = [
  {
    label: "API Reference",
    description: "Full type docs for core, presets, and worker packages.",
    href: "/docs/api/core"
  },
  {
    label: "Examples",
    description: "Guides, best practices, and effect creation walkthroughs.",
    href: "/docs/guides/creating-an-effect"
  },
  {
    label: "Changelog",
    description: "Release notes and version history for all packages.",
    href: "https://github.com/benedicti0n/effectsoup/releases"
  }
];

export function ResourcesStrip(): JSX.Element {
  return (
    <section className="bg-soft-stone/20 border-b border-hairline">
      <div className="mx-auto max-w-container px-4 py-14 lg:px-8 lg:py-20">
        <div className="mb-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-accent">
            Built to be documented
          </p>
          <h2 className="font-serif-display text-2xl leading-[1.2] tracking-tight text-ink-primary md:text-3xl">
            Everything you need to <span className="italic text-accent">build</span> with it.
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {resources.map((r) => (
            <Link
              key={r.label}
              href={r.href}
              target={r.href.startsWith("http") ? "_blank" : undefined}
              rel={r.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group rounded-lg border border-hairline bg-canvas p-5 transition-all hover:-translate-y-0.5 hover:border-accent/20 hover:shadow-sm"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="font-display text-base font-medium text-ink-primary group-hover:text-accent transition-colors">
                  {r.label}
                </span>
                <span className="text-muted transition-transform group-hover:translate-x-0.5">
                  &rarr;
                </span>
              </div>
              <p className="text-sm leading-relaxed text-body-muted">
                {r.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
