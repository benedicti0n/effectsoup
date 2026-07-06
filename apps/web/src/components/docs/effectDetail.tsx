"use client";

import type { JSX } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Callout } from "@/components/docs/callout";
import { getControlDisplayName } from "@/lib/docs/presets";
import type { AdvancedControlDefinition } from "@effectsoup/presets";

type EffectData = {
  id: string;
  name: string;
  description: string;
  category: string;
  defaultIntensity: number;
  usesIntensity: boolean;
  advancedControlSchema: AdvancedControlDefinition[];
};

type CategoryData = {
  name: string;
  description: string;
  bestFor: string;
  idealImages: string;
};

type RelatedEffect = {
  id: string;
  name: string;
  description: string;
};

function ControlTable({ schema }: { schema: AdvancedControlDefinition[] }): JSX.Element {
  return (
    <div className="my-6 overflow-x-auto rounded-sm border border-hairline">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-hairline bg-soft-stone/20">
            <th className="px-4 py-2.5 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted">Control</th>
            <th className="px-4 py-2.5 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted">Type</th>
            <th className="px-4 py-2.5 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted">Range / Options</th>
            <th className="px-4 py-2.5 text-left font-mono text-xs font-medium uppercase tracking-wider text-muted">Default</th>
          </tr>
        </thead>
        <tbody>
          {schema.map((control) => (
            <tr key={control.id} className="border-b border-hairline/50 last:border-0">
              <td className="px-4 py-2.5 font-medium text-ink-primary">{getControlDisplayName(control.id)}</td>
              <td className="px-4 py-2.5">
                <span className="rounded-sm border border-hairline px-1.5 py-0.5 text-xs font-medium text-body-muted">
                  {control.type}
                </span>
              </td>
              <td className="px-4 py-2.5 font-mono text-xs text-body-muted">
                {control.type === "range" && control.min !== undefined && control.max !== undefined
                  ? `${control.min} – ${control.max}${control.step ? ` (step ${control.step})` : ""}`
                  : control.type === "select" && control.options
                  ? control.options.join(", ")
                  : control.type === "boolean"
                  ? "true / false"
                  : control.type === "color"
                  ? "Hex color"
                  : "\u2014"}
              </td>
              <td className="px-4 py-2.5 font-mono text-xs text-body-muted">
                {String(control.defaultValue)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function EffectDetailPage({
  effect,
  premium,
  category,
  relatedEffects
}: {
  effect: EffectData;
  premium: boolean;
  category?: CategoryData;
  relatedEffects: RelatedEffect[];
}): JSX.Element {
  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <Link href="/docs/effects" className="text-xs text-muted hover:text-ink transition-colors">
          Effects Catalog
        </Link>
        <span className="text-xs text-muted">/</span>
        <span className="text-xs font-medium text-ink">{category?.name ?? effect.category}</span>
      </div>

      <div className="mb-2 flex items-center gap-2">
        <h1 className="font-display text-2xl font-medium tracking-tight text-ink-primary">
          {effect.name}
        </h1>
        {premium && <Badge variant="coral">Premium</Badge>}
      </div>

      <p className="mb-8 text-sm leading-relaxed text-body-muted">{effect.description}</p>

      <Callout variant="info">
        <strong>Open this effect in the playground</strong> — <Link href={`/playground?preset=${effect.id}`} className="underline">try {effect.name}</Link>
      </Callout>

      <section className="mb-10">
        <h2 id="controls" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mb-4">
          Controls
        </h2>

        <div className="mb-4 grid grid-cols-2 gap-4 rounded-sm border border-hairline bg-soft-stone/20 p-4 text-sm">
          <div>
            <span className="text-xs font-medium text-muted">Category</span>
            <p className="mt-0.5 text-ink-primary">{category?.name ?? effect.category}</p>
          </div>
          <div>
            <span className="text-xs font-medium text-muted">Default Intensity</span>
            <p className="mt-0.5 text-ink-primary">{effect.usesIntensity ? `${effect.defaultIntensity}%` : "None (always on)"}</p>
          </div>
          <div>
            <span className="text-xs font-medium text-muted">Intensity Slider</span>
            <p className="mt-0.5 text-ink-primary">{effect.usesIntensity ? "Visible" : "Hidden"}</p>
          </div>
        </div>

        {effect.advancedControlSchema.length > 0 && (
          <>
            <h3 className="font-display text-lg font-medium tracking-tight text-ink-primary mb-3">
              Advanced Controls
            </h3>
            <ControlTable schema={effect.advancedControlSchema} />
          </>
        )}
      </section>

      <section className="mb-10">
        <h2 id="usage" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mb-4">
          Usage Tips
        </h2>
        <div className="space-y-3 text-sm leading-relaxed text-body-muted">
          <p>
            {!effect.usesIntensity
              ? `This effect does not use the main Intensity slider. It relies entirely on the advanced controls.`
              : `The Intensity slider scales ${effect.name}&rsquo;s primary effect. At 0% the source image is returned unchanged.`}
          </p>
          {category && <p>{category.idealImages}</p>}
        </div>
      </section>

      {relatedEffects.length > 0 && (
        <section className="mb-10">
          <h2 id="related" className="scroll-mt-20 font-display text-xl font-medium tracking-tight text-ink-primary mb-4">
            Related Effects
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {relatedEffects.map((r) => (
              <Link
                key={r.id}
                href={`/docs/effects/${r.id}`}
                className="rounded-sm border border-hairline p-4 text-sm hover:border-ink/20 transition-colors"
              >
                <div className="font-medium text-ink-primary">{r.name}</div>
                <div className="mt-1 text-xs text-body-muted line-clamp-2">{r.description}</div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
