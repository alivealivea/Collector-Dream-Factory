"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type SmartImageFrameProps = {
  src: string;
  alt: string;
  sizes: string;
  openLabel: string;
  closeLabel: string;
  ratio?: "4:3" | "auto";
  priority?: boolean;
  className?: string;
};

export function SmartImageFrame({
  src,
  alt,
  sizes,
  openLabel,
  closeLabel,
  ratio = "4:3",
  priority = false,
  className,
}: SmartImageFrameProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "relative flex w-full items-center justify-center overflow-hidden rounded-2xl border border-[var(--line)] bg-[#F5F1EA] p-3 text-left shadow-[var(--soft-shadow)]",
          ratio === "4:3" ? "aspect-[4/3]" : "min-h-[260px]",
          className,
        )}
        aria-label={`${openLabel}: ${alt}`}
      >
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          sizes={sizes}
          className="block h-full w-full object-contain object-center"
        />
        <span className="absolute bottom-3 right-3 rounded-full border border-[rgba(23,19,15,0.12)] bg-white/88 px-3 py-1 text-xs font-bold text-[#17130f] shadow-sm backdrop-blur">
          {openLabel}
        </span>
      </button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#17130f]/82 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative flex h-[88vh] w-full max-w-6xl items-center justify-center rounded-2xl border border-white/20 bg-[#111] p-3 shadow-[0_30px_100px_rgba(0,0,0,0.5)]"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={src}
              alt={alt}
              decoding="async"
              className="block h-full w-full object-contain object-center"
            />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 rounded-full border border-white/20 bg-white/92 px-4 py-2 text-sm font-bold text-[#17130f] shadow-sm"
            >
              {closeLabel}
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
