import type { MetadataRoute } from "next";

const SITE_URL = "https://scrollsprint.online";

export default function robots(): MetadataRoute.Robots {
  // Step 2 decision (owner-confirmed 2026-09-23): all AI crawlers explicitly
  // allowed to maximise citation odds in AI answers, accepting zero-click
  // summarization tradeoff. Revisit if referral traffic drops.
  const aiCrawlers = [
    "GPTBot",
    "ChatGPT-User",
    "ClaudeBot",
    "PerplexityBot",
    "Google-Extended",
    "CCBot",
    "Applebot-Extended",
  ];
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/dashboard/", "/login/", "/signup/"],
      },
      ...aiCrawlers.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
