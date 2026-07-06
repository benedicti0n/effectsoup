"use client";

import type { JSX } from "react";
import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  GoogleIcon,
  LockPasswordIcon,
  Mail01Icon,
  UserIcon
} from "@hugeicons/core-free-icons";
import { authClient } from "@/lib/authClient";

export function SignInDialog({
  onClose,
  onSuccess
}: {
  onClose: () => void;
  onSuccess?: () => void;
}): JSX.Element {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    setError(null);

    try {
      if (mode === "signup") {
        const result = await authClient.signUp.email({
          email,
          password,
          name
        });
        if (result.error) {
          setError(result.error.message ?? "Sign up failed");
          return;
        }
      } else {
        const result = await authClient.signIn.email({
          email,
          password
        });
        if (result.error) {
          setError(result.error.message ?? "Sign in failed");
          return;
        }
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await authClient.signIn.social({ provider: "google" });
      if (result && "error" in result && result.error) {
        setError(result.error.message ?? "Google sign in failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4">
      <div className="w-full max-w-md rounded-lg border border-hairline bg-canvas p-6 shadow-sm md:p-8">
        <div className="mb-6 flex items-center justify-between border-b border-hairline pb-3">
          <h2 className="font-serif-display text-2xl tracking-tight text-ink-primary">
            {mode === "signin" ? "Sign In" : "Create Account"}
          </h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-ink transition-colors"
            aria-label="Close"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="h-5 w-5" />
          </button>
        </div>

        {error && <p className="mb-4 text-sm text-error">{error}</p>}

        <div className="space-y-3">
          {mode === "signup" && (
            <div className="relative">
              <HugeiconsIcon
                icon={UserIcon}
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              />
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10 w-full rounded-lg border border-hairline bg-canvas py-2 pl-10 pr-3 text-sm text-ink outline-none transition-colors focus:border-accent"
              />
            </div>
          )}
          <div className="relative">
            <HugeiconsIcon
              icon={Mail01Icon}
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 w-full rounded-lg border border-hairline bg-canvas py-2 pl-10 pr-3 text-sm text-ink outline-none transition-colors focus:border-accent"
            />
          </div>
          <div className="relative">
            <HugeiconsIcon
              icon={LockPasswordIcon}
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 w-full rounded-lg border border-hairline bg-canvas py-2 pl-10 pr-3 text-sm text-ink outline-none transition-colors focus:border-accent"
            />
          </div>
        </div>

        <button
          onClick={submit}
          disabled={loading}
          className="mt-4 inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-ink px-5 text-sm font-medium text-canvas transition-colors hover:bg-ink-deep disabled:bg-surface-card disabled:text-muted"
        >
          {loading ? "Please wait…" : mode === "signin" ? "Sign In" : "Sign Up"}
        </button>

        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-hairline" />
          <span className="text-xs text-muted">or</span>
          <div className="h-px flex-1 bg-hairline" />
        </div>

        <button
          onClick={signInWithGoogle}
          disabled={loading}
          className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-hairline bg-canvas px-5 text-sm text-ink transition-colors hover:bg-soft-stone disabled:bg-surface-card disabled:text-muted"
        >
          <HugeiconsIcon icon={GoogleIcon} className="h-4 w-4" />
          Continue with Google
        </button>

        <p className="mt-4 text-center text-xs text-muted">
          {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="text-accent underline transition-colors hover:text-accent/80"
          >
            {mode === "signin" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
