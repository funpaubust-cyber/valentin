"use client";

import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";

/** Салон Valentin, 2 этаж МЦ «Мебельный город» — координаты из карточки Яндекса */
export const MAP_LAT = 50.582173;
export const MAP_LON = 36.608651;

export const BASE_ZOOM = 21;

const placemarkProps = {
  hintContent: "Valentin — МЦ «Мебельный город», 2 этаж",
  balloonContent:
    "Valentin<br>ул. Донецкая, 85А<br>МЦ «Мебельный город», 2 этаж",
};

const placemarkOptions = {
  preset: "islands#blueIcon",
  draggable: false,
};

type YMap = {
  geoObjects: { add: (o: unknown) => void };
  destroy: () => void;
  behaviors: {
    disable: (name: string) => void;
    enable: (name: string) => void;
  };
};

declare global {
  interface Window {
    ymaps?: {
      ready: (cb: () => void) => void;
      Map: new (
        el: HTMLElement,
        state: Record<string, unknown>,
        opts?: Record<string, unknown>
      ) => YMap;
      Placemark: new (
        coords: number[],
        props?: Record<string, unknown>,
        opts?: Record<string, unknown>
      ) => unknown;
    };
  }
}

let ymapsLoader: Promise<void> | null = null;

function loadYmaps(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.ymaps) return Promise.resolve();
  if (ymapsLoader) return ymapsLoader;

  ymapsLoader = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://api-maps.yandex.ru/2.1/?lang=ru_RU";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("ymaps load failed"));
    document.head.appendChild(script);
  });

  return ymapsLoader;
}

const iframeSrc = `https://yandex.ru/map-widget/v1/?ll=${MAP_LON}%2C${MAP_LAT}&z=${BASE_ZOOM}&pt=${MAP_LON},${MAP_LAT},pm2blm&indoorLevel=2`;

export function YandexMapLabel({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [useIframe, setUseIframe] = useState(false);
  const lenis = useLenis();

  const pausePageScroll = () => {
    lenis?.stop();
  };

  const resumePageScroll = () => {
    lenis?.start();
  };

  useEffect(() => {
    return () => {
      lenis?.start();
    };
  }, [lenis]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.stopPropagation();
    };

    el.addEventListener("wheel", onWheel, { capture: true });
    return () => el.removeEventListener("wheel", onWheel, { capture: true });
  }, []);

  useEffect(() => {
    if (useIframe) return;

    let map: YMap | null = null;
    let cancelled = false;

    loadYmaps()
      .then(() => {
        if (cancelled || !window.ymaps) {
          setUseIframe(true);
          return;
        }
        window.ymaps.ready(() => {
          if (cancelled || !ref.current || !window.ymaps) return;

          map = new window.ymaps.Map(
            ref.current,
            {
              center: [MAP_LAT, MAP_LON],
              zoom: BASE_ZOOM,
              controls: ["zoomControl"],
              indoorLevel: "2",
            },
            { suppressMapOpenBlock: true }
          );

          map.behaviors.enable("scrollZoom");
          if (window.matchMedia("(max-width: 767px)").matches) {
            map.behaviors.disable("drag");
            map.behaviors.disable("scrollZoom");
          }

          map.geoObjects.add(
            new window.ymaps.Placemark(
              [MAP_LAT, MAP_LON],
              placemarkProps,
              placemarkOptions
            )
          );
        });
      })
      .catch(() => {
        if (!cancelled) setUseIframe(true);
      });

    return () => {
      cancelled = true;
      if (map) {
        try {
          map.destroy();
        } catch {
          /* ignore */
        }
      }
    };
  }, [useIframe]);

  return (
    <div
      ref={wrapRef}
      className={`${className} overscroll-contain`}
      data-lenis-prevent
      onMouseEnter={pausePageScroll}
      onMouseLeave={resumePageScroll}
    >
      {useIframe ? (
        <iframe
          title="Яндекс.Карта — Valentin, Белгород"
          src={iframeSrc}
          className="h-full w-full border-0"
          loading="lazy"
          allowFullScreen
        />
      ) : (
        <div
          ref={ref}
          className="h-full w-full"
          role="img"
          aria-label="Карта: салон Valentin, Белгород"
        />
      )}
    </div>
  );
}
