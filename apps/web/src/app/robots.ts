import type { MetadataRoute } from "next";
import { canonical, getSiteOrigin } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/account"]
      },
      {
        userAgent: [
          "Googlebot",
          "Slurp",
          "DuckDuckBot",
          "Baiduspider",
          "YandexBot",
          "Bingbot",
          "Applebot",
          "facebookexternalhit",
          "Twitterbot",
          "LinkedInBot"
        ],
        allow: "/",
        disallow: ["/api/", "/account"]
      }
    ],
    sitemap: `${getSiteOrigin()}/sitemap.xml`,
    host: getSiteOrigin()
  };
}

// Re-export canonical for tests / external utilities.
export { canonical };
