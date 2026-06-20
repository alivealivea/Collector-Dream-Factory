import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { absoluteUrl, seoKeywords } from "@/src/config/seo";

export const metadata: Metadata = {
  title: "Dream Build | Collector Dream Factory",
  description: "เริ่มโปรเจกต์ฟิกเกอร์สั่งทำ รับทำโมเดลจากรูป และของสะสมขนาดใหญ่",
  keywords: seoKeywords,
  alternates: {
    canonical: "/dream-project",
  },
  openGraph: {
    title: "Dream Build | Collector Dream Factory",
    description: "ส่งรูปอ้างอิงเพื่อเริ่มประเมินโปรเจกต์ของสะสมสั่งทำ",
    url: absoluteUrl("/dream-build"),
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dream Build | Collector Dream Factory",
    description: "ส่งรูปอ้างอิงเพื่อเริ่มประเมินโปรเจกต์ของสะสมสั่งทำ",
  },
};

export default function DreamBuildPage() {
  redirect("/dream-project");
}
