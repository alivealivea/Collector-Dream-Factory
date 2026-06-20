import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoryDetailClient } from "@/components/story/story-detail-client";
import { collectorStories } from "@/src/config/story-content";
import { getStoryBySlug, stories } from "@/src/data/stories";
import { absoluteUrl, seoKeywords, storyArticleJsonLd } from "@/src/config/seo";

type StorySlug = (typeof collectorStories)[number]["slug"];

type StoryParams = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return stories.map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({ params }: StoryParams): Promise<Metadata> {
  const { slug } = await params;
  const story = getStoryBySlug(slug);

  if (!story) {
    return {
      title: "Story not found | Collector Dream Factory",
    };
  }

  return {
    title: story.seoTitleTh,
    description: story.seoDescriptionTh,
    keywords: seoKeywords,
    alternates: {
      canonical: `/story/${story.slug}`,
    },
    openGraph: {
      title: story.seoTitleTh,
      description: story.seoDescriptionTh,
      url: absoluteUrl(`/story/${story.slug}`),
      type: "article",
      images: [{ url: absoluteUrl(story.heroImage) }],
    },
    twitter: {
      card: "summary_large_image",
      title: story.seoTitleTh,
      description: story.seoDescriptionTh,
      images: [absoluteUrl(story.heroImage)],
    },
  };
}

export default async function StoryDetailPage({ params }: StoryParams) {
  const { slug } = await params;
  const story = collectorStories.find((item) => item.slug === slug);

  if (!story) {
    notFound();
  }

  const jsonLd = storyArticleJsonLd(slug);

  return (
    <>
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}
      <StoryDetailClient slug={slug as StorySlug} />
    </>
  );
}
