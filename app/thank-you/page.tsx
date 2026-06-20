"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { contactLinks } from "@/src/config/links";
import { dictionary, type Lang } from "@/src/config/dictionary";

const quickContacts = ["Facebook Messenger", "Instagram", "TikTok", "LINE Official"]
  .map((platform) => contactLinks.find((contact) => contact.platform === platform))
  .filter((contact): contact is (typeof contactLinks)[number] => Boolean(contact));

export default function ThankYouPage() {
  const [lang, setLang] = useState<Lang>("th");

  useEffect(() => {
    const stored = window.localStorage.getItem("collector-lang");
    if (stored === "th" || stored === "en") {
      setLang(stored);
      document.documentElement.setAttribute("lang", stored);
    }
  }, []);

  const t = dictionary[lang].thankYou;

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

      <section className="px-5 pb-10 pt-14 md:px-10 md:pb-16 md:pt-20 xl:px-16">
        <div className="mx-auto max-w-[980px] text-center">
          <span className="mx-auto mb-7 inline-flex h-14 w-14 items-center justify-center rounded-full bg-gold text-[var(--button-text)] shadow-[0_16px_34px_rgba(185,130,43,0.22)]">
            <Check size={26} />
          </span>
          <h1 className="text-[clamp(3.4rem,9vw,7.4rem)] font-semibold leading-[0.94] tracking-[-0.055em]">
            {t.headline}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl font-medium leading-8 text-mist md:text-2xl">
            {t.subheadline}
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-base font-bold leading-7 text-gold">
            {t.note}
          </p>
        </div>
      </section>

      <section className="px-5 py-8 md:px-10 md:py-12 xl:px-16">
        <div className="mx-auto max-w-[1120px] rounded-3xl border border-[var(--line)] bg-gallery p-5 shadow-[var(--soft-shadow)] md:p-8">
          <h2 className="mb-6 text-[clamp(2.2rem,4vw,4.4rem)] font-semibold leading-none tracking-[-0.05em]">
            {t.nextTitle}
          </h2>
          <div className="grid gap-3 md:grid-cols-4">
            {t.steps.map((step, index) => (
              <article key={step.title} className="rounded-2xl border border-[var(--line)] bg-[#F5F1EA] p-5">
                <span className="font-mono text-xs font-black text-gold">0{index + 1}</span>
                <h3 className="mt-4 text-xl font-semibold tracking-[-0.03em]">{step.title}</h3>
                <p className="mt-2 text-sm font-medium leading-6 text-mist">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-8 md:px-10 md:py-12 xl:px-16">
        <div className="mx-auto grid max-w-[1120px] gap-3 md:grid-cols-4">
          {quickContacts.map((contact) => (
            <a
              key={contact.platform}
              href={contact.href}
              target="_blank"
              rel="noreferrer"
              className="group rounded-2xl border border-[var(--line)] bg-gallery p-5 shadow-[var(--soft-shadow)] transition hover:-translate-y-0.5 hover:border-gold/50"
            >
              <span className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#F5F1EA] text-sm font-black text-gold">
                {contact.shortLabel}
              </span>
              <h3 className="text-xl font-bold leading-tight">{contact.platform}</h3>
              <p className="mt-1 text-sm font-semibold text-gold">{contact.handle}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-ivory group-hover:text-gold">
                {t.openChannel} <ArrowRight size={15} />
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="px-5 pb-20 pt-8 md:px-10 md:pb-28 xl:px-16">
        <div className="mx-auto max-w-[980px] rounded-3xl border border-[var(--line)] bg-gallery p-7 text-center shadow-[var(--soft-shadow)] md:p-12">
          <h2 className="text-[clamp(2.5rem,5vw,5.4rem)] font-semibold leading-[0.98] tracking-[-0.055em]">
            {t.ctaTitle}
          </h2>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/#collections">{t.collection}</Button>
            <Button href="/story" variant="secondary">
              {t.stories}
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
