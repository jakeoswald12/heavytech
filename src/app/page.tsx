import Link from "next/link";
import HeroViewer from "@/components/HeroViewer";
import NewsCarousel from "@/components/NewsCarousel";
import PowertrainTabs from "@/components/PowertrainTabs";
import Reveal from "@/components/Reveal";
import { MachineCard, Split } from "@/components/blocks";
import { machines, news, site } from "@/data/site";

/** Section eyebrow: bracketed index plus name, matching the nav order. */
function Eyebrow({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <span className="label">
      [ {String(n).padStart(2, "0")} ] {children}
    </span>
  );
}

export default function Home() {
  return (
    <>
      {/* ---------- Home ---------- */}
      <section className="hero wrap" id="top" aria-label="HeavyTech HT-1 in 3D">
        <div className="hero-viewer">
          <HeroViewer />
        </div>
        <div className="inner hero-inner">
          <div className="hero-copy">
            <h1 className="display h-xl hero-title">
              <span>Next Gen</span>
              <span>Off-Highway</span>
              <span>Machinery</span>
            </h1>
            <p className="lede hero-lede">Cheaper to own. Easier to fix. Smoother to operate.</p>
          </div>
        </div>
      </section>

      {/* ---------- Machines ---------- */}
      <section className="section wrap" id="machines">
        <div className="inner">
          <div className="section-head">
            <div className="head-stack">
              <Eyebrow n={1}>Machines</Eyebrow>
              <h2 className="display h-l">The machines.</h2>
            </div>
            <p className="lede">One architecture across construction, farm, ranch and defense. Drag any machine to turn it.</p>
          </div>
          <div className="machines-grid">
            {machines.map((m, i) => (
              <MachineCard key={m.slug} m={m} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Technology ---------- */}
      <div id="technology">
        <section className="section wrap ticks">
          <Reveal className="inner statement-grid">
            <Eyebrow n={2}>Technology</Eyebrow>
            <h2 className="display h-l">A new architecture.</h2>
            <p className="lede">
              Batteries, motors, power electronics and software have all moved fast. The basic layout of off-highway equipment
              hasn’t. HeavyTech starts from a blank sheet and designs the whole machine as one system.
            </p>
          </Reveal>
        </section>

        <Split
          label="Interchangeable powertrain"
          title="Swappable power."
          image={{ src: "/images/technology/guts.webp", alt: "HeavyTech swappable power module with engine, generator and battery" }}
        >
          <p>
            The front of every HeavyTech machine is the same electric architecture. The back, where the power source lives,
            swaps out. Pick the energy source the job calls for, and change it when the job changes.
          </p>
          <PowertrainTabs />
        </Split>

        <Split
          flip
          label="Electro-hydraulics · Patent pending"
          title="Power on demand."
          image={{ src: "/images/technology/slide2.webp", alt: "Electric motor coupled to a hydraulic pump with its control board" }}
        >
          <p>
            A dedicated electric motor drives each work-function pump. No directional or pressure control valves burning energy
            as heat, so every function gets precise, instant, digitally controlled power, and the pump only spins when you’re
            working.
          </p>
        </Split>

        <section className="section wrap">
          <div className="inner duo-grid">
            <figure className="duo-item">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="render" src="/images/technology/powertrain.webp" alt="HeavyTech powertrain modules arranged on a chassis base" loading="lazy" />
              <div className="duo-copy">
                <h3 className="display h-s">Modular powertrain</h3>
                <p>Power, energy storage and pumps are separate modules on a common base, so each can be serviced, upgraded or swapped on its own.</p>
              </div>
            </figure>
            <figure className="duo-item">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="render" src="/images/technology/slide3.webp" alt="Valveless hydraulic manifold" loading="lazy" />
              <div className="duo-copy">
                <h3 className="display h-s">Valveless digital control</h3>
                <p>Real-time, high-resolution control of every function without directional or pressure control valves.</p>
              </div>
            </figure>
          </div>
        </section>

        <section className="section wrap">
          <div className="inner">
            <span className="label">Intelligence</span>
            <Reveal>
              <h2 className="display h-l" style={{ marginTop: 18 }}>
                Smarter machines.
              </h2>
            </Reveal>
            <div className="fgrid fgrid-3">
              <div>
                <h3 className="display h-s">Software-defined controls</h3>
                <p>Real-time diagnostics, seamless upgrades and an intuitive operator interface. The machine isolates a problem to a subsystem and tells the technician.</p>
              </div>
              <div>
                <h3 className="display h-s">Machine vision</h3>
                <p>Camera-based sensing that understands machine state and attachment position without traditional sensors, built for operator assistance and automation.</p>
              </div>
              <div>
                <h3 className="display h-s">Autonomy ready</h3>
                <p>A sensor module mounts front and back of the cab. Add it or remove it to enable autonomous functions on your terms.</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ---------- Service ---------- */}
      <div id="service">
        <Split
          label="[ 03 ] Service"
          title="Right to repair."
          image={{ src: "/images/machines/ctl_access.webp", alt: "HT-1 with service panels open showing the power module" }}
        >
          <p>
            The people who operate and depend on their machines every day should be able to repair them. Open diagnostics and full
            service documentation let operators, fleet mechanics and independent shops keep the machine working without
            proprietary tools.
          </p>
          <p>Where we can, we use recognizable, commercially available components instead of hiding them behind our own part numbers.</p>
        </Split>

        <section className="section wrap">
          <div className="inner">
            <span className="label">Complete access</span>
            <Reveal>
              <h2 className="display h-l" style={{ marginTop: 18 }}>
                Built for service.
              </h2>
            </Reveal>
            <div className="fgrid">
              <div>
                <h3 className="display h-s">Removable panels</h3>
                <p>Swing-out service doors and panels that come off, so nothing is buried behind something else.</p>
              </div>
              <div>
                <h3 className="display h-s">Labeled wiring</h3>
                <p>Clearly labeled harnesses and modular subsystems that can be traced and swapped in the field.</p>
              </div>
              <div>
                <h3 className="display h-s">Open diagnostics</h3>
                <p>The machine points the technician to the subsystem. No dealer-only laptop required.</p>
              </div>
              <div>
                <h3 className="display h-s">Standard parts</h3>
                <p>Commercially available components wherever practical, so parts can be found locally.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section wrap ticks">
          <div className="inner split">
            <Reveal className="split-copy">
              <span className="label">Operator cabin</span>
              <h2 className="display h-m">A modular cab.</h2>
              <p>
                Start with an open ROPS platform, move to a lighted canopy or a fully enclosed, climate-controlled cab. Inside, a
                digital control environment with easy-to-clean surfaces, smooth joystick operation and panoramic visibility.
              </p>
            </Reveal>
            <Reveal className="prose" delay={0.1}>
              <dl className="spec-list">
                <div>
                  <dt>Open</dt>
                  <dd>ROPS platform</dd>
                </div>
                <div>
                  <dt>Canopy</dt>
                  <dd>Lighted canopy</dd>
                </div>
                <div>
                  <dt>Enclosed</dt>
                  <dd>Climate-controlled cab</dd>
                </div>
                <div>
                  <dt>Autonomy</dt>
                  <dd>Removable sensor module, front and back of cab</dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </section>
      </div>

      {/* ---------- News ---------- */}
      <section className="section wrap" id="news">
        <div className="inner">
          <NewsCarousel
            items={news}
            title={
              <div className="head-stack">
                <Eyebrow n={4}>News</Eyebrow>
                <h2 className="display h-l">Field notes.</h2>
              </div>
            }
          />
        </div>
      </section>

      {/* ---------- Company ---------- */}
      <div id="company">
        <section className="section wrap ticks">
          <div className="inner split">
            <Reveal className="split-copy">
              <Eyebrow n={5}>Company</Eyebrow>
              <h2 className="display h-m">Built in Fort Wayne.</h2>
            </Reveal>
            <Reveal className="prose" delay={0.1}>
              <p>
                HeavyTech was founded by industry experts, engineers and stakeholders who saw an industry overdue for a new
                approach. Our mission is simple: design and build powerful, high-performance machines that are affordable and
                practical to own.
              </p>
              <p>
                Large manufacturers have enormous investments in existing platforms, factories and supply chains. A startup gets a
                blank sheet: whether a hydraulic function should still be powered the same way, whether mechanical complexity can
                become digital control, whether the machine can diagnose itself.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="section-tight wrap">
          <div className="inner photo-row">
            <figure className="photo" style={{ margin: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/company/expo_ivt.webp" alt="HeavyTech booth at IVT Expo with scale models of HT-1 and ARLO" loading="lazy" />
            </figure>
            <figure className="photo" style={{ margin: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/company/photo_3331.webp" alt="CAD model of a HeavyTech track assembly on an engineering workstation" loading="lazy" />
            </figure>
          </div>
          <div className="inner fgrid fgrid-3">
            <div>
              <h3 className="display h-s">Northeast Indiana</h3>
              <p>A region with deep manufacturing roots and the industrial base to build heavy equipment again.</p>
            </div>
            <div>
              <h3 className="display h-s">Domestic supply</h3>
              <p>US steel and domestic components, minimizing global dependencies to protect quality and keep the impact local.</p>
            </div>
            <div>
              <h3 className="display h-s">Partners</h3>
              <p>We don’t need to invent every component. We work with world-class suppliers and make the parts work together better.</p>
            </div>
          </div>
        </section>

        <section className="section wrap ticks join">
          <div className="inner join-grid">
            <span className="label">Reservations · Dealers · Investors</span>
            <h2 className="display h-l">Join the build.</h2>
            <p className="lede">Reserve a machine, ask about becoming a dealer, or follow along as the first HT-1 comes together.</p>
            <div className="ctas">
              <Link className="btn btn-solid" href="/reserve/">
                Reserve an HT-1 <span aria-hidden="true">↗</span>
              </Link>
              <Link className="btn" href="/reserve/#dealer">
                Dealer inquiry
              </Link>
              <a className="btn" href={site.investorPortal} target="_blank" rel="noopener">
                Investor portal <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
