"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Chunky segmented progress bar (XP / level progress). Segments fill one after
 * another when the bar scrolls into view.
 *
 * Value is a 0–1 fraction. Pass `label` to name the bar for assistive tech.
 */
export function Segments({
  value,
  total = 20,
  label,
  className,
  fillClassName = "bg-primary",
}: {
  value: number;
  total?: number;
  label?: string;
  className?: string;
  fillClassName?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [seen, setSeen] = React.useState(false);
  const clamped = Math.max(0, Math.min(1, value));
  const filled = Math.round(clamped * total);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setSeen(true);
        observer.disconnect();
      },
      { threshold: 0.12 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      role="progressbar"
      aria-label={label}
      aria-valuenow={Math.round(clamped * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("flex gap-[3px]", className)}
    >
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "h-4 flex-1 rounded-[3px] border-2 border-line transition-colors duration-[250ms]",
            seen && i < filled ? fillClassName : "bg-elevated",
          )}
          style={{ transitionDelay: `${i * 45}ms` }}
        />
      ))}
    </div>
  );
}
