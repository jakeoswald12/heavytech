import { machines } from "@/data/site";
import SplatViewer from "./SplatViewer";

/** Home-page hero: the HT-1 in 3D, turning slowly until the visitor drags it. */
export default function HeroViewer() {
  const m = machines.find((x) => x.slug === "ht-1" && x.model);
  if (!m?.model) return null;
  return <SplatViewer model={m.model} poster={m.hero.src} alt={m.hero.alt} showStatus={false} />;
}
