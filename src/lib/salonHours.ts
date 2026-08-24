import {
  SALON_CLOSE_MINUTES,
  SALON_CLOSES,
  SALON_OPEN_MINUTES,
  SALON_OPENS,
} from "@/data/salon";

const TZ = "Europe/Moscow";

function clockParts(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(now);

  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  return { hour, minute, minutes: hour * 60 + minute };
}

export function salonStatus(now = new Date()) {
  const { minutes } = clockParts(now);
  const open =
    minutes >= SALON_OPEN_MINUTES && minutes < SALON_CLOSE_MINUTES;
  return {
    open,
    label: open
      ? `Открыто до ${SALON_CLOSES}`
      : `Закрыто · завтра с ${SALON_OPENS}`,
  };
}
