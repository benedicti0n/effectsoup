import type { JSX } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { allPresets } from "@effectsoup/presets";
import { SiteHeader } from "@/components/siteHeader";
import { SiteFooter } from "@/components/siteFooter";
import { MiniPlayground } from "@/components/home/miniPlayground";
import { HowItWorks } from "@/components/home/howItWorks";
import { CreatorsDevelopers } from "@/components/home/creatorsDevelopers";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FaqJsonLd,
  SoftwareApplicationJsonLd
} from "@/components/seo/StructuredData";
import {
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_TAGLINE,
  canonical
} from "@/lib/seo";

export const metadata: Metadata = {
  title: {
    absolute: `${SITE_NAME} — ${SITE_TAGLINE}`
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    url: canonical("/"),
    type: "website",
    siteName: SITE_NAME,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "EffectSoup — browser-based image effects studio"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"]
  }
};

function HeroEyebrow(): JSX.Element {
  return (
    <div className="mb-4 inline-flex items-center gap-2 rounded-pill border border-hairline bg-soft-stone/50 pl-1 pr-3 py-1">
      <Badge variant="coral">New</Badge>
      <span className="text-xs font-medium text-body-muted">
        Browser-only image effects studio
      </span>
    </div>
  );
}

function Hero(): JSX.Element {
  return (
    <section className="bg-canvas">
      <div className="mx-auto max-w-container px-4 py-16 text-center lg:px-8 lg:py-24">
        <HeroEyebrow />
        <h1 className="mx-auto mb-6 max-w-3xl font-display text-4xl font-medium leading-[1.1] tracking-tight text-ink-primary md:text-5xl lg:text-6xl">
          Beautiful image effects. <br />
          <span className="text-muted">Made in your browser.</span>
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-lg leading-relaxed text-body-muted">
          Upload a photo, pick a look, and export in seconds. No AI, no uploads
          to a server — every pixel is processed right here.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/playground">Open Playground</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/#try-it">Try it</Link>
          </Button>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted">
          <span>{allPresets.length} presets</span>
          <span className="h-1 w-1 rounded-full bg-muted" />
          <span>Every effect free</span>
          <span className="h-1 w-1 rounded-full bg-muted" />
          <span>PNG / JPEG / WebP</span>
        </div>
      </div>
    </section>
  );
}

function MiniPlaygroundSection(): JSX.Element {
  return (
    <section id="try-it" className="bg-soft-stone/30">
      <div className="mx-auto max-w-container px-4 py-16 lg:px-8 lg:py-24">
        <div className="mb-8 text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted">
            Try it
          </p>
          <h2 className="font-display text-2xl font-medium tracking-tight text-ink-primary md:text-3xl">
            Play with a demo photo.
          </h2>
        </div>
        <MiniPlayground />
      </div>
    </section>
  );
}

const features = [
  {
    title: "Private by default",
    description:
      "Your image never leaves your device while editing. Everything runs in a browser Web Worker."
  },
  {
    title: "Deterministic output",
    description:
      "Same photo, same settings, same pixels. Every effect is a pure, testable pipeline."
  },
  {
    title: "Fast previews",
    description:
      "Adaptive preview quality keeps the UI responsive even on large photos and slower devices."
  },
  {
    title: "Built for creators",
    description:
      "From retro print grids to luminous ASCII bloom, the presets are tuned for real photos."
  }
];

function Features(): JSX.Element {
  return (
    <section className="border-y border-hairline bg-soft-stone/30">
      <div className="mx-auto max-w-container px-4 py-16 lg:px-8 lg:py-24">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted">
            Why EffectSoup
          </p>
          <h2 className="font-display text-2xl font-medium tracking-tight text-ink-primary md:text-3xl">
            A small studio that respects your photos.
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-sm border border-card-border bg-canvas p-6"
            >
              <h3 className="mb-2 font-display text-lg font-medium text-ink-primary">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-body-muted">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <MiniPlaygroundSection />
        <CreatorsDevelopers />
        <Features />
        <HowItWorks />
      </main>
      <SiteFooter />
      <SoftwareApplicationJsonLd />
      <FaqJsonLd
        faqs={[
          {
            question: "What is EffectSoup?",
            answer:
              "EffectSoup is a browser-based image effects studio. It runs entirely in your browser via Web Workers, so no image ever leaves your device. Pick from 25+ curated presets covering pixel grids, halftones, ASCII art, glow, glitch, CRT, and graphic-print looks, then export to PNG, JPEG, or WebP."
          },
          {
            question: "Do I need to create an account to use EffectSoup?",
            answer:
              "No. The editor and mini-playground work without an account. Account creation is optional and only used to save your work to the cloud in future versions."
          },
          {
            question: "Are my uploaded images sent to a server?",
            answer:
              "No. EffectSoup runs entirely client-side. Every pixel is processed in your browser using a Web Worker. The exported image is created with the standard Canvas toBlob API on your device."
          },
          {
            question: "Which image formats does EffectSoup support?",
            answer:
              "EffectSoup accepts JPEG, PNG, and WebP as input, and exports to PNG, JPEG, and WebP. You can choose the longest edge (1080px, original resolution, or up to 4K) and JPEG quality."
          },
          {
            question: "Is EffectSoup free?",
            answer:
              "Yes. Every effect is free. There are no subscriptions, watermarks, or hidden limits in the editor."
          }
        ]}
      />
    </div>
  );
}
