import { ht1Annotations, machines } from "@/data/site";
import SplatViewer from "./SplatViewer";

const HERO_OFFSET: [number, number] = [-20, -10];

/** Home-page hero: the HT-1 in 3D, turning slowly until the visitor drags it. */
export default function HeroViewer() {
  const m = machines.find((x) => x.slug === "ht-1" && x.model);
  if (!m?.model) return null;
  return (
    <SplatViewer
      model={m.model}
      poster={m.hero.src}
      alt={m.hero.alt}
      showStatus={false}
      annotations={ht1Annotations}
      bleed={0.3}
      // Opens nearly front-on, turned slightly to the viewer's right, so the slow spin has room to play.
      startAngle={-0.36 * Math.PI}
      offset={HERO_OFFSET}
    />
  );
}
