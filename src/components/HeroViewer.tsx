"use client";

import { useState } from "react";
import { machines } from "@/data/site";
import SplatViewer from "./SplatViewer";

const withModels = machines.filter((m) => m.model);

/** Home-page 3D stage with a picker for each machine that has a model. */
export default function HeroViewer() {
  const [slug, setSlug] = useState(withModels[0]?.slug);

  const m = withModels.find((x) => x.slug === slug) ?? withModels[0];
  if (!m?.model) return null;

  return (
    <>
      {/* Remounting per machine gives each model a fresh renderer, so the previous one never lingers. */}
      <SplatViewer key={m.slug} model={m.model} poster={m.hero.src} alt={m.hero.alt} />
      <div className="seg hero-picker" role="group" aria-label="Machine shown in 3D">
        {withModels.map((x) => (
          <button key={x.slug} type="button" aria-pressed={x.slug === m.slug} onClick={() => setSlug(x.slug)}>
            {x.name}
          </button>
        ))}
      </div>
    </>
  );
}
