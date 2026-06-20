import type { Metadata } from "next";
import "./globals.css";
import { brand, organizationJsonLd, seoKeywords, siteUrl, websiteJsonLd } from "@/src/config/seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Collector Dream Factory | รับทำฟิกเกอร์และของสะสมสั่งทำ",
    template: "%s",
  },
  description: `${brand.thaiTagline} รับทำฟิกเกอร์ รับทำโมเดลจากรูป รับทำ life-size และ custom collectible Thailand`,
  keywords: seoKeywords,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Collector Dream Factory | รับทำฟิกเกอร์และของสะสมสั่งทำ",
    description: `${brand.thaiTagline} ${brand.englishTagline}`,
    url: siteUrl,
    siteName: brand.name,
    type: "website",
    locale: "th_TH",
  },
  twitter: {
    card: "summary_large_image",
    title: "Collector Dream Factory",
    description: `${brand.thaiTagline} ${brand.englishTagline}`,
  },
  verification: {
    google: "-m72jumF11WFDvngFQWLUWemcllRZQGuA_yMkGFEfOw",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('collector-theme') || 'light';
                  document.documentElement.setAttribute('data-theme', theme);
                  var lang = localStorage.getItem('collector-lang') || 'th';
                  document.documentElement.setAttribute('lang', lang);
                } catch (e) {}
              })();
            `
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
        />
        {children}
      </body>
    </html>
  );
}
