import type { Metadata } from "next";
import { absoluteUrl, seoKeywords } from "@/src/config/seo";

export const metadata: Metadata = {
  title: "เริ่มโปรเจกต์ของคุณ | Collector Dream Factory",
  description:
    "ส่งรูปอ้างอิง เลือกขนาด และเริ่มประเมินงานฟิกเกอร์สั่งทำ รับทำโมเดลจากรูป และ life-size figure Thailand",
  keywords: seoKeywords,
  alternates: {
    canonical: "/dream-project",
  },
  openGraph: {
    title: "เริ่มโปรเจกต์ของคุณ | Collector Dream Factory",
    description: "ส่งรูปอ้างอิงเพื่อประเมินงานฟิกเกอร์สั่งทำและของสะสมขนาดใหญ่",
    url: absoluteUrl("/dream-project"),
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "เริ่มโปรเจกต์ของคุณ | Collector Dream Factory",
    description: "ส่งรูปอ้างอิงเพื่อประเมินงานฟิกเกอร์สั่งทำและของสะสมขนาดใหญ่",
  },
};

export default function DreamProjectLayout({ children }: { children: React.ReactNode }) {
  return children;
}
