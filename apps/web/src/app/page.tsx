import type { JSX } from "react";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/siteHeader";
import { SiteFooter } from "@/components/siteFooter";
import { HeroSection } from "@/components/home/heroSection";
import { DevSection } from "@/components/home/devSection";
import { ValueSection } from "@/components/home/valueSection";
import { ResourcesStrip } from "@/components/home/resourcesStrip";
import { FinalCta } from "@/components/home/finalCta";
import {
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_TAGLINE,
  canonical
} from "@/lib/seo";
import { SoftwareApplicationJsonLd } from "@/components/seo/StructuredData";

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

export default function HomePage(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <DevSection />
        <ValueSection />
        <ResourcesStrip />
        <FinalCta />
      </main>
      <SiteFooter />
      <SoftwareApplicationJsonLd />
    </div>
  );
}
