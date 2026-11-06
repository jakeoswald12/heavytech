import { ht1CadAnnotations, ht1CadModel, machines } from "@/data/site";
import SplatViewer from "./SplatViewer";

const HERO_OFFSET: [number, number] = [-20, -10];

/** Home-page hero: the HT-1 from the founder's CAD in the studio look, turning slowly until the visitor drags it. */
export default function HeroViewer() {
  const m = machines.find((x) => x.slug === "ht-1");
  if (!m) return null;
  return (
    <SplatViewer
      model={ht1CadModel}
      poster={m.hero.src}
      alt={m.hero.alt}
      showStatus={false}
      annotations={ht1CadAnnotations}
      bleed={0.3}
      // Opens nearly front-on, turned slightly to the viewer's right, so the slow spin has room to play.
      startAngle={-0.36 * Math.PI}
      offset={HERO_OFFSET}
    />
  );
}
