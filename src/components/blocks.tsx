import Link from "next/link";
import type { ReactNode } from "react";
import type { Machine } from "@/data/site";
import Reveal from "./Reveal";
import SplatViewer from "./SplatViewer";

/** Top-of-page header for inner pages. */
export function PageHeader({ label, title, lede, children }: { label: string; title: ReactNode; lede?: ReactNode; children?: ReactNode }) {
  return (
    <section className="page-head wrap ticks">
      <div className="inner page-head-grid">
        <span className="label">{label}</span>
        <h1 className="display h-xl">{title}</h1>
        {lede ? <p className="lede">{lede}</p> : null}
        {children}
      </div>
    </section>
  );
}

/** Copy on one side, product image on the other. */
export function Split({
  id,
  label,
  title,
  children,
  image,
  flip = false,
  band = false,
  joined = false,
  extra,
}: {
  id?: string;
  label: string;
  title: ReactNode;
  children: ReactNode;
  image: { src: string; alt: string; caption?: string };
  flip?: boolean;
  band?: boolean;
  /** Continue the previous section: no dividing rule, tighter top spacing. */
  joined?: boolean;
  /** Extra content under the copy column (for example a grid of points). */
  extra?: ReactNode;
}) {
  return (
    <section id={id} className={`section wrap ${band ? "band" : ""} ${joined ? "section-joined" : ""}`}>
      <div className={`inner split ${flip ? "split-flip" : ""}`}>
        <Reveal className="split-copy">
          <span className="label">{label}</span>
          <h2 className="display h-m">{title}</h2>
          {children}
          {extra}
        </Reveal>
        <Reveal className="split-media" delay={0.1}>
          <figure>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="render" src={image.src} alt={image.alt} loading="lazy" />
          </figure>
        </Reveal>
      </div>
    </section>
  );
}

export function MachineCard({ m, index }: { m: Machine; index: number }) {
  const href = `/machines/${m.slug}/`;
  return (
    <article className="machine-card">
      <div className="machine-img">
        {m.model ? (
          <SplatViewer model={m.model} poster={m.hero.src} alt={m.hero.alt} compact bare />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={m.hero.src} alt={m.hero.alt} loading="lazy" />
        )}
      </div>
      <div className="machine-meta">
        <div className="machine-tags">
          <span className="label">[ {String(index + 1).padStart(2, "0")} ]</span>
          <span className={`tag ${m.statusHot ? "tag-hot" : ""}`}>{m.status}</span>
        </div>
        <h3 className="display machine-name">
          <Link href={href}>{m.name}</Link>
        </h3>
        <span className="label">
          {m.code} / {m.category}
        </span>
        <p className="machine-summary">{m.summary}</p>
        <div className="machine-actions">
          <Link href={href} className="btn btn-ghost">
            View machine <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

/** Closing call to action used at the bottom of most pages. */
export function JoinBand() {
  return (
    <section className="section wrap ticks join">
      <div className="inner join-grid">
        <span className="label">Reservations · Dealers · Investors</span>
        <h2 className="display h-l">Join the build.</h2>
        <p className="lede">
          Reserve a machine, ask about becoming a dealer, or follow along as the first HT-1 comes together in Fort Wayne.
        </p>
        <div className="ctas">
          <Link className="btn btn-solid" href="/reserve/">
            Reserve an HT-1 <span aria-hidden="true">↗</span>
          </Link>
          <Link className="btn" href="/reserve/#dealer">
            Dealer inquiry
          </Link>
          <a className="btn" href="https://investors.heavytech.ai/" target="_blank" rel="noopener">
            Investor portal <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
