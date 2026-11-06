"use client";

import { ht1CadAnnotations, ht1CadModel, machines } from "@/data/site";
import { useSyncExternalStore } from "react";
import SplatViewer from "./SplatViewer";

const WIDE = "(min-width: 861px)";
function useWide() {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(WIDE);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(WIDE).matches,
    () => true,
  );
}

// Lens shift [right, up] as fractions of the canvas: wide screens put the machine right of the
// title; phones lift it into the space above the title.
const SHIFT_WIDE: [number, number] = [0.15, 0.05];
const SHIFT_NARROW: [number, number] = [-0.06, 0.13];
// Camera distance per layout (the canvas now spans the whole hero, so it needs pulling back).
const MODEL_WIDE = { ...ht1CadModel, fit: 1.38 };
const MODEL_NARROW = { ...ht1CadModel, fit: 1.9 };
// Callouts open one at a time as the machine turns: arm (03), then powertrain (01), then sensors (02).
// The arm's callout hands off once the camera has turned ~63° past the arm's outer face.
const CYCLE = { order: [2, 0, 1], leaveAt: 1.1 };

/** Home-page hero: the HT-1 from the founder's CAD in the studio look, turning slowly until the visitor drags it. */
export default function HeroViewer() {
  const wide = useWide();
  const m = machines.find((x) => x.slug === "ht-1");
  if (!m) return null;
  return (
    <SplatViewer
      model={wide ? MODEL_WIDE : MODEL_NARROW}
      poster={m.hero.src}
      alt={m.hero.alt}
      showStatus={false}
      annotations={ht1CadAnnotations}
      cycle={CYCLE}
      bleed={0.3}
      // Opens nearly front-on, turned slightly to the viewer's right, so the slow spin has room to play.
      startAngle={-0.36 * Math.PI}
      shift={wide ? SHIFT_WIDE : SHIFT_NARROW}
    />
  );
}
