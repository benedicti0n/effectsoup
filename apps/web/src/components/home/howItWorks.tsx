import type { JSX } from "react";

const steps = [
  {
    number: "01",
    title: "Upload a photo",
    description: "Drag in any JPEG, PNG, or WebP. Your image stays in your browser — we never see it."
  },
  {
    number: "02",
    title: "Pick a preset",
    description: "Choose from 16 carefully tuned looks across print, ASCII, and atmosphere categories."
  },
  {
    number: "03",
    title: "Export in seconds",
    description: "Download a high-resolution PNG, JPEG, or WebP. Free exports up to 1080px; Premium unlocks original and 4K."
  }
];

export function HowItWorks(): JSX.Element {
  return (
    <section className="bg-canvas">
      <div className="mx-auto max-w-container px-4 py-16 lg:px-8 lg:py-24">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted">
            How it works
          </p>
          <h2 className="font-display text-2xl font-medium tracking-tight text-ink-primary md:text-3xl">
            From upload to export in three steps.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-sm border border-card-border bg-soft-stone/30 p-6"
            >
              <span className="mb-4 block font-display text-3xl font-medium text-muted">
                {step.number}
              </span>
              <h3 className="mb-2 font-display text-lg font-medium text-ink-primary">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-body-muted">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
