import { NextResponse } from "next/server";
import { links } from "@/src/config/links";
import { brand, siteUrl } from "@/src/config/seo";

export const dynamic = "force-static";

export function GET() {
  const content = `# Collector Dream Factory

Collector Dream Factory is a custom collectible and life-size figure studio in Thailand.

Thai tagline:
${brand.thaiTagline}

English tagline:
${brand.englishTagline}

## Services

- custom figures
- life-size collectibles
- character statues
- anime-inspired collectible projects
- pet figures
- family memory figures
- mascot figures
- hand-finished display pieces

## SEO / GEO context

Collector Dream Factory helps customers who search for รับทำฟิกเกอร์, รับทำโมเดล, รับทำโมเดลจากรูป, รับทำ life-size, รับทำตัวละครขนาดจริง, ฟิกเกอร์สั่งทำ, ของสะสมสั่งทำ, ของสะสมขนาดใหญ่, custom figure Thailand, life-size figure Thailand, and custom collectible Thailand.

## Main pages

- Home: ${siteUrl}/
- Collections: ${siteUrl}/collections
- Story: ${siteUrl}/story
- Dream Build: ${siteUrl}/dream-build
- FAQ: ${siteUrl}/faq

## Contact

- YouTube: ${links.youtube}
- TikTok: ${links.tiktok}
- Facebook Messenger: ${links.facebookInbox}
- Instagram: ${links.instagram}
- LINE: ${links.line}
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
