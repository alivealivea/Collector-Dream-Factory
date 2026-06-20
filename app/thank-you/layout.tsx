import type { Metadata } from "next";
import { absoluteUrl, seoKeywords } from "@/src/config/seo";

export const metadata: Metadata = {
  title: "ได้รับข้อมูลแล้ว | Collector Dream Factory",
  description: "ขอบคุณที่ส่งรายละเอียดโปรเจกต์ Collector Dream Factory จะติดต่อกลับผ่านช่องทางที่คุณสะดวกที่สุด",
  keywords: seoKeywords,
  alternates: {
    canonical: "/thank-you",
  },
  openGraph: {
    title: "ได้รับข้อมูลแล้ว | Collector Dream Factory",
    description: "ขั้นตอนต่อไปหลังส่งโปรเจกต์ฟิกเกอร์สั่งทำและของสะสมสั่งทำ",
    url: absoluteUrl("/thank-you"),
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "ได้รับข้อมูลแล้ว | Collector Dream Factory",
    description: "ขั้นตอนต่อไปหลังส่งโปรเจกต์ฟิกเกอร์สั่งทำและของสะสมสั่งทำ",
  },
};

export default function ThankYouLayout({ children }: { children: React.ReactNode }) {
  return children;
}
