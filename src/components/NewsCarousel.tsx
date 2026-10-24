"use client";

import { useEffect, useRef, useState } from "react";
import type { NewsItem } from "@/data/site";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** "2025-11-26" → "26 November 2025" (formatted from the string, so it never shifts by time zone). */
function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

/** Four articles per view on desktop; the arrows page through the rest. */
export default function NewsCarousel({ items, title }: { items: NewsItem[]; title: React.ReactNode }) {
  const track = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const update = () =>
      setEdges({ start: el.scrollLeft <= 2, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2 });
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const page = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * (el.clientWidth + 24), behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <>
      <div className="section-head">
        {title}
        <div className="carousel-arrows">
          <button type="button" className="btn btn-ghost arrow" onClick={() => page(-1)} disabled={edges.start} aria-label="Previous articles">
            ←
          </button>
          <button type="button" className="btn btn-ghost arrow" onClick={() => page(1)} disabled={edges.end} aria-label="More articles">
            →
          </button>
        </div>
      </div>
      <div className="news-track" ref={track} tabIndex={0} aria-label="News articles">
        {items.map((n, i) => (
          <a
            key={n.slug}
            href={n.href}
            className="news-card"
            target="_blank"
            rel="noopener"
            data-reveal="right"
            style={{ "--d": `${150 + Math.min(i, 3) * 110}ms` } as React.CSSProperties}
          >
            <div className="news-img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={n.image} alt="" loading="lazy" />
            </div>
            <div className="news-meta">
              <span className="label">{formatDate(n.date)}</span>
              <h3 className="display h-s">{n.title}</h3>
              <p>{n.summary}</p>
              <span className="label news-more">
                Read more <span aria-hidden="true">↗</span>
              </span>
            </div>
          </a>
        ))}
      </div>
    </>
  );
}
