/**
 * Scrape Valentin shop products from mebelgorod.com and write local catalog.
 * Run: node scripts/scrape-valentin-shop.mjs
 */
import { mkdir, writeFile } from "fs/promises";
import { createWriteStream } from "fs";
import { pipeline } from "stream/promises";
import { Readable } from "stream";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "public", "images", "shop");
const API = "https://mebelgorod.com/api/web/v1";

function slugify(name, id) {
  const map = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
    и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
    с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh", щ: "sch",
    ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
  };
  const base = name
    .toLowerCase()
    .split("")
    .map((c) => map[c] ?? c)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
  return `${base || "item"}-${id}`;
}

function categorize(item) {
  const n = (item.name || "").toLowerCase();
  const cat = (item.categoryShort?.name || "").toLowerCase();
  const slug = (item.categoryShort?.slug || "").toLowerCase();

  // Skip promo / custom-order banner and kitchen corners
  if (!item.price_new || n.includes("гардеробные, шкафы")) return null;
  if (n.includes("кухонный уголок")) return null;

  if (
    cat.includes("кухн") ||
    slug.includes("kuh") ||
    n.startsWith("кухня")
  ) {
    return "кухни";
  }

  if (
    cat.includes("прихож") ||
    cat.includes("обув") ||
    cat.includes("банкет") ||
    cat.includes("зеркал") ||
    cat.includes("шкаф") ||
    n.includes("прихожая") ||
    n.includes("обувниц") ||
    n.includes("банкетка") ||
    n.includes("зеркало") ||
    n.includes("шкаф")
  ) {
    return "прихожие";
  }

  if (
    cat.includes("диван") ||
    cat.includes("кресл") ||
    cat.includes("пуф") ||
    cat.includes("стул") ||
    n.includes("диван") ||
    n.includes("кресло") ||
    n.includes("пуф") ||
    n.includes("стул")
  ) {
    return "диваны";
  }

  return null;
}

function materialsFor(category) {
  if (category === "кухни") return ["дуб"];
  if (category === "прихожие") return ["дуб"];
  return ["велюр"];
}

function featuresFor(item, category) {
  const f = [];
  if (item.nalichie) f.push("В наличии");
  else f.push("Под заказ");
  if (item.is_akcia) f.push("Акция");
  if (item.is_new) f.push("Новинка");
  if (category === "кухни") f.push("Индивидуальные размеры");
  if (category === "прихожие") f.push("Для прихожей");
  if (category === "диваны") f.push("Мягкая мебель");
  return f.slice(0, 3);
}

function descriptionFor(item, category) {
  const cat = item.categoryShort?.name || category;
  const price = item.price_new
    ? ` от ${Number(item.price_new).toLocaleString("ru-RU")} ₽`
    : "";
  return `${item.name} — ${cat.toLowerCase()} салона Valentin${price}. Салон в МЦ «Мебельный город», Белгород.`;
}

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: { Accept: "application/json", "User-Agent": "ValentinCatalogBot/1.0" },
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

async function download(url, dest) {
  const res = await fetch(url, {
    headers: { "User-Agent": "ValentinCatalogBot/1.0" },
  });
  if (!res.ok) throw new Error(`img ${res.status} ${url}`);
  await mkdir(path.dirname(dest), { recursive: true });
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
}

