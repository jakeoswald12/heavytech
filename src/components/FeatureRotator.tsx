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
 * and expanded; every four seconds the next one opens and the image crossfades. Hovering or
 * focusing the list pauses it; clicking a feature jumps to it.
 */
export default function FeatureRotator({ features, label }: { features: Feature[]; label: string }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [cycle, setCycle] = useState(0); // bumps to restart the progress bar
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const go = useCallback((i: number) => {
    setActive(i);
    setCycle((c) => c + 1);
  }, []);

  useEffect(() => {
    if (paused) return;
    timer.current = setTimeout(() => go((active + 1) % features.length), INTERVAL);
    return () => clearTimeout(timer.current);
  }, [active, paused, cycle, features.length, go]);

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
              <button type="button" className="rotator-title" aria-expanded={on} onClick={() => go(i)}>
                <span className="label rotator-index">[ {String(i + 1).padStart(2, "0")} ]</span>
                <span className="display h-s">{f.title}</span>
              </button>
              <div className="rotator-body" aria-hidden={!on}>
                <div>
                  <p>{f.body}</p>
                </div>
              </div>
              <span className="rotator-progress" aria-hidden="true">
                {on ? <span key={cycle} className="rotator-bar" data-paused={paused} /> : null}
              </span>
            </li>
          );
        })}
      </ol>
      <div className="rotator-media">
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
