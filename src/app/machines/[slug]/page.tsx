import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import SplatViewer from "@/components/SplatViewer";
import { JoinBand } from "@/components/blocks";
import { machines } from "@/data/site";

export function generateStaticParams() {
  return machines.map((m) => ({ slug: m.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/machines/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const m = machines.find((x) => x.slug === slug);
  if (!m) return {};
  return {
    title: `${m.name} ${m.category}`,
    description: m.summary,
    openGraph: { images: [{ url: m.hero.src, alt: m.hero.alt }] },
  };
}

export default async function MachinePage({ params }: PageProps<"/machines/[slug]">) {
  const { slug } = await params;
  const index = machines.findIndex((x) => x.slug === slug);
  if (index < 0) notFound();
  const m = machines[index];
  const next = machines[(index + 1) % machines.length];

  return (
    <>
      <section className="machine-hero wrap" aria-label={m.name}>
        <div className="inner machine-hero-grid">
          <div className="machine-hero-copy">
            <div className="head">
              <div className="machine-tags">
                <span className="label">[ {String(index + 1).padStart(2, "0")} ]</span>
                <span className={`tag ${m.statusHot ? "tag-hot" : ""}`}>{m.status}</span>
              </div>
              <h1 className="display h-xl">{m.name}</h1>
              <span className="label">
                {m.code} / {m.category}
              </span>
            </div>
            <p className="lede">{m.summary}</p>
          </div>
          <div className="machine-hero-media">
            {m.model ? (
              <SplatViewer model={m.model} poster={m.hero.src} alt={m.hero.alt} compact />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="static-render" src={m.hero.src} alt={m.hero.alt} />
            )}
          </div>
        </div>
      </section>

      <section className="section wrap ticks">
        <div className="inner split">
          <Reveal className="split-copy">
            <span className="label">Overview</span>
            <h2 className="display h-m">{m.category}.</h2>
          </Reveal>
          <Reveal className="prose" delay={0.1}>
            {m.intro.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <dl className="spec-list">
              <div>
                <dt>Platform</dt>
                <dd>{m.code}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{m.status}</dd>
              </div>
              <div>
                <dt>Powertrain</dt>
                <dd>Battery-electric, hybrid or plug-in hybrid power module</dd>
              </div>
              <div>
                <dt>Built in</dt>
                <dd>Fort Wayne, Indiana</dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </section>

      <section className="section wrap band">
        <div className="inner">
          <span className="label">Features</span>
          <div className={`fgrid ${m.features.length % 3 === 0 ? "fgrid-3" : ""}`}>
            {m.features.map((f) => (
              <div key={f.title}>
                <h3 className="display h-s">{f.title}</h3>
                <p>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section wrap">
        <div className="inner duo" style={{ marginTop: 0 }}>
          {m.gallery.map((g) => (
            <figure key={g.src}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="render" src={g.src} alt={g.alt} loading="lazy" />
              <figcaption className="label">{g.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="section-tight wrap">
        <div className="inner machine-nav">
          <Link href="/#machines">
            <span className="label">← Back</span>
            <span className="display h-s">All machines</span>
          </Link>
          <Link href={`/machines/${next.slug}/`} style={{ textAlign: "right" }}>
            <span className="label">Next machine →</span>
            <span className="display h-s">
              {next.name} / {next.category}
            </span>
          </Link>
        </div>
      </section>

      <JoinBand />
    </>
  );
}
