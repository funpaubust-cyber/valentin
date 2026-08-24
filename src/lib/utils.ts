export function formatPrice(value: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPriceFrom(value: number): string {
  return `от ${formatPrice(value)}`;
}

export const spring = {
  type: "spring" as const,
  stiffness: 120,
  damping: 18,
  mass: 0.6,
};

export const softSpring = {
  type: "spring" as const,
  stiffness: 50,
  damping: 18,
};

export const vipDeliveryThreshold = 150000;

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}
