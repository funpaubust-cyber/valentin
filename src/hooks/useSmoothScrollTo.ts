"use client";

import { useLenis } from "lenis/react";
import { useCallback } from "react";

/** Плавный скролл к якорю через Lenis (или native smooth). */
export function useSmoothScrollTo() {
  const lenis = useLenis();

  return useCallback(
    (id: string, offset = -96) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (lenis) {
        lenis.scrollTo(el, { offset, duration: 1.2 });
      } else {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    [lenis],
  );
}
