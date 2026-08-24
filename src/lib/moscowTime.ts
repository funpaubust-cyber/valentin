const MOSCOW = "Europe/Moscow";

export function moscowHour(now = new Date()): number {
  const hour = new Intl.DateTimeFormat("en-GB", {
    timeZone: MOSCOW,
    hour: "numeric",
    hourCycle: "h23",
  }).formatToParts(now)
    .find((part) => part.type === "hour")?.value;

  return Number(hour ?? 0);
}

/** Приветствие по времени в Москве */
export function moscowGreeting(now = new Date()): string {
  const hour = moscowHour(now);
  if (hour >= 5 && hour < 12) return "Доброе утро";
  if (hour >= 12 && hour < 17) return "Добрый день";
  if (hour >= 17 && hour < 23) return "Добрый вечер";
  return "Доброй ночи";
}
