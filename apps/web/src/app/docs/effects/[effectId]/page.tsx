import type { JSX } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EffectDetailPage } from "@/components/docs/effectDetail";
import { getEffectById, isPremium, getEffects } from "@/lib/docs/presets";
import { categoryInfo } from "@/lib/docs/presets";
import type { AdvancedControlDefinition } from "@effectsoup/presets";

type Props = {
  params: Promise<{ effectId: string }>;
};

export async function generateStaticParams(): Promise<{ effectId: string }[]> {
  return getEffects().map((p) => ({ effectId: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { effectId } = await params;
  const effect = getEffectById(effectId);
  if (!effect) return { title: "Effect not found" };

  return {
    title: `${effect.name} | Effects Catalog | EffectSoup Docs`,
    description: effect.description,
    alternates: { canonical: `/docs/effects/${effect.id}` }
  };
}

export default async function EffectDetailPageRoute({ params }: Props): Promise<JSX.Element> {
  const { effectId } = await params;
  const effect = getEffectById(effectId);
  if (!effect) notFound();

  const cat = effect.category ? categoryInfo[effect.category] : undefined;

  // Extract only serializable data (no functions) to pass to Client Component
  const effectData = {
    id: effect.id,
    name: effect.name,
    description: effect.description,
    category: effect.category,
    defaultIntensity: effect.defaultIntensity,
    usesIntensity: effect.usesIntensity ?? true,
    advancedControlSchema: effect.advancedControlSchema as AdvancedControlDefinition[]
  };

  const premium = isPremium(effectId);
  const categoryData = cat ? {
    name: cat.name,
    description: cat.description,
    bestFor: cat.bestFor,
    idealImages: cat.idealImages
  } : undefined;

  const relatedEffects = getEffects()
    .filter((e) => e.id !== effectId && e.category === effect.category)
    .map((e) => ({ id: e.id, name: e.name, description: e.description }));

  return <EffectDetailPage effect={effectData} premium={premium} category={categoryData} relatedEffects={relatedEffects} />;
}
