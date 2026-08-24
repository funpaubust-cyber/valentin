"use client";

import { useEffect } from "react";
import { useLenis } from "lenis/react";

/** Блокирует скролл страницы без сдвига вёрстки при открытии модалки */
export function useLockBodyScroll(locked: boolean) {
  const lenis = useLenis();

  useEffect(() => {
    if (!locked) return;

    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = document.body.style.overflow;
    const prevPadding = document.body.style.paddingRight;

    document.body.style.overflow = "hidden";
    if (scrollbar > 0) {
      document.body.style.paddingRight = `${scrollbar}px`;
    }

    lenis?.stop();

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPadding;
      lenis?.start();
    };
  }, [locked, lenis]);
}
