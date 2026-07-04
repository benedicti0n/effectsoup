import type { MetadataRoute } from "next";
import { canonical } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: Array<{
    path: string;
    changeFrequency?:
      | "always"
      | "hourly"
      | "daily"
      | "weekly"
      | "monthly"
      | "yearly"
      | "never";
    priority?: number;
  }> = [
    { path: "/", changeFrequency: "weekly", priority: 1.0 },
    { path: "/playground", changeFrequency: "weekly", priority: 0.9 },
    { path: "/docs", changeFrequency: "monthly", priority: 0.7 },
    { path: "/account", changeFrequency: "monthly", priority: 0.3 }
  ];

  return routes.map(({ path, changeFrequency, priority }) => ({
    url: canonical(path),
    lastModified: now,
    changeFrequency,
    priority
  }));
}
