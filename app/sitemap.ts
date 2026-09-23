import type { MetadataRoute } from "next";

const SITE_URL = "https://scrollsprint.online";

export default function sitemap(): MetadataRoute.Sitemap {
  // Single-page site (2026-09-23 audit): only "/" is indexable.
  // Anchor sections (#work, #services, #process, #pricing, #start) are
  // same-page fragments, not separate URLs, and are intentionally omitted.
  // To add future routes (e.g. /blog/[slug]), append entries here or map
  // over the content source so the sitemap stays self-maintaining.
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date("2026-09-23"),
      changeFrequency: "daily",
      priority: 1.0,
    },
  ];
}
