"use client";

import type { JSX } from "react";
import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/authClient";
import { SignInDialog } from "@/components/auth/signInDialog";
import { SiteHeader } from "@/components/siteHeader";
import { SiteFooter } from "@/components/siteFooter";
import { useToast } from "@/components/ui/toast";

export default function AccountPage(): JSX.Element {
  const { data: session, isPending } = authClient.useSession();
  const [showSignIn, setShowSignIn] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const signOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await authClient.signOut();
      showToast("Signed out", "success");
      router.push("/");
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to sign out";
      showToast(message, "error");
      setSigningOut(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink">
      <SiteHeader />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-16">
        <div className="rounded-sm border border-hairline bg-surface-soft p-6 md:p-8">
          <h1 className="mb-6 border-b border-hairline pb-3 font-mono text-2xl font-bold text-ink">
            Account
          </h1>

          {isPending ? (
            <p className="font-mono text-base text-mute">Loading…</p>
          ) : session ? (
            <div className="space-y-6">
              <div className="flex flex-col items-start justify-between gap-4 border-b border-hairline pb-6 sm:flex-row sm:items-center">
                <p className="font-mono text-base text-body">
                  Signed in as{" "}
                  <span className="font-medium text-ink">{session.user.email}</span>
                </p>
                <button
                  onClick={() => void signOut()}
                  disabled={signingOut}
                  className="inline-flex h-9 items-center gap-1 rounded-sm border border-hairline bg-canvas px-5 font-mono text-sm text-ink hover:bg-surface-card disabled:opacity-60"
                >
                  <HugeiconsIcon icon={Cancel01Icon} className="h-4 w-4" />
                  {signingOut ? "Signing out…" : "Sign Out"}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="font-mono text-base text-body">
                Sign in to access your account.
              </p>
              <button
                onClick={() => setShowSignIn(true)}
                className="inline-flex h-9 items-center rounded-sm bg-ink px-5 font-mono text-sm font-medium text-canvas hover:bg-ink-deep"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />

      {showSignIn && <SignInDialog onClose={() => setShowSignIn(false)} />}
    </div>
  );
}
