"use client";

import Lenis from "lenis";
import { useEffect } from "react";

let instance: Lenis | null = null;

/**
 * Scroll to a section (or the very top for "top") with the same soft easing as the wheel.
 * Falls back to native scrolling when smooth scrolling is off (reduced motion).
 */
export function scrollToSection(id: string) {
  const el = id === "top" ? null : document.getElementById(id);
  if (instance) {
    instance.scrollTo(el ?? 0, { duration: 1.4 });
    return;
  }
  if (el) el.scrollIntoView({ behavior: "smooth" });
  else window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * Smooth, inertial page scrolling: wheel and trackpad input glide in and settle out instead of
 * stepping. Touch screens keep their native scrolling. Skipped for visitors who prefer reduced motion.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.085, // lower = softer, longer glide
      wheelMultiplier: 0.85, // a little less distance per wheel tick
      // Sideways trackpad swipes are left alone, so the news track still scrolls horizontally.
    });
    instance = lenis;
    return () => {
      lenis.destroy();
      instance = null;
    };
  }, []);

  return null;
}
