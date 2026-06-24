"use client";

import type { JSX } from "react";
import { useState } from "react";
import { SiteHeader } from "@/components/siteHeader";
import { SiteFooter } from "@/components/siteFooter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { authClient } from "@/lib/authClient";
import { createCheckoutSession } from "@/lib/billingClient";
import { SignInDialog } from "@/components/auth/signInDialog";
import { env } from "@/lib/env";

const billingEnabled = Boolean(env.DODO_API_KEY && env.DODO_PREMIUM_PRODUCT_ID);

const faqs = [
  {
    question: "Can I use EffectSoup for free?",
    answer:
      "Yes. The free tier includes 9 presets, full upload and preview, and exports up to 1080px with no watermark."
  },
  {
    question: "What do I get with Premium?",
    answer:
      "Premium unlocks all 16 presets, original-resolution and 4K exports, full advanced controls, and cloud project saving."
  },
  {
    question: "Where is my image processed?",
    answer:
      "Every effect runs in your browser. Your photo is never uploaded to our servers while editing."
  },
  {
    question: "Can I cancel my subscription?",
    answer:
      "Yes. You can manage your subscription from your account page at any time."
  }
];

function PricingCard({
  title,
  price,
  period,
  description,
  features,
  highlighted,
  button
}: {
  title: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  button: JSX.Element;
}): JSX.Element {
  return (
    <div
      className={`flex flex-col rounded-sm border p-6 md:p-8 ${
        highlighted
          ? "border-ink-primary bg-ink-primary text-on-primary"
          : "border-card-border bg-canvas text-ink"
      }`}
    >
      <div className="mb-6">
        <h2 className="mb-2 font-display text-xl font-medium">{title}</h2>
        <div className="mb-3 flex items-baseline gap-1">
          <span className="font-display text-4xl font-medium">{price}</span>
          <span className={highlighted ? "text-on-dark/60" : "text-muted"}>{period}</span>
        </div>
        <p className={highlighted ? "text-on-dark/80" : "text-body-muted"}>{description}</p>
      </div>

      <ul className="mb-8 flex-1 space-y-3 text-sm">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <span className={highlighted ? "text-on-dark/60" : "text-muted"}>+</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {button}
    </div>
  );
}

export default function PricingPage(): JSX.Element {
  const { data: session } = authClient.useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSignIn, setShowSignIn] = useState(false);

  const handleSubscribe = async () => {
    if (!session?.user.email) {
      setShowSignIn(true);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { checkoutUrl } = await createCheckoutSession();
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        setError("Checkout URL not available");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  const subscribeButton = (
    <Button
      className="w-full"
      onClick={handleSubscribe}
      disabled={loading || !billingEnabled}
      variant={billingEnabled ? "primary" : "outline"}
    >
      {loading ? "Loading…" : session ? "Subscribe" : "Sign in to Subscribe"}
    </Button>
  );

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b border-hairline bg-soft-stone/30">
          <div className="mx-auto max-w-container px-4 py-16 text-center lg:px-8 lg:py-24">
            <Badge variant="coral" className="mb-4">
              Simple pricing
            </Badge>
            <h1 className="mx-auto mb-4 max-w-2xl font-display text-3xl font-medium tracking-tight text-ink-primary md:text-4xl">
              One plan. No surprises.
            </h1>
            <p className="mx-auto max-w-xl text-lg text-body-muted">
              Start free, upgrade when you need more power. Cancel anytime.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-container px-4 py-16 lg:px-8">
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            <PricingCard
              title="Free"
              price="$0"
              period="/ forever"
              description="Everything you need to start creating beautiful effects."
              features={[
                "9 free presets",
                "Upload and preview all effects",
                "Export up to 1080px",
                "No watermark",
                "Browser-only processing"
              ]}
              button={
                <Button variant="outline" className="w-full" asChild>
                  <a href="/playground">Start creating</a>
                </Button>
              }
            />
            <PricingCard
              title="Premium"
              price="$3"
              period="/ month"
              description="Unlock the full studio for creators who need more."
              features={[
                "All 16 presets",
                "Original-resolution export",
                "4K export option",
                "Full advanced controls",
                "Cloud project saving"
              ]}
              highlighted
              button={subscribeButton}
            />
          </div>

          {!billingEnabled && (
            <p className="mx-auto mt-6 max-w-4xl text-center text-sm text-muted">
              Billing is not configured. Subscribe button is disabled until Dodo Payments
              credentials are set.
            </p>
          )}
          {error && (
            <p className="mx-auto mt-4 max-w-4xl text-center text-sm text-error">{error}</p>
          )}
        </section>

        <section className="border-t border-hairline bg-soft-stone/30">
          <div className="mx-auto max-w-container px-4 py-16 lg:px-8 lg:py-24">
            <h2 className="mb-12 text-center font-display text-2xl font-medium tracking-tight text-ink-primary md:text-3xl">
              Frequently asked questions
            </h2>
            <div className="mx-auto grid max-w-3xl gap-6">
              {faqs.map((faq) => (
                <div key={faq.question} className="border-b border-hairline pb-6">
                  <h3 className="mb-2 font-display text-lg font-medium text-ink-primary">
                    {faq.question}
                  </h3>
                  <p className="text-sm leading-relaxed text-body-muted">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />

      {showSignIn && (
        <SignInDialog
          onClose={() => setShowSignIn(false)}
          onSuccess={() => {
            setShowSignIn(false);
            void handleSubscribe();
          }}
        />
      )}
    </div>
  );
}
