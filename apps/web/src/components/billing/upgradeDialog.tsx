"use client";

import type { JSX } from "react";
import { useState } from "react";
import { authClient } from "@/lib/authClient";
import { createCheckoutSession } from "@/lib/billingClient";
import { SignInDialog } from "@/components/auth/signInDialog";

export function UpgradeDialog({ onClose }: { onClose: () => void }): JSX.Element {
  const { data: session } = authClient.useSession();
  const [showSignIn, setShowSignIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upgrade = async () => {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-surface p-6 shadow-xl">
        <h2 className="mb-2 text-xl font-bold text-neon-lavender">Unlock Premium</h2>
        <p className="mb-4 text-sm text-white/70">
          Get all 16 presets, original/4K export, full advanced controls, and cloud projects for
          $3/month.
        </p>

        <ul className="mb-6 space-y-2 text-sm text-white/70">
          <li className="flex items-center gap-2">✓ All premium presets</li>
          <li className="flex items-center gap-2">✓ Original & 4K exports</li>
          <li className="flex items-center gap-2">✓ Cloud projects</li>
        </ul>

        {error && <p className="mb-3 text-sm text-red-400">{error}</p>}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
          >
            Not now
          </button>
          <button
            onClick={upgrade}
            disabled={loading}
            className="rounded-lg bg-neon-pink px-6 py-2 text-sm font-semibold text-white hover:bg-neon-pink/90 disabled:opacity-50"
          >
            {loading ? "Loading…" : session ? "Subscribe" : "Sign in to Subscribe"}
          </button>
        </div>
      </div>

      {showSignIn && (
        <SignInDialog
          onClose={() => setShowSignIn(false)}
          onSuccess={() => {
            setShowSignIn(false);
            void upgrade();
          }}
        />
      )}
    </div>
  );
}
