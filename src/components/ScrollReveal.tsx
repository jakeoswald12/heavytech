"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Reveals elements marked `data-reveal` as they scroll into view by setting `data-shown` once.
 * The hidden starting state only applies after the inline head script adds `reveal-ready` to <html>,
 * so content is never hidden if JavaScript doesn't run. Variants and timing live in components.css;
 * stagger an element with an inline `--d` (milliseconds).
 */
export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-shown])"));
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach((el) => el.setAttribute("data-shown", ""));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.setAttribute("data-shown", "");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    root.classList.add("reveal-ready");
    return () => io.disconnect();
  }, [pathname]);

  return null;
}

