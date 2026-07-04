/**
 * Centralized SEO constants for the EffectSoup web app.
 *
 * These feed Next.js `generateMetadata` and the JSON-LD structured
 * data blocks. Keeping them centralized prevents drift across pages
 * and gives one obvious place to tune titles, descriptions, keywords,
 * canonical URL, social-card image, etc.
 */

export const SITE_NAME = "EffectSoup";
export const SITE_TAGLINE =
  "Beautiful image effects, made in your browser.";
export const SITE_DESCRIPTION =
  "EffectSoup is a free, browser-based image effects studio. Apply pixel grids, halftones, ASCII art, glowing symbols, cinematic bloom, and graphic print looks — no uploads, no AI, no signup. Edit, preview, and export PNG, JPEG, or WebP in seconds.";
export const SITE_KEYWORDS = [
  "image effects",
  "photo effects online",
  "browser image editor",
  "free image editor",
  "pixel art filter",
  "halftone effect",
  "ASCII art generator",
  "dithering filter",
  "photographic effects",
  "WebP export",
  "PNG export",
  "no upload photo editor",
  "privacy first photo editor",
  "client-side image processing",
  "WebGL image filters",
  "Web Worker image editor",
  "visual effects studio",
  "open source photo editor"
];

export const SITE_LOCALE = "en";
export const SITE_TYPE = "website";

/**
 * The absolute public origin. Override at deploy time via env.
 * Falls back to the production Vercel default and finally localhost.
 */
export function getSiteOrigin(): string {
  const explicit = process.env.NEXT_PUBLIC_APP_URL;
  if (explicit && explicit.length > 0) {
    return explicit.replace(/\/+$/, "");
  }
  const vercel = process.env.VERCEL_URL;
  if (vercel) {
    return `https://${vercel}`;
  }
  return "https://effectsoup-web.vercel.app";
}

/**
 * Canonical URL for a pathname. Leading slash required; returns the
 * root URL for "/".
 */
export function canonical(pathname: string): string {
  const origin = getSiteOrigin();
  if (!pathname || pathname === "/") return `${origin}/`;
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${origin}${normalized}`;
}
