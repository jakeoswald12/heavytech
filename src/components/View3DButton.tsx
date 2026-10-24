"use client";

import { SHOW_IN_HERO } from "./HeroViewer";

/** Scrolls up to the home hero and shows this machine in 3D. */
export default function View3DButton({ slug }: { slug: string }) {
  return (
    <button
      type="button"
      className="btn btn-ghost view3d"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        window.dispatchEvent(new CustomEvent(SHOW_IN_HERO, { detail: slug }));
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        document.getElementById("hero")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
      }}
    >
      View in 3D <span aria-hidden="true">↑</span>
    </button>
  );
}
