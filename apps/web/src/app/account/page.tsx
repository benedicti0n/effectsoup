"use client";

import type { JSX } from "react";
import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Logout01Icon, UserIcon } from "@hugeicons/core-free-icons";
import { useRouter } from "next/navigation";
import { useUser, useAuth } from "@clerk/nextjs";
import { SignInDialog } from "@/components/auth/signInDialog";
import { SiteHeader } from "@/components/siteHeader";
import { SiteFooter } from "@/components/siteFooter";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";

export default function AccountPage(): JSX.Element {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useAuth();
  const [showSignIn, setShowSignIn] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const handleSignOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await signOut();
    } catch (err) {
      console.error("signOut request failed:", err);
    }
    setSigningOut(false);
    showToast("Signed out", "success");
    router.replace("/");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink-primary">
      <SiteHeader />

      <main className="mx-auto w-full max-w-container flex-1 px-4 py-16 lg:px-8">
        <div className="mx-auto max-w-lg">
          <div className="mb-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-accent">
              Account
            </p>
            <h1 className="font-serif-display text-3xl leading-[1.2] tracking-tight text-ink-primary md:text-4xl">
              Your account
            </h1>
          </div>

          <div className="rounded-lg border border-hairline bg-canvas p-6 shadow-sm md:p-8">
            {!isLoaded ? (
              <p className="text-sm text-muted">Loading…</p>
            ) : isSignedIn && user ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-soft-stone">
                    <HugeiconsIcon icon={UserIcon} className="h-5 w-5 text-muted" />
                  </div>
                  <div>
                    <p className="font-display text-base font-medium text-ink-primary">
                      {user.fullName ?? "User"}
                    </p>
                    <p className="text-sm text-body-muted">{user.emailAddresses?.[0]?.emailAddress}</p>
                  </div>
                </div>
                <div className="border-t border-hairline pt-4">
                  <Button
                    variant="outline"
                    onClick={() => void handleSignOut()}
                    disabled={signingOut}
                  >
                    <HugeiconsIcon icon={Logout01Icon} className="h-4 w-4" />
                    {signingOut ? "Signing out…" : "Sign Out"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-body-muted">
                  Sign in to access your account.
                </p>
                <Button onClick={() => setShowSignIn(true)}>
                  Sign In
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />

      {showSignIn && <SignInDialog onClose={() => setShowSignIn(false)} />}
    </div>
  );
}
