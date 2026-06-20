import type { MetadataRoute } from "next";
import { siteUrl } from "@/src/config/seo";

export default function robots(): MetadataRoute.Robots {
  const allowedAiAndSearchBots = [
    "Googlebot",
    "Bingbot",
    "GPTBot",
    "OAI-SearchBot",
    "ChatGPT-User",
    "ClaudeBot",
    "PerplexityBot",
    "CCBot",
  ];

  return {
    rules: [
      ...allowedAiAndSearchBots.map((userAgent) => ({
        userAgent,
        allow: "/",
      })),
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
