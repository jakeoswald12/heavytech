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
    const query = window.matchMedia(SNAP_QUERY);
    // Only pages that mark their sections (the home page) step section by section; every other page
    // scrolls normally.
    const snap = { get matches() { return query.matches && !!document.querySelector("[data-snap]"); } };
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
    let queued: 1 | -1 | 0 = 0; // a swipe that arrived mid-glide runs as soon as the glide ends
    let stepAt = -Infinity;
    const step = (dir: 1 | -1) => {
      const y = window.scrollY;
      const s = stops();
      const target = dir > 0 ? s.find((v) => v > y + 4) : [...s].reverse().find((v) => v < y - 4);
      if (target === undefined) return;
      moving = true;
      stepAt = lastWheel;
      lenis.scrollTo(target, {
        duration: SNAP_DURATION,
        easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
        lock: true,
        onComplete: () => {
          moving = false;
          const next = queued;
          queued = 0;
          if (next) step(next);
        },
      });
    };

    // One gesture moves one section. A gesture's first event steps; the rest are swallowed. A gesture
    // ends when the wheel goes quiet, or when a new swipe starts on top of the old one's momentum:
    // macOS keeps sending a fading momentum tail for a second or more after the fingers lift, and a
    // fresh swipe shows up as a sudden jump in speed. (Without this, a second swipe made during the
    // tail was ignored until the tail ended, or until the mouse moved, which cancels momentum.)
    let lastWheel = 0;
    let lastSpeed = 0;
    let rises = 0;
    const recent: [number, number][] = []; // [time, speed] of the last ~400ms of wheel events
    let streak = 0; // events in the current gesture
    let used = false;
    const onWheel = (e: WheelEvent) => {
      if (!snap.matches || e.ctrlKey) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // sideways: the news carousel
      e.preventDefault();
      // Event time, not handling time: a busy frame mid-glide must not look like a pause between swipes.
      const now = e.timeStamp;
      const speed = Math.abs(e.deltaY);
      const gap = now - lastWheel;
      // A pause ends the gesture, unless the events resume at the same fading speed (a hiccup in the
      // momentum stream rather than a new swipe; a real new swipe still registers via the speed jump).
      // Only trackpads stream dozens of events per gesture; a mouse wheel's clicks are a few isolated ones.
      // The window is generous because the page can freeze for a second while 3D models load (first
      // visit), and the momentum that piles up during the freeze must not count as a second swipe.
      const hiccup = streak > 8 && gap < 2500 && lastSpeed > 3 && speed <= lastSpeed * 1.15;
      const quiet = gap > GESTURE_GAP && !hiccup;
      streak = quiet ? 1 : streak + 1;
      // A new swipe is a clear rise above the speeds of a moment ago. Comparing with just the
      // previous event was too twitchy: hard swipes report jittery deltas that jump 1.6x between events,
      // which counted as a second swipe and skipped two sections. A swipe also ramps up over its first
      // ~100ms, so nothing counts until the step it started is well under way.
      // "Before" is the fastest event from 120-400ms ago: during a momentum tail that's at least as
      // fast as now, while a fresh swipe ramps from near zero to full speed in well under 120ms.
      while (recent.length && now - recent[0][0] > 400) recent.shift();
      let before = 0;
      for (const [t, v] of recent) if (now - t >= 120) before = Math.max(before, v);
      recent.push([now, speed]);
      // Two rising events in a row: a real swipe keeps climbing, a jitter spike in the momentum doesn't.
      const rising = now - stepAt > 450 && speed > 12 && speed > before * 1.8 + 10;
      rises = rising ? rises + 1 : 0;
      const surge = rises >= 2;
      const dir = e.deltaY > 0 ? 1 : -1;
      if (moving && surge && !queued) queued = dir;
      if (quiet || (surge && !moving)) used = false;
      lastWheel = now;
      lastSpeed = speed;
      if (used || moving || speed < 3) return;
      used = true;
      step(dir);
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
    // The footer's height, for CSS that sizes the last section so it and the footer share one screen.
    const footer = document.querySelector("footer");
    const footerSize = new ResizeObserver(() => {
      if (footer) document.documentElement.style.setProperty("--footer-h", `${footer.offsetHeight}px`);
    });
    if (footer) footerSize.observe(footer);

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      footerSize.disconnect();
      lenis.destroy();
      instance = null;
    };
  }, []);

  return null;
}
