"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { guides, type Guide } from "@/src/data/guides";
import { socialLinks } from "@/src/config/links";
import { cn } from "@/lib/utils";

type Lang = "th" | "en";

export function GuideDetailClient({ slug }: { slug: string }) {
  const [lang, setLang] = useState<Lang>("th");
  const [openFaqIndex, setOpenFaqIndex] = useState<number>(0);

  useEffect(() => {
    const stored = window.localStorage.getItem("collector-lang");
    if (stored === "th" || stored === "en") {
      setLang(stored);
      document.documentElement.setAttribute("lang", stored);
    }
  }, []);

  const toggleLang = () => {
    setLang((current) => {
      const next = current === "th" ? "en" : "th";
      window.localStorage.setItem("collector-lang", next);
      document.documentElement.setAttribute("lang", next);
      return next;
    });
  };

  const guide = guides.find((g) => g.slug === slug);

  if (!guide) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-void text-ivory">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Guide Not Found</h1>
          <Link href="/guides" className="mt-4 inline-block text-gold hover:underline">
            Back to Guides
          </Link>
        </div>
      </div>
    );
  }

  const relatedGuides = guides.filter((g) => guide.relatedSlugs.includes(g.slug));

  const t = {
    th: {
      backToGuides: "กลับหน้าคู่มือ",
      language: "TH / EN",
      eyebrow: "GUIDE & TUTORIAL",
      faqTitle: "คำถามที่พบบ่อยเกี่ยวกับเรื่องนี้",
      relatedTitle: "คู่มือที่เกี่ยวข้อง",
      footer: "เปลี่ยนตัวละครที่คุณรักให้กลายเป็นของสะสมสั่งทำและฟิกเกอร์สั่งทำที่ตั้งอยู่ในบ้านคุณได้จริง โดยสตูดิโอรับทำฟิกเกอร์และโมเดลชั้นนำ",
      collections: "คอลเลกชัน",
      project: "สั่งทำ",
      about: "เรื่องราว",
      faq: "คำถามที่พบบ่อย",
      guides: "คู่มือการสั่งทำ",
      ctaTitle: "พร้อมสร้างผลงานในฝันชิ้นต่อไปหรือยัง?",
      ctaBtn: "เริ่มโปรเจกต์ของคุณ",
    },
    en: {
      backToGuides: "Back to Guides",
      language: "EN / TH",
      eyebrow: "GUIDE & TUTORIAL",
      faqTitle: "Frequently Asked Questions",
      relatedTitle: "Related Guides",
      footer: "Bring your favorite characters to life with custom high-quality collectible figure and model design studio.",
      collections: "Collections",
      project: "Dream Project",
      about: "Story",
      faq: "FAQ",
      guides: "Guides",
      ctaTitle: "Ready to start your dream piece?",
      ctaBtn: "Start your project",
    }
  }[lang];

  // Specific CTA text based on guide slug
  const getCtaLabel = () => {
    if (lang === "th") {
      switch (slug) {
        case "custom-figure-from-photo":
          return "ส่งรูปให้ประเมิน";
        case "life-size-figure-price-thailand":
          return "ขอประเมินราคา Life-size";
        case "figure-size-guide-30-60-100-170":
          return "ลองเลือกขนาด";
        case "custom-anime-character-statue":
          return "เริ่มโปรเจกต์อนิเมะของคุณ";
        case "pet-figure-from-photo":
          return "ส่งรูปสัตว์เลี้ยงให้ประเมิน";
        case "family-memory-figure":
          return "เริ่มทำของขวัญจากรูป";
        case "custom-mascot-statue":
          return "ขอประเมินงานมาสคอต";
        case "how-to-order-custom-figure":
          return "เริ่มสั่งทำ";
        case "custom-figure-delivery-thailand":
          return "ถามเรื่องขนส่ง";
        case "stl-to-real-collectible":
          return "ส่งไฟล์หรือรูปให้ประเมิน";
        default:
          return "เริ่มประเมินราคาโปรเจกต์";
      }
    } else {
      switch (slug) {
        case "custom-figure-from-photo":
          return "Send photos for estimate";
        case "life-size-figure-price-thailand":
          return "Request Life-size quote";
        case "figure-size-guide-30-60-100-170":
          return "Select your size";
        case "custom-anime-character-statue":
          return "Start your anime project";
        case "pet-figure-from-photo":
          return "Send pet photos for estimate";
        case "family-memory-figure":
          return "Start custom portrait gift";
        case "custom-mascot-statue":
          return "Request mascot quote";
        case "how-to-order-custom-figure":
          return "Order custom figure";
        case "custom-figure-delivery-thailand":
          return "Inquire about delivery";
        case "stl-to-real-collectible":
          return "Submit STL or photo for quote";
        default:
          return "Start project estimation";
      }
    }
  };

  return (
    <main className="min-h-screen bg-void font-thai text-ivory">
      {/* Navigation */}
      <header className="border-b border-[var(--line)] bg-void/82 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 md:px-10 xl:px-16">
          <Link href="/guides" className="inline-flex items-center gap-2 text-sm font-bold text-mist transition hover:text-ivory">
            <ArrowLeft size={16} /> {t.backToGuides}
          </Link>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleLang}
              className="min-h-10 rounded-full border border-[var(--line)] bg-gallery/80 px-4 text-xs font-bold uppercase tracking-[0.08em] text-mist transition hover:text-ivory"
            >
              {t.language}
            </button>
          </div>
        </nav>
      </header>

      {/* Article Body */}
      <article className="px-5 py-14 md:px-10 md:py-20 xl:px-16">
        <div className="mx-auto max-w-[980px]">
          <span className="mb-4 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-gold">
            <BookOpen size={16} /> {t.eyebrow}
          </span>
          <h1 className="text-[clamp(2.5rem,6.8vw,5.6rem)] font-semibold leading-[1.02] tracking-[-0.05em] text-ivory">
            {lang === "th" ? guide.titleTh : guide.titleEn}
          </h1>
          <p className="mt-6 text-lg font-medium leading-8 text-mist md:text-xl md:leading-9 border-l-4 border-gold/30 pl-5">
            {guide.excerptTh}
          </p>

          {/* Guide Sections */}
          <div className="mt-12 space-y-10">
            {guide.bodyTh.map((section, idx) => (
              <section key={idx} className="space-y-4">
                {section.heading && (
                  <h2 className="text-2xl font-bold tracking-tight text-ivory md:text-3xl mt-8">
                    {section.heading}
                  </h2>
                )}
                {section.paragraphs.map((p, pIdx) => (
                  <p key={pIdx} className="text-base leading-8 text-mist md:text-lg md:leading-8 font-normal">
                    {p}
                  </p>
                ))}
              </section>
            ))}
          </div>

          {/* CTA Box */}
          <div className="mt-14 rounded-2xl border border-gold/22 bg-[#F5F1EA] p-6 text-center shadow-[var(--soft-shadow)] md:p-8">
            <h3 className="text-xl font-bold md:text-2xl text-ivory tracking-[-0.03em]">
              {t.ctaTitle}
            </h3>
            <div className="mt-5">
              <Button href="/dream-project">{getCtaLabel()}</Button>
            </div>
            <p className="mt-3 text-xs text-shadow-text">
              * ราคาประเมินเบื้องต้น อาจเปลี่ยนตามรายละเอียดงาน
            </p>
            {(slug === "life-size-figure-price-thailand" || slug === "custom-figure-delivery-thailand") && (
              <p className="mt-1 text-xs text-gold font-semibold">
                * ลูกค้าสามารถเรียก Lalamove หรือรถมารับเองได้
              </p>
            )}
          </div>

          {/* Accordion FAQ Section */}
          <section className="mt-16 border-t border-[var(--line)] pt-14">
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-ivory mb-8">
              {t.faqTitle}
            </h2>
            <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-gallery shadow-[var(--soft-shadow)]">
              {guide.faq.map((faqItem, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div key={idx} className="border-b border-[var(--line)] last:border-b-0">
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                      className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left transition hover:bg-[#F5F1EA] md:px-7 md:py-6"
                    >
                      <span className="text-lg font-bold tracking-tight text-ivory md:text-xl">
                        {faqItem.question}
                      </span>
                      <ChevronDown
                        size={20}
                        className={cn("text-gold transition-transform duration-300", isOpen && "rotate-180")}
                      />
                    </button>
                    <div
                      className={cn(
                        "grid transition-all duration-300 ease-in-out",
                        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      )}
                    >
                      <div className="overflow-hidden">
                        <p className="px-5 pb-6 pt-2 text-base leading-7 text-mist md:px-7 md:pb-7 whitespace-pre-line">
                          {faqItem.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Related Guides section */}
          {relatedGuides.length > 0 && (
            <section className="mt-16 border-t border-[var(--line)] pt-14">
              <h2 className="text-3xl font-semibold tracking-[-0.04em] text-ivory mb-8">
                {t.relatedTitle}
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {relatedGuides.map((relGuide) => (
                  <Link
                    key={relGuide.slug}
                    href={`/guides/${relGuide.slug}`}
                    className="group block overflow-hidden rounded-2xl border border-[var(--line)] bg-gallery p-6 shadow-[var(--soft-shadow)] transition hover:-translate-y-0.5 hover:border-gold/50"
                  >
                    <h3 className="text-lg font-bold text-ivory group-hover:text-gold transition-colors">
                      {lang === "th" ? relGuide.titleTh : relGuide.titleEn}
                    </h3>
                    <p className="mt-2 text-sm text-mist line-clamp-2 leading-6">
                      {relGuide.excerptTh}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider text-gold">
                      Read Guide <ArrowRight size={12} />
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t border-[var(--line)] bg-gallery-lift px-4 py-8 md:px-10 md:py-14 xl:px-16">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-display text-2xl text-ivory">Collector Dream Factory</p>
            <p className="mt-3 max-w-md text-sm leading-6 text-mist">{t.footer}</p>
          </div>
          <div className="flex flex-wrap gap-x-7 gap-y-4 text-sm font-semibold text-mist">
            <Link href="/#collections" className="hover:text-ivory">
              {t.collections}
            </Link>
            <Link href="/dream-project" className="hover:text-ivory">
              {t.project}
            </Link>
            <Link href="/story" className="hover:text-ivory">
              {t.about}
            </Link>
            <Link href="/faq" className="hover:text-ivory">
              {t.faq}
            </Link>
            <Link href="/guides" className="hover:text-ivory text-gold">
              {t.guides}
            </Link>
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="hover:text-ivory"
              >
                {link.name}
                <span className="ml-1 text-shadow-text">{link.handle}</span>
              </a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
