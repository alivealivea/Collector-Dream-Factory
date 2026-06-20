import type { Metadata } from "next";
import { StoryPageClient } from "@/components/story/story-page-client";
import { dictionary } from "@/src/config/dictionary";
import { absoluteUrl, seoKeywords } from "@/src/config/seo";

export const metadata: Metadata = {
  title: dictionary.th.story.metaTitle,
  description: dictionary.th.story.metaDescription,
  keywords: seoKeywords,
  alternates: {
    canonical: "/story",
  },
  openGraph: {
    title: dictionary.th.story.metaTitle,
    description: dictionary.th.story.metaDescription,
    url: absoluteUrl("/story"),
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: dictionary.th.story.metaTitle,
    description: dictionary.th.story.metaDescription,
  },
};

export default function StoryPage() {
  return <StoryPageClient />;
}
