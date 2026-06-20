"use client";

import Image from "next/image";
import Link from "next/link";
import { type ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { links, socialLinks } from "@/src/config/links";
import { pieces as pieceData } from "@/src/data/pieces";
import { pricing } from "@/src/config/pricing";
import { cn } from "@/lib/utils";

type Lang = "th" | "en";
type Theme = "light" | "dark";
type SizeKey = "30" | "60" | "100" | "170";
type QuoteSizeKey = "30" | "60" | "100" | "170";

const transitions = {
  cinematic: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  smooth: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
} as const;

const copy = {
  th: {
    nav: {
      collections: "คอลเลกชัน",
      project: "สั่งทำ",
      about: "เรื่องราว",
      faq: "คำถามที่พบบ่อย",
      guides: "คู่มือการสั่งทำ",
      instagram: "Instagram",
      cta: "เริ่มโปรเจกต์",
      menu: "เมนู",
      close: "ปิด",
    },
    hero: {
      headline: "ผลงาน\u200bในฝัน\u200bสำหรับ\u200bนักสะสม\u200bตัวจริง",
      subheadline:
        "สตูดิโอรับทำฟิกเกอร์และรับทำโมเดล เลือกตัวละคร ขนาดที่ต้องการ และพรีวิวในห้องจริงได้ทันทีสำหรับของสะสมสั่งทำในฝันของคุณ",
      primary: "ดูตัวอย่างขนาด",
      secondary: "เริ่มโปรเจกต์",
      eyebrow: "ROOM SCALE PREVIEW",
    },
    preview: {
      title: "ดูสเกลก่อนเริ่มสร้าง",
      library: "Model Library",
      upload: "อัปโหลดรูปของคุณ",
      uploadHelper:
        "ลองอัปโหลดรูปตัวละครหรือรูปอ้างอิง แล้วดูตัวอย่างในห้องได้ทันที",
      uploadedName: "รูปของคุณ",
      uploadedNote:
        "ระบบนี้เป็นตัวอย่างขนาดเบื้องต้น ภาพจริงจะถูกปรับไดคัทก่อนผลิต",
      human: "170 cm human",
      collectible: "Hero Piece",
      measurement: "ขนาดที่เลือก",
      room: "ห้องตัวอย่าง",
      chips: ["30 cm", "60 cm", "100 cm", "170 cm"],
      notes: {
        "30": "เหมาะกับโต๊ะทำงาน / ชั้นวาง",
        "60": "เด่นบนชั้นทีวีหรือมุมสะสม",
        "100": "ชิ้นงานใหญ่ที่เริ่มเห็นสเกลชัดในห้องจริง",
        "170": "Life-size ยืนข้างคุณได้จริง",
      },
    },
    order: {
      eyebrow: "ORDER FLOW",
      title: "เริ่มโปรเจกต์ด้วยมัดจำ",
      subtitle:
        "สำหรับงานสั่งทำ ลูกค้าสามารถวางมัดจำก่อน แล้วค่อยคุยรายละเอียดแบบจริงจัง",
      primary: "วางมัดจำเริ่มโปรเจกต์",
      secondary: "เริ่มโปรเจกต์ของคุณ",
      steps: [
        {
          title: "เลือกแบบ",
          description: "เลือกตัวละครหรืออัปโหลดรูปอ้างอิง",
        },
        {
          title: "วางมัดจำ",
          description: "เริ่มต้น 1,000 บาท เพื่อจองคิวประเมินและคุยรายละเอียด",
        },
        {
          title: "เริ่มสร้าง",
          description: "คอนเฟิร์มขนาด รายละเอียด และเริ่มผลิตจริง",
        },
      ],
    },
    featured: {
      eyebrow: "FEATURED HERO PIECES",
      title: "Hero Pieces ที่พร้อมกลายเป็นของสะสมของคุณ",
      cta: "ขอประเมินราคาจริง",
      custom: {
        badge: "CUSTOM QUOTE",
        title: "อัปโหลดรูปของคุณ เพื่อเสนอราคา",
        subtitle: `เริ่มต้น ${pricing["100"].price} / 100 cm`,
        description:
          "บริการรับทำโมเดลจากรูปและของสะสมสั่งทำ ลองอัปโหลดรูปตัวละครหรือรูปอ้างอิงของคุณ แล้วเลือกความสูงเพื่อเทียบกับคน 170 ซม. เหมาะสำหรับผู้ที่ต้องการฟิกเกอร์สั่งทำขนาดใหญ่ในราคาจับต้องได้",
        upload: "อัปโหลดรูปของคุณ",
        human: "คน 170 cm",
        model: "โมเดลตัวอย่าง",
        measurement: "ความสูงที่เลือก",
        cta: "ขอประเมินราคาจริง",
      },
    },
    story: {
      eyebrow: "STORY / REAL WORKS",
      title: "เรื่องราวจากของสะสม",
      subheadline:
        "บริการรับทำตัวละครขนาดจริง (รับทำ life-size / life-size figure Thailand) จากภาพอ้างอิงและโมเดลสามมิติ ทุกชิ้นงานถูกสร้างขึ้นด้วยฝีมือประณีตเพื่อให้เป็นของสะสมสั่งทำที่ดีที่สุดในชีวิตจริงของคุณ",
      items: [
        "Watermelon เทียบสเกลกับงานจริง",
        "Stitch showcase พร้อมหลายมุม",
        "R2-D2 ขนาดใหญ่เทียบกับคน",
        "Akaza ระหว่างงานเก็บรายละเอียด",
      ],
    },
    work: {
      eyebrow: "HOW IT WORKS",
      title: "เริ่มสร้างของสะสมในฝันได้ง่าย ๆ",
      steps: [
        "ส่งไอเดียหรือรูปอ้างอิง",
        "เลือกขนาดที่อยากได้",
        "ดูราคาประเมิน",
        "วางมัดจำ แล้วเริ่มผลิต",
      ],
    },
    project: {
      headline: "ถ้าตัวละครที่คุณรัก ยืนอยู่ในห้องคุณได้จริงล่ะ?",
      subheadline:
        "บริการรับทำโมเดลและรับทำฟิกเกอร์สั่งทำคุณภาพสูง (custom figure Thailand) เพียงส่งรูปอ้างอิงและเลือกขนาดที่ต้องการ เราพร้อมประเมินราคาและขั้นตอนการผลิตแบบละเอียดให้ทันที",
      cta: "เริ่ม Dream Build",
    },
    final: {
      headline: "พร้อมเริ่ม Hero Piece ชิ้นแรกของคุณหรือยัง?",
      subline: "Bring Your Favorite Character Into The Real World.",
      cta: "เริ่มโปรเจกต์ของคุณ",
    },
    footer:
      "เปลี่ยนตัวละครที่คุณรักให้กลายเป็นของสะสมสั่งทำและฟิกเกอร์สั่งทำที่ตั้งอยู่ในบ้านคุณได้จริง โดยสตูดิโอรับทำฟิกเกอร์และโมเดลชั้นนำ",
  },
  en: {
    nav: {
      collections: "Collections",
      project: "Dream Project",
      about: "Story",
      faq: "FAQ",
      guides: "Guides",
      instagram: "Instagram",
      cta: "Start Project",
      menu: "Menu",
      close: "Close",
    },
    hero: {
      headline: "Dream collectible works for serious collectors",
      subheadline:
        "Choose a character, select a scale, and preview where your Hero Piece belongs in the room.",
      primary: "Preview Sizes",
      secondary: "Start Project",
      eyebrow: "ROOM SCALE PREVIEW",
    },
    preview: {
      title: "Preview the scale before production",
      library: "Model Library",
      upload: "Upload your image",
      uploadHelper:
        "Upload a character image or reference and preview it inside the room instantly.",
      uploadedName: "Your image",
      uploadedNote:
        "This is an early scale preview. Final production images will be cut out and prepared before building.",
      human: "170 cm human",
      collectible: "Hero Piece",
      measurement: "Selected scale",
      room: "Sample room",
      chips: ["30 cm", "60 cm", "100 cm", "170 cm"],
      notes: {
        "30": "Perfect for desks and display shelves",
        "60": "Strong presence on a TV shelf or collector corner",
        "100": "A large piece that makes the room scale easy to understand",
        "170": "Life-size presence beside you",
      },
    },
    order: {
      eyebrow: "ORDER FLOW",
      title: "Start with a deposit",
      subtitle:
        "For custom builds, customers can place a deposit first, then discuss details seriously.",
      primary: "Place deposit",
      secondary: "Start your project",
      steps: [
        {
          title: "Choose a concept",
          description: "Choose a character or upload reference images",
        },
        {
          title: "Place deposit",
          description: "Starts at ฿1,000 to reserve an estimate and discussion slot",
        },
        {
          title: "Begin building",
          description: "Confirm size, details, and begin real production",
        },
      ],
    },
    featured: {
      eyebrow: "FEATURED HERO PIECES",
      title: "Hero Pieces ready to become part of your collection",
      cta: "Request real estimate",
      custom: {
        badge: "CUSTOM QUOTE",
        title: "Upload your image for an estimate",
        subtitle: `Starts at ${pricing["100"].price} / 100 cm`,
        description:
          "Upload a character or reference image, choose a height, and compare it beside a 170 cm human. A practical starting point for collectors who want a larger piece.",
        upload: "Upload your image",
        human: "170 cm human",
        model: "Model mockup",
        measurement: "Selected height",
        cta: "Request real estimate",
      },
    },
    story: {
      eyebrow: "STORY / REAL WORKS",
      title: "Real work, real scale, real process",
      subheadline:
        "Some pieces begin as models. Some need human scale checks. Every build is shaped so collectors can imagine it in a real home.",
      items: [
        "Watermelon scale check",
        "Stitch multi-angle showcase",
        "R2-D2 beside a real person",
        "Akaza detailing process",
      ],
    },
    work: {
      eyebrow: "HOW IT WORKS",
      title: "Start your dream collectible in four simple steps",
      steps: [
        "Send an idea or reference images",
        "Choose the scale you want",
        "Review the estimate",
        "Place a deposit and begin production",
      ],
    },
    project: {
      headline: "What if your favorite character could stand in your room?",
      subheadline:
        "Send references, choose a size, and we will help estimate the best way to begin.",
      cta: "Start Dream Build",
    },
    final: {
      headline: "Ready to begin your first Hero Piece?",
      subline: "Bring Your Favorite Character Into The Real World.",
      cta: "Start Your Project",
    },
    footer:
      "Turning beloved characters into collectible pieces that belong in real homes.",
  },
} as const;

const featuredPieceSlugs = ["android-18", "akaza", "goku", "watermelon", "r2d2", "stitch"] as const;
const featuredImageOverrides: Record<string, { image: string; fit: "cover" | "contain" }> = {
  watermelon: { image: "/images/story-watermelon-scale.jpg", fit: "cover" },
  r2d2: { image: "/images/story-r2d2-scale.jpg", fit: "cover" },
};

const pieces = {
  th: featuredPieceSlugs.map((slug) => {
    const piece = pieceData.find((item) => item.slug === slug)!;
    const imageOverride = featuredImageOverrides[piece.slug];

    return {
      slug: piece.slug,
      image: imageOverride?.image ?? piece.heroImage,
      title: piece.titleTh,
      subtitle: piece.subtitleTh,
      description: piece.loreTh,
      price: `เริ่มต้น ${piece.startingPrice}`,
      badge: piece.badges[0] ?? piece.category,
      fit: imageOverride?.fit ?? "contain",
    };
  }),
  en: featuredPieceSlugs.map((slug) => {
    const piece = pieceData.find((item) => item.slug === slug)!;
    const imageOverride = featuredImageOverrides[piece.slug];

    return {
      slug: piece.slug,
      image: imageOverride?.image ?? piece.heroImage,
      title: piece.titleEn,
      subtitle: piece.subtitleEn,
      description: piece.loreEn,
      price: `Starts ${piece.startingPrice}`,
      badge: piece.badges[0] ?? piece.category,
      fit: imageOverride?.fit ?? "contain",
    };
  }),
} as const;

const sizeData: Record<SizeKey, { label: string; height: number; line: number; width: number }> = {
  "30": { label: pricing["30"].label, height: 24, line: 24, width: 14 },
  "60": { label: pricing["60"].label, height: 38, line: 38, width: 17 },
  "100": { label: pricing["100"].label, height: 58, line: 58, width: 20 },
  "170": { label: pricing["170"].label, height: 82, line: 82, width: 24 },
};

const quoteSizeData: Record<QuoteSizeKey, { label: string; height: number; line: number; width: number }> = {
  "30": { label: pricing["30"].label, height: 13, line: 13, width: 18 },
  "60": { label: pricing["60"].label, height: 26, line: 26, width: 28 },
  "100": { label: pricing["100"].label, height: 50, line: 50, width: 42 },
  "170": { label: pricing["170"].label, height: 73, line: 73, width: 58 },
};

const previewCharacters = [
  {
    id: "android-18",
    image: "/images/android-18.png",
    name: "Android 18",
    description: "ตัวละครขนาดใหญ่ที่วางในห้องแล้วรู้สึกเหมือนยืนอยู่จริง",
    objectPosition: "50% 50%",
  },
  {
    id: "akaza",
    image: "/images/akaza.png",
    name: "Akaza",
    description: "งานปั้นขนาดใหญ่ที่เหมาะกับมุมโชว์แบบจริงจัง",
    objectPosition: "50% 50%",
  },
  {
    id: "watermelon",
    image: "/images/watermelon.png",
    name: "Watermelon",
    description: "คาแรกเตอร์สดใสสำหรับโต๊ะทำงานหรือชั้นวาง",
    objectPosition: "50% 50%",
  },
  {
    id: "c3po",
    image: "/images/c3po.png",
    name: "C-3PO",
    description: "โทนทองพรีเมียมที่เข้ากับห้องสว่างและเฟอร์นิเจอร์ไม้",
    objectPosition: "50% 50%",
  },
  {
    id: "r2d2",
    image: "/images/r2d2.png",
    name: "R2-D2",
    description: "เหมาะกับชั้นทีวีหรือมุมของสะสมสายหุ่นยนต์",
    objectPosition: "50% 50%",
  },
  {
    id: "lover",
    image: "/images/lover.png",
    name: "Lovers",
    description: "ความทรงจำที่กลายเป็นฟิกเกอร์ยืนโชว์ได้จริง",
    objectPosition: "50% 50%",
  },
  {
    id: "bearbrick",
    image: "/images/bearbrick.png",
    name: "Bearbrick",
    description: "ชิ้น display สีดำที่เข้ากับห้องโมเดิร์น",
    objectPosition: "50% 50%",
  },
  {
    id: "stitch",
    image: "/images/stitch.png",
    name: "Stitch",
    description: "คาแรกเตอร์ playful สำหรับมุมสะสมที่อยากให้สนุกขึ้น",
    objectPosition: "50% 50%",
  },
  {
    id: "goku",
    image: "/images/goku.png",
    name: "Goku",
    description: "พลังวัยเด็กที่วางตรงไหนก็กลายเป็นมุมสะสม",
    objectPosition: "50% 50%",
  },
] as const;

const portfolioImages = [
  { src: "/images/portfolio/portfolio-01.jpg", caption: "Custom couple collectible from reference memory" },
  { src: "/images/portfolio/portfolio-02.jpg", caption: "Digital model set before becoming real collectibles" },
  { src: "/images/portfolio/portfolio-03.jpg", caption: "Collector figure preparation and pose study" },
  { src: "/images/portfolio/portfolio-04.jpg", caption: "Finished character lineup for display" },
  { src: "/images/portfolio/portfolio-05.jpg", caption: "Large cat collectible with scale comparison" },
  { src: "/images/portfolio/portfolio-06.jpg", caption: "Miniature person collectible for display" },
  { src: "/images/portfolio/portfolio-07.jpg", caption: "Princess figure prototype in gray finish" },
  { src: "/images/portfolio/portfolio-08.jpg", caption: "Life-size Android 18 display beside collector" },
  { src: "/images/portfolio/portfolio-09.jpg", caption: "Character model lineup for future Hero Pieces" },
  { src: "/images/portfolio/portfolio-10.jpg", caption: "Small custom figure prototype" },
  { src: "/images/portfolio/portfolio-11.jpg", caption: "Reference-to-collectible transformation concept" },
  { src: "/images/portfolio/portfolio-12.jpg", caption: "Character group build and finishing table" },
  { src: "/images/portfolio/portfolio-13.png", caption: "Memory figure made from a real photograph" },
  { src: "/images/portfolio/portfolio-17.jpg", caption: "Akaza large sculpture during finishing process" },
  { src: "/images/portfolio/portfolio-18.jpg", caption: "Akaza sculpture detail angle" },
  { src: "/images/portfolio/portfolio-19.jpg", caption: "Akaza prototype scale and pose" },
  { src: "/images/portfolio/portfolio-20.jpg", caption: "Akaza work-in-progress detail" },
  { src: "/images/portfolio/portfolio-21.jpg", caption: "Akaza body detail close-up" },
  { src: "/images/portfolio/portfolio-22.jpg", caption: "R2-D2 scale build in progress" },
  { src: "/images/portfolio/portfolio-23.jpg", caption: "R2-D2 life-size build beside maker" },
  { src: "/images/portfolio/portfolio-24.jpg", caption: "Stitch collectible showcase with multiple angles" },
  { src: "/images/portfolio/portfolio-25.jpg", caption: "Watermelon character scale check on table" },
  { src: "/images/portfolio/portfolio-26.jpg", caption: "Tall character screenshot for size planning" },
  { src: "/images/portfolio/portfolio-27.jpg", caption: "Goku character build preview" },
  { src: "/images/portfolio/portfolio-28.jpg", caption: "Large character figure preview angle" },
  { src: "/images/portfolio/portfolio-29.jpg", caption: "Large character figure preview side angle" },
  { src: "/images/portfolio/portfolio-30.jpg", caption: "Large character figure preview detail" },
  { src: "/images/portfolio/portfolio-31.jpg", caption: "Small collectible preview item" },
  { src: "/images/portfolio/portfolio-32.jpg", caption: "Compact display collectible preview" },
  { src: "/images/portfolio/portfolio-33.jpg", caption: "Small character piece for shelf display" },
  { src: "/images/portfolio/portfolio-34.jpg", caption: "Mini display figure preview" },
  { src: "/images/portfolio/portfolio-35.jpg", caption: "Small collectible finishing preview" },
] as const;

function FadeUp({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ ...transitions.smooth, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const [theme, setTheme] = useState<Theme>("light");
  const [lang, setLang] = useState<Lang>("th");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("collector-theme") as Theme;
    if (storedTheme === "light" || storedTheme === "dark") {
      setTheme(storedTheme);
    }
    const storedLang = window.localStorage.getItem("collector-lang") as Lang;
    if (storedLang === "th" || storedLang === "en") {
      setLang(storedLang);
    }
  }, []);

  const handleToggleTheme = () => {
    setTheme((value) => {
      const next = value === "light" ? "dark" : "light";
      window.localStorage.setItem("collector-theme", next);
      document.documentElement.setAttribute("data-theme", next);
      return next;
    });
  };

  const handleToggleLang = () => {
    setLang((value) => {
      const next = value === "th" ? "en" : "th";
      window.localStorage.setItem("collector-lang", next);
      document.documentElement.setAttribute("lang", next);
      return next;
    });
  };

  const t = copy[lang];

  return (
    <main
      data-theme={theme}
      className="min-h-screen overflow-x-hidden bg-void font-thai text-ivory transition-colors duration-500"
    >
      <Navigation
        lang={lang}
        theme={theme}
        menuOpen={menuOpen}
        t={t}
        onToggleLang={handleToggleLang}
        onToggleTheme={handleToggleTheme}
        onToggleMenu={() => setMenuOpen((value) => !value)}
      />
      <Hero t={t} />
      <FeaturedPieces lang={lang} t={t} />
      <OrderDepositSection t={t} />
      <StorySection t={t} />
      <HowItWorks t={t} />
      <DreamProject t={t} />
      <FinalCta t={t} />
      <Footer t={t} />
    </main>
  );
}

