"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HumanScaleFigure } from "@/components/human-scale-figure";
import { contactLinks } from "@/src/config/links";
import {
  collections,
  materialDetails,
  sizeOptions,
  type CollectionSlug,
  type SizeKey,
} from "@/src/config/collections";
import { cn } from "@/lib/utils";

type Lang = "th" | "en";

const dictionary = {
  th: {
    back: "กลับไปคอลเลกชัน",
    category: "หมวดหมู่",
    sizeTitle: "เลือกขนาด",
    estimated: "ราคาเริ่มต้น",
    priceGuide: "ราคาเริ่มต้นตามขนาด",
    priceNotes: [
      "ราคาประเมินเบื้องต้น อาจเปลี่ยนตามรายละเอียดงาน สี ฐาน และความซับซ้อนของโมเดล",
      "ราคานี้ไม่รวมจัดส่ง ลูกค้าสามารถเรียก Lalamove หรือรถมารับเองได้",
      "งานทำสีเต็ม / งานเก็บผิวละเอียด / ฐานโชว์ คิดราคาเพิ่มตามรายละเอียด",
    ],
    height: "ความสูง",
    details: "รายละเอียดงาน",
    gallery: "แกลเลอรี",
    related: "ชิ้นงานที่เกี่ยวข้อง",
    ctaTitle: "พร้อมสร้างชิ้นงานของคุณ?",
    estimate: "ขอประเมินราคาจริง",
    reference: "ส่งรูปอ้างอิง",
    contact: "ช่องทางติดต่อ",
    view: "ดูรายละเอียด",
    lightboxClose: "ปิด",
  },
  en: {
    back: "Back to collections",
    category: "Category",
    sizeTitle: "Choose size",
    estimated: "Starting price",
    priceGuide: "Starting price by size",
    priceNotes: [
      "This is an early estimate and may change based on details, paint, base, and model complexity.",
      "Shipping is not included. Customers can arrange Lalamove or pickup by car.",
      "Full painting, detailed finishing, and display bases are quoted separately.",
    ],
    height: "Height",
    details: "Project details",
    gallery: "Gallery",
    related: "Customers also viewed",
    ctaTitle: "Ready to create your piece?",
    estimate: "Request real estimate",
    reference: "Send references",
    contact: "Contact",
    view: "View details",
    lightboxClose: "Close",
  },
} as const;

