import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "@/data/products";
import {
  productDescription,
  productFeatures,
  productLeadTime,
} from "@/lib/productCopy";
import { formatPriceFrom } from "@/lib/utils";
import { siteUrl } from "@/lib/site";
import { ProductActions } from "@/components/modules/ProductActions";
import { ProductGallery } from "@/components/modules/ProductGallery";
import { MessengerLinks } from "@/components/ui/MessengerLinks";

type Params = { id: string };

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = products.find((p) => p.id === id);
  if (!product) return { title: "Товар — Valentin" };
  const description = productDescription(product);
  const url = `${siteUrl()}/catalog/${product.id}`;
  return {
    title: `${product.name} — Valentin`,
    description,
    openGraph: {
      title: `${product.name} — Valentin`,
      description,
      url,
      images: [{ url: `${siteUrl()}${product.images[0]}` }],
      type: "website",
      locale: "ru_RU",
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);
  if (!product) notFound();

  const description = productDescription(product);
  const features = productFeatures(product);
  const lead = productLeadTime(product);

  return (
    <main className="bg-cashmere pt-[calc(5.5rem+env(safe-area-inset-top))] pb-16 md:pt-32 md:pb-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <nav className="mb-8 text-xs uppercase tracking-[0.14em] text-graphite/45">
          <Link href="/catalog" className="hover:text-brass">
            Каталог
          </Link>
          <span className="mx-2">/</span>
          <span className="text-graphite/70">{product.name}</span>
        </nav>

        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          <ProductGallery name={product.name} images={product.images} />

          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-brass">
              {product.category} · под заказ
            </p>
            <h1 className="mt-3 font-serif text-[2.1rem] leading-tight text-graphite md:text-5xl">
              {product.name}
            </h1>
            <p className="mt-4 text-lg font-medium text-brass md:text-xl">
              {formatPriceFrom(product.priceFrom)}
            </p>
            <p className="mt-2 text-sm text-graphite/50">
              {product.materials.join(" · ")}
            </p>
            <p className="mt-6 text-sm leading-relaxed text-graphite/75 md:text-[15px]">
              {description}
            </p>
            <ul className="mt-5 space-y-1.5 text-sm text-graphite/65">
              {features.map((f) => (
                <li key={f}>— {f}</li>
              ))}
            </ul>
            <p className="mt-5 text-xs uppercase tracking-[0.14em] text-graphite/45">
              Срок: {lead}
            </p>

            <div className="mt-8">
              <ProductActions product={product} />
            </div>

            <div className="mt-10 border-t border-brass/15 pt-6">
              <p className="mb-3 text-xs uppercase tracking-[0.16em] text-graphite/45">
                Задать вопрос
              </p>
              <MessengerLinks
                text={`Здравствуйте! Интересует ${product.name} на сайте Valentin.`}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
