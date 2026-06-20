"use client";

import Link from "next/link";
import type React from "react";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SmartImageFrame } from "@/components/story/smart-image-frame";
import { links } from "@/src/config/links";
import { dictionary, type Lang } from "@/src/config/dictionary";
import {
  behindTheDream,
  collectorStories,
  instagramFeed,
  videoGallery,
} from "@/src/config/story-content";

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

export function StoryPageClient() {
  const { lang, toggleLang, t } = useLanguage();
  const storyCopy = t.story;

  return (
    <main className="min-h-screen bg-void font-thai text-ivory">
      <StoryNav label={t.nav} onToggleLang={toggleLang} />
      <section className="px-5 pb-14 pt-14 md:px-10 md:pb-20 md:pt-20 xl:px-16">
        <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div>
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.18em] text-gold">
              {storyCopy.heroEyebrow}
            </p>
            <h1 className="text-[clamp(3.4rem,10vw,8rem)] font-semibold leading-[0.94] tracking-[-0.055em]">
              {storyCopy.title}
            </h1>
            <p className="mt-6 text-[clamp(1.5rem,3vw,3rem)] font-semibold leading-tight tracking-[-0.04em] text-gold">
              {storyCopy.subtitle}
            </p>
          </div>
          <div className="grid gap-6">
            <p className="max-w-4xl text-xl font-medium leading-9 text-mist">
              {storyCopy.heroBody}
            </p>
            <SmartImageFrame
              src="/images/portfolio/portfolio-08.jpg"
              alt="Life-size collectible story hero"
              priority
              sizes="(min-width: 1024px) 62vw, 92vw"
              openLabel={t.image.open}
              closeLabel={t.image.close}
            />
          </div>
        </div>
      </section>

      <section className="px-5 py-14 md:px-10 md:py-20 xl:px-16">
        <div className="mx-auto max-w-[1440px]">
          <SectionHeader
            eyebrow={storyCopy.behindEyebrow}
            title={storyCopy.behindTitle}
            subtitle={storyCopy.behindSubtitle}
          />
          <div className="grid gap-5 md:grid-cols-2">
            {behindTheDream.map((item, index) => {
              const card = storyCopy.behindCards[index];
              return (
                <article
                  key={item.image}
                  className="overflow-hidden rounded-2xl border border-[var(--line)] bg-gallery shadow-[var(--soft-shadow)]"
                >
                  <SmartImageFrame
                    src={item.image}
                    alt={card.title}
                    sizes="(min-width: 768px) 46vw, 92vw"
                    openLabel={t.image.open}
                    closeLabel={t.image.close}
                    className="rounded-none border-0 shadow-none"
                  />
                  <div className="p-6 md:p-7">
                    <span className="font-mono text-xs font-bold text-shadow-text">
                      0{index + 1}
                    </span>
                    <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em]">
                      {card.title}
                    </h3>
                    <p className="mt-3 text-base leading-7 text-mist">
                      {card.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-5 py-14 md:px-10 md:py-20 xl:px-16">
        <div className="mx-auto max-w-[1440px]">
          <SectionHeader
            eyebrow={storyCopy.storyEyebrow}
            title={storyCopy.storyTitle}
          />
          <div className="grid gap-6 lg:grid-cols-2">
            {collectorStories.map((story) => {
              const copy = {
                eyebrow: storyCopy.stories[story.slug].eyebrow,
                title: lang === "th" ? story.story.titleTh : story.story.titleEn,
                description: lang === "th" ? story.story.excerptTh : story.story.excerptEn,
              };
              return (
                <article
                  key={story.slug}
                  className="overflow-hidden rounded-2xl border border-[var(--line)] bg-gallery shadow-[var(--soft-shadow)]"
                >
                  <SmartImageFrame
                    src={story.image}
                    alt={copy.title}
                    sizes="(min-width: 1024px) 46vw, 92vw"
                    openLabel={t.image.open}
                    closeLabel={t.image.close}
                    className="rounded-none border-0 shadow-none"
                  />
                  <div className="p-6 md:p-7">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold">
                      {copy.eyebrow}
                    </p>
                    <h3 className="mt-3 text-[clamp(1.8rem,3.4vw,3.6rem)] font-semibold leading-[1.02] tracking-[-0.045em]">
                      {copy.title}
                    </h3>
                    <p className="mt-4 max-w-3xl text-base leading-7 text-mist md:text-lg">
                      {copy.description}
                    </p>
                    <Link
                      href={`/story/${story.slug}`}
                      className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-ivory transition hover:text-gold"
                    >
                      {storyCopy.readStory} <ArrowRight size={16} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-5 py-14 md:px-10 md:py-20 xl:px-16">
        <div className="mx-auto max-w-[1440px]">
          <SectionHeader
            eyebrow={storyCopy.videoEyebrow}
            title={storyCopy.videoTitle}
            action={
              <a
                href={links.youtube}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-bold text-ivory hover:text-gold"
              >
                {storyCopy.openYoutube} <ArrowRight size={16} />
              </a>
            }
          />
          <div className="grid gap-5 md:grid-cols-3">
            {videoGallery.map((video, index) => {
              const copy = storyCopy.videos[index];
              return (
                <article
                  key={video.image}
                  className="overflow-hidden rounded-2xl border border-[var(--line)] bg-gallery shadow-[var(--soft-shadow)]"
                >
                  <SmartImageFrame
                    src={video.image}
                    alt={copy.title}
                    sizes="(min-width: 768px) 30vw, 92vw"
                    openLabel={t.image.open}
                    closeLabel={t.image.close}
                    className="rounded-none border-0 shadow-none"
                  />
                  <div className="p-5">
                    <h3 className="text-xl font-semibold tracking-[-0.025em]">
                      {copy.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-mist">
                      {copy.description}
                    </p>
                    <a
                      href={video.href}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-ivory hover:text-gold"
                    >
                      {storyCopy.openYoutube} <ArrowRight size={16} />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-5 py-14 md:px-10 md:py-20 xl:px-16">
        <div className="mx-auto max-w-[1440px]">
          <SectionHeader
            eyebrow={storyCopy.instagramEyebrow}
            title={storyCopy.instagramTitle}
            action={
              <a
                href={links.instagram}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-bold text-ivory hover:text-gold"
              >
                @meme_premium123 <ArrowRight size={16} />
              </a>
            }
          />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
            {instagramFeed.map((post, index) => (
              <article
                key={post.image}
                className="overflow-hidden rounded-2xl border border-[var(--line)] bg-gallery shadow-[var(--soft-shadow)]"
              >
                <SmartImageFrame
                  src={post.image}
                  alt={storyCopy.instagram[index]}
                  sizes="(min-width: 768px) 23vw, 46vw"
                  openLabel={t.image.open}
                  closeLabel={t.image.close}
                  ratio="auto"
                  className="rounded-none border-0 shadow-none"
                />
                <a
                  href={post.href}
                  target="_blank"
                  rel="noreferrer"
                  className="block p-4 text-sm font-semibold text-mist hover:text-ivory"
                >
                  {storyCopy.instagram[index]}
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:px-10 md:py-24 xl:px-16">
        <div className="mx-auto max-w-[1120px] rounded-3xl border border-[var(--line)] bg-gallery p-7 text-center shadow-[var(--soft-shadow)] md:p-12">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-gold">
            {storyCopy.finalEyebrow}
          </p>
          <h2 className="mx-auto max-w-4xl text-[clamp(2.5rem,5.6vw,6rem)] font-semibold leading-[0.98] tracking-[-0.055em]">
            {storyCopy.finalTitle}
          </h2>
          <Button href="/dream-project" className="mt-8">
            {storyCopy.finalCta}
          </Button>
        </div>
      </section>
    </main>
  );
}

function StoryNav({
  label,
  onToggleLang,
}: {
  label: (typeof dictionary)[Lang]["nav"];
  onToggleLang: () => void;
}) {
  return (
    <header className="border-b border-[var(--line)] bg-void/82 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 md:px-10 xl:px-16">
        <Link href="/" className="font-display text-lg tracking-wide">
          Collector Dream Factory
        </Link>
        <div className="hidden items-center gap-7 text-sm font-semibold text-mist md:flex">
          <Link href="/#collections" className="transition hover:text-ivory">
            {label.collections}
          </Link>
          <Link href="/story" className="text-ivory">
            {label.story}
          </Link>
          <a href={links.instagram} target="_blank" rel="noreferrer" className="transition hover:text-ivory">
            Instagram
          </a>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleLang}
            className="min-h-10 rounded-full border border-[var(--line)] bg-gallery/80 px-4 text-xs font-bold uppercase tracking-[0.08em] text-mist transition hover:text-ivory"
          >
            {label.language}
          </button>
          <Button href="/dream-project" className="hidden md:inline-flex">
            {label.start}
          </Button>
        </div>
      </nav>
    </header>
  );
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:mb-12 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-gold">
          {eyebrow}
        </p>
        <h2 className="text-[clamp(2.4rem,5vw,5.2rem)] font-semibold leading-[1] tracking-[-0.05em]">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-4 max-w-xl text-base leading-8 text-mist md:text-lg">
            {subtitle}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
