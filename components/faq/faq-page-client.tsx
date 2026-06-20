"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { contactLinks } from "@/src/config/links";
import { dictionary, type Lang } from "@/src/config/dictionary";
import { cn } from "@/lib/utils";

const contactPlatforms = ["Facebook Messenger", "Instagram", "LINE Official"];
const contactLabels: Record<string, string> = {
  "Facebook Messenger": "Facebook",
  Instagram: "Instagram",
  "LINE Official": "LINE",
};

export function FaqPageClient() {
  const [lang, setLang] = useState<Lang>("th");
  const [openIndex, setOpenIndex] = useState(0);

  useEffect(() => {
    const stored = window.localStorage.getItem("collector-lang");
    if (stored === "th" || stored === "en") {
      setLang(stored);
      document.documentElement.setAttribute("lang", stored);
    }
  }, []);

  const t = dictionary[lang].faq;
  const contacts = contactPlatforms
    .map((platform) => contactLinks.find((contact) => contact.platform === platform))
    .filter((contact): contact is (typeof contactLinks)[number] => Boolean(contact));

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

      <section className="px-5 py-8 md:px-10 md:py-12 xl:px-16">
        <div className="mx-auto max-w-[1120px] overflow-hidden rounded-3xl border border-[var(--line)] bg-gallery shadow-[var(--soft-shadow)]">
          {t.items.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <article key={item.question} className="border-b border-[var(--line)] last:border-b-0">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left transition hover:bg-[#F5F1EA] md:px-7 md:py-6"
                  aria-expanded={isOpen}
                >
                  <span className="flex items-start gap-4">
                    <span className="mt-1 font-mono text-xs font-black text-gold">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-xl font-semibold tracking-[-0.03em] md:text-2xl">
                      {item.question}
                    </span>
                  </span>
                  <ChevronDown
                    className={cn("shrink-0 text-gold transition", isOpen && "rotate-180")}
                    size={22}
                  />
                </button>
                <div
                  className={cn(
                    "grid transition-all duration-300 ease-out",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="whitespace-pre-line px-14 pb-6 text-base font-medium leading-8 text-mist md:px-[72px] md:text-lg">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="px-5 pb-20 pt-8 md:px-10 md:pb-28 xl:px-16">
        <div className="mx-auto max-w-[1120px] rounded-3xl border border-[var(--line)] bg-gallery p-7 text-center shadow-[var(--soft-shadow)] md:p-12">
          <h2 className="text-[clamp(2.4rem,5vw,5.2rem)] font-semibold leading-[0.98] tracking-[-0.055em]">
            {t.contactTitle}
          </h2>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/dream-project">{t.startProject}</Button>
            {contacts.map((contact) => (
              <Button key={contact.platform} href={contact.href} target="_blank" rel="noreferrer" variant="secondary">
                {contactLabels[contact.platform]}
              </Button>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
