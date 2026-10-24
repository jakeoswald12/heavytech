"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav } from "@/data/site";
import { scrollToSection } from "./SmoothScroll";
import ThemeToggle from "./ThemeToggle";

const ROW = 16; // px height of one nav row; the elbow is measured in rows

/** Which section a non-home page belongs to, so the elbow still has somewhere to point. */
function sectionForPath(pathname: string) {
  if (pathname.startsWith("/machines")) return "machines";
  if (pathname.startsWith("/reserve")) return "company";
  return "top";
}

export default function Nav() {
  const pathname = usePathname();
  const onHome = pathname === "/";

  // The menu remembers which page it was opened on, so navigating closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  // Scroll-spy: the section nearest the top of the viewport is the active one.
  const [spied, setSpied] = useState("top");
  const lockUntil = useRef(0);
  useEffect(() => {
    const onScroll = () => {
      if (!onHome || Date.now() < lockUntil.current) return;
      const line = window.innerHeight * 0.35;
      let current = nav[0].id;
      for (const item of nav) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= line) current = item.id;
      }
      setSpied(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [onHome]);

  const active = onHome ? spied : sectionForPath(pathname);
  const activeIndex = Math.max(0, nav.findIndex((n) => n.id === active));
  const href = (id: string) => (onHome ? `#${id}` : `/#${id}`);
  const pick = (e: React.MouseEvent, id: string) => {
    if (!onHome) return;
    // Scroll ourselves so "Home" lands at the exact top (not the hero's offset) with the same easing.
    e.preventDefault();
    history.replaceState(null, "", id === "top" ? location.pathname : `#${id}`);
    scrollToSection(id);
    // Hold the elbow on the clicked item while the page scrolls past the sections in between.
    lockUntil.current = Date.now() + 1500;
    setSpied(id);
    setOpenOn(null);
  };

  return (
    <header className="nav wrap">
      <div className="inner nav-row">
        <Link href="/" className="wordmark" aria-label="HeavyTech home" onClick={(e) => pick(e, "top")}>
          HeavyTech
        </Link>
        <nav aria-label="Sections" className="nav-stack" style={{ ["--row" as string]: `${ROW}px` }}>
          <span className="elbow" aria-hidden="true" style={{ height: activeIndex * ROW + ROW / 2 }} />
          <ul>
            {nav.map((item) => (
              <li key={item.id}>
                <a
                  href={href(item.id)}
                  onClick={(e) => pick(e, item.id)}
                  aria-current={item.id === active ? "true" : undefined}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="nav-actions">
          <ThemeToggle />
          <Link href="/reserve/" className="btn btn-solid nav-cta">
            Reserve <span aria-hidden="true">↗</span>
          </Link>
          <button
            type="button"
            className="btn btn-ghost nav-burger"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpenOn(open ? null : pathname)}
          >
            <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              {open ? (
                <path d="M4 4l12 12M16 4L4 16" />
              ) : (
                <path d="M2.5 5.5h15M2.5 10h15M2.5 14.5h15" />
              )}
            </svg>
          </button>
        </div>
      </div>
      <div id="mobile-menu" className="mobile-menu wrap" hidden={!open}>
        <ul>
          {nav.map((item, i) => (
            <li key={item.id}>
              <a href={href(item.id)} onClick={(e) => pick(e, item.id)} aria-current={item.id === active ? "true" : undefined}>
                <span className="label">[ {String(i + 1).padStart(2, "0")} ]</span>
                <span className="display h-m">{item.label}</span>
              </a>
            </li>
          ))}
          <li>
            <Link href="/reserve/">
              <span className="label">[ {String(nav.length + 1).padStart(2, "0")} ]</span>
              <span className="display h-m accent">Reserve</span>
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
