/**
 * Centralized SEO constants for the EffectSoup web app.
 *
 * These feed Next.js `generateMetadata` and the JSON-LD structured
 * data blocks. Keeping them centralized prevents drift across pages
 * and gives one obvious place to tune titles, descriptions, keywords,
 * canonical URL, social-card image, etc.
 */

export const SITE_NAME = "EffectSoup";
export const SITE_TAGLINE = "Beautiful Image Effects";
export const SITE_DESCRIPTION =
  "Transform your images with beautiful browser-based effects. Explore dither, ASCII, halftone, glow, print, retro signal, and more.";
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
 * Priority: NEXT_PUBLIC_SITE_URL > NEXT_PUBLIC_APP_URL > VERCEL_URL > production fallback.
 */
export function getSiteOrigin(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl && siteUrl.length > 0) {
    return siteUrl.replace(/\/+$/, "");
  }
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (appUrl && appUrl.length > 0) {
    return appUrl.replace(/\/+$/, "");
  }
  const vercel = process.env.VERCEL_URL;
  if (vercel) {
    return `https://${vercel}`;
  }
  return "https://www.effectsoup.com";
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
