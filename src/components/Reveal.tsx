import type { ReactNode } from "react";

type Variant = "up" | "fade" | "line" | "right";

/**
 * Wraps content in an element that eases in as it scrolls into view (see ScrollReveal).
 * `delay` is in seconds, for staggering siblings.
 */
export default function Reveal({
  children,
  delay = 0,
  className = "",
  variant = "up",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  variant?: Variant;
}) {
  return (
    <div className={className} data-reveal={variant} style={delay ? ({ "--d": `${Math.round(delay * 1000)}ms` } as React.CSSProperties) : undefined}>
      {children}
    </div>
  );
}

/** Inline style for staggering any element marked with data-reveal. */
export const stagger = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;
