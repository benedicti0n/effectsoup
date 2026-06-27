"use client";

import Link from "next/link";
import { useState, type JSX } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/authClient";
import { SignInDialog } from "@/components/auth/signInDialog";
import { cn } from "@/lib/utils";

export function SiteHeader({ noPadding = false }: { noPadding?: boolean } = {}): JSX.Element {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const { data: session } = authClient.useSession();

  const navLinks = [
    { href: "/playground", label: "Playground" },
    { href: "/docs", label: "Docs" }
  ];

  return (
    <>
      {showSignIn && <SignInDialog onClose={() => setShowSignIn(false)} />}
      <header className="sticky top-0 z-50 border-b border-hairline bg-canvas/95 backdrop-blur">
        <div className={cn("mx-auto flex h-16 max-w-container items-center justify-between", !noPadding && "px-4 lg:px-8")}>
          <Link href="/" className="font-display text-xl font-medium tracking-tight text-ink-primary">
            EffectSoup
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-ink hover:text-muted transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            <Link
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-ink hover:text-muted transition-colors"
            >
              GitHub
            </Link>
            {session ? (
              <Button variant="secondary" asChild>
                <Link href="/account">Account</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => setShowSignIn(true)}>
                  Log In
                </Button>
                <Button onClick={() => setShowSignIn(true)}>Sign Up</Button>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((s) => !s)}
            className="flex h-10 w-10 items-center justify-center rounded-sm md:hidden"
            aria-label="Toggle menu"
          >
            <HugeiconsIcon icon={menuOpen ? Cancel01Icon : Menu01Icon} className="h-5 w-5" />
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-hairline bg-canvas md:hidden">
            <div className={cn("mx-auto max-w-container space-y-1 py-4", !noPadding && "px-4")}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-sm px-3 py-2.5 text-base font-medium text-ink hover:bg-soft-stone"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2">
                {session ? (
                  <Button className="w-full" variant="secondary" asChild>
                    <Link href="/account" onClick={() => setMenuOpen(false)}>
                      Account
                    </Link>
                  </Button>
                ) : (
                  <Button className="w-full" onClick={() => { setMenuOpen(false); setShowSignIn(true); }}>
                    Sign Up / Log In
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
