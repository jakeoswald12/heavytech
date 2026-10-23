import type { Metadata } from "next";
import ReserveForm from "@/components/ReserveForm";
import { PageHeader } from "@/components/blocks";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Reserve",
  description: "Reserve a HeavyTech machine, ask about becoming a dealer, or reach the investor portal.",
};

export default function ReservePage() {
  return (
    <>
      <PageHeader
        label="Reservations"
        title="Reserve."
        lede="Tell us about the work. We’ll keep you posted as the first machines come together and reservations open."
      />
      <section className="section-tight wrap">
        <div className="inner split" style={{ alignItems: "start" }}>
          <div className="split-copy">
            <span className="label">[ 01 ] Reserve a machine</span>
            <h2 className="display h-m">Your machine.</h2>
            <p>Pick the machines you’re interested in and how you’d power them. The more we know about the job, the better we can size it.</p>
          </div>
          <ReserveForm />
        </div>
      </section>
      <section className="section wrap band" id="dealer">
        <div className="inner split">
          <div className="split-copy">
            <span className="label">[ 02 ] Dealers</span>
            <h2 className="display h-m">Sell HeavyTech.</h2>
            <p>
              We’re talking with equipment dealers who want a hybrid and electric line built around serviceability. Choose “Dealer”
              in the form above, or email us.
            </p>
          </div>
          <dl className="spec-list">
            <div>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>{site.location}</dd>
            </div>
          </dl>
        </div>
      </section>
      <section className="section wrap ticks" id="investors">
        <div className="inner split">
          <div className="split-copy">
            <span className="label">[ 03 ] Investors</span>
            <h2 className="display h-m">Invest.</h2>
            <p>Investor updates, documents and offering details live on the HeavyTech investor portal.</p>
          </div>
          <div>
            <a className="btn btn-solid" href={site.investorPortal} target="_blank" rel="noopener">
              Investor portal <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
