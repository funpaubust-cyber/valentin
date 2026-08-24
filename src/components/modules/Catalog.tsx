"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState, useTransition } from "react";
import { LayoutGrid, Columns2, SlidersHorizontal, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { products } from "@/data/products";
import type { CatalogFilters, Category, GridMode, Material, Product } from "@/types";
import { ProductCard } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";
import { formatPrice, formatPriceFrom, softSpring } from "@/lib/utils";
import { productDescription, productFeatures } from "@/lib/productCopy";
import { useCart } from "@/context/CartContext";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

const categories: Category[] = ["кухни", "прихожие", "диваны"];

const materials = Array.from(
  new Set(products.flatMap((p) => p.materials)),
).sort() as Material[];

const defaultFilters: CatalogFilters = {
  priceMin: 0,
  priceMax: 300000,
  materials: [],
  categories: [],
};

function isCategory(value: string | null): value is Category {
  return value === "кухни" || value === "прихожие" || value === "диваны";
}

export function Catalog({ standalone = false }: { standalone?: boolean }) {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("cat");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [grid, setGrid] = useState<GridMode>("compact");
  const [filters, setFilters] = useState<CatalogFilters>(() => ({
    ...defaultFilters,
    categories: isCategory(initialCat) ? [initialCat] : [],
  }));
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [isPending, startTransition] = useTransition();
  const { addItem } = useCart();

  useLockBodyScroll(filtersOpen || Boolean(quickView));

  useEffect(() => {
    if (!quickView && !filtersOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setQuickView(null);
        setFiltersOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [quickView, filtersOpen]);

  useEffect(() => {
    const cat = searchParams.get("cat");
    startTransition(() => {
      setFilters((prev) => ({
        ...prev,
        categories: isCategory(cat) ? [cat] : [],
      }));
    });
  }, [searchParams]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (p.priceFrom < filters.priceMin || p.priceFrom > filters.priceMax)
        return false;
      if (
        filters.materials.length &&
        !filters.materials.some((m) => p.materials.includes(m))
      )
        return false;
      if (
        filters.categories.length &&
        !filters.categories.includes(p.category)
      )
        return false;
      return true;
    });
  }, [filters]);

  const updateFilters = (patch: Partial<CatalogFilters>) => {
    startTransition(() => {
      setFilters((prev) => ({ ...prev, ...patch }));
    });
  };

  const toggleMaterial = (m: Material) => {
    startTransition(() => {
      setFilters((prev) => ({
        ...prev,
        materials: prev.materials.includes(m)
          ? prev.materials.filter((x) => x !== m)
          : [...prev.materials, m],
      }));
    });
  };

  const toggleCategory = (c: Category) => {
    startTransition(() => {
      setFilters((prev) => ({
        ...prev,
        categories: prev.categories.includes(c)
          ? prev.categories.filter((x) => x !== c)
          : [...prev.categories, c],
      }));
    });
  };

  return (
    <section
      id="catalog"
      className={`bg-cashmere pb-16 md:pb-28 ${
        standalone ? "pt-[calc(5.5rem+env(safe-area-inset-top))] md:pt-32" : "pt-10 md:pt-12"
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-10 flex flex-col gap-6 md:mb-12 md:flex-row md:items-end md:justify-between">
          <FadeIn>
            <p className="mb-3 text-xs uppercase tracking-[0.22em] text-brass">
              Каталог
            </p>
            <h2 className="font-serif text-[1.85rem] leading-tight text-graphite md:text-5xl">
              Кухни · Прихожие · Диваны
            </h2>
            <p
              className={`mt-3 text-sm text-graphite/55 transition-opacity ${
                isPending ? "opacity-50" : "opacity-100"
              }`}
            >
              {filtered.length} позиций
            </p>
          </FadeIn>

          <FadeIn delay={0.08} className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              magnetic={false}
              onClick={() => setFiltersOpen(true)}
              className="!px-5"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Фильтры
            </Button>
            <div className="inline-flex border border-brass/25 p-1">
              <button
                type="button"
                onClick={() => setGrid("large")}
                className={`flex h-11 w-11 items-center justify-center transition-colors ${
                  grid === "large"
                    ? "bg-graphite text-milk"
                    : "hover:bg-milk"
                }`}
                aria-label="Крупная сетка"
                aria-pressed={grid === "large"}
              >
                <Columns2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setGrid("compact")}
                className={`flex h-11 w-11 items-center justify-center transition-colors ${
                  grid === "compact"
                    ? "bg-graphite text-milk"
                    : "hover:bg-milk"
                }`}
                aria-label="Компактная сетка"
                aria-pressed={grid === "compact"}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>
          </FadeIn>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((c) => {
            const on = filters.categories.includes(c);
            return (
              <button
                key={c}
                type="button"
                onClick={() => toggleCategory(c)}
                className={`px-4 py-2.5 text-sm capitalize transition-all duration-300 ${
                  on
                    ? "bg-wood text-milk shadow-brass"
                    : "border border-brass/25 bg-milk text-graphite/70 shadow-soft hover:border-brass/50 hover:shadow-lift"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>

        <div
          className={`grid gap-x-3 gap-y-8 md:gap-x-8 md:gap-y-14 ${
            grid === "large"
              ? "grid-cols-1 md:grid-cols-2"
              : "grid-cols-2 lg:grid-cols-3"
          } ${isPending ? "opacity-70" : "opacity-100"} transition-opacity`}
        >
          {filtered.map((product, i) => (
            <FadeIn key={product.id} delay={Math.min(i * 0.04, 0.24)}>
              <ProductCard
                product={product}
                large={grid === "large"}
                onQuickView={setQuickView}
              />
            </FadeIn>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {filtersOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Закрыть фильтры"
              className="fixed inset-0 z-[60] bg-graphite/30 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFiltersOpen(false)}
            />
            <motion.aside
            className="fixed inset-y-0 left-0 z-[70] flex w-full max-w-none flex-col bg-milk shadow-soft sm:max-w-sm pt-[env(safe-area-inset-top)]"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={softSpring}
              role="dialog"
              aria-modal="true"
              aria-label="Фильтры каталога"
            >
              <div className="flex items-center justify-between border-b border-brass/20 px-6 py-5">
                <h3 className="font-serif text-2xl">Фильтры</h3>
                <button
                  type="button"
                  className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-cashmere"
                  onClick={() => setFiltersOpen(false)}
                  aria-label="Закрыть"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div
                data-lenis-prevent
                className="flex-1 space-y-8 overflow-y-auto px-6 py-6"
              >
                <fieldset>
                  <legend className="mb-4 text-xs uppercase tracking-[0.16em] text-graphite/45">
                    Цена от
                  </legend>
                  <label className="block text-sm text-graphite/70">
                    До {formatPrice(filters.priceMax)}
                    <input
                      type="range"
                      min={5000}
                      max={300000}
                      step={1000}
                      value={filters.priceMax}
                      onChange={(e) =>
                        updateFilters({ priceMax: Number(e.target.value) })
                      }
                      className="mt-2 w-full accent-brass"
                    />
                  </label>
                </fieldset>

                <fieldset>
                  <legend className="mb-4 text-xs uppercase tracking-[0.16em] text-graphite/45">
                    Материалы
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {materials.map((m) => {
                      const on = filters.materials.includes(m);
                      return (
                        <button
                          key={m}
                          type="button"
                          onClick={() => toggleMaterial(m)}
                          className={`px-4 py-2.5 text-sm capitalize transition-colors ${
                            on
                              ? "bg-wood text-milk"
                              : "bg-cashmere text-graphite hover:bg-cashmere/80"
                          }`}
                        >
                          {m}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              </div>

              <div className="flex gap-2 border-t border-brass/20 px-6 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
                <Button
                  variant="outline"
                  fullWidth
                  magnetic={false}
                  onClick={() => setFilters(defaultFilters)}
                >
                  Сбросить
                </Button>
                <Button
                  fullWidth
                  magnetic={false}
                  onClick={() => setFiltersOpen(false)}
                >
                  Показать {filtered.length}
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {quickView && (
          <motion.div
            key="quick-view"
            className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:p-4 md:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-graphite/40 backdrop-blur-sm"
              onClick={() => setQuickView(null)}
              aria-label="Закрыть быстрый просмотр"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={quickView.name}
              data-lenis-prevent
              className="relative z-[1] max-h-[92dvh] w-full max-w-3xl overflow-y-auto overscroll-contain bg-milk p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-soft md:p-8"
              initial={{ y: 28 }}
              animate={{ y: 0 }}
              exit={{ y: 16 }}
              transition={softSpring}
            >
              <div className="grid gap-6 md:grid-cols-2">
                <div
                  className={`relative aspect-[3/4] overflow-hidden ${
                    quickView.images[0]?.endsWith(".png") ? "bg-cashmere" : "bg-milk"
                  }`}
                >
                  <Image
                    src={quickView.images[0]}
                    alt={quickView.name}
                    fill
                    className={
                      quickView.images[0]?.endsWith(".png")
                        ? "object-contain object-center p-6"
                        : "object-cover object-center"
                    }
                    sizes="(max-width:768px) 100vw, 40vw"
                  />
                </div>
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-serif text-3xl">{quickView.name}</h3>
                    <button
                      type="button"
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full hover:bg-cashmere"
                      onClick={() => setQuickView(null)}
                      aria-label="Закрыть"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="mt-2 font-medium text-brass">
                    {formatPriceFrom(quickView.priceFrom)}
                  </p>
                  <p className="mt-1 text-sm text-graphite/55">
                    {quickView.materials.join(" · ")}
                  </p>
                  <p className="mt-5 text-sm leading-relaxed text-graphite/65">
                    {productDescription(quickView)}
                  </p>
                  <ul className="mt-4 space-y-1 text-sm text-graphite/60">
                    {productFeatures(quickView).map((f) => (
                      <li key={f}>— {f}</li>
                    ))}
                  </ul>
                  <p className="mt-4 text-xs uppercase tracking-[0.14em] text-graphite/45">
                    Под заказ
                  </p>
                  <div className="mt-8 flex flex-col gap-2 sm:flex-row">
                    <Button
                      fullWidth
                      onClick={() => {
                        addItem(quickView);
                        setQuickView(null);
                      }}
                    >
                      В заявку
                    </Button>
                    <Link
                      href={`/catalog/${quickView.id}`}
                      className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-brass/40 px-5 text-sm text-graphite transition hover:border-brass hover:bg-milk/60"
                      onClick={() => setQuickView(null)}
                    >
                      Страница товара
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
