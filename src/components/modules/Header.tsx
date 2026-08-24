"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Phone, Search, ShoppingBag, X } from "lucide-react";
import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { useLenis } from "lenis/react";
import { useCart } from "@/context/CartContext";
import { products, searchSuggestions } from "@/data/products";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { formatPriceFrom, softSpring } from "@/lib/utils";
import type { Category, Product } from "@/types";

const nav = [
  { href: "/#projects", label: "Наши проекты", hash: "projects" },
  { href: "/#stages", label: "Этапы работы", hash: "stages" },
  { href: "/catalog", label: "Каталог", mega: true },
  { href: "/#before-after", label: "Пространство", hash: "before-after" },
  { href: "/#contacts", label: "Контакты", hash: "contacts" },
];

const megaColumns: { title: string; cat: Category; href: string }[] = [
  {
    title: "Кухни",
    cat: "кухни",
    href: "/catalog?cat=%D0%BA%D1%83%D1%85%D0%BD%D0%B8",
  },
  {
    title: "Прихожие",
    cat: "прихожие",
    href: "/catalog?cat=%D0%BF%D1%80%D0%B8%D1%85%D0%BE%D0%B6%D0%B8%D0%B5",
  },
  {
    title: "Диваны",
    cat: "диваны",
    href: "/catalog?cat=%D0%B4%D0%B8%D0%B2%D0%B0%D0%BD%D1%8B",
  },
];

