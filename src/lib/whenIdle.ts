/** Runs `fn` after the page has loaded and the browser is idle (or after `delay` ms at most). */
export function whenIdle(fn: () => void, delay: number) {
  let t: ReturnType<typeof setTimeout> | undefined;
  let id: number | undefined;
  const arm = () => {
    t = setTimeout(() => {
      if ("requestIdleCallback" in window) id = window.requestIdleCallback(fn, { timeout: 2000 });
      else fn();
    }, delay);
  };
  if (document.readyState === "complete") arm();
  else window.addEventListener("load", arm, { once: true });
  return () => {
    window.removeEventListener("load", arm);
    clearTimeout(t);
    if (id !== undefined) window.cancelIdleCallback(id);
  };
}
