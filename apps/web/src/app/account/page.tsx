"use client";

import type { JSX } from "react";
import { useState } from "react";
import { authClient } from "@/lib/authClient";
import { SignInDialog } from "@/components/auth/signInDialog";

export default function AccountPage(): JSX.Element {
  const { data: session, isPending } = authClient.useSession();
  const [showSignIn, setShowSignIn] = useState(false);

  const signOut = async () => {
    await authClient.signOut();
  };

  return (
    <main className="min-h-screen bg-charcoal p-8 text-neon-cream">
      <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-surface p-8">
        <h1 className="mb-6 text-2xl font-bold">Account</h1>

        {isPending ? (
          <p className="text-white/50">Loading…</p>
        ) : session ? (
          <div className="space-y-4">
            <p className="text-white/70">
              Signed in as <span className="text-white">{session.user.email}</span>
            </p>
            <button
              onClick={signOut}
              className="rounded-lg border border-white/10 px-6 py-2 text-sm hover:bg-white/5"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-white/70">Sign in to save projects and unlock Premium features.</p>
            <button
              onClick={() => setShowSignIn(true)}
              className="rounded-lg bg-neon-pink px-6 py-2 text-sm font-semibold text-white hover:bg-neon-pink/90"
            >
              Sign In
            </button>
          </div>
        )}
      </div>

      {showSignIn && <SignInDialog onClose={() => setShowSignIn(false)} />}
    </main>
  );
}
