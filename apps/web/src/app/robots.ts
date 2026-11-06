import type { MetadataRoute } from "next";

import { baseUrl } from "@/utils/base-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        allow: ["/", "/og/*", "/llms.txt"],
        disallow: ["/api/", "/auth/"],
        userAgent: "*",
      },
      {
        allow: ["/", "/og/*", "/llms.txt"],
        disallow: ["/api/", "/auth/"],
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "PerplexityBot",
          "ClaudeBot",
          "Claude-SearchBot",
          "Applebot-Extended",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
