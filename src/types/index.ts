export type Category = "кухни" | "прихожие" | "диваны";

export type Material =
  | "орех"
  | "дуб"
  | "латунь"
  | "кашемир"
  | "велюр"
  | "кожа"
  | "мрамор";

export interface Product {
  id: string;
  name: string;
  priceFrom: number;
  materials: Material[];
  inStock: boolean;
  category: Category;
  images: string[];
  description: string;
  features: string[];
  capitone?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type GridMode = "large" | "compact";

export interface CatalogFilters {
  priceMin: number;
  priceMax: number;
  materials: Material[];
  categories: Category[];
}

export interface KitchenCollection {
  id: string;
  name: string;
  tagline: string;
  image: string;
  priceFrom: number;
}
