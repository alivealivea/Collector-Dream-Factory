"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { guides } from "@/src/data/guides";
import { socialLinks } from "@/src/config/links";

type Lang = "th" | "en";

export function GuidesPageClient() {
  const [lang, setLang] = useState<Lang>("th");

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

  const t = {
    th: {
      navBack: "กลับหน้าแรก",
      language: "TH / EN",
      eyebrow: "KNOWLEDGE BASE & GUIDES",
      title: "คู่มือการสั่งทำของสะสม",
      subtitle: "รวมข้อมูล เทคนิค และขั้นตอนการเปลี่ยนภาพในจินตนาการของคุณให้กลายเป็นชิ้นงานจริง",
      readMore: "อ่านคู่มือนี้",
      footer: "เปลี่ยนตัวละครที่คุณรักให้กลายเป็นของสะสมสั่งทำและฟิกเกอร์สั่งทำที่ตั้งอยู่ในบ้านคุณได้จริง โดยสตูดิโอรับทำฟิกเกอร์และโมเดลชั้นนำ",
      collections: "คอลเลกชัน",
      project: "สั่งทำ",
      about: "เรื่องราว",
      faq: "คำถามที่พบบ่อย",
      guides: "คู่มือการสั่งทำ",
      ctaTitle: "มีคำถามหรืออยากเริ่มโปรเจกต์ของคุณเอง?",
      ctaBtn: "เริ่มประเมินราคาโปรเจกต์",
    },
    en: {
      navBack: "Back Home",
      language: "EN / TH",
      eyebrow: "KNOWLEDGE BASE & GUIDES",
      title: "Custom Collectible Guides",
      subtitle: "Everything you need to know about commissioning, scaling, and producing custom figures.",
      readMore: "Read this guide",
      footer: "Bring your favorite characters to life with custom high-quality collectible figure and model design studio.",
      collections: "Collections",
      project: "Dream Project",
      about: "Story",
      faq: "FAQ",
      guides: "Guides",
      ctaTitle: "Have questions or ready to start your project?",
      ctaBtn: "Get a custom quote",
    }
  }[lang];

  return (
    <main className="min-h-screen bg-void font-thai text-ivory">
      {/* Navigation */}
      <header className="border-b border-[var(--line)] bg-void/82 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 md:px-10 xl:px-16">
          <Link href="/" className="font-display text-lg tracking-wide">
            Collector Dream Factory
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/" className="hidden text-sm font-bold text-mist transition hover:text-ivory sm:block">
              {t.navBack}
            </Link>
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

      {/* Hero Header */}
      <section className="px-5 pb-8 pt-14 md:px-10 md:pb-12 md:pt-20 xl:px-16">
        <div className="mx-auto max-w-[1120px]">
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.18em] text-gold">
            {t.eyebrow}
          </p>
          <h1 className="max-w-5xl text-[clamp(3.4rem,9vw,7.4rem)] font-semibold leading-[0.94] tracking-[-0.055em]">
            {t.title}
          </h1>
          <p className="mt-7 max-w-3xl text-xl font-medium leading-9 text-mist md:text-2xl">
            {t.subtitle}
          </p>
        </div>
      </section>

      {/* Guide Cards Grid */}
      <section className="px-5 py-8 md:px-10 md:py-12 xl:px-16">
        <div className="mx-auto grid max-w-[1120px] gap-6 md:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => (
            <article
              key={guide.slug}
              className="flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--line)] bg-gallery p-6 shadow-[var(--soft-shadow)] transition hover:-translate-y-0.5 hover:border-gold/50"
            >
              <div>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#F5F1EA] text-gold mb-5">
                  <BookOpen size={20} />
                </span>
                <h3 className="text-xl font-bold leading-snug tracking-[-0.02em]">
                  {lang === "th" ? guide.titleTh : guide.titleEn}
                </h3>
                <p className="mt-3 text-sm leading-6 text-mist line-clamp-3">
                  {guide.excerptTh}
                </p>
              </div>
              <div className="mt-6 border-t border-[var(--line)] pt-4">
                <Link
                  href={`/guides/${guide.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-bold text-gold transition hover:text-gold-light"
                >
                  {t.readMore} <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-5 py-12 md:px-10 md:py-16 xl:px-16">
        <div className="mx-auto max-w-[1120px] rounded-3xl border border-[var(--line)] bg-gallery p-8 text-center shadow-[var(--soft-shadow)] md:p-12">
          <h2 className="text-[clamp(2.2rem,4.5vw,4.4rem)] font-semibold leading-[1.03] tracking-[-0.04em]">
            {t.ctaTitle}
          </h2>
          <Button href="/dream-project" className="mt-8">
            {t.ctaBtn}
          </Button>
        </div>
      </section>

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
