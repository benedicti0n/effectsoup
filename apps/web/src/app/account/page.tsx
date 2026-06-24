import type { JSX } from "react";

export default function AccountPage(): JSX.Element {
  return (
    <main className="min-h-screen bg-charcoal p-8 text-neon-cream">
      <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-surface p-8">
        <h1 className="mb-6 text-2xl font-bold">Account</h1>
        <p className="text-white/70">
          Authentication integration is wired but requires environment variables to activate.
        </p>
        <div className="mt-6 flex gap-4">
          <button className="rounded-lg bg-neon-pink px-6 py-2 text-sm font-semibold text-white">
            Sign In
          </button>
          <button className="rounded-lg border border-white/10 px-6 py-2 text-sm hover:bg-white/5">
            Sign Out
          </button>
        </div>
      </div>
    </main>
  );
}
