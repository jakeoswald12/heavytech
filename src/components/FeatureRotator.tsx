"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import TechModel, { type FeatureView } from "./TechModel";

export type Feature = {
  title: string;
  body: string;
  image: { src: string; alt: string };
  /** "render" sits on the page background; "photo" fills a framed box. */
  kind?: "render" | "photo";
  /** When every feature has one, the media is the 3D HT-1 with this feature's parts lit up. */
  view?: FeatureView;
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
  const views = useMemo(() => (features.every((f) => f.view) ? features.map((f) => f.view as FeatureView) : null), [features]);
  const fallback = useMemo(() => features.map((f) => f.image), [features]);

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
        {views ? (
          <TechModel active={active} views={views} fallback={fallback} />
        ) : features.map((f, i) => (
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
