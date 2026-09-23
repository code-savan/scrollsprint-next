import type { MetadataRoute } from "next";

const SITE_URL = "https://scrollsprint.online";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/dashboard/", "/login/", "/signup/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
