"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type Feature = {
  title: string;
  body: string;
  image: { src: string; alt: string };
  /** "render" sits on the page background; "photo" fills a framed box. */
  kind?: "render" | "photo";
};

const INTERVAL = 4000;

/**
 * A list of features on the left and a matching image on the right. The active feature is gold
 * and expanded; every four seconds the next one opens and the image crossfades, until the visitor
 * picks a feature. From then on it stays where they put it. Hovering the list pauses the timer.
 */
export default function FeatureRotator({ features, label }: { features: Feature[]; label: string }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [chosen, setChosen] = useState(false); // once the visitor clicks, auto-rotation stops for good
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const choose = useCallback((i: number) => {
    setChosen(true);
    setActive(i);
  }, []);

  useEffect(() => {
    if (paused || chosen) return;
    timer.current = setTimeout(() => setActive((a) => (a + 1) % features.length), INTERVAL);
    return () => clearTimeout(timer.current);
  }, [active, paused, chosen, features.length]);

  return (
    <div className="rotator">
      <ol
        className="rotator-list"
        aria-label={label}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        {features.map((f, i) => {
          const on = i === active;
          return (
            <li key={f.title} className="rotator-item" data-active={on}>
              <button type="button" className="rotator-title" aria-expanded={on} onClick={() => choose(i)}>
                <span className="label rotator-index">[ {String(i + 1).padStart(2, "0")} ]</span>
                <span className="display h-s">{f.title}</span>
              </button>
              <div className="rotator-body" aria-hidden={!on}>
                <div>
                  <p>{f.body}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
      <div className="rotator-media" data-reveal="fade" style={{ "--d": "250ms" } as React.CSSProperties}>
        {features.map((f, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={f.title}
            src={f.image.src}
            alt={i === active ? f.image.alt : ""}
            className={`rotator-img ${f.kind === "photo" ? "is-photo" : "is-render"}`}
            data-active={i === active}
            loading={i === 0 ? "eager" : "lazy"}
          />
        ))}
      </div>
    </div>
  );
}
