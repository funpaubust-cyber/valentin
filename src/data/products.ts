import type { KitchenCollection, Product } from "@/types";

export { vipDeliveryThreshold as FREE_SHIPPING_THRESHOLD } from "@/lib/utils";

const img = (name: string) => `/images/real/${name}`;

/** Товары салона Valentin с mebelgorod.com/shops/valentin (shop_id=10) */
export const products: Product[] = [
  {
    "id": "divan-nord-2131",
    "name": "Диван Норд",
    "priceFrom": 25800,
    "materials": [
      "велюр"
    ],
    "inStock": false,
    "category": "диваны",
    "images": [
      "/images/catalog/2131/0.jpg",
      "/images/catalog/2131/1.jpg",
      "/images/catalog/2131/2.jpg"
    ],
    "description": "Диван Норд — прямые диваны салона Valentin от 25 800 ₽. Салон в МЦ «Мебельный город», Белгород.",
    "features": [
      "Мягкая мебель"
    ]
  },
  {
    "id": "divan-bar-2137",
    "name": "Диван Бар",
    "priceFrom": 31900,
    "materials": [
      "велюр"
    ],
    "inStock": false,
    "category": "диваны",
    "images": [
      "/images/catalog/2137/0.jpg",
      "/images/catalog/2137/1.jpg",
      "/images/catalog/2137/2.jpg"
    ],
    "description": "Диван Бар — прямые диваны салона Valentin от 31 900 ₽. Салон в МЦ «Мебельный город», Белгород.",
    "features": [
      "Мягкая мебель"
    ]
  },
  {
    "id": "kuhnya-miya-3852",
    "name": "Кухня Мия",
    "priceFrom": 120000,
    "materials": [
      "дуб"
    ],
    "inStock": false,
    "category": "кухни",
    "images": [
      "/images/catalog/3852/0.jpg",
      "/images/catalog/3852/1.jpg",
      "/images/catalog/3852/2.jpg"
    ],
    "description": "Кухня Мия — кухонные гарнитуры салона Valentin от 120 000 ₽. Салон в МЦ «Мебельный город», Белгород.",
    "features": [
      "Индивидуальные размеры"
    ]
  },
  {
    "id": "divan-edelveys-2141",
    "name": "Диван Эдельвейс",
    "priceFrom": 37300,
    "materials": [
      "велюр"
    ],
    "inStock": false,
    "category": "диваны",
    "images": [
      "/images/catalog/2141/0.jpg",
      "/images/catalog/2141/1.jpg",
      "/images/catalog/2141/2.jpg"
    ],
    "description": "Диван Эдельвейс — прямые диваны салона Valentin от 37 300 ₽. Салон в МЦ «Мебельный город», Белгород.",
    "features": [
      "Мягкая мебель"
    ]
  },
  {
    "id": "divan-yunost-2124",
    "name": "Диван Юность",
    "priceFrom": 18000,
    "materials": [
      "велюр"
    ],
    "inStock": false,
    "category": "диваны",
    "images": [
      "/images/catalog/2124/0.jpg",
      "/images/catalog/2124/1.jpg",
      "/images/catalog/2124/2.jpg"
    ],
    "description": "Диван Юность — диваны и кресла салона Valentin от 18 000 ₽. Салон в МЦ «Мебельный город», Белгород.",
    "features": [
      "Мягкая мебель"
    ]
  },
  {
    "id": "kreslo-sherlok-2150",
    "name": "Кресло Шерлок",
    "priceFrom": 19200,
    "materials": [
      "велюр"
    ],
    "inStock": false,
    "category": "диваны",
    "images": [
      "/images/catalog/2150/0.jpg",
      "/images/catalog/2150/1.jpg",
      "/images/catalog/2150/2.jpg"
    ],
    "description": "Кресло Шерлок — кресла салона Valentin от 19 200 ₽. Салон в МЦ «Мебельный город», Белгород.",
    "features": [
      "Мягкая мебель"
    ]
  },
  {
    "id": "divan-prestizh-2-2147",
    "name": "Диван Престиж 2",
    "priceFrom": 31900,
    "materials": [
      "велюр"
    ],
    "inStock": false,
    "category": "диваны",
    "images": [
      "/images/catalog/2147/0.jpg",
      "/images/catalog/2147/1.jpg",
      "/images/catalog/2147/2.jpg"
    ],
    "description": "Диван Престиж 2 — прямые диваны салона Valentin от 31 900 ₽. Салон в МЦ «Мебельный город», Белгород.",
    "features": [
      "Мягкая мебель"
    ]
  },
  {
    "id": "divan-evrika-malysh-2129",
    "name": "Диван Эврика-малыш",
    "priceFrom": 16000,
    "materials": [
      "велюр"
    ],
    "inStock": false,
    "category": "диваны",
    "images": [
      "/images/catalog/2129/0.jpg",
      "/images/catalog/2129/1.jpg",
      "/images/catalog/2129/2.jpg"
    ],
    "description": "Диван Эврика-малыш — прямые диваны салона Valentin от 16 000 ₽. Салон в МЦ «Мебельный город», Белгород.",
    "features": [
      "Мягкая мебель"
    ]
  },
  {
    "id": "prihozhaya-classic-7-2133",
    "name": "Прихожая Classic-7",
    "priceFrom": 249500,
    "materials": [
      "дуб"
    ],
    "inStock": false,
    "category": "прихожие",
    "images": [
      "/images/catalog/2133/0.jpg",
      "/images/catalog/2133/1.jpg",
      "/images/catalog/2133/2.jpg"
    ],
    "description": "Прихожая Classic-7 — прихожие салона Valentin от 249 500 ₽. Салон в МЦ «Мебельный город», Белгород.",
    "features": [
      "Для прихожей"
    ]
  },
  {
    "id": "divan-rossa-2143",
    "name": "Диван Росса",
    "priceFrom": 33300,
    "materials": [
      "велюр"
    ],
    "inStock": false,
    "category": "диваны",
    "images": [
      "/images/catalog/2143/0.jpg",
      "/images/catalog/2143/1.jpg",
      "/images/catalog/2143/2.jpg"
    ],
    "description": "Диван Росса — прямые диваны салона Valentin от 33 300 ₽. Салон в МЦ «Мебельный город», Белгород.",
    "features": [
      "Мягкая мебель"
    ]
  },
  {
    "id": "divan-hilton-2153",
    "name": "Диван Хилтон",
    "priceFrom": 15200,
    "materials": [
      "велюр"
    ],
    "inStock": false,
    "category": "диваны",
    "images": [
      "/images/catalog/2153/0.jpg",
      "/images/catalog/2153/1.jpg",
      "/images/catalog/2153/2.jpg"
    ],
    "description": "Диван Хилтон — прямые диваны салона Valentin от 15 200 ₽. Салон в МЦ «Мебельный город», Белгород.",
    "features": [
      "Мягкая мебель"
    ]
  },
  {
    "id": "stul-bar-2138",
    "name": "Стул Бар",
    "priceFrom": 8000,
    "materials": [
      "велюр"
    ],
    "inStock": false,
    "category": "диваны",
    "images": [
      "/images/catalog/2138/0.jpg",
      "/images/catalog/2138/1.jpg",
      "/images/catalog/2138/2.jpg"
    ],
    "description": "Стул Бар — стулья салона Valentin от 8 000 ₽. Салон в МЦ «Мебельный город», Белгород.",
    "features": [
      "Мягкая мебель"
    ]
  },
  {
    "id": "kuhnya-santorini-4034",
    "name": "Кухня Санторини",
    "priceFrom": 196000,
    "materials": [
      "дуб"
    ],
    "inStock": false,
    "category": "кухни",
    "images": [
      "/images/catalog/4034/0.jpg",
      "/images/catalog/4034/1.jpg",
      "/images/catalog/4034/2.jpg"
    ],
    "description": "Кухня Санторини — кухонные гарнитуры салона Valentin от 196 000 ₽. Салон в МЦ «Мебельный город», Белгород.",
    "features": [
      "Индивидуальные размеры"
    ]
  },
  {
    "id": "kreslo-kokteylnoe-2132",
    "name": "Кресло коктейльное",
    "priceFrom": 15900,
    "materials": [
      "велюр"
    ],
    "inStock": false,
    "category": "диваны",
    "images": [
      "/images/catalog/2132/0.jpg",
      "/images/catalog/2132/1.jpg",
      "/images/catalog/2132/2.jpg"
    ],
    "description": "Кресло коктейльное — кресла салона Valentin от 15 900 ₽. Салон в МЦ «Мебельный город», Белгород.",
    "features": [
      "Мягкая мебель"
    ]
  },
  {
    "id": "obuvnitsa-classic-2154",
    "name": "Обувница Classic",
    "priceFrom": 31600,
    "materials": [
      "дуб"
    ],
    "inStock": false,
    "category": "прихожие",
    "images": [
      "/images/catalog/2154/0.jpg",
      "/images/catalog/2154/1.jpg",
      "/images/catalog/2154/2.jpg"
    ],
    "description": "Обувница Classic — прихожие салона Valentin от 31 600 ₽. Салон в МЦ «Мебельный город», Белгород.",
    "features": [
      "Для прихожей"
    ]
  },
  {
    "id": "prihozhaya-louf-2135",
    "name": "Прихожая Лоуф",
    "priceFrom": 59600,
    "materials": [
      "дуб"
    ],
    "inStock": false,
    "category": "прихожие",
    "images": [
      "/images/catalog/2135/0.jpg",
      "/images/catalog/2135/1.jpg",
      "/images/catalog/2135/2.jpg"
    ],
    "description": "Прихожая Лоуф — прихожие салона Valentin от 59 600 ₽. Салон в МЦ «Мебельный город», Белгород.",
    "features": [
      "Для прихожей"
    ]
  },
  {
    "id": "prihozhaya-s-tumboy-i-zerkalom-2162",
    "name": "Прихожая с тумбой и зеркалом",
    "priceFrom": 99600,
    "materials": [
      "дуб"
    ],
    "inStock": false,
    "category": "прихожие",
    "images": [
      "/images/catalog/2162/0.jpg",
      "/images/catalog/2162/1.jpg",
      "/images/catalog/2162/2.jpg"
    ],
    "description": "Прихожая с тумбой и зеркалом — прихожие салона Valentin от 99 600 ₽. Салон в МЦ «Мебельный город», Белгород.",
    "features": [
      "Для прихожей"
    ]
  },
  {
    "id": "kreslo-edelveys-2142",
    "name": "Кресло Эдельвейс",
    "priceFrom": 23800,
    "materials": [
      "велюр"
    ],
    "inStock": false,
    "category": "диваны",
    "images": [
      "/images/catalog/2142/0.jpg",
      "/images/catalog/2142/1.jpg",
      "/images/catalog/2142/2.jpg"
    ],
    "description": "Кресло Эдельвейс — кресла салона Valentin от 23 800 ₽. Салон в МЦ «Мебельный город», Белгород.",
    "features": [
      "Мягкая мебель"
    ]
  },
  {
    "id": "divan-sherlok-3708",
    "name": "Диван Шерлок",
    "priceFrom": 33600,
    "materials": [
      "велюр"
    ],
    "inStock": false,
    "category": "диваны",
    "images": [
      "/images/catalog/3708/0.jpg",
      "/images/catalog/3708/1.jpg",
      "/images/catalog/3708/2.jpg"
    ],
    "description": "Диван Шерлок — прямые диваны салона Valentin от 33 600 ₽. Салон в МЦ «Мебельный город», Белгород.",
    "features": [
      "Мягкая мебель"
    ]
  },
  {
    "id": "divan-bar-2130",
    "name": "Диван Бар Compact",
    "priceFrom": 16000,
    "materials": [
      "велюр"
    ],
    "inStock": false,
    "category": "диваны",
    "images": [
      "/images/catalog/2130/0.jpg",
      "/images/catalog/2130/1.jpg",
      "/images/catalog/2130/2.jpg"
    ],
    "description": "Диван Бар Compact — прямые диваны салона Valentin от 16 000 ₽. Салон в МЦ «Мебельный город», Белгород.",
    "features": [
      "Мягкая мебель"
    ]
  },
  {
    "id": "kreslo-kokteylnoe-2-2140",
    "name": "Кресло коктейльное Soft",
    "priceFrom": 12000,
    "materials": [
      "велюр"
    ],
    "inStock": false,
    "category": "диваны",
    "images": [
      "/images/catalog/2140/0.jpg",
      "/images/catalog/2140/1.jpg",
      "/images/catalog/2140/2.jpg"
    ],
    "description": "Кресло коктейльное Soft — кресла салона Valentin от 12 000 ₽. Салон в МЦ «Мебельный город», Белгород.",
    "features": [
      "Мягкая мебель"
    ]
  },
  {
    "id": "kuhnya-venetsiya-2120",
    "name": "Кухня Венеция",
    "priceFrom": 193000,
    "materials": [
      "дуб"
    ],
    "inStock": false,
    "category": "кухни",
    "images": [
      "/images/catalog/2120/0.jpg",
      "/images/catalog/2120/1.jpg",
      "/images/catalog/2120/2.jpg"
    ],
    "description": "Кухня Венеция — кухни салона Valentin от 193 000 ₽. Салон в МЦ «Мебельный город», Белгород.",
    "features": [
      "Индивидуальные размеры"
    ]
  },
  {
    "id": "prihozhaya-semela-4937",
    "name": "Прихожая Семела",
    "priceFrom": 141400,
    "materials": [
      "дуб"
    ],
    "inStock": false,
    "category": "прихожие",
    "images": [
      "/images/catalog/4937/0.jpg",
      "/images/catalog/4937/1.jpg",
      "/images/catalog/4937/2.jpg"
    ],
    "description": "Прихожая Семела — прихожие салона Valentin от 141 400 ₽. Салон в МЦ «Мебельный город», Белгород.",
    "features": [
      "Для прихожей"
    ]
  },
  {
    "id": "prihozhaya-s-pufom-2161",
    "name": "Прихожая с пуфом",
    "priceFrom": 68900,
    "materials": [
      "дуб"
    ],
    "inStock": false,
    "category": "прихожие",
    "images": [
      "/images/catalog/2161/0.jpg",
      "/images/catalog/2161/1.jpg",
      "/images/catalog/2161/2.jpg"
    ],
    "description": "Прихожая с пуфом — прихожие салона Valentin от 68 900 ₽. Салон в МЦ «Мебельный город», Белгород.",
    "features": [
      "Для прихожей"
    ]
  },
  {
    "id": "prihozhaya-assimetriya-2134",
    "name": "Прихожая Ассиметрия",
    "priceFrom": 49800,
    "materials": [
      "дуб"
    ],
    "inStock": false,
    "category": "прихожие",
    "images": [
      "/images/catalog/2134/0.jpg",
      "/images/catalog/2134/1.jpg",
      "/images/catalog/2134/2.jpg"
    ],
    "description": "Прихожая Ассиметрия — прихожие салона Valentin от 49 800 ₽. Салон в МЦ «Мебельный город», Белгород.",
    "features": [
      "Для прихожей"
    ]
  },
  {
    "id": "kreslo-kokteylnoe-2-2144",
    "name": "Кресло коктейльное Lounge",
    "priceFrom": 12000,
    "materials": [
      "велюр"
    ],
    "inStock": false,
    "category": "диваны",
    "images": [
      "/images/catalog/2144/0.jpg",
      "/images/catalog/2144/1.jpg",
      "/images/catalog/2144/2.jpg"
    ],
    "description": "Кресло коктейльное Lounge — кресла салона Valentin от 12 000 ₽. Салон в МЦ «Мебельный город», Белгород.",
    "features": [
      "Мягкая мебель"
    ]
  },
  {
    "id": "prihozhaya-s-chasami-2156",
    "name": "Прихожая с часами",
    "priceFrom": 73700,
    "materials": [
      "дуб"
    ],
    "inStock": false,
    "category": "прихожие",
    "images": [
      "/images/catalog/2156/0.jpg",
      "/images/catalog/2156/1.jpg",
      "/images/catalog/2156/2.jpg"
    ],
    "description": "Прихожая с часами — прихожие салона Valentin от 73 700 ₽. Салон в МЦ «Мебельный город», Белгород.",
    "features": [
      "Для прихожей"
    ]
  },
  {
    "id": "kuhnya-sakura-2118",
    "name": "Кухня Сакура",
    "priceFrom": 160000,
    "materials": [
      "дуб"
    ],
    "inStock": false,
    "category": "кухни",
    "images": [
      "/images/catalog/2118/0.jpg",
      "/images/catalog/2118/1.jpg",
      "/images/catalog/2118/2.jpg"
    ],
    "description": "Кухня Сакура — кухни салона Valentin от 160 000 ₽. Салон в МЦ «Мебельный город», Белгород.",
    "features": [
      "Индивидуальные размеры"
    ]
  },
  {
    "id": "banketka-obuvnitsa-3917",
    "name": "Банкетка-обувница",
    "priceFrom": 45600,
    "materials": [
      "дуб"
    ],
    "inStock": false,
    "category": "прихожие",
    "images": [
      "/images/catalog/3917/0.jpg",
      "/images/catalog/3917/1.jpg",
      "/images/catalog/3917/2.jpg"
    ],
    "description": "Банкетка-обувница — банкетки салона Valentin от 45 600 ₽. Салон в МЦ «Мебельный город», Белгород.",
    "features": [
      "Для прихожей"
    ]
  },
  {
    "id": "prihozhaya-venetsiya-s-pufom-2136",
    "name": "Прихожая Венеция с пуфом",
    "priceFrom": 30000,
    "materials": [
      "дуб"
    ],
    "inStock": false,
    "category": "прихожие",
    "images": [
      "/images/catalog/2136/0.jpg",
      "/images/catalog/2136/1.jpg",
      "/images/catalog/2136/2.jpg"
    ],
    "description": "Прихожая Венеция с пуфом — прихожие салона Valentin от 30 000 ₽. Салон в МЦ «Мебельный город», Белгород.",
    "features": [
      "Для прихожей"
    ]
  },
  {
    "id": "prihozhaya-s-pufom-2157",
    "name": "Прихожая с пуфом Compact",
    "priceFrom": 63600,
    "materials": [
      "дуб"
    ],
    "inStock": false,
    "category": "прихожие",
    "images": [
      "/images/catalog/2157/0.jpg",
      "/images/catalog/2157/1.jpg",
      "/images/catalog/2157/2.jpg"
    ],
    "description": "Прихожая с пуфом Compact — прихожие салона Valentin от 63 600 ₽. Салон в МЦ «Мебельный город», Белгород.",
    "features": [
      "Для прихожей"
    ]
  },
  {
    "id": "prihozhaya-s-zerkalom-2159",
    "name": "Прихожая с зеркалом",
    "priceFrom": 67600,
    "materials": [
      "дуб"
    ],
    "inStock": false,
    "category": "прихожие",
    "images": [
      "/images/catalog/2159/0.jpg",
      "/images/catalog/2159/1.jpg",
      "/images/catalog/2159/2.jpg"
    ],
    "description": "Прихожая с зеркалом — прихожие салона Valentin от 67 600 ₽. Салон в МЦ «Мебельный город», Белгород.",
    "features": [
      "Для прихожей"
    ]
  },
  {
    "id": "obuvintsa-classic-3919",
    "name": "Обувница Classic",
    "priceFrom": 47800,
    "materials": [
      "дуб"
    ],
    "inStock": false,
    "category": "прихожие",
    "images": [
      "/images/catalog/3919/0.jpg",
      "/images/catalog/3919/1.jpg",
      "/images/catalog/3919/2.jpg"
    ],
    "description": "Обувница Classic — прихожие салона Valentin от 47 800 ₽. Салон в МЦ «Мебельный город», Белгород.",
    "features": [
      "Для прихожей"
    ]
  },
  {
    "id": "divan-prestizh-4745",
    "name": "Диван Престиж",
    "priceFrom": 18000,
    "materials": [
      "велюр"
    ],
    "inStock": false,
    "category": "диваны",
    "images": [
      "/images/catalog/4745/0.jpg",
      "/images/catalog/4745/1.jpg",
      "/images/catalog/4745/2.jpg"
    ],
    "description": "Диван Престиж — прямые диваны салона Valentin от 18 000 ₽. Салон в МЦ «Мебельный город», Белгород.",
    "features": [
      "Мягкая мебель"
    ]
  },
  {
    "id": "divan-valeo-2152",
    "name": "Диван Valeo",
    "priceFrom": 41000,
    "materials": [
      "велюр"
    ],
    "inStock": false,
    "category": "диваны",
    "images": [
      "/images/catalog/2152/0.jpg",
      "/images/catalog/2152/1.jpg",
      "/images/catalog/2152/2.jpg"
    ],
    "description": "Диван Valeo — прямые диваны салона Valentin от 41 000 ₽. Салон в МЦ «Мебельный город», Белгород.",
    "features": [
      "Мягкая мебель"
    ]
  },
  {
    "id": "divan-kokteylnaya-dvoyka-2149",
    "name": "Диван Коктейльная двойка",
    "priceFrom": 27500,
    "materials": [
      "велюр"
    ],
    "inStock": false,
    "category": "диваны",
    "images": [
      "/images/catalog/2149/0.jpg",
      "/images/catalog/2149/1.jpg",
      "/images/catalog/2149/2.jpg"
    ],
    "description": "Диван Коктейльная двойка — прямые диваны салона Valentin от 27 500 ₽. Салон в МЦ «Мебельный город», Белгород.",
    "features": [
      "Мягкая мебель"
    ]
  },
  {
    "id": "zerkalo-nastennoe-3918",
    "name": "Зеркало настенное",
    "priceFrom": 36200,
    "materials": [
      "дуб"
    ],
    "inStock": false,
    "category": "прихожие",
    "images": [
      "/images/catalog/3918/0.jpg",
      "/images/catalog/3918/1.jpg",
      "/images/catalog/3918/2.jpg"
    ],
    "description": "Зеркало настенное — зеркала салона Valentin от 36 200 ₽. Салон в МЦ «Мебельный город», Белгород.",
    "features": [
      "Для прихожей"
    ]
  },
  {
    "id": "puf-classic-2160",
    "name": "Пуф Classic",
    "priceFrom": 34000,
    "materials": [
      "велюр"
    ],
    "inStock": false,
    "category": "диваны",
    "images": [
      "/images/catalog/2160/0.jpg",
      "/images/catalog/2160/1.jpg",
      "/images/catalog/2160/2.jpg"
    ],
    "description": "Пуф Classic — пуфы салона Valentin от 34 000 ₽. Салон в МЦ «Мебельный город», Белгород.",
    "features": [
      "Мягкая мебель"
    ]
  },
  {
    "id": "divan-prestizh-3920",
    "name": "Диван Престиж Comfort",
    "priceFrom": 22000,
    "materials": [
      "велюр"
    ],
    "inStock": false,
    "category": "диваны",
    "images": [
      "/images/catalog/3920/0.jpg",
      "/images/catalog/3920/1.jpg",
      "/images/catalog/3920/2.jpg"
    ],
    "description": "Диван Престиж Comfort — прямые диваны салона Valentin от 22 000 ₽. Салон в МЦ «Мебельный город», Белгород.",
    "features": [
      "Мягкая мебель"
    ]
  },
  {
    "id": "shkaf-platyanoy-2155",
    "name": "Шкаф платяной",
    "priceFrom": 65500,
    "materials": [
      "дуб"
    ],
    "inStock": false,
    "category": "прихожие",
    "images": [
      "/images/catalog/2155/0.jpg",
      "/images/catalog/2155/1.jpg",
      "/images/catalog/2155/2.jpg"
    ],
    "description": "Шкаф платяной — распашные шкафы салона Valentin от 65 500 ₽. Салон в МЦ «Мебельный город», Белгород.",
    "features": [
      "Для прихожей"
    ]
  },
  {
    "id": "stul-princess-2151",
    "name": "Стул Princess",
    "priceFrom": 8000,
    "materials": [
      "велюр"
    ],
    "inStock": false,
    "category": "диваны",
    "images": [
      "/images/catalog/2151/0.jpg",
      "/images/catalog/2151/1.jpg",
      "/images/catalog/2151/2.jpg"
    ],
    "description": "Стул Princess — стулья салона Valentin от 8 000 ₽. Салон в МЦ «Мебельный город», Белгород.",
    "features": [
      "Мягкая мебель"
    ]
  }
];

