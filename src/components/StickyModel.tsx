"use client";

import { useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import { getWide, modelStage, subscribeWide } from "@/lib/modelStage";
import TechModel, { type FeatureView } from "./TechModel";

export type StageSection = { id: string; views: FeatureView[]; fallback: { src: string; alt: string }[] };

/**
 * One 3D HT-1 pinned to the right of the screen while the Technology and Service sections scroll past.
 * It follows whichever section is on screen and that section's active feature, so moving from one
 * section to the next is just another turn of the same model. Wide screens only; phones keep a model
 * inline in each section.
 */
export default function StickyModel({ sections }: { sections: StageSection[] }) {
  const wide = useSyncExternalStore(subscribeWide, getWide, () => true);
  const state = useSyncExternalStore(modelStage.subscribe, modelStage.get, modelStage.get);
  const ref = useRef<HTMLDivElement>(null);

  const views = useMemo(() => sections.flatMap((s) => s.views), [sections]);
  const fallback = useMemo(() => sections.flatMap((s) => s.fallback), [sections]);
  const offsets = useMemo(() => {
    const o: Record<string, number> = {};
    let n = 0;
    for (const s of sections) {
      o[s.id] = n;
      n += s.views.length;
    }
    return o;
  }, [sections]);

  // The section whose top has passed the middle of the screen owns the stage.
  useEffect(() => {
    const pick = () => {
      let owner = sections[0].id;
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.5) owner = s.id;
      }
      modelStage.setOwner(owner);
    };
    pick();
    window.addEventListener("scroll", pick, { passive: true });
    window.addEventListener("resize", pick);
    return () => {
      window.removeEventListener("scroll", pick);
      window.removeEventListener("resize", pick);
    };
  }, [sections]);

  if (!wide) return null;
  const owner = state.owner || sections[0].id;
  const active = (offsets[owner] ?? 0) + (state.active[owner] ?? 0);
  return (
    <div className="model-stage" aria-hidden="false" ref={ref}>
      <div className="model-stage-pin">
        {/* Framed for a full-height pane: camera further back, machine shifted down toward the lists. */}
        <TechModel active={active} views={views} fallback={fallback} dist={2.5} shiftY={-0.075} />
      </div>
    </div>
  );
}
