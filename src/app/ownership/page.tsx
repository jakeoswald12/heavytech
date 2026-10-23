import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import { JoinBand, PageHeader, Split } from "@/components/blocks";

export const metadata: Metadata = {
  title: "Ownership",
  description: "Right to repair, complete service access, open diagnostics and a modular cab. Machines that are easier to own.",
};

export default function OwnershipPage() {
  return (
    <>
      <PageHeader
        label="Ownership"
        title="Easier to own."
        lede="Technology should make equipment simpler to own, not more dependent on the manufacturer. Every HeavyTech design decision is checked against what it costs the person who has to keep the machine running."
      />

      <Split
        id="repair"
        label="[ 01 ] Right to repair"
        title="Right to repair."
        image={{ src: "/images/machines/ctl_access.webp", alt: "HT-1 with service panels open showing the power module", caption: "HT-1 · Service access" }}
      >
        <p>
          The people who operate and depend on their machines every day should be able to repair them. HeavyTech machines ship
          with open diagnostics and detailed service documentation, so operators, fleet mechanics and independent shops can
          work on them without proprietary tools or restrictive software.
        </p>
        <p>
          Where we can, we use recognizable, commercially available components instead of hiding them behind our own part
          numbers.
        </p>
      </Split>

      <section className="section wrap band">
        <div className="inner">
          <span className="label">[ 02 ] Complete access</span>
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
            <span className="label">[ 03 ] Operator cabin</span>
            <h2 className="display h-m">A modular cab.</h2>
            <p>
              Cabs are modular and upgradeable: start with an open ROPS platform, move to a lighted canopy or a fully enclosed,
              climate-controlled cab. Inside, a digital control environment with easy-to-clean surfaces, smooth joystick operation
              and panoramic visibility.
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

      <section className="section wrap band">
        <Reveal className="inner statement-grid">
          <span className="label">[ 04 ] Total cost</span>
          <h2 className="display h-l">Less downtime.</h2>
          <p className="lede">
            Faster diagnosis, parts you can buy locally and power that only runs when the machine is working all point the same
            way: lower cost of ownership and machines that keep working when and where they’re needed.
          </p>
        </Reveal>
      </section>

      <JoinBand />
    </>
  );
}