function pickMegaItems(cat: Category, limit = 3): Product[] {
  return products.filter((p) => p.category === cat).slice(0, limit);
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const lenis = useLenis();
  const isHome = pathname === "/";
  const isMobile = useIsMobile();
  const { hidden, scrolled } = useScrollDirection();
  const { openCart, count } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);

  useLockBodyScroll(mobileOpen);

  const solid = scrolled || megaOpen || searchOpen || !isHome;
  const hideBar = hidden && !megaOpen && !mobileOpen && !searchOpen && !isMobile;

  const megaLists = useMemo(
    () =>
      megaColumns.map((col) => ({
        ...col,
        items: pickMegaItems(col.cat, 3),
      })),
    [],
  );

  const categoryHits = useMemo(() => {
    if (!query.trim()) return searchSuggestions;
    const q = query.toLowerCase();
    return searchSuggestions.filter(
      (s) =>
        s.label.toLowerCase().includes(q) ||
        s.query.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q),
    );
  }, [query]);

  const productHits = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products.slice(0, 6);
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.materials.some((m) => m.toLowerCase().includes(q)),
      )
      .slice(0, 8);
  }, [query]);

  const closeOverlays = () => {
    setMobileOpen(false);
    setSearchOpen(false);
    setMegaOpen(false);
    setQuery("");
  };

  const scrollToHash = (hash: string) => {
    const el = document.getElementById(hash);
    if (!el) return;
    if (lenis) {
      lenis.scrollTo(el, { offset: -96, duration: 1.2 });
    } else {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const onNavClick = (
    e: MouseEvent<HTMLAnchorElement>,
    hash?: string,
  ) => {
    closeOverlays();
    if (!hash) return;
    if (pathname === "/") {
      e.preventDefault();
      scrollToHash(hash);
      window.history.replaceState(null, "", `/#${hash}`);
      return;
    }
    e.preventDefault();
    router.push(`/#${hash}`);
  };

  useEffect(() => {
    if (pathname !== "/") return;
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash) return;
    const t = window.setTimeout(() => scrollToHash(hash), 80);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, lenis]);

  useEffect(() => {
    if (!searchOpen && !mobileOpen && !megaOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeOverlays();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen, mobileOpen, megaOpen]);

  return (
    <>
      <motion.header
        className={`fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] transition-[background,box-shadow,backdrop-filter] duration-500 ${
          solid
            ? "bg-cashmere/80 shadow-soft backdrop-blur-md"
            : "bg-transparent"
        }`}
        animate={{ y: hideBar ? "-100%" : 0 }}
        transition={softSpring}
        onMouseLeave={() => setMegaOpen(false)}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-2 px-4 sm:h-16 sm:px-5 md:h-20 md:px-8">
          <Link
            href="/"
            onClick={closeOverlays}
            className={`relative z-10 shrink-0 font-serif text-[1.55rem] font-semibold tracking-tight sm:text-[1.85rem] md:text-[2.15rem] ${
              solid ? "text-graphite" : "text-milk"
            }`}
          >
            Valentin
          </Link>

          <nav
            className="hidden items-center gap-8 lg:flex"
            aria-label="Основная"
          >
            {nav.map((item) => {
              const active =
                item.href === "/catalog" ? pathname.startsWith("/catalog") : false;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-[0.95rem] font-semibold tracking-wide transition-colors md:text-base ${
                    solid
                      ? active
                        ? "text-graphite"
                        : "text-graphite/75 hover:text-graphite"
                      : "text-milk/80 hover:text-milk"
                  }`}
                  onMouseEnter={() => setMegaOpen(Boolean(item.mega))}
                  onClick={(e) => onNavClick(e, item.hash)}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center">
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setSearchOpen((v) => !v);
                  setMobileOpen(false);
                }}
                className={`flex h-10 w-10 items-center justify-center rounded-full sm:h-11 sm:w-11 ${
                  solid
                    ? "text-graphite hover:bg-milk"
                    : "text-milk hover:bg-white/10"
                }`}
                aria-label="Поиск"
                aria-expanded={searchOpen}
                aria-controls="header-search"
              >
                <Search className="h-5 w-5" />
              </button>
              <AnimatePresence>
                {searchOpen && (
                  <motion.div
                    id="header-search"
                    role="search"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={softSpring}
                    className="absolute right-0 top-full z-50 mt-3 w-[min(calc(100vw-2rem),22rem)] overflow-hidden border border-brass/25 bg-milk/95 p-3 shadow-soft backdrop-blur-xl"
                  >
                    <label className="sr-only" htmlFor="header-search-input">
                      Поиск по каталогу
                    </label>
                    <input
                      id="header-search-input"
                      autoFocus
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Найти кухню, диван, прихожую..."
                      className="w-full rounded-xl bg-cashmere px-4 py-3 text-base outline-none placeholder:text-graphite/40"
                    />
                    <ul className="mt-2 max-h-[50vh] space-y-0.5 overflow-y-auto">
                      {categoryHits.map((s) => (
                        <li key={`cat-${s.label}`}>
                          <Link
                            href={`/catalog?cat=${encodeURIComponent(s.cat)}`}
                            onClick={closeOverlays}
                            className="flex items-center justify-between rounded-xl px-3 py-3 text-sm hover:bg-cashmere"
                          >
                            <span>{s.label}</span>
                            <span className="text-xs text-graphite/40">
                              раздел
                            </span>
                          </Link>
                        </li>
                      ))}
                      {productHits.map((p) => (
                        <li key={p.id}>
                          <Link
                            href={`/catalog/${p.id}`}
                            onClick={closeOverlays}
                            className="flex items-center justify-between gap-3 rounded-xl px-3 py-3 text-sm hover:bg-cashmere"
                          >
                            <span className="truncate">{p.name}</span>
                            <span className="shrink-0 text-xs text-graphite/40">
                              {formatPriceFrom(p.priceFrom)}
                            </span>
                          </Link>
                        </li>
                      ))}
                      {query.trim() &&
                      categoryHits.length === 0 &&
                      productHits.length === 0 ? (
                        <li className="px-3 py-3 text-sm text-graphite/45">
                          Ничего не найдено
                        </li>
                      ) : null}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              type="button"
              onClick={() => {
                closeOverlays();
                openCart();
              }}
              className={`relative flex h-10 w-10 items-center justify-center rounded-full sm:h-11 sm:w-11 ${
                solid
                  ? "text-graphite hover:bg-milk"
                  : "text-milk hover:bg-white/10"
              }`}
              aria-label="Заявка"
            >
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-wood px-1 text-[10px] font-medium text-milk sm:right-1.5 sm:top-1.5">
                  {count}
                </span>
              )}
            </button>

            <button
              type="button"
              className={`flex h-10 w-10 items-center justify-center rounded-full lg:hidden sm:h-11 sm:w-11 ${
                solid
                  ? "text-graphite hover:bg-milk"
                  : "text-milk hover:bg-white/10"
              }`}
              onClick={() => {
                setSearchOpen(false);
                setMobileOpen(true);
              }}
              aria-label="Меню"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {megaOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="border-t border-brass/20 bg-cashmere/95 backdrop-blur-md"
            >
              <div className="mx-auto grid max-w-7xl gap-6 px-5 py-5 md:grid-cols-3 md:gap-8 md:px-8 md:py-6">
                {megaLists.map((col) => (
                  <div key={col.cat}>
                    <Link
                      href={col.href}
                      onClick={() => setMegaOpen(false)}
                      className="mb-3 inline-flex items-baseline gap-2 font-serif text-xl text-graphite transition hover:text-walnut"
                    >
                      {col.title}
                      <span className="text-xs font-sans uppercase tracking-[0.14em] text-brass">
                        все
                      </span>
                    </Link>
                    <ul className="space-y-1">
                      {col.items.map((p) => (
                        <li key={p.id}>
                          <Link
                            href={`/catalog/${p.id}`}
                            onClick={() => setMegaOpen(false)}
                            className="flex items-center gap-3 rounded-lg px-1 py-1.5 transition hover:bg-milk/80"
                          >
                            <span className="relative h-11 w-9 shrink-0 overflow-hidden bg-milk">
                              <Image
                                src={p.images[0]}
                                alt=""
                                fill
                                className={
                                  p.images[0]?.endsWith(".png")
                                    ? "object-contain p-0.5"
                                    : "object-cover"
                                }
                                sizes="36px"
                              />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm text-graphite">
                                {p.name}
                              </span>
                              <span className="block text-xs text-graphite/45">
                                {formatPriceFrom(p.priceFrom)}
                              </span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[55] flex flex-col bg-cashmere pt-[env(safe-area-inset-top)] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex h-14 items-center justify-between px-4 sm:h-16 sm:px-5">
              <Link
                href="/"
                onClick={closeOverlays}
                className="font-serif text-[1.55rem] font-semibold tracking-tight text-graphite sm:text-[1.85rem]"
              >
                Valentin
              </Link>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-milk sm:h-11 sm:w-11"
                onClick={() => setMobileOpen(false)}
                aria-label="Закрыть меню"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav
              className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-4 pt-6 sm:px-5"
              aria-label="Мобильная"
            >
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => onNavClick(e, item.hash)}
                  className="rounded-2xl px-3 py-3.5 text-[1.65rem] font-semibold leading-tight text-graphite hover:bg-milk sm:text-2xl"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="border-t border-brass/15 px-5 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
              <a
                href="tel:+79202005124"
                className="bg-wood inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-5 text-sm font-medium text-milk shadow-brass"
              >
                <Phone className="h-4 w-4" />
                +7 (920) 200-51-24
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
