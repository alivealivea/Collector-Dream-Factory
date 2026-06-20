import type { MetadataRoute } from "next";
import { pieces } from "@/src/data/pieces";
import { stories } from "@/src/data/stories";
import { guides } from "@/src/data/guides";
import { absoluteUrl, importantRoutes } from "@/src/config/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = importantRoutes.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: route.priority,
  }));

  const collectionRoutes = pieces.map((item) => ({
    url: absoluteUrl(`/collection/${item.slug}`),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  const storyRoutes = stories.map((story) => ({
    url: absoluteUrl(`/story/${story.slug}`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  const guideLandingRoute = {
    url: absoluteUrl("/guides"),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  };

  const guideRoutes = guides.map((guide) => ({
    url: absoluteUrl(`/guides/${guide.slug}`),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...routes, ...collectionRoutes, ...storyRoutes, guideLandingRoute, ...guideRoutes];
}
