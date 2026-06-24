"use client";

import type { JSX } from "react";
import { useState } from "react";
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
    try {
      await authClient.signIn.social({ provider: "google" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign in failed");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-surface p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-bold">
          {mode === "signin" ? "Sign In" : "Create Account"}
        </h2>

        {error && <p className="mb-3 text-sm text-red-400">{error}</p>}

        <div className="space-y-3">
          {mode === "signup" && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-white/10 bg-ink px-3 py-2 text-sm text-white outline-none focus:border-neon-blue"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-white/10 bg-ink px-3 py-2 text-sm text-white outline-none focus:border-neon-blue"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-white/10 bg-ink px-3 py-2 text-sm text-white outline-none focus:border-neon-blue"
          />
        </div>

        <button
          onClick={submit}
          disabled={loading}
          className="mt-4 w-full rounded-lg bg-neon-pink py-2 text-sm font-semibold text-white hover:bg-neon-pink/90 disabled:opacity-50"
        >
          {loading ? "Please wait…" : mode === "signin" ? "Sign In" : "Sign Up"}
        </button>

        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-white/40">or</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <button
          onClick={signInWithGoogle}
          disabled={loading}
          className="w-full rounded-lg border border-white/10 bg-ink py-2 text-sm hover:bg-white/5 disabled:opacity-50"
        >
          Continue with Google
        </button>

        <p className="mt-4 text-center text-xs text-white/50">
          {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="text-neon-pink underline"
          >
            {mode === "signin" ? "Sign up" : "Sign in"}
          </button>
        </p>

        <button
          onClick={onClose}
          className="mt-4 w-full text-xs text-white/50 hover:text-white"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
