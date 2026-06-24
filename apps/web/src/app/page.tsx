import Link from "next/link";
import type { JSX } from "react";

export default function HomePage(): JSX.Element {
  return (
    <main className="min-h-screen bg-charcoal">
      <header className="border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="font-mono text-xl font-bold text-neon-pink">effectLab</div>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/editor" className="text-white/80 hover:text-white">
              Editor
            </Link>
            <Link href="/account" className="text-white/80 hover:text-white">
              Account
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          Transform photos into retro-digital art.
        </h1>
        <p className="text-lg md:text-xl text-white/70 mb-8 max-w-2xl mx-auto">
          Upload an image, pick a vibe, adjust one slider, and export. No AI. Your image stays on
          your device while editing.
        </p>
        <Link
          href="/editor"
          className="inline-flex items-center justify-center rounded-lg bg-neon-pink px-8 py-3 text-sm font-semibold text-white hover:bg-neon-pink/90 transition"
        >
          Open the Editor
        </Link>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 grid gap-8 md:grid-cols-3">
        {[
          { title: "Dither", desc: "Ordered and error-diffusion dither effects." },
          { title: "ASCII & Halftone", desc: "Terminal glyphs and newsprint dots." },
          { title: "Dream & Retro", desc: "Glow, grain, CRT, VHS, and riso looks." }
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-white/10 bg-surface p-6 hover:border-neon-blue/50 transition"
          >
            <h3 className="font-mono text-neon-lavender mb-2">{item.title}</h3>
            <p className="text-white/70 text-sm">{item.desc}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Free vs Premium</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-surface p-6">
            <h3 className="font-semibold mb-4">Free</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li>8 free presets</li>
              <li>Upload, crop, preview all effects</li>
              <li>Export up to 1080px</li>
              <li>No watermark</li>
            </ul>
          </div>
          <div className="rounded-xl border border-neon-pink/30 bg-surface p-6">
            <h3 className="font-semibold mb-4 text-neon-pink">Premium — $3/month</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li>All 16 presets</li>
              <li>Original / 4K export</li>
              <li>Full advanced controls</li>
              <li>Cloud projects</li>
            </ul>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-8 text-center text-sm text-white/50">
        <p>No AI. Your image stays on your device while editing.</p>
      </footer>
    </main>
  );
}
