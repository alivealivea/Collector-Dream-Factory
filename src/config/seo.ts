import { links } from "@/src/config/links";
import { pieces, getPieceBySlug } from "@/src/data/pieces";
import { getStoryBySlug, stories } from "@/src/data/stories";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export const seoKeywords = [
  "รับทำฟิกเกอร์",
  "รับทำโมเดล",
  "รับทำโมเดลจากรูป",
  "รับทำ life-size",
  "รับทำตัวละครขนาดจริง",
  "ฟิกเกอร์สั่งทำ",
  "ของสะสมสั่งทำ",
  "ของสะสมขนาดใหญ่",
  "custom figure Thailand",
  "life-size figure Thailand",
  "custom collectible Thailand",
];

export const brand = {
  name: "Collector Dream Factory",
  thaiTagline: "ผลงานในฝัน สำหรับนักสะสมตัวจริง",
  englishTagline: "Turn Your Favorite Character Into a Real Collectible.",
  description:
    "รับทำฟิกเกอร์ รับทำโมเดลจากรูป และของสะสมสั่งทำในประเทศไทย รวมถึง life-size figure, character statue, pet figure, family memory figure และ mascot figure",
};

export function absoluteUrl(path: string) {
  if (path.startsWith("http")) return path;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export const importantRoutes = [
  { path: "/", priority: 1 },
  { path: "/collections", priority: 0.8 },
  { path: "/story", priority: 0.8 },
  { path: "/dream-project", priority: 0.9 },
  { path: "/project-status", priority: 0.5 },
  { path: "/faq", priority: 0.8 },
];

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    name: brand.name,
    url: siteUrl,
    description: brand.description,
    slogan: `${brand.thaiTagline} | ${brand.englishTagline}`,
    areaServed: "Thailand",
    sameAs: [
      links.youtube,
      links.tiktok,
      links.facebookInbox,
      links.instagram,
      links.line,
      links.fastwork,
      links.shopee,
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        availableLanguage: ["th", "en"],
        url: links.facebookInbox,
      },
    ],
    makesOffer: [
      "custom figures",
      "life-size collectibles",
      "character statues",
      "anime-inspired collectible projects",
      "pet figures",
      "family memory figures",
      "mascot figures",
      "hand-finished display pieces",
    ].map((name) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name,
      },
    })),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: brand.name,
    url: siteUrl,
    inLanguage: ["th-TH", "en"],
    description: brand.description,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/faq?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function collectionJsonLd(slug: string) {
  const item = getPieceBySlug(slug);
  if (!item) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${item.titleTh} ${item.subtitleTh}`,
    description: `${item.descriptionTh} ${item.descriptionEn}`,
    image: item.galleryImages.map(absoluteUrl),
    brand: {
      "@type": "Brand",
      name: brand.name,
    },
    category: item.category,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "THB",
      lowPrice: "3900",
      highPrice: "18900",
      offerCount: "4",
      availability: "https://schema.org/PreOrder",
    },
  };
}

export function storyArticleJsonLd(slug: string) {
  const story = getStoryBySlug(slug);
  if (!story) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: story.titleTh,
    description: story.excerptTh,
    image: absoluteUrl(story.heroImage),
    author: {
      "@type": "Organization",
      name: brand.name,
    },
    publisher: {
      "@type": "Organization",
      name: brand.name,
    },
    mainEntityOfPage: absoluteUrl(`/story/${slug}`),
  };
}

export { pieces, stories };
