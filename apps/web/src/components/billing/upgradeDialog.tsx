"use client";

import type { JSX } from "react";
import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4">
      <div className="w-full max-w-md rounded-sm border border-hairline bg-canvas p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between border-b border-hairline pb-3">
          <h2 className="font-mono text-xl font-bold text-ink">Unlock Premium</h2>
          <button onClick={onClose} className="text-mute hover:text-ink" aria-label="Close">
            <HugeiconsIcon icon={Cancel01Icon} className="h-5 w-5" />
          </button>
        </div>

        <p className="mb-4 font-mono text-sm text-body">
          Get all 16 presets, original/4K export, full advanced controls, and cloud projects for
          $3/month.
        </p>

        <ul className="mb-6 space-y-2 font-mono text-sm text-body">
          <li>[+] All premium presets</li>
          <li>[+] Original & 4K exports</li>
          <li>[+] Cloud projects</li>
        </ul>

        {error && <p className="mb-3 font-mono text-sm text-danger">{error}</p>}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="h-9 rounded-sm border border-hairline bg-canvas px-4 font-mono text-sm text-ink hover:bg-surface-soft"
          >
            Not now
          </button>
          <button
            onClick={upgrade}
            disabled={loading}
            className="h-9 rounded-sm bg-ink px-6 font-mono text-sm font-medium text-canvas hover:bg-ink-deep disabled:bg-surface-card disabled:text-ash"
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
