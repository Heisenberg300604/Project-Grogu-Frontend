"use client";

import * as React from "react";

const DURATION_MS = 1000;

/**
 * A whole number that counts up to its value the first time it is shown. The
 * final value is what renders on the server and for anyone who prefers reduced
 * motion, so the figure is always correct even if the animation never runs.
 */
export function AnimatedNumber({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const [display, setDisplay] = React.useState(value);

  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const startedAt = performance.now();
    const step = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / DURATION_MS);
      setDisplay(Math.round(value * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <span className={className}>{display.toLocaleString("en-US")}</span>;
}
