import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import { JoinBand, PageHeader } from "@/components/blocks";

export const metadata: Metadata = {
  title: "Company",
  description: "HeavyTech is a Fort Wayne, Indiana company building hybrid and electric off-highway machines.",
};

export default function CompanyPage() {
  return (
    <>
      <PageHeader
        label="Company"
        title="Built in Fort Wayne."
        lede="HeavyTech was founded by industry experts, engineers and stakeholders who saw an industry overdue for a new approach."
      />

      <section className="section wrap ticks">
        <div className="inner split">
          <Reveal className="split-copy">
            <span className="label">[ 01 ] Our story</span>
            <h2 className="display h-m">Why we exist.</h2>
          </Reveal>
          <Reveal className="prose" delay={0.1}>
            <p>
              Our mission is simple: design and build powerful, high-performance machines that are both affordable and
              responsible to own. Many of the hybrid and electric technologies inside them were developed in-house.
            </p>
            <p>
              Large manufacturers have incredible engineering organizations, but they also have enormous investments in existing
              platforms, factories and supply chains. A startup gets a blank sheet: whether a hydraulic function should still be
              powered the same way, whether mechanical complexity can become digital control, whether the machine can diagnose
              itself.
            </p>
            <p>
              We offer gas/diesel hybrid or pure electric power, highly fuel-efficient operation and machines designed with the
              right to repair in mind. <strong>Let’s get to work.</strong>
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section wrap band">
        <div className="inner">
          <div className="photo-row">
            <figure className="photo" style={{ margin: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/company/expo_ivt.webp" alt="HeavyTech booth at IVT Expo with scale models of HT-1 and ARLO" loading="lazy" />
            </figure>
            <figure className="photo" style={{ margin: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/company/photo_3331.webp" alt="CAD model of a HeavyTech track assembly on an engineering workstation" loading="lazy" />
            </figure>
          </div>
        </div>
      </section>

      <section className="section wrap">
        <div className="inner">
          <span className="label">[ 02 ] Where we build</span>
          <Reveal>
            <h2 className="display h-l" style={{ marginTop: 18 }}>
              Made in the Midwest.
            </h2>
          </Reveal>
          <div className="fgrid fgrid-3">
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
        </div>
      </section>

      <section className="section wrap band ticks">
        <div className="inner split">
          <Reveal className="split-copy">
            <span className="label">[ 03 ] How we work with partners</span>
            <h2 className="display h-m">More than one path.</h2>
          </Reveal>
          <Reveal className="prose" delay={0.1}>
            <p>
              HeavyTech builds complete machines, and the technology underneath them, from power electronics and energy management
              to digitally controlled hydraulics and machine intelligence, can apply across many kinds of equipment.
            </p>
            <dl className="spec-list">
              <div>
                <dt>Machines</dt>
                <dd>HeavyTech-built equipment for construction, farm, ranch and defense</dd>
              </div>
              <div>
                <dt>Integration</dt>
                <dd>Technology integration with equipment manufacturers</dd>
              </div>
              <div>
                <dt>Engineering</dt>
                <dd>Engineering programs for partners</dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </section>

      <JoinBand />
    </>
  );
}
