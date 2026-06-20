import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideDetailClient } from "@/components/guides/guide-detail-client";
import { guides } from "@/src/data/guides";
import { absoluteUrl } from "@/src/config/seo";

type GuideParams = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: GuideParams): Promise<Metadata> {
  const { slug } = await params;
  const guide = guides.find((g) => g.slug === slug);

  if (!guide) {
    return {
      title: "Guide not found | Collector Dream Factory",
    };
  }

  return {
    title: guide.seoTitleTh,
    description: guide.seoDescriptionTh,
    keywords: guide.keywords,
    alternates: {
      canonical: `/guides/${guide.slug}`,
    },
    openGraph: {
      title: guide.seoTitleTh,
      description: guide.seoDescriptionTh,
      url: absoluteUrl(`/guides/${guide.slug}`),
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: guide.seoTitleTh,
      description: guide.seoDescriptionTh,
    },
  };
}

export default async function GuidePage({ params }: GuideParams) {
  const { slug } = await params;
  const guide = guides.find((g) => g.slug === slug);

  if (!guide) {
    notFound();
  }

  // Schema.org Article JSON-LD
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": guide.titleTh,
    "description": guide.excerptTh,
    "inLanguage": "th-TH",
    "mainEntityOfPage": absoluteUrl(`/guides/${slug}`),
    "author": {
      "@type": "Organization",
      "name": "Collector Dream Factory",
      "url": absoluteUrl("/")
    },
    "publisher": {
      "@type": "Organization",
      "name": "Collector Dream Factory",
      "url": absoluteUrl("/")
    }
  };

  // Schema.org FAQPage JSON-LD
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "inLanguage": "th-TH",
    "mainEntity": guide.faq.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <GuideDetailClient slug={slug} />
    </>
  );
}