function Navigation({
  lang,
  theme,
  menuOpen,
  t,
  onToggleLang,
  onToggleTheme,
  onToggleMenu,
}: {
  lang: Lang;
  theme: Theme;
  menuOpen: boolean;
  t: (typeof copy)[Lang];
  onToggleLang: () => void;
  onToggleTheme: () => void;
  onToggleMenu: () => void;
}) {
  const navLinks = [
    { href: "#collections", label: t.nav.collections },
    { href: "/dream-project", label: t.nav.project },
    { href: "/story", label: t.nav.about },
    { href: "/faq", label: t.nav.faq },
    { href: "#instagram", label: t.nav.instagram },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...transitions.cinematic, delay: 0.15 }}
      className="fixed inset-x-0 top-0 z-50 border-b border-[var(--line)] bg-void/78 backdrop-blur-[20px]"
    >
      <nav className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-4 md:h-16 md:px-10 xl:px-16">
        <a href="#" className="truncate font-display text-sm tracking-wide text-ivory sm:text-lg">
          Collector Dream Factory
        </a>
        <div className="hidden items-center gap-7 text-sm font-semibold text-mist md:flex">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="transition hover:text-ivory">
              {link.label}
            </a>
          ))}
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <ToggleButton onClick={onToggleLang}>{lang.toUpperCase()} / {lang === "th" ? "EN" : "TH"}</ToggleButton>
          <ToggleButton onClick={onToggleTheme}>
            {theme === "light" ? "Light" : "Dark"}
          </ToggleButton>
          <Button href="/dream-project" className="ml-1">
            {t.nav.cta}
          </Button>
        </div>
        <button
          type="button"
          onClick={onToggleMenu}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--line)] bg-gallery text-ivory md:hidden"
          aria-label={menuOpen ? t.nav.close : t.nav.menu}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={19} /> : <Menu size={19} />}
        </button>
      </nav>
      {menuOpen ? (
        <div className="max-h-[calc(100vh-3.5rem)] overflow-y-auto border-t border-[var(--line)] bg-void px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3 text-base font-semibold text-ivory">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={onToggleMenu}>
                {link.label}
              </a>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <ToggleButton onClick={onToggleLang}>{lang.toUpperCase()} / {lang === "th" ? "EN" : "TH"}</ToggleButton>
            <ToggleButton onClick={onToggleTheme}>
              {theme === "light" ? "Light" : "Dark"}
            </ToggleButton>
            <Button href="/dream-project" className="col-span-2 w-full">
              {t.nav.cta}
            </Button>
          </div>
          <div className="mt-4 border-t border-[var(--line)] pt-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-gold">
              Social
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm font-semibold text-mist">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-[var(--line)] bg-gallery/70 px-3 py-2 hover:text-ivory"
                >
                  <span className="block">{link.name}</span>
                  <span className="block truncate text-[11px] text-shadow-text">
                    {link.handle}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </motion.header>
  );
}

function ToggleButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="min-h-10 rounded-full border border-[var(--line)] bg-gallery/80 px-4 text-xs font-bold uppercase tracking-[0.08em] text-mist transition hover:text-ivory"
    >
      {children}
    </button>
  );
}

function Hero({ t }: { t: (typeof copy)[Lang] }) {
  return (
    <section className="relative overflow-hidden bg-void px-4 pb-8 pt-20 md:px-10 md:pb-14 md:pt-20 xl:px-16">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_72%_38%,rgba(185,130,43,0.13)_0%,rgba(185,130,43,0.045)_42%,transparent_72%)]" />
      <div className="mx-auto grid max-w-[1440px] items-center gap-7 md:min-h-[85vh] md:grid-cols-[0.86fr_1.14fr] md:gap-8">
        <div className="relative z-10 max-w-[680px]">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transitions.smooth, delay: 0.35 }}
            className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-gold"
          >
            {t.hero.eyebrow}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transitions.cinematic, delay: 0.45 }}
            className="hero-headline-fix font-semibold text-ivory"
          >
            {t.hero.headline}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transitions.smooth, delay: 0.68 }}
            className="mt-4 max-w-xl text-base font-medium leading-7 text-mist md:mt-6 md:text-xl md:leading-8"
          >
            {t.hero.subheadline}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transitions.smooth, delay: 0.85 }}
            className="mt-5 flex flex-col gap-2.5 sm:flex-row md:mt-7 md:gap-3"
          >
            <Button href="#room-preview" className="w-full sm:w-auto">{t.hero.primary}</Button>
            <Button href="/dream-project" variant="secondary" className="w-full sm:w-auto">
              {t.hero.secondary}
            </Button>
          </motion.div>
        </div>
        <RoomScalePreview t={t} />
      </div>
    </section>
  );
}

