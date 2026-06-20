import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionDetailClient } from "@/components/collection/collection-detail-client";
import { collections, type CollectionSlug } from "@/src/config/collections";
import { getPieceBySlug, pieces } from "@/src/data/pieces";
import { absoluteUrl, collectionJsonLd, seoKeywords } from "@/src/config/seo";

type CollectionParams = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return pieces.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: CollectionParams): Promise<Metadata> {
  const { slug } = await params;
  const item = getPieceBySlug(slug);

  if (!item) {
    return {
      title: "Collection not found | Collector Dream Factory",
    };
  }

  return {
    title: item.seoTitleTh,
    description: item.seoDescriptionTh,
    keywords: seoKeywords,
    alternates: {
      canonical: `/collection/${item.slug}`,
    },
    openGraph: {
      title: item.seoTitleTh,
      description: item.seoDescriptionTh,
      url: absoluteUrl(`/collection/${item.slug}`),
      type: "website",
      images: item.galleryImages.map((image) => ({ url: absoluteUrl(image) })),
    },
    twitter: {
      card: "summary_large_image",
      title: item.seoTitleTh,
      description: item.seoDescriptionTh,
      images: [absoluteUrl(item.heroImage)],
    },
  };
}

export default async function CollectionPage({ params }: CollectionParams) {
  const { slug } = await params;
  const item = collections.find((collection) => collection.slug === slug);

  if (!item) {
    notFound();
  }

  const jsonLd = collectionJsonLd(slug);

  return (
    <>
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}
      <CollectionDetailClient slug={slug as CollectionSlug} />
    </>
  );
}
