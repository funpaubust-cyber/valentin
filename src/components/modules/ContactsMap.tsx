"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Clock, MapPin, Phone } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { MessengerLinks } from "@/components/ui/MessengerLinks";
import {
  YandexMapLabel,
  MAP_LAT,
  MAP_LON,
  BASE_ZOOM,
} from "@/components/ui/YandexMapLabel";
import {
  SALON_ADDRESS,
  SALON_CITY,
  SALON_HOURS_LABEL,
  SALON_HOW_TO,
  SALON_PHONE,
  SALON_PHONE_HREF,
  SALON_PLACE,
  SALON_STREET,
} from "@/data/salon";
import { salonStatus } from "@/lib/salonHours";
import { softSpring } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

export function ContactsMap() {
  const [open, setOpen] = useState(true);
  const [status, setStatus] = useState(() => salonStatus());

  useEffect(() => {
    setStatus(salonStatus());
    const id = window.setInterval(() => setStatus(salonStatus()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section id="contacts" className="bg-cashmere pb-16 pt-10 md:pb-20 md:pt-12">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 md:grid-cols-2 md:gap-10 md:px-8">
        <FadeIn>
          <h2 className="font-serif text-[1.85rem] text-graphite md:text-5xl">
            Контакты
          </h2>

          <div className="mt-8 overflow-hidden border border-brass/20 bg-milk shadow-soft">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-cashmere/60"
              aria-expanded={open}
            >
              <span className="font-medium text-graphite">г. {SALON_CITY}</span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-brass transition-transform duration-300 ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={softSpring}
                  className="overflow-hidden border-t border-brass/15 bg-cashmere/50"
                >
                  <div className="space-y-4 px-5 py-5">
                    <div className="flex gap-3">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brass" />
                      <div className="text-sm leading-relaxed text-graphite/80">
                        <p className="font-medium text-graphite">{SALON_STREET}</p>
                        <p className="mt-1">{SALON_PLACE}</p>
                        <p className="mt-1 text-graphite/55">{SALON_ADDRESS}</p>
                      </div>
                    </div>

                    <div className="flex gap-3 border-t border-brass/15 pt-4">
                      <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brass" />
                      <div className="text-sm leading-relaxed text-graphite/80">
                        <p className="font-medium text-graphite">{status.label}</p>
                        <p className="mt-1 text-graphite/55">{SALON_HOURS_LABEL}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 border-t border-brass/15 pt-4">
                      <Phone className="h-4 w-4 shrink-0 text-brass" />
                      <a
                        href={SALON_PHONE_HREF}
                        className="text-sm text-graphite/80 transition-colors hover:text-graphite"
                      >
                        {SALON_PHONE}
                      </a>
                    </div>

                    <div className="border-t border-brass/15 pt-4">
                      <p className="mb-2 text-xs uppercase tracking-[0.16em] text-graphite/45">
                        Как пройти
                      </p>
                      <p className="text-sm leading-relaxed text-graphite/75">
                        {SALON_HOW_TO}
                      </p>
                    </div>

                    <div className="border-t border-brass/15 pt-4">
                      <p className="mb-3 text-xs uppercase tracking-[0.16em] text-graphite/45">
                        Написать нам
                      </p>
                      <MessengerLinks />
                    </div>

                    <a
                      href={`https://yandex.ru/maps/org/valentin/110863088243/?indoorLevel=2&ll=${MAP_LON}%2C${MAP_LAT}&z=${BASE_ZOOM}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex text-xs uppercase tracking-[0.16em] text-brass transition-colors hover:text-graphite"
                    >
                      Открыть в Яндекс.Картах
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </FadeIn>

        <FadeIn delay={0.08}>
          <div className="relative min-h-[16rem] overflow-hidden border border-brass/20 bg-walnut shadow-soft aspect-[4/3] md:aspect-auto md:min-h-[22rem] md:h-full">
            <YandexMapLabel className="absolute inset-0 h-full w-full" />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
