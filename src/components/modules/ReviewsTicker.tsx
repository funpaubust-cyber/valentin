"use client";

import { yandexReviews } from "@/data/reviews";
import {
  YANDEX_RATING,
  YANDEX_REVIEW_COUNT,
  YANDEX_REVIEWS_URL,
} from "@/data/salon";

function Stars({ value }: { value: number }) {
  return (
    <span className="inline-flex gap-0.5 text-brass" aria-label={`${value} из 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < value ? "opacity-100" : "opacity-25"}>
          ★
        </span>
      ))}
    </span>
  );
}

function excerpt(text: string, max = 210) {
  if (text.length <= max) return text;
  return `${text.slice(0, max).replace(/\s+\S*$/, "")}…`;
}

function Card({
  author,
  date,
  text,
  rating,
}: (typeof yandexReviews)[number]) {
  return (
    <article className="flex h-[22.5rem] w-[min(22rem,78vw)] shrink-0 flex-col rounded-2xl border border-brass/15 bg-milk p-5 shadow-soft md:h-[24rem] md:w-[24rem] md:p-6">
      <Stars value={rating} />
      <p className="mt-3 flex-1 overflow-hidden font-serif text-[1.15rem] leading-snug text-graphite md:text-xl">
        «{excerpt(text)}»
      </p>
      <p className="mt-4 text-sm font-medium text-graphite">{author}</p>
      <p className="mt-0.5 text-[11px] uppercase tracking-[0.14em] text-graphite/40">
        {date} · Яндекс Карты
      </p>
    </article>
  );
}

export function ReviewsTicker() {
  const loop = [...yandexReviews, ...yandexReviews];

  return (
    <section
      id="reviews"
      className="overflow-hidden bg-cashmere py-10 md:py-12"
      aria-labelledby="reviews-heading"
    >
      <div className="mx-auto mb-7 flex max-w-5xl flex-col gap-2 px-5 md:mb-8 md:flex-row md:items-end md:justify-between md:px-8">
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.22em] text-brass">
            Отзывы гостей
          </p>
          <h2
            id="reviews-heading"
            className="font-serif text-[1.85rem] text-graphite md:text-4xl"
          >
            {YANDEX_RATING.toLocaleString("ru-RU")} на Яндекс Картах
          </h2>
        </div>
        <a
          href={YANDEX_REVIEWS_URL}
          target="_blank"
          rel="noreferrer"
          className="text-xs uppercase tracking-[0.16em] text-brass transition-colors hover:text-graphite"
        >
          {YANDEX_REVIEW_COUNT} отзывов →
        </a>
      </div>

      <div className="reviews-marquee group relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-cashmere to-transparent md:w-16" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-cashmere to-transparent md:w-16" />
        <div className="reviews-track flex w-max gap-4 py-1 pr-4 md:gap-5">
          {loop.map((review, i) => (
            <div
              key={`${review.id}-${i}`}
              aria-hidden={i >= yandexReviews.length}
            >
              <Card {...review} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
