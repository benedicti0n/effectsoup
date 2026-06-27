import type { JSX } from "react";
import { Button } from "@/components/ui/button";

export function CreatorsDevelopers(): JSX.Element {
  return (
    <section className="bg-deep-green text-on-dark">
      <div className="mx-auto max-w-container px-4 py-16 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-on-dark/60">
              For creators
            </p>
            <h2 className="mb-4 font-display text-2xl font-medium tracking-tight md:text-3xl">
              A look for every mood.
            </h2>
            <p className="mb-6 max-w-md leading-relaxed text-on-dark/80">
              EffectSoup ships with presets that actually work on real photos — portraits,
              landscapes, products, and night shots. Tweak intensity, swap colors, and export
              without learning a complex tool.
            </p>
            <Button variant="outline" className="border-on-dark/30 text-on-dark hover:bg-on-dark/10" asChild>
              <a href="/playground">Try the playground</a>
            </Button>
          </div>

          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-on-dark/60">
              For developers
            </p>
            <h2 className="mb-4 font-display text-2xl font-medium tracking-tight md:text-3xl">
              Install the engine.
            </h2>
            <p className="mb-6 max-w-md leading-relaxed text-on-dark/80">
              The same deterministic pixel pipeline that powers the UI is available as
              packages. Bring EffectSoup into your own app, script, or automation workflow.
            </p>
            <div className="mb-6 rounded-sm bg-on-dark/10 p-4 font-mono text-sm text-on-dark">
              <span className="text-on-dark/50">$</span> npm install @effectsoup/core
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outline" className="border-on-dark/30 text-on-dark hover:bg-on-dark/10" asChild>
                <a href="/docs">Read the docs</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
