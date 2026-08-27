"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  projectGroups,
  type ProjectGroup,
  type PortfolioCollection,
} from "@/data/portfolio";
import { FadeIn } from "@/components/ui/FadeIn";
import { CutCta } from "@/components/ui/CutCta";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { useSmoothScrollTo } from "@/hooks/useSmoothScrollTo";
import { softSpring } from "@/lib/utils";

function PortfolioCard({
  collection,
  categoryTitle,
  onOpenLightbox,
  onRequest,
}: {
  collection: PortfolioCollection;
  categoryTitle: string;
  onOpenLightbox: (src: string) => void;
  onRequest: () => void;
}) {
  const [index, setIndex] = useState(0);
  const total = collection.images.length;
  const current = collection.images[index];
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((i) => (i - 1 + total) % total);
  };

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((i) => (i + 1) % total);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
    swiped.current = false;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current || total <= 1) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      swiped.current = true;
      if (dx < 0) setIndex((i) => (i + 1) % total);
      else setIndex((i) => (i - 1 + total) % total);
    }
    touchStart.current = null;
  };

  const openLightbox = () => {
    if (swiped.current) {
      swiped.current = false;
      return;
    }
    onOpenLightbox(current);
  };

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl bg-milk shadow-soft md:rounded-[1.25rem]">
      <div
        className="group relative aspect-[4/3] bg-cashmere"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <button
          type="button"
          className="relative block h-full w-full"
          onClick={openLightbox}
          aria-label={`${categoryTitle}: ракурс ${index + 1} из ${total}`}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Image
                src={current}
                alt={`${categoryTitle} — ${collection.style}, ракурс ${index + 1}`}
                fill
                className="object-contain"
                sizes="(max-width:768px) 100vw, 360px"
                quality={95}
              />
            </motion.div>
          </AnimatePresence>
        </button>

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-graphite/55 text-milk opacity-100 md:h-8 md:w-8 md:opacity-0 md:transition-opacity md:group-hover:opacity-100"
              aria-label="Предыдущий ракурс"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-graphite/55 text-milk opacity-100 md:h-8 md:w-8 md:opacity-0 md:transition-opacity md:group-hover:opacity-100"
              aria-label="Следующий ракурс"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex justify-center gap-1.5">
              {collection.images.map((_, i) => (
                <span
                  key={i}
                  className={`h-0.5 w-4 rounded-full transition-colors ${
                    i === index ? "bg-milk" : "bg-milk/45"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 px-4 py-4 md:px-5 md:py-5">
        <div className="space-y-1.5 text-sm">
          <p>
            <span className="font-semibold text-wood">Стиль: </span>
            <span className="text-graphite/70">{collection.style}</span>
          </p>
          <p>
            <span className="font-semibold text-wood">Планировка: </span>
            <span className="text-graphite/70">{collection.layout}</span>
          </p>
        </div>

        <button
          type="button"
          onClick={onRequest}
          className="bg-wood mt-auto inline-flex min-h-[44px] items-center justify-center rounded-full px-5 text-sm font-medium tracking-wide text-milk shadow-brass transition-[filter] hover:brightness-105"
        >
          Оставить заявку
        </button>
      </div>
    </article>
  );
}

function GroupShowcaseCard({
  group,
  onOpen,
}: {
  group: ProjectGroup;
  onOpen: () => void;
}) {
  const images =
    group.showcase.length > 0 ? group.showcase : [group.cover];
  const [index, setIndex] = useState(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((i) => (i - 1 + images.length) % images.length);
  };

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((i) => (i + 1) % images.length);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
    swiped.current = false;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      swiped.current = true;
      if (dx < 0) setIndex((i) => (i + 1) % images.length);
      else setIndex((i) => (i - 1 + images.length) % images.length);
    }
    touchStart.current = null;
  };

  const handleOpen = () => {
    if (swiped.current) {
      swiped.current = false;
      return;
    }
    onOpen();
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleOpen}
      onKeyDown={(e) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();
        handleOpen();
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl bg-walnut text-left shadow-soft md:rounded-[1.75rem]"
      aria-label={`${group.title}: ракурс ${index + 1} из ${images.length}. Открыть проекты`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={images[index]}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Image
            src={images[index]}
            alt={`${group.title} — ракурс ${index + 1}`}
            fill
            className="object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
            sizes="(max-width:768px) 33vw, 280px"
            quality={95}
            priority={index === 0}
          />
        </motion.div>
      </AnimatePresence>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-1.5 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-graphite/55 text-milk opacity-100 md:left-2 md:h-9 md:w-9 md:opacity-0 md:transition-opacity md:group-hover:opacity-100"
            aria-label="Предыдущий ракурс"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-1.5 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-graphite/55 text-milk opacity-100 md:right-2 md:h-9 md:w-9 md:opacity-0 md:transition-opacity md:group-hover:opacity-100"
            aria-label="Следующий ракурс"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="pointer-events-none absolute inset-x-0 bottom-12 z-10 flex justify-center gap-1.5 md:bottom-14">
            {images.map((_, i) => (
              <span
                key={i}
                className={`h-0.5 w-4 rounded-full transition-colors ${
                  i === index ? "bg-milk" : "bg-milk/45"
                }`}
              />
            ))}
          </div>
        </>
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-graphite/70 via-graphite/15 to-transparent" />
      <span className="absolute inset-x-0 bottom-0 z-10 p-2 font-serif text-[0.95rem] leading-tight text-milk sm:p-3 sm:text-lg md:p-5 md:text-2xl">
        {group.title}
      </span>
    </div>
  );
}

export function Projects() {
  const pathname = usePathname();
  const [open, setOpen] = useState<ProjectGroup | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const scrollTo = useSmoothScrollTo();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setOpen(null);
    setLightbox(null);
  }, [pathname]);

  useLockBodyScroll(Boolean(open) || Boolean(lightbox));

  useEffect(() => {
    if (!open && !lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (lightbox) setLightbox(null);
      else setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, lightbox]);

  const closeAll = () => {
    setLightbox(null);
    setOpen(null);
  };

  const overlays =
    mounted &&
    createPortal(
      <>
        <AnimatePresence>
          {open ? (
            <motion.div
              key="projects-modal"
              className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <button
                type="button"
                aria-label="Закрыть"
                className="absolute inset-0 bg-graphite/65 backdrop-blur-sm"
                onClick={closeAll}
              />
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label={open.title}
                className="relative z-[1] flex h-[100dvh] w-full max-w-4xl flex-col overflow-hidden bg-cashmere shadow-deep sm:h-auto sm:max-h-[min(92vh,48rem)]"
                initial={{ y: 20, scale: 0.98 }}
                animate={{ y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10 }}
                transition={softSpring}
              >
                <div className="flex shrink-0 items-center justify-between border-b border-brass/20 bg-milk px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-5 sm:py-4 md:px-6">
                  <h3 className="font-serif text-2xl text-graphite md:text-3xl">
                    {open.title}
                  </h3>
                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-cashmere"
                    onClick={closeAll}
                    aria-label="Закрыть окно"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div
                  data-lenis-prevent
                  className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:p-6"
                >
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {open.collections.map((collection) => (
                      <PortfolioCard
                        key={collection.id}
                        collection={collection}
                        categoryTitle={open.title}
                        onOpenLightbox={setLightbox}
                        onRequest={() => {
                          closeAll();
                          window.setTimeout(() => scrollTo("contacts"), 80);
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {lightbox ? (
            <motion.div
              key="projects-lightbox"
              className="fixed inset-0 z-[100] flex items-center justify-center bg-graphite/85 p-3 sm:p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setLightbox(null)}
            >
              <button
                type="button"
                className="absolute right-3 top-[max(0.75rem,env(safe-area-inset-top))] flex h-11 w-11 items-center justify-center rounded-full bg-milk/10 text-milk hover:bg-milk/20 sm:right-4 sm:top-4"
                aria-label="Закрыть фото"
                onClick={() => setLightbox(null)}
              >
                <X className="h-5 w-5" />
              </button>
              <motion.div
                className="relative h-[min(70dvh,42rem)] w-full max-w-4xl sm:h-[min(80vh,42rem)]"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={softSpring}
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={lightbox}
                  alt="Проект крупным планом"
                  fill
                  className="object-contain"
                  sizes="90vw"
                  quality={95}
                  priority
                />
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </>,
      document.body,
    );

  return (
    <section id="projects" className="bg-cashmere pb-2 pt-14 md:pb-3 md:pt-16">
      <div className="mx-auto max-w-5xl px-5 md:px-8">
        <FadeIn>
          <p className="mb-3 text-xs uppercase tracking-[0.22em] text-brass">
            Портфолио
          </p>
          <h2 className="font-serif text-[1.85rem] text-graphite md:text-4xl">
            Наши проекты
          </h2>
          <p className="mt-3 max-w-lg text-sm text-graphite/55 md:text-base">
            Выберите раздел — внутри подборка реализованных работ.
          </p>
        </FadeIn>

        <FadeIn delay={0.08} className="mt-8">
          <div className="grid grid-cols-3 gap-3 md:gap-5">
            {projectGroups.map((group) => (
              <GroupShowcaseCard
                key={group.id}
                group={group}
                onOpen={() => setOpen(group)}
              />
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.12} className="mt-6 md:mt-7">
          <CutCta href="/catalog" onClick={closeAll}>
            Открыть каталог
          </CutCta>
        </FadeIn>
      </div>

      {overlays}
    </section>
  );
}
