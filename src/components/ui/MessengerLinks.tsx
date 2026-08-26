import {
  SALON_EMAIL,
  SALON_PHONE,
  SALON_PHONE_HREF,
  VK_URL,
} from "@/data/salon";

type MessengerLinksProps = {
  className?: string;
  tone?: "light" | "dark";
};

export function MessengerLinks({
  className = "",
  tone = "light",
}: MessengerLinksProps) {
  const link =
    tone === "dark"
      ? "inline-flex min-h-10 items-center rounded-full border border-milk/20 px-3.5 text-[11px] uppercase tracking-[0.14em] text-milk/80 transition-colors hover:border-milk/50 hover:text-milk"
      : "inline-flex min-h-10 items-center rounded-full border border-brass/20 bg-milk px-3.5 text-[11px] uppercase tracking-[0.14em] text-graphite transition-colors hover:border-brass/45";

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <a href={`mailto:${SALON_EMAIL}`} className={link}>
        Почта
      </a>
      <a href={VK_URL} target="_blank" rel="noreferrer" className={link}>
        ВКонтакте
      </a>
      <a href={SALON_PHONE_HREF} className={link}>
        {SALON_PHONE}
      </a>
    </div>
  );
}
