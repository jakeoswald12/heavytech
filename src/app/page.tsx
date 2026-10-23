import Link from "next/link";
import PowertrainTabs from "@/components/PowertrainTabs";
import Reveal from "@/components/Reveal";
import SplatViewer from "@/components/SplatViewer";
import { JoinBand, MachineCard, NewsCard, Split } from "@/components/blocks";
import { machines, news } from "@/data/site";

export default function Home() {
  const ht1 = machines[0];

  return (
    <>
      <section className="hero wrap" aria-label="HT-1 compact track loader">
        <div className="hero-viewer">
          {ht1.model ? <SplatViewer model={ht1.model} poster={ht1.hero.src} alt={ht1.hero.alt} /> : null}
        </div>
        <div className="inner hero-inner">
          <div className="hero-top">
            <h1 className="display h-xl hero-title">
              <span>Built</span>
              <span>for</span>
              <span>work.</span>
            </h1>
            <p className="label hero-kicker">Next-generation off-highway machines</p>
          </div>
          <div />
          <div className="hero-bottom">
            <p className="lede">Easier to own. Easier to fix. Super fuel efficient. And fun to operate.</p>
          </div>
        </div>
      </section>

      <section className="section wrap ticks">
        <Reveal className="inner statement-grid">
          <span className="label">[ 01 ] The architecture</span>
          <h2 className="display h-l">A new architecture.</h2>
          <p className="lede">
            Batteries, motors, power electronics and software have all moved fast. The basic layout of off-highway equipment
            hasn’t. HeavyTech starts from a blank sheet and designs the whole machine as one system.
          </p>
        </Reveal>
      </section>

      <section className="section wrap" id="machines">
        <div className="inner">
          <div className="section-head">
            <div style={{ display: "grid", gap: 18 }}>
              <span className="label">[ 02 ] The platform</span>
              <h2 className="display h-l">The machines.</h2>
            </div>
            <Link href="/machines/" className="btn btn-ghost">
              All machines <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="machines-grid">
            {machines.map((m, i) => (
              <MachineCard key={m.slug} m={m} index={i} />
            ))}
          </div>
        </div>
      </section>

      <Split
        label="[ 03 ] Interchangeable powertrain"
        title="Swappable power."
        image={{ src: "/images/technology/guts.webp", alt: "HeavyTech swappable power module with engine, generator and battery", caption: "Swappable power module" }}
      >
        <p>
          The front of every HeavyTech machine is the same electric architecture. The back, where the power source lives, swaps
          out. Pick the energy source the job calls for, and change it when the job changes.
        </p>
        <PowertrainTabs />
      </Split>

      <Split
        flip
        band
        label="[ 04 ] Electro-hydraulics · Patent pending"
        title="Power on demand."
        image={{ src: "/images/technology/slide2.webp", alt: "Electric motor coupled to a hydraulic pump with its control board", caption: "Point-of-use electric pump" }}
      >
        <p>
          A dedicated electric motor drives each work-function pump. No directional or pressure control valves burning energy as
          heat, so every function gets precise, instant, digitally controlled power, and the pump only spins when you’re working.
        </p>
        <Link href="/technology/" className="btn btn-ghost" style={{ width: "fit-content" }}>
          How it works <span aria-hidden="true">→</span>
        </Link>
      </Split>

      <Split
        label="[ 05 ] Complete access"
        title="Right to repair."
        image={{ src: "/images/machines/ctl_access.webp", alt: "HT-1 with service panels open showing the power module", caption: "HT-1 · Service access" }}
      >
        <p>
          Every component is laid out to be reached: removable panels, swing-out service doors, labeled wiring and modular
          subsystems. Open diagnostics and full service documentation, so operators, fleet mechanics and independent shops can
          keep the machine working.
        </p>
        <Link href="/ownership/" className="btn btn-ghost" style={{ width: "fit-content" }}>
          Ownership <span aria-hidden="true">→</span>
        </Link>
      </Split>

      <section className="section wrap">
        <div className="inner">
          <span className="label">[ 06 ] Intelligence</span>
          <Reveal>
            <h2 className="display h-l" style={{ marginTop: 18 }}>
              Smarter machines.
            </h2>
          </Reveal>
          <div className="fgrid">
            <div>
              <h3 className="display h-s">Autonomy ready</h3>
              <p>A sensor module mounts front and back of the cab. Add it or remove it to enable autonomous functions on your terms.</p>
            </div>
            <div>
              <h3 className="display h-s">Machine vision</h3>
              <p>Camera-based sensing that reads machine and attachment position without traditional sensors.</p>
            </div>
            <div>
              <h3 className="display h-s">Software-defined</h3>
              <p>Real-time diagnostics that point a technician to the subsystem, not just “it doesn’t work.”</p>
            </div>
            <div>
              <h3 className="display h-s">American made</h3>
              <p>Built in Fort Wayne, Indiana with US steel and domestic components.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section wrap band">
        <div className="inner">
          <div className="section-head">
            <div style={{ display: "grid", gap: 18 }}>
              <span className="label">[ 07 ] Field notes</span>
              <h2 className="display h-l">News.</h2>
            </div>
            <Link href="/news/" className="btn btn-ghost">
              All news <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="news-grid">
            {news.slice(0, 3).map((n) => (
              <NewsCard key={n.slug} n={n} />
            ))}
          </div>
        </div>
      </section>

      <JoinBand />
    </>
  );
}
