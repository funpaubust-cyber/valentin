export const SALON_NAME = "Valentin";
export const SALON_EMAIL = "valentinksalon@mail.ru";
export const SALON_PHONE = "+7 (920) 200-51-24";
export const SALON_PHONE_HREF = "tel:+79202005124";
export const SALON_PHONE_DIGITS = "79202005124";

export const SALON_CITY = "Белгород";
export const SALON_STREET = "ул. Донецкая, 85А";
export const SALON_PLACE = "МЦ «Мебельный город», 2 этаж";
export const SALON_ADDRESS = `${SALON_CITY}, ${SALON_STREET}`;
export const SALON_HOW_TO =
  "Вход в торговый центр «Мебельный город», лифт или лестница на 2 этаж — салон Valentin. Остановка «Мебельный город», около 600 м пешком.";

export const SALON_HOURS_LABEL = "ежедневно 10:00–20:00";
export const SALON_OPENS = "10:00";
export const SALON_CLOSES = "20:00";
export const SALON_OPEN_MINUTES = 10 * 60;
export const SALON_CLOSE_MINUTES = 20 * 60;

export const YANDEX_ORG_ID = "110863088243";
export const YANDEX_REVIEWS_URL =
  "https://yandex.ru/maps/org/valentin/110863088243/reviews/";
export const YANDEX_ORG_URL =
  "https://yandex.ru/maps/org/valentin/110863088243/";
export const YANDEX_RATING = 4.8;
export const YANDEX_RATING_COUNT = 18;
export const YANDEX_REVIEW_COUNT = 14;

export const VK_GROUP_ID = 143735775;
export const VK_URL = "https://vk.ru/club143735775";
export const VK_CHAT_URL = "https://vk.me/club143735775";
export const VK_APP_WRITE_URL = `vk://vk.com/write-${VK_GROUP_ID}`;
export const VK_APP_IM_URL = `vk://vk.com/im?sel=-${VK_GROUP_ID}`;

export function isVkMobileDevice() {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

/** Открывает чат сообщества: приложение ВК, если установлено, иначе vk.me */
export function openVkMessenger() {
  const web = VK_CHAT_URL;
  const ua = navigator.userAgent;

  if (/Android/i.test(ua)) {
    window.location.href =
      `intent://vk.com/write-${VK_GROUP_ID}#Intent;` +
      `scheme=vk;package=com.vkontakte.android;` +
      `S.browser_fallback_url=${encodeURIComponent(web)};end`;
    return;
  }

  if (/iPhone|iPad|iPod/i.test(ua)) {
    const fallback = window.setTimeout(() => {
      if (document.visibilityState === "visible") {
        window.location.href = web;
      }
    }, 1400);
    const cancel = () => window.clearTimeout(fallback);
    document.addEventListener("visibilitychange", cancel, { once: true });
    window.addEventListener("pagehide", cancel, { once: true });
    window.addEventListener("blur", cancel, { once: true });
    window.location.href = VK_APP_WRITE_URL;
    return;
  }

  window.open(web, "_blank", "noopener,noreferrer");
}

export function whatsappUrl(text?: string) {
  const base = `https://wa.me/${SALON_PHONE_DIGITS}`;
  if (!text) return base;
  return `${base}?text=${encodeURIComponent(text)}`;
}

export function viberUrl() {
  return `viber://chat?number=%2B${SALON_PHONE_DIGITS}`;
}

export const DEFAULT_WHATSAPP_TEXT =
  "Здравствуйте! Пишу с сайта салона Valentin.";
