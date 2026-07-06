import type { JSX } from "react";

const values = [
  {
    title: "Instant browser-based effects",
    description:
      "No software to install, no account required. Upload, tweak, and export — all in your browser."
  },
  {
    title: "Fine-tune every detail",
    description:
      "Each effect has its own advanced controls. Adjust intensity, dot size, color palette, grain, glow, and more."
  },
  {
    title: "Export-ready results",
    description:
      "Download PNG, JPEG, or WebP at 1080px, original resolution, or up to 4K. Ready for social, print, or portfolio."
  },
  {
    title: "Built for creators and developers",
    description:
      "Whether you are editing a single photo or building an image-processing pipeline, EffectSoup fits your workflow."
  }
];

export function ValueSection(): JSX.Element {
  return (
    <section className="bg-canvas">
      <div className="mx-auto max-w-container px-4 py-16 lg:px-8 lg:py-24">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-accent md:text-xs">
            Why EffectSoup
          </p>
          <h2 className="font-serif-display text-3xl leading-[1.2] tracking-tight text-ink-primary md:text-4xl">
            Create more. <br />
            <span className="italic text-accent">Tweak less.</span>
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {values.map((v) => (
            <div
              key={v.title}
              className="rounded-lg border border-hairline bg-canvas p-6 transition-all hover:border-accent/20 hover:shadow-sm"
            >
              <div className="mb-3 h-8 w-8 rounded-sm bg-accent/10 flex items-center justify-center">
                <span className="text-accent text-lg leading-none">✦</span>
              </div>
              <h3 className="font-display text-lg font-medium text-ink-primary">
                {v.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-body-muted">
                {v.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-lg border border-hairline bg-soft-stone/30 p-6 text-center text-sm leading-relaxed text-body-muted md:p-8">
          <p className="font-display text-lg font-medium text-ink-primary">
            &ldquo;Beautiful results in a few clicks.&rdquo;
          </p>
          <p className="mt-2 text-sm text-muted">
            Made for creators, developers, and curious visual people.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted">
            <span className="h-1 w-1 rounded-full bg-accent" />
            <span>No subscriptions</span>
            <span className="h-1 w-1 rounded-full bg-accent" />
            <span>No watermarks</span>
            <span className="h-1 w-1 rounded-full bg-accent" />
            <span>No hidden limits</span>
          </div>
        </div>
      </div>
    </section>
  );
}
