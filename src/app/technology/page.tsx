import type { Metadata } from "next";
import PowertrainTabs from "@/components/PowertrainTabs";
import Reveal from "@/components/Reveal";
import { JoinBand, PageHeader, Split } from "@/components/blocks";

export const metadata: Metadata = {
  title: "Technology",
  description: "Interchangeable powertrains, point-of-use electro-hydraulics, software-defined controls and machine vision.",
};

export default function TechnologyPage() {
  return (
    <>
      <PageHeader
        label="Technology"
        title="One system."
        lede="HeavyTech isn’t swapping a diesel engine for a battery. Power generation, energy storage, electric drive, hydraulics and controls are designed together, around the work the machine actually does."
      />

      <Split
        id="powertrain"
        label="[ 01 ] Interchangeable powertrain"
        title="Swappable power."
        image={{ src: "/images/technology/guts.webp", alt: "Swappable power module with engine, generator and battery", caption: "Rear power module" }}
      >
        <p>
          Every machine shares the same electric architecture up front. The rear power module swaps between battery-electric,
          hybrid and plug-in hybrid, so the same machine can be set up for a warehouse, a remote site or anything in between.
        </p>
        <PowertrainTabs />
      </Split>

      <section className="section wrap band ticks">
        <Reveal className="inner statement-grid">
          <span className="label">[ 02 ] Duty cycle</span>
          <h2 className="display h-l">Sized to the job.</h2>
          <p className="lede">
            Two machines that look identical can need very different energy. We size the battery, generator, cooling and power
            electronics around the real duty cycle: load, travel, hydraulics, idle time, heat and terrain.
          </p>
        </Reveal>
      </section>

      <Split
        id="electro-hydraulics"
        flip
        label="[ 03 ] Electro-hydraulics · Patent pending"
        title="Power on demand."
        image={{ src: "/images/technology/slide2.webp", alt: "Electric motor coupled to a hydraulic pump with its control board", caption: "Point-of-use electric pump" }}
      >
        <p>
          A dedicated electric motor drives each work-function pump. Traditional machines run one pump continuously and throttle
          it with directional and pressure control valves, turning energy into heat. HeavyTech’s valveless digital control gives
          every function precise, instant power, and the pump only spins when you’re doing work.
        </p>
        <p>Compact and modular, the system also simplifies diagnostics and service.</p>
      </Split>

      <section className="section wrap">
        <div className="inner duo" style={{ marginTop: 0 }}>
          <figure>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="render" src="/images/technology/powertrain.webp" alt="HeavyTech powertrain modules arranged on a chassis base" loading="lazy" />
            <figcaption className="label">Modular powertrain</figcaption>
          </figure>
          <figure>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="render" src="/images/technology/slide3.webp" alt="Valveless hydraulic manifold" loading="lazy" />
            <figcaption className="label">Valveless digital control</figcaption>
          </figure>
        </div>
      </section>

      <section className="section wrap band" id="intelligence">
        <div className="inner">
          <span className="label">[ 04 ] Intelligence</span>
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

      <JoinBand />
    </>
  );
}
