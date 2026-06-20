import type { Metadata } from "next";
import { GuidesPageClient } from "@/components/guides/guides-page-client";
import { absoluteUrl, seoKeywords } from "@/src/config/seo";

export const metadata: Metadata = {
  title: "คู่มือการสั่งทำฟิกเกอร์และของสะสม | Collector Dream Factory",
  description: "คลังความรู้สำหรับการสั่งทำของสะสมและฟิกเกอร์ แนะนำวิธีการเตรียมรูปถ่าย การเปรียบเทียบสเกลขนาด 30/60/100/170 cm การปั้น 3D การขนส่ง และการเตรียมไฟล์ STL",
  keywords: seoKeywords,
  alternates: {
    canonical: "/guides",
  },
  openGraph: {
    title: "คู่มือการสั่งทำฟิกเกอร์และของสะสม | Collector Dream Factory",
    description: "คลังความรู้และการสั่งทำโมเดล ฟิกเกอร์ จากภาพถ่าย ตลอดจนการพิมพ์ 3D ชิ้นงานขนาดใหญ่",
    url: absoluteUrl("/guides"),
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "คู่มือการสั่งทำฟิกเกอร์และของสะสม | Collector Dream Factory",
    description: "คลังความรู้และการสั่งทำโมเดล ฟิกเกอร์ จากภาพถ่าย ตลอดจนการพิมพ์ 3D ชิ้นงานขนาดใหญ่",
  },
};

export default function GuidesPage() {
  return <GuidesPageClient />;
}
