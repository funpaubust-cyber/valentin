"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FadeIn } from "@/components/ui/FadeIn";
import { siteImages } from "@/data/products";

export function BeforeAfter() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const target = useMotionValue(50);
  const position = useSpring(target, {
    stiffness: 180,
    damping: 22,
    mass: 0.55,
  });
  const velocity = useRef(0);
  const lastX = useRef(0);
  const lastT = useRef(0);

  const clip = useTransform(position, (v) => `inset(0 ${100 - v}% 0 0)`);
  const left = useTransform(position, (v) => `${v}%`);

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      const now = performance.now();
      const dt = Math.max(1, now - lastT.current);
      velocity.current = ((e.clientX - lastX.current) / dt) * 16;
      lastX.current = e.clientX;
      lastT.current = now;
      target.set(Math.min(92, Math.max(8, pct)));
    };

    const onPointerUp = () => {
      if (!dragging) return;
      setDragging(false);
      const current = target.get();
      const inertia = Math.max(-8, Math.min(8, velocity.current * 0.9));
      const bounced = Math.min(92, Math.max(8, current + inertia));
      target.set(bounced);
      requestAnimationFrame(() => {
        const overshoot = inertia * 0.25;
        target.set(Math.min(92, Math.max(8, bounced - overshoot)));
      });
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [dragging, target]);

  return (
    <section id="before-after" className="bg-milk pb-20 pt-8 md:pb-28 md:pt-10">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <FadeIn className="mb-10 max-w-2xl md:mb-14">
          <p className="mb-3 text-xs uppercase tracking-[0.22em] text-brass">
            До / После
          </p>
          <h2 className="font-serif text-[1.85rem] leading-tight text-graphite md:text-5xl">
            Трансформация пространства
          </h2>
          <p className="mt-4 text-graphite/60">
            Сравните пространство до установки кухни и готовый интерьер после
            меблировки Valentin.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div
            ref={containerRef}
            className="relative aspect-[4/3] touch-none select-none overflow-hidden border border-brass/20 bg-walnut shadow-deep"
            onPointerDown={(e) => {
              setDragging(true);
              lastX.current = e.clientX;
              lastT.current = performance.now();
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = ((e.clientX - rect.left) / rect.width) * 100;
              target.set(Math.min(92, Math.max(8, pct)));
            }}
          >
            <Image
              src={siteImages.after}
              alt="Кухня после меблировки Valentin"
              fill
              className="object-cover object-center"
              sizes="100vw"
              quality={95}
              priority
            />

            <motion.div className="absolute inset-0" style={{ clipPath: clip }}>
              <Image
                src={siteImages.before}
                alt="Кухня до меблировки — замеры и подготовка"
                fill
                className="object-cover object-center"
                sizes="100vw"
                quality={95}
                priority
              />
            </motion.div>

            <motion.div
              className="absolute inset-y-0 z-10 w-[2px] bg-brass shadow-[0_0_18px_rgba(61,36,24,0.4)]"
              style={{ left }}
            >
              <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-brass/60 bg-milk shadow-brass sm:h-14 sm:w-14">
                <span className="text-[10px] uppercase tracking-[0.18em] text-walnut">
                  ↔
                </span>
              </div>
            </motion.div>

            <span className="absolute left-3 top-3 z-10 rounded-full bg-milk/85 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-oak backdrop-blur-sm sm:left-4 sm:top-4 sm:px-3 sm:py-1.5 sm:text-[11px] sm:tracking-[0.18em]">
              До
              <span className="hidden sm:inline"> меблировки</span>
            </span>
            <span className="absolute right-3 top-3 z-10 rounded-full bg-graphite/80 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-brass-soft backdrop-blur-sm sm:right-4 sm:top-4 sm:px-3 sm:py-1.5 sm:text-[11px] sm:tracking-[0.18em]">
              После
              <span className="hidden sm:inline"> меблировки</span>
            </span>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
