"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef, type ReactNode } from "react";
import { cn, softSpring } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: ReactNode;
  variant?: Variant;
  /** @deprecated Magnetic hover is disabled; kept for call-site compatibility */
  magnetic?: boolean;
  fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-wood text-milk shadow-brass hover:shadow-lift focus-visible:ring-brass/40",
  secondary:
    "bg-graphite text-milk shadow-soft hover:bg-walnut focus-visible:ring-graphite/30",
  ghost:
    "bg-transparent text-graphite hover:bg-cashmere focus-visible:ring-brass/20",
  outline:
    "bg-transparent border border-brass/40 text-graphite shadow-soft hover:border-brass hover:bg-milk/60 hover:text-walnut focus-visible:ring-brass/20",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      children,
      variant = "primary",
      magnetic: _magnetic,
      fullWidth,
      className = "",
      ...props
    },
    ref
  ) {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        transition={softSpring}
        className={cn(
          "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium tracking-wide transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-cashmere disabled:cursor-not-allowed disabled:opacity-50",
          variants[variant],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
