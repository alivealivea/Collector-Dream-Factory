import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Check, Clock3, ImageIcon, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { links } from "@/src/config/links";
import { absoluteUrl } from "@/src/config/seo";
import {
  projectStatus,
  type ProjectStepStatus,
} from "@/src/data/projectStatus";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "ติดตามสถานะโปรเจกต์ | Collector Dream Factory",
  description: "ดูความคืบหน้าของ Hero Piece ตั้งแต่รับรูปอ้างอิง เริ่มผลิต เก็บรายละเอียด จนพร้อมส่งมอบ",
  alternates: {
    canonical: "/project-status",
  },
  openGraph: {
    title: "ติดตามสถานะโปรเจกต์ | Collector Dream Factory",
    description: "ดูความคืบหน้าของชิ้นงานในแต่ละขั้นตอน",
    url: absoluteUrl("/project-status"),
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "ติดตามสถานะโปรเจกต์ | Collector Dream Factory",
    description: "ดูความคืบหน้าของชิ้นงานในแต่ละขั้นตอน",
  },
};

const statusStyles: Record<ProjectStepStatus, string> = {
  completed: "border-gold/35 bg-gold/10 text-gold",
  "in-progress": "border-cyan/45 bg-cyan/10 text-[#247f7a]",
  pending: "border-[var(--line)] bg-[#F5F1EA] text-mist",
};

function StatusIcon({ status }: { status: ProjectStepStatus }) {
  if (status === "completed") return <Check size={17} />;
  if (status === "in-progress") return <LoaderCircle size={17} />;
  return <Clock3 size={17} />;
}

export default function ProjectStatusPage() {
  return (
    <main className="min-h-screen bg-void font-thai text-ivory">
      <header className="border-b border-[var(--line)] bg-void/82 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 md:px-10 xl:px-16">
          <Link href="/" className="font-display text-lg tracking-wide">
            Collector Dream Factory
          </Link>
          <Link href="/" className="text-sm font-bold text-mist transition hover:text-ivory">
            กลับหน้าแรก
          </Link>
        </nav>
      </header>

      <section className="px-5 pb-10 pt-14 md:px-10 md:pb-14 md:pt-20 xl:px-16">
        <div className="mx-auto max-w-[1120px]">
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.18em] text-gold">
            PROJECT TIMELINE
          </p>
          <h1 className="max-w-5xl text-[clamp(3.2rem,8vw,7rem)] font-semibold leading-[0.94] tracking-[-0.055em]">
            ติดตามสถานะโปรเจกต์
          </h1>
          <p className="mt-7 max-w-3xl text-xl font-medium leading-9 text-mist md:text-2xl">
            ดูความคืบหน้าของชิ้นงานในแต่ละขั้นตอน
          </p>
        </div>
      </section>

      <section className="px-5 py-8 md:px-10 md:py-12 xl:px-16">
        <div className="mx-auto max-w-[1120px] rounded-3xl border border-[var(--line)] bg-gallery p-5 shadow-[var(--soft-shadow)] md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-gold">
                {projectStatus.projectName}
              </p>
              <p className="mt-3 text-[clamp(2.3rem,4vw,4.5rem)] font-semibold leading-none tracking-[-0.05em]">
                {projectStatus.progress}%
              </p>
              <p className="mt-3 text-sm font-medium text-mist">ความคืบหน้าโดยรวม</p>
            </div>
            <div className="rounded-2xl border border-[var(--line)] bg-[#F5F1EA] px-5 py-4 md:min-w-72">
              <p className="flex items-center gap-2 text-sm font-bold text-mist">
                <CalendarDays size={17} className="text-gold" />
                วันที่คาดว่าจะเสร็จ
              </p>
              <p className="mt-2 text-xl font-semibold">{projectStatus.estimatedCompletionDate}</p>
            </div>
          </div>

          <div
            className="mt-7 h-3 overflow-hidden rounded-full bg-[#E7DED2]"
            role="progressbar"
            aria-valuenow={projectStatus.progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="ความคืบหน้าโปรเจกต์"
          >
            <div
              className="h-full rounded-full bg-gold transition-[width] duration-700"
              style={{ width: `${projectStatus.progress}%` }}
            />
          </div>
        </div>
      </section>

      <section className="px-5 py-8 md:px-10 md:py-12 xl:px-16">
        <div className="mx-auto max-w-[1120px]">
          <h2 className="mb-6 text-[clamp(2.2rem,4vw,4.4rem)] font-semibold leading-none tracking-[-0.05em]">
            Timeline
          </h2>
          <div className="relative">
            <div className="absolute bottom-8 left-6 top-8 hidden w-px bg-[var(--line)] md:block" />
            <div className="grid gap-4">
              {projectStatus.steps.map((step) => (
                <article
                  key={step.id}
                  className="relative grid gap-4 rounded-2xl border border-[var(--line)] bg-gallery p-5 shadow-[var(--soft-shadow)] md:grid-cols-[48px_1fr_auto] md:items-center md:p-6"
                >
                  <span
                    className={cn(
                      "relative z-10 inline-flex h-12 w-12 items-center justify-center rounded-full border text-sm font-black",
                      statusStyles[step.status],
                    )}
                  >
                    {step.status === "completed" ? <Check size={18} /> : step.id}
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-gold">
                      STEP {String(step.id).padStart(2, "0")}
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold tracking-[-0.035em]">{step.title}</h3>
                    <p className="mt-2 text-base font-medium leading-7 text-mist">{step.description}</p>
                  </div>
                  <span
                    className={cn(
                      "inline-flex w-fit items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold",
                      statusStyles[step.status],
                    )}
                  >
                    <StatusIcon status={step.status} />
                    {step.statusLabel}
                  </span>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-8 md:px-10 md:py-12 xl:px-16">
        <div className="mx-auto max-w-[1120px]">
          <div className="mb-6">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-gold">PROJECT UPDATES</p>
            <h2 className="mt-3 text-[clamp(2.2rem,4vw,4.4rem)] font-semibold leading-none tracking-[-0.05em]">
              อัปเดตล่าสุด
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {projectStatus.updates.map((update) => (
              <article
                key={update.id}
                className="overflow-hidden rounded-2xl border border-[var(--line)] bg-gallery shadow-[var(--soft-shadow)]"
              >
                <div className="flex aspect-[4/3] items-center justify-center bg-[#F5F1EA]">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-[var(--line)] bg-gallery text-gold">
                    <ImageIcon size={24} />
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold">{update.date}</p>
                  <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em]">{update.title}</h3>
                  <p className="mt-2 text-sm font-medium text-mist">Photo placeholder</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 pt-8 md:px-10 md:pb-28 xl:px-16">
        <div className="mx-auto max-w-[980px] rounded-3xl border border-[var(--line)] bg-gallery p-7 text-center shadow-[var(--soft-shadow)] md:p-12">
          <h2 className="text-[clamp(2.5rem,5vw,5.4rem)] font-semibold leading-[0.98] tracking-[-0.055em]">
            มีคำถามเพิ่มเติม?
          </h2>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href={links.line} target="_blank" rel="noreferrer">
              LINE
            </Button>
            <Button href={links.facebookInbox} target="_blank" rel="noreferrer" variant="secondary">
              Facebook
            </Button>
            <Button href={links.instagram} target="_blank" rel="noreferrer" variant="secondary">
              Instagram
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
