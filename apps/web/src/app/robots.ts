import type { MetadataRoute } from "next";

import { baseUrl } from "@/utils/base-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        allow: ["/", "/og/*"],
        disallow: ["/api/", "/auth/"],
        userAgent: "*",
      },
      {
        allow: ["/", "/og/*"],
        disallow: ["/api/", "/auth/"],
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "PerplexityBot",
          "ClaudeBot",
          "Applebot-Extended",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
