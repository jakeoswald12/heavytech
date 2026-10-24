"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav } from "@/data/site";
import ThemeToggle from "./ThemeToggle";

export default function Nav() {
  const pathname = usePathname();
  // The menu remembers which page it was opened on, so navigating closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  // Transparent at the very top so it blends into the hero; fades in once the page scrolls.
  const [atTop, setAtTop] = useState(true);
  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY < 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href);

  return (
    <header className="nav wrap" data-top={atTop && !open}>
      <div className="inner nav-row">
        <Link href="/" className="wordmark" aria-label="HeavyTech home">
          HeavyTech
        </Link>
        <nav aria-label="Main" className="nav-links">
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={isActive(item.href) ? "page" : undefined}>
                  {item.label}
                </Link>
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
            onClick={() => setOpenOn(open ? null : pathname)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>
      <div id="mobile-menu" className="mobile-menu wrap" hidden={!open}>
        <ul>
          {nav.map((item, i) => (
            <li key={item.href}>
              <Link href={item.href} aria-current={isActive(item.href) ? "page" : undefined}>
                <span className="label">[ {String(i + 1).padStart(2, "0")} ]</span>
                <span className="display h-m">{item.label}</span>
              </Link>
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
