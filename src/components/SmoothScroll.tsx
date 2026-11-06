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
/**
 * Wide, tall-enough screens step through the page one section at a time: each wheel flick, trackpad
 * swipe or arrow/page key glides to the next [data-snap] section and rests there. Must match the
 * "snap" media query in components.css, which sizes each section to one screen.
 */
export const SNAP_QUERY = "(min-width: 901px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)";
const SNAP_DURATION = 1.1; // seconds per step
const GESTURE_GAP = 220; // ms of wheel silence that ends one gesture (absorbs trackpad momentum)

export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const snap = window.matchMedia(SNAP_QUERY);
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.085, // lower = softer, longer glide
      wheelMultiplier: 0.85, // a little less distance per wheel tick
      // Sideways trackpad swipes are left alone, so the news track still scrolls horizontally.
      // In snap mode the wheel is ours (below); touch and scrollbar dragging stay native.
      virtualScroll: (data) => !(snap.matches && data.event.type === "wheel"),
    });
    instance = lenis;

    // Where the page can rest: the top, every [data-snap] section, and the very bottom.
    const stops = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ys = [0, max];
      document.querySelectorAll<HTMLElement>("[data-snap]").forEach((el) => {
        ys.push(Math.min(max, Math.round(el.getBoundingClientRect().top + window.scrollY)));
      });
      return [...new Set(ys)].sort((a, b) => a - b);
    };
    let moving = false;
    const step = (dir: 1 | -1) => {
      const y = window.scrollY;
      const s = stops();
      const target = dir > 0 ? s.find((v) => v > y + 4) : [...s].reverse().find((v) => v < y - 4);
      if (target === undefined) return;
      moving = true;
      lenis.scrollTo(target, {
        duration: SNAP_DURATION,
        easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
        lock: true,
        onComplete: () => (moving = false),
      });
    };

    // One gesture moves one section: the gesture's first event steps, the rest (including the
    // trackpad's momentum tail) are swallowed until the wheel goes quiet.
    let lastWheel = 0;
    let used = false;
    const onWheel = (e: WheelEvent) => {
      if (!snap.matches || e.ctrlKey) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // sideways: the news carousel
      e.preventDefault();
      const now = performance.now();
      if (now - lastWheel > GESTURE_GAP) used = false;
      lastWheel = now;
      if (used || moving || Math.abs(e.deltaY) < 3) return;
      used = true;
      step(e.deltaY > 0 ? 1 : -1);
    };
    const onKey = (e: KeyboardEvent) => {
      if (!snap.matches || e.altKey || e.ctrlKey || e.metaKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      const down = e.key === "ArrowDown" || e.key === "PageDown" || (e.key === " " && !e.shiftKey);
      const up = e.key === "ArrowUp" || e.key === "PageUp" || (e.key === " " && e.shiftKey);
      if (!down && !up) return;
      e.preventDefault();
      if (!moving) step(down ? 1 : -1);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      lenis.destroy();
      instance = null;
    };
  }, []);

  return null;
}