export const kitchenCollections: KitchenCollection[] = [
  {
    id: "kuhnya-miya-3852",
    name: "Кухни",
    tagline: "Индивидуальные размеры",
    image: "/images/catalog/3852/0.jpg",
    priceFrom: 120000,
  },
  {
    id: "prihozhaya-classic-7-2133",
    name: "Прихожие",
    tagline: "Под вашу нишу",
    image: "/images/catalog/2133/0.jpg",
    priceFrom: 249500,
  },
  {
    id: "divan-nord-2131",
    name: "Диваны",
    tagline: "Мягкая группа",
    image: "/images/catalog/2131/0.jpg",
    priceFrom: 25800,
  },
];

export const siteImages = {
  /** Hero: полный кадр кухни, все ящики в кадре */
  hero: img("hero-kitchen-fill-2k.jpg"),
  /** До: кухня до установки (выровнено под слайдер) */
  before: img("before-furnishing-v6.jpg"),
  /** После: готовая кухня (выровнено под слайдер) */
  after: img("after-furnishing-v6.jpg"),
};

/** Категории в шапке; товары ищем по `products` */
export const searchSuggestions = [
  { label: "Кухни", query: "кухня", category: "Кухни", cat: "кухни" as const },
  { label: "Прихожие", query: "прихожая", category: "Прихожие", cat: "прихожие" as const },
  { label: "Диваны", query: "диван", category: "Диваны", cat: "диваны" as const },
  { label: "Обувницы", query: "обувниц", category: "Прихожие", cat: "прихожие" as const },
  { label: "Пуфы", query: "пуф", category: "Диваны", cat: "диваны" as const },
];
