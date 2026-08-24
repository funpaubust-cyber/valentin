"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CutCta } from "@/components/ui/CutCta";
import { siteImages } from "@/data/products";
import { useSmoothScrollTo } from "@/hooks/useSmoothScrollTo";

/** Как на mfslon.ru: картинка уходит вдаль (scale 1.45 → 1), текст выезжает снизу */
const easeOut = [0.215, 0.61, 0.355, 1] as const;

export function Hero() {
  const [active, setActive] = useState(false);
  const scrollTo = useSmoothScrollTo();

  useEffect(() => {
    let cancelled = false;
    const t = window.setTimeout(() => {
      if (!cancelled) setActive(true);
    }, 80);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, []);

  return (
    <section
      id="top"
      className="relative h-[100dvh] min-h-[36rem] w-full overflow-hidden bg-graphite text-milk"
    >
      <div className="absolute inset-0 bg-graphite">
        <motion.div
          className="absolute inset-0 origin-center will-change-transform"
          initial={{ scale: 1.22 }}
          animate={{ scale: active ? 1 : 1.22 }}
          transition={{ duration: 1.3, ease: "linear" }}
        >
          <Image
            src={siteImages.hero}
            alt="Премиальная кухня Valentin — камень, латунь и остров"
            fill
            priority
            className="object-cover object-[center_58%] md:object-center"
            sizes="100vw"
            quality={100}
          />
        </motion.div>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-graphite/90 via-graphite/30 to-graphite/10" />
        <div className="pointer-events-none absolute inset-0 bg-vignette opacity-30" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-graphite/45 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-[calc(5.5rem+env(safe-area-inset-top))] md:px-8 md:pb-14 md:pt-28">
        <div className="overflow-hidden">
          <motion.p
            className="mb-2 font-serif text-[2.35rem] tracking-tight text-milk drop-shadow-[0_8px_32px_rgba(0,0,0,0.45)] md:mb-4 md:text-6xl lg:text-7xl"
            initial={{ y: "110%", opacity: 0 }}
            animate={
              active ? { y: "0%", opacity: 1 } : { y: "110%", opacity: 0 }
            }
            transition={{ duration: 0.55, delay: 0.7, ease: easeOut }}
          >
            Valentin
          </motion.p>
        </div>

        <div className="overflow-hidden">
          <motion.h1
            className="max-w-3xl font-serif text-[1.65rem] leading-[1.2] text-milk/95 text-balance drop-shadow-[0_6px_24px_rgba(0,0,0,0.4)] md:text-[clamp(1.75rem,3.2vw,2.75rem)] md:leading-[1.15]"
            initial={{ y: "120%", opacity: 0 }}
            animate={
              active ? { y: "0%", opacity: 1 } : { y: "120%", opacity: 0 }
            }
            transition={{ duration: 0.55, delay: 0.85, ease: easeOut }}
          >
            Кухни, прихожие и мягкая мебель под заказ
          </motion.h1>
        </div>

        <div className="overflow-hidden">
          <motion.p
            className="mt-3 max-w-xl text-[0.95rem] leading-relaxed text-milk/70 md:mt-5 md:text-base"
            initial={{ y: "100%", opacity: 0 }}
            animate={
              active ? { y: "0%", opacity: 1 } : { y: "100%", opacity: 0 }
            }
            transition={{ duration: 0.5, delay: 1.0, ease: easeOut }}
          >
            Качественная мебель для архитектуры вашего пространства.
          </motion.p>
        </div>

        <motion.div
          className="mt-6 md:mt-9"
          initial={{ y: 24, opacity: 0 }}
          animate={active ? { y: 0, opacity: 1 } : { y: 24, opacity: 0 }}
          transition={{ duration: 0.55, delay: 1.15, ease: easeOut }}
        >
          <CutCta
            className="sm:w-auto sm:min-w-[17.5rem]"
            align="start"
            onClick={() => scrollTo("projects")}
          >
            Смотреть проекты
          </CutCta>
        </motion.div>
      </div>
    </section>
  );
}
