import type { Metadata } from "next";
import { JoinBand, MachineCard, PageHeader } from "@/components/blocks";
import { machines } from "@/data/site";

export const metadata: Metadata = {
  title: "Machines",
  description: "HT-1 compact track loader, ARLO articulated loader and the DefenseX platform, all on one hybrid and electric architecture.",
};

export default function MachinesPage() {
  return (
    <>
      <PageHeader
        label="The platform"
        title="One architecture."
        lede="Construction, farm, ranch and defense machines that share the same power modules, electro-hydraulics, controls and service approach. Parts, training and diagnostics carry across the fleet."
      />
      <section className="section-tight wrap">
        <div className="inner machines-grid">
          {machines.map((m, i) => (
            <MachineCard key={m.slug} m={m} index={i} />
          ))}
        </div>
      </section>
      <section className="section wrap band">
        <div className="inner">
          <span className="label">Shared across every machine</span>
          <div className="fgrid">
            <div>
              <h3 className="display h-s">Power modules</h3>
              <p>Battery-electric, hybrid and plug-in hybrid modules that swap at the rear of the machine.</p>
            </div>
            <div>
              <h3 className="display h-s">Electro-hydraulics</h3>
              <p>An electric motor and pump for each work function, controlled digitally.</p>
            </div>
            <div>
              <h3 className="display h-s">Open diagnostics</h3>
              <p>The machine points the technician to the problem. No proprietary tools.</p>
            </div>
            <div>
              <h3 className="display h-s">Autonomy ready</h3>
              <p>Sensor mounting and controls designed for remote and autonomous operation.</p>
            </div>
          </div>
        </div>
      </section>
      <JoinBand />
    </>
  );
}
