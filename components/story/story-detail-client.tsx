"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SmartImageFrame } from "@/components/story/smart-image-frame";
import { dictionary, type Lang } from "@/src/config/dictionary";
import { collectorStories } from "@/src/config/story-content";

type StorySlug = (typeof collectorStories)[number]["slug"];

function useLanguage() {
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

  return { lang, toggleLang, t: dictionary[lang] };
}

export function StoryDetailClient({ slug }: { slug: StorySlug }) {
  const { lang, toggleLang, t } = useLanguage();
  const story = collectorStories.find((item) => item.slug === slug)!;
  const copy = {
    eyebrow: t.story.stories[slug].eyebrow,
    title: lang === "th" ? story.story.titleTh : story.story.titleEn,
    description: lang === "th" ? story.story.excerptTh : story.story.excerptEn,
  };
  const body = lang === "th" ? story.story.bodyTh : story.story.bodyEn;

  return (
    <main className="min-h-screen bg-void font-thai text-ivory">
      <header className="border-b border-[var(--line)] bg-void/82 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 md:px-10 xl:px-16">
          <Link href="/story" className="inline-flex items-center gap-2 text-sm font-bold text-mist hover:text-ivory">
            <ArrowLeft size={16} /> {t.nav.backToStory}
          </Link>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleLang}
              className="min-h-10 rounded-full border border-[var(--line)] bg-gallery/80 px-4 text-xs font-bold uppercase tracking-[0.08em] text-mist transition hover:text-ivory"
            >
              {t.nav.language}
            </button>
            <Button href="/dream-project" className="hidden md:inline-flex">
              {t.nav.start}
            </Button>
          </div>
        </nav>
      </header>

      <article className="px-5 py-14 md:px-10 md:py-20 xl:px-16">
        <div className="mx-auto max-w-[1180px]">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-gold">
            {copy.eyebrow}
          </p>
          <h1 className="max-w-5xl text-[clamp(3rem,8vw,7rem)] font-semibold leading-[0.96] tracking-[-0.055em]">
            {copy.title}
          </h1>
          <p className="mt-6 max-w-3xl text-xl font-medium leading-9 text-mist">
            {copy.description}
          </p>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <SmartImageFrame
              src={story.image}
              alt={copy.title}
              priority
              sizes="(min-width: 1024px) 58vw, 92vw"
              openLabel={t.image.open}
              closeLabel={t.image.close}
            />
            <SmartImageFrame
              src={story.heroImage}
              alt={`${copy.title} collectible`}
              sizes="(min-width: 1024px) 34vw, 80vw"
              openLabel={t.image.open}
              closeLabel={t.image.close}
            />
          </div>

          <section className="mx-auto mt-14 grid max-w-4xl gap-7 text-lg leading-9 text-mist">
            {body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <div className="pt-4">
              <Button href="/dream-project">
                {t.story.detailCta}
              </Button>
            </div>
          </section>

          <section className="mt-14">
            <div className="grid gap-5 md:grid-cols-3">
              {story.gallery.map((image) => (
                <SmartImageFrame
                  key={image}
                  src={image}
                  alt={copy.title}
                  sizes="(min-width: 768px) 30vw, 92vw"
                  openLabel={t.image.open}
                  closeLabel={t.image.close}
                  ratio="auto"
                />
              ))}
            </div>
          </section>
        </div>
      </article>
    </main>
  );
}
