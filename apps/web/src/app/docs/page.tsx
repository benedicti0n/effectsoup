import type { JSX } from "react";
import { SiteHeader } from "@/components/siteHeader";
import { SiteFooter } from "@/components/siteFooter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const docCards = [
  {
    title: "Quick start",
    description: "Upload your first image, pick a preset, and export in under two minutes.",
    href: "/playground",
    action: "Open playground"
  },
  {
    title: "Effect reference",
    description:
      "A complete catalog of every preset, its controls, and the best photos to use it on.",
    href: "#",
    action: "Coming soon"
  },
  {
    title: "npm packages",
    description:
      "Use the same deterministic pixel pipeline in your own apps with @imageeffects/core.",
    href: "#",
    action: "Coming soon"
  },
  {
    title: "Self-hosting",
    description:
      "Deploy EffectSoup with your own auth, billing, and storage credentials.",
    href: "#",
    action: "Coming soon"
  }
];

export default function DocsPage(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b border-hairline bg-soft-stone/30">
          <div className="mx-auto max-w-container px-4 py-16 lg:px-8 lg:py-24">
            <Badge variant="muted" className="mb-4">
              Documentation
            </Badge>
            <h1 className="mb-4 max-w-2xl font-display text-3xl font-medium tracking-tight text-ink-primary md:text-4xl">
              Learn how to use EffectSoup.
            </h1>
            <p className="max-w-2xl text-lg text-body-muted">
              The docs are still growing. For now, the fastest way to learn is to open the
              playground and try a preset.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-container px-4 py-16 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            {docCards.map((card) => (
              <div
                key={card.title}
                className="flex flex-col rounded-sm border border-card-border bg-soft-stone/30 p-6"
              >
                <h2 className="mb-2 font-display text-xl font-medium text-ink-primary">
                  {card.title}
                </h2>
                <p className="mb-6 flex-1 text-sm leading-relaxed text-body-muted">
                  {card.description}
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <a href={card.href}>{card.action}</a>
                </Button>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