async function main() {
  console.log("Fetching catalog…");
  const page1 = await fetchJson(`${API}/catalog?shop_id=10&per-page=100&page=1`);
  const page2 = await fetchJson(`${API}/catalog?shop_id=10&per-page=100&page=2`);
  const raw = [...page1.items, ...(page2.items || [])];
  console.log("Raw items:", raw.length);

  const products = [];
  for (const item of raw) {
    const category = categorize(item);
    if (!category) {
      console.log("skip", item.id, item.name);
      continue;
    }

    let detail = item;
    try {
      detail = await fetchJson(
        `${API}/catalog/product?id=${item.id}&expand=parent,collectionsChildren,collectionsParent,relatedsChildren,similarProductsChildren`
      );
    } catch (e) {
      console.warn("detail fail", item.id, e.message);
    }

    const urls = [];
    if (detail.thumbnail_base_url && detail.thumbnail_path) {
      urls.push(`${detail.thumbnail_base_url}${detail.thumbnail_path}`);
    }
    for (const ph of detail.shopProductsPhotos || []) {
      const u = `${ph.base_url}${ph.path}`;
      if (!urls.includes(u)) urls.push(u);
    }
    const imageUrls = urls.slice(0, 4);
    if (!imageUrls.length) {
      console.log("no images", item.id, item.name);
      continue;
    }

    const id = slugify(item.name, item.id);
    const localImages = [];
    for (let i = 0; i < imageUrls.length; i++) {
      const ext = path.extname(new URL(imageUrls[i]).pathname) || ".jpg";
      const rel = `/images/shop/${item.id}/${i}${ext}`;
      const abs = path.join(root, "public", rel);
      try {
        await download(imageUrls[i], abs);
        localImages.push(rel);
        process.stdout.write(".");
      } catch (e) {
        console.warn("\ndl fail", imageUrls[i], e.message);
      }
    }
    if (!localImages.length) continue;

    products.push({
      id,
      shopId: item.id,
      name: item.name.trim(),
      priceFrom: Number(item.price_new),
      materials: materialsFor(category),
      inStock: Boolean(item.nalichie),
      category,
      images: localImages,
      description: descriptionFor(item, category),
      features: featuresFor(item, category),
      categoryLabel: item.categoryShort?.name || "",
    });
  }

  console.log("\nProducts kept:", products.length);
  const byCat = { кухни: 0, прихожие: 0, диваны: 0 };
  products.forEach((p) => byCat[p.category]++);
  console.log(byCat);

  const kitchens = products.filter(
    (p) =>
      p.category === "кухни" &&
      !p.name.toLowerCase().includes("кухонный уголок"),
  );
  const collections = kitchens.slice(0, 4).map((p) => ({
    id: p.id,
    name: p.name.replace(/^Кухня\s+/i, ""),
    tagline: p.categoryLabel || "Кухня Valentin",
    image: p.images[0],
    priceFrom: p.priceFrom,
  }));

  const suggestions = [
    { label: "Кухни", query: "кухня", category: "Кухни" },
    { label: "Прихожие", query: "прихожая", category: "Прихожие" },
    { label: "Диваны", query: "диван", category: "Диваны" },
    { label: "Обувницы", query: "обувниц", category: "Прихожие" },
    { label: "Пуфы", query: "пуф", category: "Диваны" },
    ...products.slice(0, 8).map((p) => ({
      label: p.name,
      query: p.name.split(" ").slice(0, 2).join(" ").toLowerCase(),
      category:
        p.category === "кухни"
          ? "Кухни"
          : p.category === "прихожие"
            ? "Прихожие"
            : "Диваны",
    })),
  ];

  const ts = `import type { KitchenCollection, Product } from "@/types";

export { vipDeliveryThreshold as FREE_SHIPPING_THRESHOLD } from "@/lib/utils";

const img = (name: string) => \`/images/real/\${name}\`;

/** Товары салона Valentin с mebelgorod.com/shops/valentin (shop_id=10) */
export const products: Product[] = ${JSON.stringify(
    products.map(({ shopId, categoryLabel, ...p }) => p),
    null,
    2
  )};

export const kitchenCollections: KitchenCollection[] = ${JSON.stringify(
    collections,
    null,
    2
  )};

export const siteImages = {
  /** Hero 2K, пропорции исходника 888×500 */
  hero: img("hero-kitchen-2k.jpg"),
  /** До: кухня до установки мебели */
  before: img("before-furnishing.png"),
  /** После: готовая кухня после меблировки */
  after: img("after-furnishing.jpg"),
};

export type ProjectGroupId = "kitchens" | "hallways" | "sofas";

export interface ProjectGroup {
  id: ProjectGroupId;
  title: string;
  cover: string;
  images: string[];
}

/** Три подраздела портфолио — кубики на одном уровне */
export const projectGroups: ProjectGroup[] = [
  {
    id: "kitchens",
    title: "Кухни",
    cover: ${JSON.stringify(kitchens[0]?.images[0] || "/images/real/hero-kitchen-2k.jpg")},
    images: ${JSON.stringify(
      kitchens.flatMap((p) => p.images).slice(0, 10)
    )},
  },
  {
    id: "hallways",
    title: "Прихожие",
    cover: ${JSON.stringify(
      products.find((p) => p.category === "прихожие")?.images[0] ||
        "/images/real/final-hallway-vestibule-1.jpg"
    )},
    images: ${JSON.stringify(
      products
        .filter((p) => p.category === "прихожие")
        .flatMap((p) => p.images)
        .slice(0, 10)
    )},
  },
  {
    id: "sofas",
    title: "Диваны",
    cover: ${JSON.stringify(
      products.find((p) => p.category === "диваны")?.images[0] ||
        "/images/real/final-sofa-imperial-1.jpg"
    )},
    images: ${JSON.stringify(
      products
        .filter((p) => p.category === "диваны")
        .flatMap((p) => p.images)
        .slice(0, 10)
    )},
  },
];

export const searchSuggestions = ${JSON.stringify(suggestions, null, 2)};
`;

  await writeFile(path.join(root, "src", "data", "products.ts"), ts, "utf8");
  await writeFile(
    path.join(root, "src", "data", "shop-raw.json"),
    JSON.stringify(products, null, 2),
    "utf8"
  );
  console.log("Wrote products.ts");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
