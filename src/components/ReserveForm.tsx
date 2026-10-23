"use client";

import { useState } from "react";
import { machines } from "@/data/site";

type Errors = Partial<Record<"name" | "email" | "state", string>>;

/**
 * Reservation / inquiry form. There is no backend yet (static site), so it validates and
 * shows a confirmation. Wire `onSubmit` to a form service or Cloudflare Function to collect leads.
 */
export default function ReserveForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [done, setDone] = useState<{ name: string; interest: string } | null>(null);

  if (done) {
    return (
      <div className="confirm" role="status">
        <span className="label accent">Received</span>
        <p className="display h-s">Thanks, {done.name.split(" ")[0]}.</p>
        <p className="copy">
          We’ve noted your interest in {done.interest}. The HeavyTech team will be in touch as reservations open.
        </p>
        <button type="button" className="btn btn-ghost" style={{ width: "fit-content" }} onClick={() => setDone(null)}>
          Send another
        </button>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const name = String(f.get("name") ?? "").trim();
        const email = String(f.get("email") ?? "").trim();
        const state = String(f.get("state") ?? "").trim();
        const next: Errors = {};
        if (!name) next.name = "Enter your name.";
        if (!/.+@.+\..+/.test(email)) next.email = "Enter an email address like name@company.com.";
        if (!state) next.state = "Enter the state where the machine would work.";
        setErrors(next);
        if (Object.keys(next).length) return;
        const picked = f.getAll("machine").map(String);
        setDone({ name, interest: picked.length ? picked.join(", ") : "HeavyTech machines" });
      }}
    >
      <div className="form-grid">
        <div className="field">
          <label className="label" htmlFor="r-name">Name</label>
          <input id="r-name" name="name" autoComplete="name" aria-invalid={!!errors.name} aria-describedby="r-name-err" />
          <span id="r-name-err" className="form-note">{errors.name}</span>
        </div>
        <div className="field">
          <label className="label" htmlFor="r-email">Email</label>
          <input id="r-email" name="email" type="email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby="r-email-err" />
          <span id="r-email-err" className="form-note">{errors.email}</span>
        </div>
        <div className="field">
          <label className="label" htmlFor="r-company">Company</label>
          <input id="r-company" name="company" autoComplete="organization" />
        </div>
        <div className="field">
          <label className="label" htmlFor="r-state">State</label>
          <input id="r-state" name="state" autoComplete="address-level1" aria-invalid={!!errors.state} aria-describedby="r-state-err" />
          <span id="r-state-err" className="form-note">{errors.state}</span>
        </div>
        <fieldset className="field full" style={{ border: 0, padding: 0, margin: 0 }}>
          <legend className="label" style={{ marginBottom: 8 }}>Machines of interest</legend>
          <div className="choice-row">
            {machines.map((m) => (
              <label key={m.slug} className="choice">
                <input type="checkbox" name="machine" value={m.name} defaultChecked={m.slug === "ht-1"} />
                <span>{m.code} / {m.category}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="field">
          <label className="label" htmlFor="r-role">I’m a</label>
          <select id="r-role" name="role" defaultValue="Owner / operator">
            <option>Owner / operator</option>
            <option>Contractor / fleet manager</option>
            <option>Farm or ranch</option>
            <option>Rental company</option>
            <option>Dealer</option>
            <option>Municipality / government</option>
            <option>Investor</option>
            <option>Other</option>
          </select>
        </div>
        <div className="field">
          <label className="label" htmlFor="r-power">Preferred power</label>
          <select id="r-power" name="power" defaultValue="Not sure yet">
            <option>Not sure yet</option>
            <option>Battery-electric</option>
            <option>Hybrid</option>
            <option>Plug-in hybrid</option>
          </select>
        </div>
        <div className="field full">
          <label className="label" htmlFor="r-notes">What will it do?</label>
          <textarea id="r-notes" name="notes" placeholder="Typical jobs, hours per day, attachments, charging available on site…" />
        </div>
        <div className="full" style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          <button className="btn btn-solid" type="submit">
            Submit reservation <span aria-hidden="true">↗</span>
          </button>
          <span className="form-note">No deposit. We’ll contact you before anything is final.</span>
        </div>
      </div>
    </form>
  );
}
