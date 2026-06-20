import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: "primary" | "secondary" | "text";
};

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <a
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-lg px-7 py-3.5 text-sm font-semibold transition duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-void",
        variant === "primary" &&
          "bg-gold text-[var(--button-text)] shadow-[0_10px_28px_rgba(185,130,43,0.22)] hover:-translate-y-0.5 hover:bg-gold-light hover:shadow-[0_14px_34px_rgba(185,130,43,0.26)] focus-visible:ring-gold",
        variant === "secondary" &&
          "border border-[var(--line)] bg-gallery/70 text-ivory hover:-translate-y-0.5 hover:border-cyan/60 hover:text-ivory focus-visible:ring-cyan",
        variant === "text" &&
          "px-0 text-mist hover:text-ivory focus-visible:ring-ivory",
        className,
      )}
      {...props}
    />
  );
}
