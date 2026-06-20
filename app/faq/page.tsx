import type { Metadata } from "next";
import { FaqPageClient } from "@/components/faq/faq-page-client";
import { dictionary } from "@/src/config/dictionary";
import { absoluteUrl, seoKeywords } from "@/src/config/seo";

const faqCopy = dictionary.th.faq;

export const metadata: Metadata = {
  title: faqCopy.metaTitle,
  description: faqCopy.metaDescription,
  keywords: seoKeywords,
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: faqCopy.metaTitle,
    description: faqCopy.metaDescription,
    url: absoluteUrl("/faq"),
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: faqCopy.metaTitle,
    description: faqCopy.metaDescription,
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  name: faqCopy.title,
  description: faqCopy.subtitle,
  inLanguage: "th-TH",
  mainEntity: faqCopy.items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <FaqPageClient />
    </>
  );
}
