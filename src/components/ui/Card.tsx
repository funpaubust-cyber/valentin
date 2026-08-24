"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Eye, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import type { Product } from "@/types";
import { formatPriceFrom, softSpring } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { Button } from "./Button";

interface ProductCardProps {
  product: Product;
  large?: boolean;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product, large, onQuickView }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [slide, setSlide] = useState(0);
  const { addItem } = useCart();
  const href = `/catalog/${product.id}`;

  useEffect(() => {
    if (!hovered || product.images.length < 2) {
      setSlide(0);
      return;
    }
    const id = window.setInterval(() => {
      setSlide((s) => (s + 1) % product.images.length);
    }, 1100);
    return () => window.clearInterval(id);
  }, [hovered, product.images.length]);

  return (
    <article
      className="group relative flex h-full flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative aspect-[3/4] overflow-hidden bg-cashmere shadow-soft transition-shadow duration-500 group-hover:shadow-lift"
      >
        <Link href={href} className="absolute inset-0 z-0" aria-label={product.name}>
          {product.images.map((src, i) => (
            <Image
              key={src}
              src={src}
              alt={i === 0 ? product.name : ""}
              fill
              className="object-cover object-center transition-opacity duration-700 ease-premium"
              style={{ opacity: slide === i ? 1 : 0 }}
              sizes={
                large
                  ? "(max-width:768px) 100vw, 50vw"
                  : "(max-width:768px) 50vw, 33vw"
              }
              quality={85}
            />
          ))}
        </Link>

        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-graphite/10 via-transparent to-transparent opacity-40" />

        <span className="absolute left-2 top-2 z-10 bg-graphite/85 px-2 py-1 text-[9px] uppercase tracking-[0.12em] text-milk shadow-soft backdrop-blur-sm sm:left-3 sm:top-3 sm:px-3 sm:py-1.5 sm:text-[11px] sm:tracking-[0.14em]">
          Под заказ
        </span>

        <motion.div
          initial={false}
          animate={{
            opacity: hovered ? 1 : 0,
            y: hovered ? 0 : 10,
            pointerEvents: hovered ? "auto" : "none",
          }}
          transition={softSpring}
          className="absolute inset-x-3 bottom-3 z-10 hidden gap-2 md:flex"
        >
          <Button
            variant="secondary"
            className="flex-1 !py-3 text-xs uppercase tracking-[0.12em] shadow-soft"
            onClick={() => onQuickView?.(product)}
            magnetic={false}
          >
            <Eye className="h-4 w-4" />
            Быстрый просмотр
          </Button>
          <Button
            variant="primary"
            className="!px-4 !py-3 shadow-brass"
            onClick={() => addItem(product)}
            magnetic={false}
            aria-label="Добавить в заявку"
          >
            <ShoppingBag className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>

      <div className="mt-3 flex flex-1 flex-col gap-2 border-t border-brass/15 pt-3 sm:mt-5 sm:gap-3 sm:pt-5">
        <div className="space-y-1.5 sm:space-y-2.5">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
            <h3 className="min-w-0 font-serif text-[1.05rem] leading-snug text-graphite sm:text-xl md:text-2xl">
              <Link href={href} className="transition-colors hover:text-walnut">
                {product.name}
              </Link>
            </h3>
            <p className="shrink-0 text-xs font-medium tracking-wide text-brass sm:pt-1 sm:text-sm">
              {formatPriceFrom(product.priceFrom)}
            </p>
          </div>
          <p className="text-[10px] uppercase tracking-[0.14em] text-graphite/45 sm:text-[11px] sm:tracking-[0.16em]">
            {product.category} · {product.materials.join(" · ")}
          </p>
        </div>

        <div className="mt-auto flex gap-1.5 sm:gap-2 md:hidden">
          <Button
            variant="secondary"
            className="flex-1 !min-h-11 !px-2 !py-2 text-[11px] sm:!py-3 sm:text-xs"
            onClick={() => onQuickView?.(product)}
            magnetic={false}
          >
            Просмотр
          </Button>
          <Button
            variant="primary"
            className="!min-h-11 !px-3 !py-2 sm:!px-4 sm:!py-3"
            onClick={() => addItem(product)}
            magnetic={false}
            aria-label="Добавить в заявку"
          >
            <ShoppingBag className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </article>
  );
}
