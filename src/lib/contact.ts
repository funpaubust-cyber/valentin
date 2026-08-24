export {
  SALON_EMAIL,
  SALON_PHONE,
  SALON_PHONE_HREF,
} from "@/data/salon";

export const CONTACT_MAIL_SUBJECT = "Новое сообщение с сайта Valentin!";

export const contactTopics = {
  price: "Расчёт стоимости товара",
  kitchen: "Кухня по индивидуальным размерам",
  hallway: "Прихожая по индивидуальным размерам",
  cart: "Консультация по подборке",
  other: "Сообщение с сайта",
} as const;

export type ContactTopic = keyof typeof contactTopics;

export type CartLine = {
  id: string;
  name: string;
  quantity: number;
  priceFrom: number;
};

export type ContactPayload = {
  name: string;
  phone: string;
  email?: string;
  topic: ContactTopic;
  message: string;
  width?: string;
  depth?: string;
  height?: string;
  company?: string;
  consent?: boolean;
  items?: CartLine[];
};

export function isContactTopic(value: string): value is ContactTopic {
  return value in contactTopics;
}

export function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 11 && (digits.startsWith("7") || digits.startsWith("8"))) {
    return `+7${digits.slice(1)}`;
  }
  if (digits.length === 10) return `+7${digits}`;
  return null;
}
