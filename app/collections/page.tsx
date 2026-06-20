import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { absoluteUrl, seoKeywords } from "@/src/config/seo";

export const metadata: Metadata = {
  title: "คอลเลกชัน | Collector Dream Factory",
  description: "ตัวอย่างฟิกเกอร์สั่งทำ ของสะสมสั่งทำ life-size figure และ custom collectible Thailand",
  keywords: seoKeywords,
  alternates: {
    canonical: "/#collections",
  },
  openGraph: {
    title: "คอลเลกชัน | Collector Dream Factory",
    description: "ตัวอย่างงานรับทำฟิกเกอร์ รับทำโมเดล และของสะสมขนาดใหญ่",
    url: absoluteUrl("/collections"),
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "คอลเลกชัน | Collector Dream Factory",
    description: "ตัวอย่างงานรับทำฟิกเกอร์ รับทำโมเดล และของสะสมขนาดใหญ่",
  },
};

export default function CollectionsPage() {
  redirect("/#collections");
}
