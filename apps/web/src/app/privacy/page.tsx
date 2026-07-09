import type { Metadata } from "next";
import type { JSX } from "react";
import { SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${SITE_NAME} handles your data.`
};

export default function PrivacyPage(): JSX.Element {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 lg:px-8 lg:py-24">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-accent">
        Legal
      </p>
      <h1 className="font-serif-display text-3xl leading-[1.2] tracking-tight text-ink-primary md:text-4xl">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-muted">Last updated: July 2026</p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-body-muted [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:font-display [&_h2]:text-base [&_h2]:font-medium [&_h2]:tracking-tight [&_h2]:text-ink-primary [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1.5">

        <section>
          <h2>What EffectSoup is</h2>
          <p>
            EffectSoup is a browser-based image effects studio. You upload a photo,
            choose an effect, and export the result. Every pixel is processed inside
            your browser using Web Workers and the Canvas 2D API. No image data is
            sent to any server.
          </p>
          <p>
            Authentication is optional and is only needed if you choose to sign in.
          </p>
        </section>

        <section>
          <h2>What we collect</h2>
          <p>We do not collect, store, or process images on any server. All image processing happens entirely on your device.</p>

          <h3>If you sign in</h3>
          <p>
            EffectSoup uses{" "}
            <a href="https://clerk.com" target="_blank" rel="noopener noreferrer" className="text-action-blue underline">
              Clerk
            </a>{" "}
            for authentication. When you create an account or sign in, Clerk receives
            and stores the information you provide:
          </p>
          <ul>
            <li>Email address</li>
            <li>Full name (if provided)</li>
            <li>A user identifier associated with your account</li>
            <li>If you sign in with Google, your Google account email and name</li>
          </ul>
          <p>
            Clerk stores this data on its own infrastructure. EffectSoup only
            receives a session identifier from Clerk to know that you are signed in.
            We do not have access to your Clerk account password or your Google
            access token.
          </p>
          <p>
            You can sign out at any time via the Account page. Managing or deleting
            your account data is handled through Clerk&apos;s account management
            tools.
          </p>

          <h3>Usage analytics</h3>
          <p>
            EffectSoup uses{" "}
            <a href="https://vercel.com/analytics" target="_blank" rel="noopener noreferrer" className="text-action-blue underline">
              Vercel Analytics
            </a>{" "}
            to collect anonymized, aggregate data about how the site is used. This
            includes:
          </p>
          <ul>
            <li>Page views and navigation paths</li>
            <li>Browser type and operating system</li>
            <li>Device type (mobile, tablet, desktop)</li>
            <li>Referrer URL</li>
            <li>Country-level location (not precise location)</li>
          </ul>
          <p>
            Vercel Analytics does not use cookies, does not collect personal
            information, and does not track you across other sites. The data is used
            solely to understand usage patterns and improve the product.
          </p>
        </section>

        <section>
          <h2>What we do not collect</h2>
          <ul>
            <li>We do not collect, upload, or store your images on any server.</li>
            <li>We do not use cookies, localStorage, sessionStorage, or IndexedDB.</li>
            <li>We do not send email, newsletters, or marketing communications.</li>
            <li>We do not use advertising networks, tracking pixels, or third-party trackers.</li>
            <li>We do not sell, rent, or share your personal information with third parties.</li>
            <li>We do not use AI or machine learning to process images.</li>
          </ul>
        </section>

        <section>
          <h2>Infrastructure</h2>
          <p>
            EffectSoup is hosted on{" "}
            <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-action-blue underline">
              Vercel
            </a>
            . Vercel may collect standard server logs (IP address, request timing,
            status codes) for operational purposes such as security monitoring and
            abuse prevention. Vercel&apos;s data practices are governed by{" "}
            <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-action-blue underline">
              their privacy policy
            </a>
            .
          </p>
        </section>

        <section>
          <h2>Data retention</h2>
          <p>
            Because EffectSoup does not operate its own database or file storage, we
            do not retain any personal data on our own infrastructure. Authentication
            data is managed by Clerk in accordance with{" "}
            <a href="https://clerk.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-action-blue underline">
              Clerk&apos;s privacy policy
            </a>
            . Analytics data is retained by Vercel in accordance with{" "}
            <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-action-blue underline">
              their policy
            </a>
            .
          </p>
        </section>

        <section>
          <h2>Third-party services</h2>
          <p>The following third-party services are used by EffectSoup:</p>
          <ul>
            <li>
              <strong>Clerk</strong> — authentication.{" "}
              <a href="https://clerk.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-action-blue underline">
                Clerk privacy policy
              </a>
            </li>
            <li>
              <strong>Vercel</strong> — hosting, CDN, and analytics.{" "}
              <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-action-blue underline">
                Vercel privacy policy
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h2>Changes to this policy</h2>
          <p>
            If this policy changes, the &ldquo;Last updated&rdquo; date at the top
            will be revised. Continued use of EffectSoup after changes means you
            accept the updated policy.
          </p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>
            If you have questions about this privacy policy, you can open an issue
            on the{" "}
            <a href="https://github.com/benedicti0n/effectsoup" target="_blank" rel="noopener noreferrer" className="text-action-blue underline">
              EffectSoup GitHub repository
            </a>
            .
          </p>
        </section>

      </div>
    </main>
  );
}