export function CollectionDetailClient({ slug }: { slug: CollectionSlug }) {
  const [lang, setLang] = useState<Lang>("th");
  const item = collections.find((collection) => collection.slug === slug)!;
  const [selectedImage, setSelectedImage] = useState<string>(item.images[0]);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<SizeKey>("100");

  useEffect(() => {
    const stored = window.localStorage.getItem("collector-lang");
    if (stored === "th" || stored === "en") {
      setLang(stored);
      document.documentElement.setAttribute("lang", stored);
    }
  }, []);

  useEffect(() => {
    if (!lightboxImage) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLightboxImage(null);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [lightboxImage]);

  const t = dictionary[lang];
  const copy = item[lang];
  const activeSize = sizeOptions[selectedSize];
  const badges = Array.from(
    new Set([item.category, item.badge, "Hero Piece", "Life-size", "Prototype", "Gallery Piece"]),
  );
  const related = useMemo(
    () => collections.filter((collection) => collection.slug !== slug).slice(0, 3),
    [slug],
  );

  const toggleLang = () => {
    setLang((current) => {
      const next = current === "th" ? "en" : "th";
      window.localStorage.setItem("collector-lang", next);
      document.documentElement.setAttribute("lang", next);
      return next;
    });
  };

  return (
    <main className="min-h-screen bg-void font-thai text-ivory">
      <header className="border-b border-[var(--line)] bg-void/82 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 md:px-10 xl:px-16">
          <Link href="/#collections" className="text-sm font-bold text-mist hover:text-ivory">
            {t.back}
          </Link>
          <button
            type="button"
            onClick={toggleLang}
            className="min-h-10 rounded-full border border-[var(--line)] bg-gallery/80 px-4 text-xs font-bold uppercase tracking-[0.08em] text-mist transition hover:text-ivory"
          >
            {lang.toUpperCase()} / {lang === "th" ? "EN" : "TH"}
          </button>
        </nav>
      </header>

      <section className="px-5 py-10 md:px-10 md:py-16 xl:px-16">
        <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
          <div>
            <button
              type="button"
              onClick={() => setLightboxImage(selectedImage)}
              className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-3xl border border-[var(--line)] bg-[#F5F1EA] p-4 shadow-[var(--soft-shadow)]"
            >
              <img
                src={selectedImage}
                alt={copy.title}
                className="block h-full w-full object-contain object-center"
              />
            </button>
            <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
              {item.images.map((image) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setSelectedImage(image)}
                  className={cn(
                    "flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-[#F5F1EA] p-2 transition",
                    selectedImage === image ? "border-gold" : "border-[var(--line)]",
                  )}
                >
                  <img
                    src={image}
                    alt={copy.title}
                    className="block h-full w-full object-contain object-center"
                  />
                </button>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-[var(--line)] bg-gallery p-6 shadow-[var(--soft-shadow)] md:p-8">
            <p className="mb-4 inline-flex rounded-full border border-gold/35 bg-gold/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-gold">
              {item.badge}
            </p>
            <h1 className="text-[clamp(3rem,6vw,6.4rem)] font-semibold leading-[0.95] tracking-[-0.055em]">
              {copy.title}
            </h1>
            <p className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-gold">
              {copy.subtitle}
            </p>
            <p className="mt-5 text-lg leading-8 text-mist">
              {copy.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-[var(--line)] bg-[#F5F1EA] px-3 py-1 text-xs font-bold text-mist"
                >
                  {badge}
                </span>
              ))}
            </div>

            <div className="mt-8 border-t border-[var(--line)] pt-7">
              <h2 className="text-2xl font-semibold tracking-[-0.035em]">
                {t.sizeTitle}
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {(Object.keys(sizeOptions) as SizeKey[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedSize(key)}
                    className={cn(
                      "rounded-2xl border p-4 text-left transition",
                      selectedSize === key
                        ? "border-gold bg-gold text-[var(--button-text)]"
                        : "border-[var(--line)] bg-[#F5F1EA] text-ivory hover:border-gold/50",
                    )}
                  >
                    <span className="block text-lg font-bold">{sizeOptions[key].label}</span>
                    <span className="mt-1 block text-sm font-semibold opacity-75">
                      {t.estimated} {sizeOptions[key].price}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 border-t border-[var(--line)] pt-7">
              <h2 className="text-2xl font-semibold tracking-[-0.035em]">
                {t.priceGuide}
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {(Object.keys(sizeOptions) as SizeKey[]).map((key) => (
                  <div
                    key={`price-${key}`}
                    className={cn(
                      "rounded-2xl border p-4 transition",
                      selectedSize === key
                        ? "border-gold bg-gold/10"
                        : "border-[var(--line)] bg-[#F5F1EA]",
                    )}
                  >
                    <p className="text-sm font-bold text-mist">{sizeOptions[key].label}</p>
                    <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[#17130f]">
                      {sizeOptions[key].price}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-5 space-y-2 rounded-2xl border border-[var(--line)] bg-[#F5F1EA] p-4">
                {t.priceNotes.map((note) => (
                  <p key={note} className="text-sm font-medium leading-6 text-mist">
                    {note}
                  </p>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="px-5 py-8 md:px-10 md:py-12 xl:px-16">
        <div className="mx-auto grid max-w-[1120px] gap-6 rounded-3xl border border-[var(--line)] bg-gallery p-6 shadow-[var(--soft-shadow)] md:grid-cols-[0.9fr_1.1fr] md:p-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-gold">
              {t.height}
            </p>
            <h2 className="mt-2 text-[clamp(2rem,4vw,4.2rem)] font-semibold leading-none tracking-[-0.05em]">
              {activeSize.label}
            </h2>
            <p className="mt-3 text-lg font-semibold text-gold">
              {t.estimated} {activeSize.price}
            </p>
          </div>
          <div className="relative min-h-[360px] overflow-hidden rounded-2xl bg-[#F5F1EA] p-5">
            <div className="absolute inset-x-5 bottom-8 h-px bg-[#8b5b26]/24" />
            <div className="absolute bottom-8 left-[5%] h-[84%] w-px bg-[#8b5b26]" />
            <div className="absolute bottom-[calc(2rem+84%)] left-[5%] h-px w-[17%] bg-[#8b5b26]" />
            <div className="absolute bottom-8 left-[5%] h-px w-[17%] bg-[#8b5b26]" />
            <div className="absolute bottom-[calc(2rem+84%)] left-[18%] h-px w-[35%] border-t border-dashed border-[#8b5b26]/35" />
            <HumanScaleFigure className="absolute bottom-8 left-[8%] h-[84%] w-[22%]" />
            <span className="absolute left-[6%] top-1/2 rounded-full bg-white/85 px-3 py-1 text-xs font-bold text-[#8b5b26] shadow-sm">
              170 cm
            </span>

            <div
              className="absolute bottom-8 left-[64%] -translate-x-1/2 drop-shadow-[0_18px_18px_rgba(23,19,15,0.18)]"
              style={{ height: `${activeSize.height}%`, width: `${activeSize.width}%` }}
            >
              <img
                src={item.images[0]}
                alt={copy.title}
                className="block h-full w-full object-contain object-bottom"
              />
            </div>
            <div
              className="absolute bottom-8 right-[12%] w-px bg-cyan"
              style={{ height: `${activeSize.height}%` }}
            />
            <span
              className="absolute right-[5%] rounded-full border border-cyan/40 bg-white/90 px-3 py-1 text-xs font-bold text-[#17130f]"
              style={{ bottom: `calc(2rem + ${activeSize.height}% - 14px)` }}
            >
              {activeSize.label}
            </span>
          </div>
        </div>
      </section>

      <section className="px-5 py-10 md:px-10 md:py-16 xl:px-16">
        <div className="mx-auto max-w-[1120px]">
          <h2 className="mb-5 text-[clamp(2rem,4vw,4rem)] font-semibold tracking-[-0.05em]">
            {t.details}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {materialDetails.map((detail) => (
              <div key={detail} className="rounded-2xl border border-[var(--line)] bg-gallery p-5 shadow-[var(--soft-shadow)]">
                <p className="text-lg font-bold">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-10 md:px-10 md:py-16 xl:px-16">
        <div className="mx-auto max-w-[1440px]">
          <h2 className="mb-5 text-[clamp(2rem,4vw,4rem)] font-semibold tracking-[-0.05em]">
            {t.gallery}
          </h2>
          <div className="grid gap-5 md:grid-cols-5">
            {item.gallery.map((entry) => (
              <button
                key={`${entry.label}-${entry.image}`}
                type="button"
                onClick={() => setLightboxImage(entry.image)}
                className="overflow-hidden rounded-2xl border border-[var(--line)] bg-gallery text-left shadow-[var(--soft-shadow)]"
              >
                <div className="flex aspect-[4/3] items-center justify-center bg-[#F5F1EA] p-3">
                  <img
                    src={entry.image}
                    alt={entry.label}
                    className="block h-full w-full object-contain object-center"
                  />
                </div>
                <p className="p-4 text-sm font-bold text-mist">{entry.label}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-10 md:px-10 md:py-16 xl:px-16">
        <div className="mx-auto max-w-[1440px]">
          <h2 className="mb-5 text-[clamp(2rem,4vw,4rem)] font-semibold tracking-[-0.05em]">
            {t.related}
          </h2>
          <div className="grid gap-5 md:grid-cols-3">
            {related.map((relatedItem) => {
              const relatedCopy = relatedItem[lang];
              return (
                <Link
                  key={relatedItem.slug}
                  href={`/collection/${relatedItem.slug}`}
                  className="group overflow-hidden rounded-2xl border border-[var(--line)] bg-gallery shadow-[var(--soft-shadow)] transition hover:-translate-y-1"
                >
                  <div className="flex aspect-[4/3] items-center justify-center bg-[#F5F1EA] p-4">
                    <img
                      src={relatedItem.images[0]}
                      alt={relatedCopy.title}
                      className="block h-full w-full object-contain object-center"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold">
                      {relatedItem.badge}
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold tracking-[-0.035em]">
                      {relatedCopy.title}
                    </h3>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold group-hover:text-gold">
                      {t.view} <ArrowRight size={15} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-5 py-12 md:px-10 md:py-20 xl:px-16">
        <div className="mx-auto max-w-[1120px] rounded-3xl border border-[var(--line)] bg-gallery p-7 text-center shadow-[var(--soft-shadow)] md:p-12">
          <h2 className="text-[clamp(2.5rem,5vw,5.4rem)] font-semibold leading-none tracking-[-0.055em]">
            {t.ctaTitle}
          </h2>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/dream-project">{t.estimate}</Button>
            <Button href="/dream-project" variant="secondary">
              {t.reference}
            </Button>
          </div>
        </div>
      </section>

      <section className="px-5 pb-16 md:px-10 md:pb-24 xl:px-16">
        <div className="mx-auto max-w-[1120px]">
          <h2 className="mb-5 text-[clamp(2rem,4vw,4rem)] font-semibold tracking-[-0.05em]">
            {t.contact}
          </h2>
          <div className="grid gap-3 md:grid-cols-5">
            {contactLinks.map((contact) => (
              <a
                key={contact.platform}
                href={contact.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-[var(--line)] bg-gallery p-5 shadow-[var(--soft-shadow)] transition hover:-translate-y-0.5 hover:border-gold/50"
              >
                <p className="text-sm font-black text-gold">{contact.shortLabel}</p>
                <h3 className="mt-3 text-lg font-bold">{contact.platform}</h3>
                <p className="mt-1 text-sm font-semibold text-mist">{contact.handle}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {lightboxImage ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#17130f]/82 p-4 backdrop-blur-sm"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative flex h-[88vh] w-full max-w-6xl items-center justify-center rounded-2xl border border-white/20 bg-[#111] p-3 shadow-[0_30px_100px_rgba(0,0,0,0.5)]"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={lightboxImage}
              alt={copy.title}
              className="block h-full w-full object-contain object-center"
            />
            <button
              type="button"
              onClick={() => setLightboxImage(null)}
              className="absolute right-4 top-4 rounded-full border border-white/20 bg-white/92 px-4 py-2 text-sm font-bold text-[#17130f] shadow-sm"
            >
              {t.lightboxClose}
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
}
