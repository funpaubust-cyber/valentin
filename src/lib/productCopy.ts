import type { Product } from "@/types";
import { formatPriceFrom } from "@/lib/utils";

type Kind =
  | "kitchen"
  | "hallway"
  | "sofa"
  | "armchair"
  | "chair"
  | "pouf"
  | "mirror"
  | "shoe"
  | "wardrobe";

function kindOf(product: Product): Kind {
  const n = product.name.toLowerCase();
  if (n.includes("кухн") || product.category === "кухни") return "kitchen";
  if (n.includes("кресл")) return "armchair";
  if (n.includes("стул")) return "chair";
  if (n.includes("пуф")) return "pouf";
  if (n.includes("зеркал")) return "mirror";
  if (n.includes("обувн") || n.includes("банкет")) return "shoe";
  if (n.includes("шкаф")) return "wardrobe";
  if (product.category === "прихожие") return "hallway";
  return "sofa";
}

export function productDescription(product: Product): string {
  const from = formatPriceFrom(product.priceFrom);
  const name = product.name;
  const fabric = product.materials.join(", ");

  switch (kindOf(product)) {
    case "kitchen":
      return `${name} — кухонный гарнитур по индивидуальным размерам. Фасады, столешница и техника подбираются в салоне; проект и 3D-визуализация до заказа. Изготовление до 60 рабочих дней. Стоимость ${from} за базовую комплектацию.`;
    case "hallway":
      return `${name} — корпусная композиция для прихожей под вашу нишу и высоту потолка. Планировку собираем в салоне: шкаф, обувница, зеркало, подсветка. Цена ${from}.`;
    case "armchair":
      return `${name} — кресло салона Valentin, обивка: ${fabric}. Ткань и цвет согласуем при заказе. Цена ${from}.`;
    case "chair":
      return `${name} — стул к обеденной группе или барной стойке. Обивка ${fabric}, каркас под интерьер. Цена ${from}.`;
    case "pouf":
      return `${name} — пуф в прихожую или к мягкой группе. Обивка ${fabric}. Цена ${from}.`;
    case "mirror":
      return `${name} — зеркало для прихожей или гардеробной. Размер и раму подбираем к мебели салона. Цена ${from}.`;
    case "shoe":
      return `${name} — обувница под заказ. Глубина и фасады согласуем на замере. Цена ${from}.`;
    case "wardrobe":
      return `${name} — платяной шкаф в прихожую или спальню. Наполнение полок и штанг — по вашим вещам. Цена ${from}.`;
    default:
      return `${name} — мягкая мебель салона Valentin, обивка: ${fabric}. Изготавливаем под заказ в нужной ткани. Цена ${from}.`;
  }
}

export function productFeatures(product: Product): string[] {
  switch (kindOf(product)) {
    case "kitchen":
      return [
        "Индивидуальные размеры",
        "Проект и 3D в салоне",
        "Изготовление до 60 рабочих дней",
        "Под заказ",
      ];
    case "hallway":
    case "shoe":
    case "wardrobe":
    case "mirror":
      return ["Корпусная мебель под размер", "Фасады и фурнитура на выбор", "Под заказ"];
    default:
      return [`Обивка: ${product.materials.join(", ")}`, "Ткань можно заменить", "Под заказ"];
  }
}

export function productLeadTime(product: Product): string {
  if (product.category === "кухни" || product.category === "прихожие") {
    return "До 60 рабочих дней после утверждения проекта";
  }
  return "Срок поставки согласуем при заказе";
}
