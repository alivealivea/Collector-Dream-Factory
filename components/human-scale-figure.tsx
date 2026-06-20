"use client";

import { cn } from "@/lib/utils";

export function HumanScaleFigure({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none relative h-full w-full", className)} aria-hidden="true">
      <div className="absolute bottom-0 left-1/2 h-[2.5%] w-[82%] -translate-x-1/2 rounded-full bg-[#8b5b26]/18 blur-[2px]" />

      <div className="absolute left-1/2 top-[1%] h-[14%] w-[36%] -translate-x-1/2 rounded-[48%_48%_43%_43%] bg-[#9a6428]" />
      <div className="absolute left-[31%] top-[4%] h-[6%] w-[12%] rotate-[-16deg] rounded-full bg-[#9a6428]" />
      <div className="absolute right-[30%] top-[4%] h-[6%] w-[12%] rotate-[16deg] rounded-full bg-[#9a6428]" />

      <div className="absolute left-1/2 top-[13%] h-[7%] w-[16%] -translate-x-1/2 rounded-b-lg bg-[#9a6428]" />
      <div className="absolute left-1/2 top-[18%] h-[38%] w-[58%] -translate-x-1/2 rounded-[42%_42%_24%_24%] bg-[#9a6428]" />
      <div className="absolute left-[16%] top-[21%] h-[38%] w-[17%] rotate-[4deg] rounded-full bg-[#9a6428]" />
      <div className="absolute right-[16%] top-[21%] h-[38%] w-[17%] rotate-[-4deg] rounded-full bg-[#9a6428]" />
      <div className="absolute left-[17%] top-[54%] h-[8%] w-[17%] rounded-full bg-[#9a6428]" />
      <div className="absolute right-[17%] top-[54%] h-[8%] w-[17%] rounded-full bg-[#9a6428]" />

      <div className="absolute left-[32%] bottom-[5%] h-[42%] w-[17%] rotate-[2deg] rounded-[999px_999px_28%_28%] bg-[#9a6428]" />
      <div className="absolute right-[32%] bottom-[5%] h-[42%] w-[17%] rotate-[-2deg] rounded-[999px_999px_28%_28%] bg-[#9a6428]" />
      <div className="absolute left-[26%] bottom-0 h-[7%] w-[25%] rotate-[-8deg] rounded-full bg-[#9a6428]" />
      <div className="absolute right-[26%] bottom-0 h-[7%] w-[25%] rotate-[8deg] rounded-full bg-[#9a6428]" />
    </div>
  );
}
