import Link from "next/link";
import HeroViewer from "@/components/HeroViewer";
import FeatureRotator, { type Feature } from "@/components/FeatureRotator";
import NewsCarousel from "@/components/NewsCarousel";
import { MachineCard } from "@/components/blocks";
import { machines, news, site } from "@/data/site";

const technology: Feature[] = [
  {
    title: "Software-defined controls",
    body: "Real-time diagnostics, seamless upgrades and an intuitive operator interface. The machine isolates a problem to a subsystem and tells the technician.",
    image: { src: "/images/machines/arlo_main.webp", alt: "HeavyTech power and hydraulic modules" },
  },
  {
    title: "Machine vision",
    body: "Camera-based sensing that understands machine state and attachment position without traditional sensors, built for operator assistance and automation.",
    image: { src: "/images/machines/ctl_main.webp", alt: "HeavyTech HT-1 compact track loader" },
  },
  {
    title: "Autonomy ready",
    body: "A sensor module mounts front and back of the cab. Add it or remove it to enable autonomous functions on your terms.",
    image: { src: "/images/machines/defx1.webp", alt: "DefenseX autonomy-ready tracked platform" },
  },
  {
    title: "Swappable power",
    body: "The front of every machine is the same electric architecture; the back, where the power lives, swaps between battery-electric, hybrid and plug-in hybrid. Pick the energy source the job calls for.",
    image: { src: "/images/technology/powertrain.webp", alt: "ARLO loader shown transparent, revealing its modular powertrain" },
  },
  {
    title: "Power on demand",
    body: "A dedicated electric motor drives each work-function pump, so the pump only spins when you’re working and every function gets precise, instant power.",
    image: { src: "/images/technology/slide2.webp", alt: "Electric motor coupled to a hydraulic pump with its control board" },
  },
  {
    title: "Valveless control",
    body: "Real-time, high-resolution control of every function without directional or pressure control valves: less energy lost as heat, faster response, simpler diagnostics.",
    image: { src: "/images/technology/slide3.webp", alt: "Valveless hydraulic manifold" },
  },
];

const service: Feature[] = [
  {
    title: "Removable panels",
    body: "Swing-out service doors and panels that come off, so nothing is buried behind something else.",
    image: { src: "/images/machines/ctl_access.webp", alt: "HT-1 with service panels open showing the power module" },
  },
  {
    title: "Labeled wiring",
    body: "Clearly labeled harnesses and modular subsystems that can be traced and swapped in the field.",
    image: { src: "/images/technology/guts.webp", alt: "HeavyTech power module with labeled wiring" },
  },
  {
    title: "Open diagnostics",
    body: "The machine points the technician to the subsystem. No dealer-only laptop required.",
    image: { src: "/images/machines/arlo_main.webp", alt: "HeavyTech power and hydraulic modules" },
  },
  {
    title: "Standard parts",
    body: "Commercially available components wherever practical, so parts can be found locally.",
    image: { src: "/images/technology/slide2.webp", alt: "Commercially available electric motor and pump" },
  },
];

const company: Feature[] = [
  {
    title: "Northeast Indiana",
    body: "A region with deep manufacturing roots and the industrial base to build heavy equipment again.",
    image: { src: "/images/company/expo_move.webp", alt: "HeavyTech team at the MOVE America conference" },
    kind: "photo",
  },
  {
    title: "Domestic supply",
    body: "US steel and domestic components, minimizing global dependencies to protect quality and keep the impact local.",
    image: { src: "/images/company/photo_3331.webp", alt: "CAD model of a HeavyTech track assembly on an engineering workstation" },
    kind: "photo",
  },
  {
    title: "Partners",
    body: "We don’t need to invent every component. We work with world-class suppliers and make the parts work together better.",
    image: { src: "/images/company/expo_ivt.webp", alt: "HeavyTech booth at IVT Expo with scale models of HT-1 and ARLO" },
    kind: "photo",
  },
];

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
      <section className="section section-lineup" id="machines">
        <div className="wrap">
          <div className="inner head-stack lineup-head">
            <Eyebrow n={1}>Machines</Eyebrow>
            <h2 className="display h-l">The lineup.</h2>
          </div>
        </div>
        <div className="machines-grid">
          {machines.map((m, i) => (
            <MachineCard key={m.slug} m={m} index={i} />
          ))}
        </div>
      </section>

      {/* ---------- Technology ---------- */}
      <section className="feature-section wrap" id="technology">
        <div className="inner feature-inner">
          <div className="head-stack">
            <Eyebrow n={2}>Technology</Eyebrow>
            <h2 className="display h-l one-line">A new architecture.</h2>
          </div>
          <FeatureRotator features={technology} label="Technology features" />
        </div>
      </section>

      {/* ---------- Service ---------- */}
      <section className="feature-section wrap" id="service">
        <div className="inner feature-inner">
          <div className="head-stack">
            <Eyebrow n={3}>Service</Eyebrow>
            <h2 className="display h-l one-line">Right to repair.</h2>
            <p className="lede">
              The people who operate and depend on their machines every day should be able to repair them. Open diagnostics and
              full service documentation let operators, fleet mechanics and independent shops keep the machine working without
              proprietary tools.
            </p>
          </div>
          <FeatureRotator features={service} label="Service features" />
        </div>
      </section>

      {/* ---------- Company ---------- */}
      <section className="feature-section wrap" id="company">
        <div className="inner feature-inner">
          <div className="head-stack">
            <Eyebrow n={4}>Company</Eyebrow>
            <h2 className="display h-l one-line">Made in the Midwest.</h2>
            <p className="lede">
              HeavyTech was founded by industry experts and engineers who saw an industry overdue for a new approach: powerful,
              high-performance machines that are affordable and practical to own, designed from a blank sheet and built in Fort
              Wayne, Indiana.
            </p>
          </div>
          <FeatureRotator features={company} label="Company" />
        </div>
      </section>

      {/* ---------- News ---------- */}
      <section className="section wrap" id="news">
        <div className="inner">
          <NewsCarousel
            items={news}
            title={
              <div className="head-stack">
                <Eyebrow n={5}>News</Eyebrow>
                <h2 className="display h-l">Field notes.</h2>
              </div>
            }
          />
        </div>
      </section>

      {/* ---------- Join ---------- */}
      <section className="section wrap join">
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
    </>
  );
}
