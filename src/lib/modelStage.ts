// Shared state for the sticky 3D HT-1 that spans the Technology and Service sections on wide screens:
// each feature list reports its active item, and the stage shows whichever section is on screen.
type State = { owner: string; active: Record<string, number> };

let state: State = { owner: "", active: {} };
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const modelStage = {
  get: () => state,
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  setActive(id: string, index: number) {
    if (state.active[id] === index) return;
    state = { ...state, active: { ...state.active, [id]: index } };
    emit();
  },
  setOwner(id: string) {
    if (state.owner === id) return;
    state = { ...state, owner: id };
    emit();
  },
};

const WIDE = "(min-width: 861px)";
/** True on screens wide enough for the sticky model beside the lists. */
export function subscribeWide(cb: () => void) {
  const m = window.matchMedia(WIDE);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
}
export const getWide = () => window.matchMedia(WIDE).matches;
