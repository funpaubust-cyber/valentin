import { Suspense } from "react";
import { Catalog } from "@/components/modules/Catalog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Каталог — Valentin",
  description:
    "Каталог кухонь, прихожих и диванов Valentin по индивидуальным размерам.",
};

export default function CatalogPage() {
  return (
    <main>
      <Suspense
        fallback={
          <div className="bg-cashmere px-5 pb-16 pt-[calc(5.5rem+env(safe-area-inset-top))] md:px-8 md:pb-28 md:pt-32">
            <p className="font-serif text-3xl text-graphite">Каталог</p>
          </div>
        }
      >
        <Catalog standalone />
      </Suspense>
    </main>
  );
}
