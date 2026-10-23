import type { ReactNode } from "react";

/**
 * Rise-in as a block scrolls into view. Pure CSS (scroll-driven animation), so content is
 * always present in the HTML and simply shows without motion in browsers that lack support
 * or when the viewer prefers reduced motion.
 */
export default function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <div className={`reveal ${className}`} style={delay ? { animationRangeStart: `entry ${Math.round(delay * 100)}%` } : undefined}>
      {children}
    </div>
  );
}