function RoomScalePreview({ t }: { t: (typeof copy)[Lang] }) {
  const [selected, setSelected] = useState<SizeKey>("100");
  const [characterId, setCharacterId] =
    useState<(typeof previewCharacters)[number]["id"]>("android-18");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const active = sizeData[selected];
  const note = t.preview.notes[selected];
  const libraryCharacter =
    previewCharacters.find((character) => character.id === characterId) ??
    previewCharacters[0];
  const activeCharacter = uploadedImage
    ? {
        image: uploadedImage,
        name: t.preview.uploadedName,
        description: t.preview.uploadedNote,
        objectPosition: "50% 100%",
      }
    : libraryCharacter;

  const chips = useMemo(
    () => (Object.keys(sizeData) as SizeKey[]).map((key) => ({ key, ...sizeData[key] })),
    [],
  );

  useEffect(() => {
    return () => {
      if (uploadedImage) {
        URL.revokeObjectURL(uploadedImage);
      }
    };
  }, [uploadedImage]);

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const nextUrl = URL.createObjectURL(file);
    setUploadedImage((currentUrl) => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }
      return nextUrl;
    });
  };

  return (
    <motion.div
      id="room-preview"
      initial={{ opacity: 0, scale: 0.97, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ ...transitions.cinematic, delay: 0.7 }}
      className="relative z-10"
    >
      <div className="absolute left-1/2 top-12 h-[72%] w-[72%] -translate-x-1/2 rounded-full bg-gold/15 blur-3xl" />
      <div className="relative w-full max-w-full min-w-0 overflow-hidden rounded-[18px] sm:rounded-2xl border border-[var(--line)] bg-gallery/90 p-3 sm:p-3 md:p-4 shadow-[var(--soft-shadow)] backdrop-blur-xl">
        <div className="mb-3 flex items-start justify-between gap-4 px-1">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">
              {t.preview.title}
            </p>
            <motion.p
              key={`${selected}-${characterId}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={transitions.smooth}
              className="mt-2 min-h-7 text-sm font-semibold text-mist"
            >
              {activeCharacter.name} · {note}
            </motion.p>
          </div>
          <span className="rounded-full border border-cyan/35 bg-cyan/10 px-3 py-1 text-xs font-bold text-ivory">
            {active.label}
          </span>
        </div>

        <div className="relative aspect-[1.25/1] overflow-hidden rounded-xl border border-[var(--line)] bg-[#efe7dc] dark:bg-gallery-lift sm:aspect-[1.34/1]">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.82)_0%,rgba(239,231,220,0.74)_45%,rgba(214,197,174,0.54)_100%)]" />

          <div className="absolute left-[22%] top-[5%] h-[54%] w-[57%] skew-x-[-18deg] rounded-t-lg border-l border-t border-[var(--line)] bg-[#fbfaf7]" />
          <div className="absolute left-[50%] top-[8%] h-[50%] w-[36%] skew-x-[15deg] rounded-tr-xl border-r border-t border-[var(--line)] bg-[#f6f2ec]" />
          <div className="absolute bottom-[5%] left-[20%] h-[42%] w-[70%] -skew-x-[18deg] rounded-b-2xl border border-[var(--line)] bg-[linear-gradient(135deg,#d8c4aa_0%,#eadcca_48%,#cdb494_100%)] shadow-[inset_0_0_35px_rgba(255,255,255,0.28)]" />

          <div className="absolute bottom-[17%] left-[24%] h-[34%] w-[65%] -skew-x-[18deg] opacity-25 [background-image:linear-gradient(90deg,var(--line)_1px,transparent_1px),linear-gradient(0deg,var(--line)_1px,transparent_1px)] [background-size:28px_28px]" />

          <div className="absolute left-[33%] top-[14%] h-[28%] w-[14%] rounded-sm border border-[var(--line)] bg-white/80 shadow-[0_8px_20px_rgba(23,19,15,0.08)]">
            <div className="absolute left-1/2 top-0 h-full w-px bg-[var(--line)]" />
            <div className="absolute left-0 top-1/2 h-px w-full bg-[var(--line)]" />
          </div>
          <div className="absolute left-[28%] top-[12%] h-[35%] w-[2.2%] rounded-full bg-[#d6c6b5]" />
          <div className="absolute left-[47%] top-[12%] h-[35%] w-[2.2%] rounded-full bg-[#d6c6b5]" />

          <div className="absolute right-[23%] top-[17%] h-[28%] w-[11%] rounded-sm border border-[var(--line)] bg-[#c49a63]/20">
            <div className="absolute inset-3 rounded-sm bg-white/70" />
          </div>

          <div className="absolute right-[18%] top-[21%] h-[35%] w-[6%] rounded-lg border border-[var(--line)] bg-[#a77b4b]/35">
            {[18, 38, 58, 78].map((top) => (
              <div key={top} className="absolute left-1 right-1 h-px bg-[var(--line)]" style={{ top: `${top}%` }} />
            ))}
          </div>
          <div className="absolute right-[12%] top-[31%] h-[10%] w-[8%] rounded-full bg-[#6e8b63]/50 blur-[1px]" />

          <div className="absolute bottom-[26%] left-[51%] h-[15%] w-[28%] rounded-[28px] bg-white/90 shadow-[0_18px_28px_rgba(23,19,15,0.13)]" />
          <div className="absolute bottom-[31%] left-[55%] h-[12%] w-[7%] rounded-lg bg-[#d9c8b6]" />
          <div className="absolute bottom-[32%] left-[64%] h-[11%] w-[8%] rounded-lg bg-[#e9dfd2]" />
          <div className="absolute bottom-[22%] left-[43%] h-[11%] w-[18%] rounded-full bg-white/82 shadow-[0_14px_22px_rgba(23,19,15,0.12)]" />
          <div className="absolute bottom-[15%] left-[42%] h-[11%] w-[34%] -skew-x-[18deg] rounded-lg bg-white/55" />
          <div className="absolute bottom-[12%] left-[36%] h-[10%] w-[23%] -skew-x-[18deg] rounded-md bg-[#b59472] shadow-[0_14px_24px_rgba(23,19,15,0.16)]" />
          <div className="absolute bottom-[9%] left-[56%] h-[13%] w-[12%] -skew-x-[18deg] rounded-md border border-[var(--line)] bg-white/68" />
          <div className="absolute bottom-[13%] right-[16%] h-[20%] w-[12%] -skew-x-[16deg] rounded-md border border-[var(--line)] bg-white/62" />

          <Image
            src="/images/room-preview.png"
            alt="Premium isometric living room for room scale preview"
            fill
            priority
            sizes="(min-width: 1024px) 58vw, 96vw"
            className="absolute inset-0 z-[1] object-contain object-center sm:object-cover"
          />
          <div className="absolute inset-0 z-[2] bg-[linear-gradient(90deg,rgba(247,243,238,0.08)_0%,transparent_32%,rgba(247,243,238,0.18)_100%)]" />

          <div className="absolute left-2 top-2 z-20 hidden w-[34%] rounded-xl border border-[var(--line)] bg-white/88 p-2 shadow-[0_18px_44px_rgba(23,19,15,0.14)] backdrop-blur-md sm:left-3 sm:top-3 sm:block sm:w-[28%] sm:p-3">
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="text-xs font-extrabold italic text-[#17130f] sm:text-sm">
                {t.preview.library}
              </p>
              <span className="text-xs font-bold text-[#6d6258]">1L</span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="sr-only"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mb-2 w-full rounded-xl border border-gold bg-gold px-3 py-3 text-left text-[12px] font-extrabold text-[var(--button-text)] shadow-[0_14px_28px_rgba(185,130,43,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_34px_rgba(185,130,43,0.28)] sm:text-sm"
            >
              {t.preview.upload}
            </button>
            <p className="mb-3 text-[10px] font-semibold leading-4 text-[#6d6258] sm:block">
              {t.preview.uploadHelper}
            </p>
            {uploadedImage ? (
              <button
                type="button"
                onClick={() => setUploadedImage(null)}
                className="mb-2 flex w-full items-center gap-2 rounded-lg border border-cyan bg-white/80 p-1.5 text-left text-[10px] font-bold text-[#17130f]"
              >
                <span className="relative block h-10 w-10 shrink-0 overflow-hidden rounded-md bg-[#f3eee7]">
                  <img
                    src={uploadedImage}
                    alt={t.preview.uploadedName}
                    className="h-full w-full object-contain object-bottom"
                  />
                </span>
                {t.preview.uploadedName}
              </button>
            ) : null}
            <div className="grid max-h-[160px] grid-cols-2 gap-1.5 overflow-y-auto pr-1 sm:max-h-[260px] sm:gap-2">
              {previewCharacters.map((character) => (
                <button
                  key={character.id}
                  type="button"
                  onClick={() => {
                    setUploadedImage(null);
                    setCharacterId(character.id);
                  }}
                  className={cn(
                    "relative aspect-square overflow-hidden rounded-lg border bg-[#f3eee7] transition",
                    !uploadedImage && characterId === character.id
                      ? "border-cyan shadow-[0_0_0_3px_rgba(58,175,169,0.2)]"
                      : "border-black/5 hover:border-cyan/50",
                  )}
                  title={character.name}
                >
                  <Image
                    src={character.image}
                    alt={character.name}
                    fill
                    sizes="96px"
                    className="object-contain p-1.5"
                    style={{ objectPosition: character.objectPosition }}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="absolute bottom-[20%] right-[17%] z-10 h-[62%] w-[5%] rounded-full border border-black/20 bg-black/5" />
          <div className="absolute bottom-[18%] right-[16%] z-10 h-[4%] w-[7%] rounded-full bg-black/10 blur-sm" />
          <p className="absolute right-[12%] top-[20%] z-10 text-[10px] font-bold uppercase tracking-[0.08em] text-mist">
            {t.preview.human}
          </p>

          <motion.div
            key={activeCharacter.image}
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              height: `${active.height}%`,
              width: `${active.width}%`,
            }}
            transition={transitions.smooth}
            className={cn(
              "absolute bottom-[17%] right-[21%] z-20 origin-bottom drop-shadow-[0_18px_18px_rgba(23,19,15,0.23)]",
              uploadedImage &&
                "overflow-hidden rounded-lg border border-cyan/30 bg-white/18 p-1 shadow-[0_16px_30px_rgba(23,19,15,0.18)] backdrop-blur-[1px]",
            )}
          >
            <img
              src={activeCharacter.image}
              alt={activeCharacter.name}
              className="h-full w-full object-contain object-bottom"
              style={{
                objectPosition: "50% 100%",
                filter: "contrast(1.04) saturate(1.02)",
              }}
            />
            {uploadedImage ? (
              <span className="absolute left-1/2 top-1 -translate-x-1/2 rounded-full border border-cyan/35 bg-white/88 px-2 py-0.5 text-[10px] font-extrabold text-[#17130f] shadow-sm">
                {t.preview.uploadedName}
              </span>
            ) : null}
          </motion.div>
          <motion.div
            animate={{ width: `${active.width + 6}%` }}
            transition={transitions.smooth}
            className="absolute bottom-[15%] right-[20%] z-10 h-[4%] rounded-full bg-black/16 blur-md"
          />

          <motion.div
            animate={{ height: `${active.line}%` }}
            transition={transitions.smooth}
            className="absolute bottom-[17%] right-[18%] z-30 w-px bg-cyan shadow-[0_0_18px_rgba(58,175,169,0.6)]"
          />
          <motion.div
            key={`${selected}-${activeCharacter.image}`}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={transitions.smooth}
            className="absolute right-[2%] z-30 rounded-full border border-cyan/40 bg-white/88 px-2 py-1 text-[10px] font-extrabold text-[#17130f] shadow-[0_10px_24px_rgba(23,19,15,0.1)] sm:right-[6%] sm:px-3 sm:text-xs"
            style={{ bottom: `calc(17% + ${active.line}% - 18px)` }}
          >
            {t.preview.measurement}: {active.label}
          </motion.div>

          <div className="absolute bottom-4 left-[34%] z-20 hidden rounded-full border border-[var(--line)] bg-white/82 px-3 py-1 text-xs font-bold text-[#6d6258] shadow-sm sm:block">
            {activeCharacter.description}
          </div>
        </div>

        <div className="mt-3 sm:hidden">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full rounded-lg border border-gold bg-gold px-3 py-2 text-xs font-extrabold text-[var(--button-text)] shadow-[0_10px_24px_rgba(185,130,43,0.2)]"
          >
            {t.preview.upload}
          </button>
          <p className="mt-1.5 text-[11px] font-medium leading-4 text-mist">
            {t.preview.uploadHelper}
          </p>
          <div className="-mx-1 mt-2.5 flex snap-x gap-2 overflow-x-auto px-1 pb-2">
            {uploadedImage ? (
              <button
                type="button"
                onClick={() => setUploadedImage(null)}
                className="relative h-[52px] w-[52px] shrink-0 snap-start overflow-hidden rounded-lg border border-cyan bg-[#f3eee7]"
                title={t.preview.uploadedName}
              >
                <img src={uploadedImage} alt={t.preview.uploadedName} className="h-full w-full object-contain" />
              </button>
            ) : null}
            {previewCharacters.map((character) => (
              <button
                key={`mobile-${character.id}`}
                type="button"
                onClick={() => {
                  setUploadedImage(null);
                  setCharacterId(character.id);
                }}
                className={cn(
                  "relative h-[52px] w-[52px] shrink-0 snap-start overflow-hidden rounded-lg border bg-[#f3eee7]",
                  !uploadedImage && characterId === character.id
                    ? "border-cyan shadow-[0_0_0_2px_rgba(58,175,169,0.2)]"
                    : "border-black/5",
                )}
                title={character.name}
              >
                <Image src={character.image} alt={character.name} fill sizes="52px" className="object-contain p-1" />
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-1.5 sm:mt-4 sm:grid-cols-4 sm:gap-2">
          {chips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={() => setSelected(chip.key)}
              className={cn(
                "min-h-11 rounded-full border px-1.5 py-2 text-xs font-bold transition sm:px-3 sm:text-sm",
                selected === chip.key
                  ? "border-gold bg-gold text-[var(--button-text)]"
                  : "border-[var(--line)] bg-void/50 text-mist hover:text-ivory",
              )}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function FeaturedPieces({ lang, t }: { lang: Lang; t: (typeof copy)[Lang] }) {
  return (
    <section id="collections" className="relative bg-void px-4 py-9 md:px-10 md:py-20 xl:px-16">
      <div className="mx-auto max-w-[1440px]">
        <FadeUp className="max-w-4xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-gold">
            {t.featured.eyebrow}
          </p>
          <h2 className="text-[clamp(2.25rem,4.4vw,4.4rem)] font-semibold leading-[1.05] tracking-[-0.04em]">
            {t.featured.title}
          </h2>
        </FadeUp>
        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <FadeUp>
            <CustomQuoteCard t={t} />
          </FadeUp>
          {pieces[lang].map((piece, index) => (
            <FadeUp key={piece.title} delay={index * 0.04}>
              <Link
                href={`/collection/${piece.slug}`}
                className="group block overflow-hidden rounded-xl border border-[var(--line)] bg-gallery shadow-[var(--soft-shadow)] transition duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-gallery-lift">
                  <Image
                    src={piece.image}
                    alt={piece.title}
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
                    className={cn(
                      "transition duration-700 ease-out group-hover:scale-[1.035]",
                      piece.fit === "cover" ? "object-cover" : "object-contain p-5",
                    )}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(23,19,15,0.44)_100%)]" />
                  <span className="absolute left-4 top-4 rounded-full border border-gold/25 bg-gallery/75 px-3 py-1 text-xs font-bold text-gold backdrop-blur-md">
                    {piece.badge}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-2xl font-semibold leading-tight tracking-[-0.02em]">
                    {piece.title}
                  </h3>
                  <p className="mt-1 font-display text-sm text-gold">
                    {piece.subtitle}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-mist">
                    {piece.description}
                  </p>
                  <div className="mt-5 flex items-center justify-between border-t border-[var(--line)] pt-4">
                    <p className="font-display text-2xl font-medium text-gold">
                      {piece.price}
                    </p>
                    <span className="inline-flex items-center gap-2 text-sm font-bold text-ivory transition group-hover:text-gold">
                      {t.featured.cta} <ArrowRight size={16} />
                    </span>
                  </div>
                </div>
              </Link>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function OrderDepositSection({ t }: { t: (typeof copy)[Lang] }) {
  return (
    <section className="bg-void px-4 py-8 md:px-10 md:py-16 xl:px-16">
      <FadeUp className="mx-auto max-w-[1180px] rounded-2xl border border-[var(--line)] bg-gallery p-5 shadow-[var(--soft-shadow)] md:p-7">
        <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-gold">
              {t.order.eyebrow}
            </p>
            <h2 className="text-[clamp(2.1rem,3.9vw,4rem)] font-semibold leading-[1.05] tracking-[-0.04em]">
              {t.order.title}
            </h2>
            <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-mist md:text-lg">
              {t.order.subtitle}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button href={links.depositLink} target="_blank" rel="noreferrer">
                {t.order.primary}
              </Button>
              <Button href="/dream-project" variant="secondary">
                {t.order.secondary}
              </Button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {t.order.steps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-xl border border-[var(--line)] bg-void/45 p-4"
              >
                <span className="font-mono text-xs font-bold text-gold">
                  0{index + 1}
                </span>
                <h3 className="mt-3 text-xl font-semibold tracking-[-0.02em]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-mist">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </FadeUp>
    </section>
  );
}

function CustomQuoteCard({ t }: { t: (typeof copy)[Lang] }) {
  const [selected, setSelected] = useState<QuoteSizeKey>("100");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const active = quoteSizeData[selected];
  const chips = useMemo(
    () => (Object.keys(quoteSizeData) as QuoteSizeKey[]).map((key) => ({ key, ...quoteSizeData[key] })),
    [],
  );

  useEffect(() => {
    return () => {
      if (uploadedImage) {
        URL.revokeObjectURL(uploadedImage);
      }
    };
  }, [uploadedImage]);

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const nextUrl = URL.createObjectURL(file);
    setUploadedImage((currentUrl) => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }
      return nextUrl;
    });
  };

  return (
    <article className="group overflow-hidden rounded-xl border border-gold/35 bg-[linear-gradient(145deg,rgba(255,255,255,0.94),rgba(239,231,220,0.88))] shadow-[var(--soft-shadow)] transition duration-300 hover:-translate-y-1 dark:bg-gallery">
      <div className="relative aspect-[3/4] overflow-hidden bg-[#efe7dc]">
        <Image
          src="/images/height-comparison.png"
          alt="Height comparison between 170 cm human silhouette and Akaza model mockup"
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
          className="object-cover transition duration-700 ease-out group-hover:scale-[1.015]"
          style={{ objectPosition: "15% 50%" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(247,243,238,0)_0%,rgba(247,243,238,0.02)_45%,rgba(247,243,238,0.38)_64%,rgba(247,243,238,0.7)_100%)]" />
        <div className="absolute inset-x-5 bottom-[13%] h-px bg-[#8b5b26]/30" />
        <div className="absolute left-4 top-4 z-20 rounded-full border border-gold/30 bg-white/82 px-3 py-1 text-[11px] font-extrabold text-gold backdrop-blur">
          {t.featured.custom.badge}
        </div>
        <p className="absolute left-[4%] top-[45%] z-20 rounded-full bg-white/88 px-2 py-1 text-[10px] font-extrabold text-[#8b5b26] shadow-sm">
          {t.featured.custom.human}
        </p>

        <div className="absolute bottom-[13%] left-[3.5%] z-20 h-[73%] w-px bg-[#8b5b26]" />
        <div className="absolute left-[3.5%] top-[14%] z-20 h-px w-[12%] bg-[#8b5b26]" />
        <div className="absolute bottom-[13%] left-[3.5%] z-20 h-px w-[12%] bg-[#8b5b26]" />

        <motion.div
          key={uploadedImage ?? "quote-akaza"}
          initial={{ opacity: 0, y: 10, scale: 0.96 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            height: `${active.height}%`,
            width: `${active.width}%`,
          }}
          transition={transitions.smooth}
          className={cn(
            "absolute bottom-[13%] left-[73%] z-20 origin-bottom -translate-x-1/2 drop-shadow-[0_20px_20px_rgba(23,19,15,0.2)]",
            uploadedImage &&
              "overflow-hidden rounded-lg border border-cyan/35 bg-white/20 p-1 shadow-[0_16px_30px_rgba(23,19,15,0.18)] backdrop-blur-[1px]",
          )}
        >
          <img
            src={uploadedImage ?? "/images/akaza.png"}
            alt={uploadedImage ? t.preview.uploadedName : t.featured.custom.model}
            className="h-full w-full object-contain object-bottom"
          />
          {uploadedImage ? (
            <span className="absolute left-1/2 top-1 -translate-x-1/2 rounded-full border border-cyan/35 bg-white/90 px-2 py-0.5 text-[10px] font-extrabold text-[#17130f] shadow-sm">
              {t.preview.uploadedName}
            </span>
          ) : null}
        </motion.div>

        <motion.div
          animate={{ height: `${active.line}%` }}
          transition={transitions.smooth}
          className="absolute bottom-[13%] right-[8%] z-30 w-px bg-cyan shadow-[0_0_18px_rgba(58,175,169,0.55)]"
        />
        <motion.div
          animate={{ bottom: `calc(13% + ${active.line}% - 16px)` }}
          transition={transitions.smooth}
          className="absolute right-[4%] z-30 rounded-full border border-cyan/45 bg-white/90 px-3 py-1 text-xs font-extrabold text-[#17130f] shadow-sm"
        >
          {active.label}
        </motion.div>
        <div className="absolute bottom-[13%] right-[8%] z-30 h-px w-[13%] bg-cyan/80" />
        <motion.div
          animate={{ bottom: `calc(13% + ${active.line}% - 1px)` }}
          transition={transitions.smooth}
          className="absolute right-[8%] z-30 h-px w-[13%] bg-cyan/80"
        />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="sr-only"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-4 left-4 right-4 z-30 rounded-xl border border-gold bg-gold px-4 py-3 text-center text-sm font-extrabold text-[var(--button-text)] shadow-[0_14px_28px_rgba(185,130,43,0.24)] transition hover:-translate-y-0.5"
        >
          {t.featured.custom.upload}
        </button>
      </div>

      <div className="p-5">
        <h3 className="text-2xl font-semibold leading-tight tracking-[-0.02em]">
          {t.featured.custom.title}
        </h3>
        <p className="mt-1 font-display text-sm text-gold">
          {t.featured.custom.subtitle}
        </p>
        <p className="mt-3 text-sm leading-6 text-mist">
          {t.featured.custom.description}
        </p>
        <div className="mt-4 grid grid-cols-4 gap-2">
          {chips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={() => setSelected(chip.key)}
              className={cn(
                "rounded-full border px-2 py-2 text-xs font-extrabold transition",
                selected === chip.key
                  ? "border-gold bg-gold text-[var(--button-text)]"
                  : "border-[var(--line)] bg-void/45 text-mist hover:text-ivory",
              )}
            >
              {chip.label}
            </button>
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-[var(--line)] pt-4">
          <p className="text-xs font-bold text-mist">
            {t.featured.custom.measurement}:{" "}
            <span className="text-gold">{active.label}</span>
          </p>
          <a
            href={links.depositLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-bold text-ivory transition hover:text-gold"
          >
            {t.featured.custom.cta} <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </article>
  );
}

function StorySection({ t }: { t: (typeof copy)[Lang] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollGallery = (direction: "left" | "right") => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    scroller.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  return (
    <section id="about" className="bg-void px-4 py-9 md:px-10 md:py-20 xl:px-16">
      <div className="mx-auto max-w-[1440px]">
        <FadeUp className="grid gap-6 md:grid-cols-[0.78fr_1.22fr] md:items-end">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-gold">
              {t.story.eyebrow}
            </p>
            <h2 className="text-[clamp(2.2rem,4vw,4.2rem)] font-semibold leading-[1.05] tracking-[-0.04em]">
              {t.story.title}
            </h2>
          </div>
          <p className="max-w-3xl text-base font-medium leading-8 text-mist md:text-lg">
            {t.story.subheadline}
          </p>
        </FadeUp>

        <FadeUp className="mt-9 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <figure className="overflow-hidden rounded-2xl border border-[var(--line)] bg-gallery shadow-[var(--soft-shadow)]">
            <div className="relative aspect-[4/3] bg-gallery-lift">
              <Image
                src="/images/portfolio/portfolio-08.jpg"
                alt="Life-size Android 18 collectible displayed beside a collector"
                fill
                sizes="(min-width: 1024px) 46vw, 92vw"
                className="object-cover"
              />
            </div>
            <figcaption className="border-t border-[var(--line)] p-5">
              <p className="text-lg font-bold text-ivory">
                Life-size Hero Piece ในพื้นที่จริง
              </p>
              <p className="mt-2 text-sm leading-6 text-mist">
                ภาพผลงานจริงช่วยให้ลูกค้าเห็นสเกล วัสดุ ท่าทาง และความรู้สึกของของสะสมก่อนเริ่มโปรเจกต์
              </p>
            </figcaption>
          </figure>

          <div className="min-w-0 rounded-2xl border border-[var(--line)] bg-gallery p-4 shadow-[var(--soft-shadow)]">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-gold">
                  Collector Gallery
                </p>
                <p className="mt-1 text-xs font-bold text-mist">
                  {portfolioImages.length} images · swipe or use arrows
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => scrollGallery("left")}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] bg-void/60 text-ivory transition hover:border-gold hover:text-gold"
                  aria-label="Scroll gallery left"
                >
                  <ArrowLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => scrollGallery("right")}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] bg-void/60 text-ivory transition hover:border-gold hover:text-gold"
                  aria-label="Scroll gallery right"
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
            <div
              ref={scrollerRef}
              className="-mx-1 flex max-w-full snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-1 pb-4 [scrollbar-color:var(--gold)_transparent] [scrollbar-width:thin]"
            >
              {portfolioImages.map((item, index) => (
                <figure
                  key={item.src}
                  className="w-[72vw] max-w-[260px] shrink-0 snap-start overflow-hidden rounded-xl border border-[var(--line)] bg-void/40 sm:w-[240px]"
                >
                  <div className="relative aspect-[3/4] bg-gallery-lift">
                    <Image
                      src={item.src}
                      alt={item.caption}
                      fill
                      sizes="260px"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="min-h-20 border-t border-[var(--line)] p-3 text-xs font-semibold leading-5 text-mist">
                    <span className="mr-2 font-mono text-shadow-text">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {item.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

function HowItWorks({ t }: { t: (typeof copy)[Lang] }) {
  return (
    <section className="bg-void px-4 py-8 md:px-10 md:py-16 xl:px-16">
      <div className="mx-auto max-w-[1180px]">
        <FadeUp className="text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-gold">
            {t.work.eyebrow}
          </p>
          <h2 className="text-[clamp(2.2rem,4vw,4rem)] font-semibold leading-[1.05] tracking-[-0.04em]">
            {t.work.title}
          </h2>
        </FadeUp>
        <div className="mt-7 grid gap-4 md:grid-cols-4">
          {t.work.steps.map((step, index) => (
            <FadeUp key={step} delay={index * 0.04}>
              <div className="min-h-28 rounded-xl border border-[var(--line)] bg-gallery/80 p-4 shadow-[var(--soft-shadow)]">
                <span className="font-mono text-xs text-shadow-text">0{index + 1}</span>
                <h3 className="mt-4 text-xl font-semibold leading-snug tracking-[-0.02em]">
                  {step}
                </h3>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function DreamProject({ t }: { t: (typeof copy)[Lang] }) {
  return (
    <section id="dream-project" className="bg-void px-4 py-8 md:px-10 md:py-16 xl:px-16">
      <FadeUp className="relative z-10 mx-auto grid max-w-[1120px] items-center gap-6 rounded-2xl border border-[var(--line)] bg-gallery p-5 shadow-[var(--soft-shadow)] md:grid-cols-[1fr_auto] md:p-7">
        <div>
          <h2 className="text-[clamp(2.2rem,4.5vw,4.8rem)] font-semibold leading-[1.03] tracking-[-0.04em]">
            {t.project.headline}
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-mist">
            {t.project.subheadline}
          </p>
        </div>
        <Button href="/dream-project" className="md:self-end">
          {t.project.cta}
        </Button>
      </FadeUp>
    </section>
  );
}

function FinalCta({ t }: { t: (typeof copy)[Lang] }) {
  return (
    <section className="relative overflow-hidden bg-void px-4 py-8 md:px-10 md:py-16 xl:px-16">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_54%_48%_at_50%_42%,rgba(185,130,43,0.12)_0%,transparent_72%)]" />
      <FadeUp className="relative z-10 mx-auto max-w-4xl text-center">
        <h2 className="text-[clamp(2.35rem,4.6vw,5rem)] font-semibold leading-[1.03] tracking-[-0.04em]">
          {t.final.headline}
        </h2>
        <p className="mt-4 text-base font-medium text-mist md:text-lg">
          {t.final.subline}
        </p>
        <Button href="/dream-project" className="mt-7">
          {t.final.cta}
        </Button>
      </FadeUp>
    </section>
  );
}

function Footer({ t }: { t: (typeof copy)[Lang] }) {
  return (
    <footer className="border-t border-[var(--line)] bg-gallery-lift px-4 py-8 md:px-10 md:py-14 xl:px-16">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-2xl text-ivory">Collector Dream Factory</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-mist">{t.footer}</p>
        </div>
        <div className="flex flex-wrap gap-x-7 gap-y-4 text-sm font-semibold text-mist">
          <a href="#collections" className="hover:text-ivory">
            {t.nav.collections}
          </a>
          <a href="/dream-project" className="hover:text-ivory">
            {t.nav.project}
          </a>
          <a href="/story" className="hover:text-ivory">
            {t.nav.about}
          </a>
          <a href="/faq" className="hover:text-ivory">
            {t.nav.faq}
          </a>
          <Link href="/guides" className="hover:text-ivory">
            {t.nav.guides}
          </Link>
          {socialLinks.map((link) => (
            <a
              key={link.name}
              id={link.name === "Instagram" ? "instagram" : undefined}
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
  );
}
