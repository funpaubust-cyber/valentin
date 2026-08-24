"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const clip =
  "polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 0 100%)";

type CutCtaProps = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  align?: "center" | "start";
};

export function CutCta({
  children,
  href,
  onClick,
  className,
  align = "center",
}: CutCtaProps) {
  const inner = (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-wood shadow-brass transition-[filter] duration-300 group-hover:brightness-110"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute top-0 h-px w-[32px] origin-left bg-milk/45"
        style={{ right: 0, transform: "translateX(-22px) rotate(45deg)" }}
      />
      <span
        className={cn(
          "relative flex flex-1 items-center px-6 py-3.5 text-[13px] font-medium uppercase tracking-[0.18em] sm:px-7",
          align === "start" ? "justify-start text-left" : "justify-center"
        )}
      >
        {children}
      </span>
      <span className="relative flex w-12 shrink-0 items-center justify-center border-l border-milk/20 sm:w-14">
        <ArrowUpRight className="h-4 w-4 transition-transform duration-500 ease-premium group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </>
  );

  const classNameFull = cn(
    "group relative inline-flex min-h-12 w-full items-stretch overflow-hidden text-milk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass/40 focus-visible:ring-offset-2",
    className
  );

  if (href) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={classNameFull}
        style={{ clipPath: clip }}
      >
        {inner}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={classNameFull}
      style={{ clipPath: clip }}
    >
      {inner}
    </button>
  );
}
