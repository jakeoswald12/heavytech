"use client";

import { useState } from "react";
import { powertrains } from "@/data/site";

export default function PowertrainTabs() {
  const [active, setActive] = useState(powertrains[0].id);
  const current = powertrains.find((p) => p.id === active) ?? powertrains[0];

  return (
    <div className="pt">
      <div className="pt-tabs" role="tablist" aria-label="Powertrain options">
        {powertrains.map((p) => (
          <button
            key={p.id}
            id={`pt-tab-${p.id}`}
            role="tab"
            type="button"
            aria-selected={p.id === active}
            aria-controls="pt-panel"
            onClick={() => setActive(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>
      <dl className="pt-panel" id="pt-panel" role="tabpanel" aria-labelledby={`pt-tab-${current.id}`}>
        <dt>Best for</dt>
        <dd>{current.bestFor}</dd>
        <dt>Energy</dt>
        <dd>{current.energy}</dd>
        <dt>Why</dt>
        <dd>{current.why}</dd>
      </dl>
    </div>
  );
}
