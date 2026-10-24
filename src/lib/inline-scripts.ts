// Tiny scripts inlined in <head> so they run before first paint. They live in a plain (non-client)
// module because strings exported from a "use client" file can't be read by the server layout.

/** Applies a saved light/dark choice so the page never flashes the wrong theme. */
export const themeScript = `try{var t=localStorage.getItem('ht-theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}`;

/** Arms the scroll-reveal starting state (skipped when motion is reduced or the observer is missing). */
export const revealScript = `try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&'IntersectionObserver' in window)document.documentElement.classList.add('reveal-ready')}catch(e){}`;

/** Always open at the top (unless a section link was used) instead of restoring an old scroll spot. */
export const scrollTopScript = `try{if('scrollRestoration' in history)history.scrollRestoration='manual';if(!location.hash){scrollTo(0,0);addEventListener('load',function(){if(!location.hash&&scrollY<200)scrollTo(0,0)})}}catch(e){}`;
