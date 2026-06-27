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
      <div className="w-full max-w-md rounded-sm border border-hairline bg-surface-soft p-6 shadow-sm md:p-8 bg-white">
        <div className="mb-6 flex items-center justify-between border-b border-hairline pb-3">
          <h2 className="font-mono text-2xl font-bold text-ink">
            {mode === "signin" ? "Sign In" : "Create Account"}
          </h2>
          <button
            onClick={onClose}
            className="text-mute hover:text-ink"
            aria-label="Close"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="h-5 w-5" />
          </button>
        </div>

        {error && <p className="mb-4 font-mono text-sm text-danger">{error}</p>}

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
                className="h-10 w-full rounded-sm border border-hairline bg-canvas py-2 pl-10 pr-3 font-mono text-sm text-ink outline-none focus:border-ink"
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
              className="h-10 w-full rounded-sm border border-hairline bg-canvas py-2 pl-10 pr-3 font-mono text-sm text-ink outline-none focus:border-ink"
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
              className="h-10 w-full rounded-sm border border-hairline bg-canvas py-2 pl-10 pr-3 font-mono text-sm text-ink outline-none focus:border-ink"
            />
          </div>
        </div>

        <button
          onClick={submit}
          disabled={loading}
          className="mt-4 inline-flex h-9 w-full items-center justify-center gap-2 rounded-sm bg-ink px-5 font-mono text-sm font-medium text-canvas hover:bg-ink-deep disabled:bg-surface-card disabled:text-ash"
        >
          <HugeiconsIcon
            icon={mode === "signin" ? Mail01Icon : UserIcon}
            className="h-4 w-4"
          />
          {loading ? "Please wait…" : mode === "signin" ? "Sign In" : "Sign Up"}
        </button>

        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-hairline" />
          <span className="font-mono text-xs text-mute">or</span>
          <div className="h-px flex-1 bg-hairline" />
        </div>

        <button
          onClick={signInWithGoogle}
          disabled={loading}
          className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-sm border border-hairline bg-canvas px-5 font-mono text-sm text-ink hover:bg-soft-stone disabled:bg-surface-card disabled:text-ash"
        >
          <HugeiconsIcon icon={GoogleIcon} className="h-4 w-4" />
          Continue with Google
        </button>

        <p className="mt-4 text-center font-mono text-xs text-mute">
          {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="text-ink underline"
          >
            {mode === "signin" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
