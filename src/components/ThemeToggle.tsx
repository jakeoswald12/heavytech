"use client";

/** Flips between light and dark. An explicit choice is saved and overrides the OS setting. */
export default function ThemeToggle() {
  const toggle = () => {
    const root = document.documentElement;
    const current =
      root.dataset.theme ?? (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    const next = current === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("ht-theme", next);
    } catch {
      /* storage unavailable: choice lasts for this page view */
    }
  };

  return (
    <button type="button" className="btn btn-ghost theme-toggle" onClick={toggle} aria-label="Switch between light and dark mode">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3a9 9 0 0 0 0 18z" fill="currentColor" />
      </svg>
    </button>
  );
}

/** Runs before first paint so a saved theme never flashes the wrong colors. */
export const themeScript = `try{var t=localStorage.getItem('ht-theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}`;
