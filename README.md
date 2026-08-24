# Valentin

Премиальный интернет-магазин кухонь и мебели: Next.js App Router, TypeScript, Tailwind, Framer Motion, GSAP ScrollTrigger, React Three Fiber, Lenis.

## Запуск

```bash
npm install
npm run dev
```

Локальный Node (если нет в PATH): `.tools/node/node-v22.14.0-win-x64`.

## Архитектура

- `src/components/modules` — секции страницы (Hero, KitchenConstructor, Capitone, Catalog, BeforeAfter, Header, SideCart)
- `src/components/three` — R3F-параллакс героя
- `src/components/cursor` — кастомный курсор
- `src/components/providers` — Lenis smooth scroll
- `src/data/products.ts` — mock-каталог кухонь / прихожих / диванов
- `src/context` — корзина и курсор

На мобильных тяжёлые эффекты (R3F, Lenis, pin-scroll) отключаются или упрощаются.
