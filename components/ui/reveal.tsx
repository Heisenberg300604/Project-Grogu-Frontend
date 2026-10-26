"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Fade-and-rise on scroll.
 *
 * Content is server-rendered visible. Only once mounted do we hide the blocks
 * that are still below the fold, then reveal them as they scroll into view, so
 * nothing flashes and nothing stays hidden if scripting is slow or absent.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  /** Stagger in ms, for siblings that should arrive one after another. */
  delay?: number;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [state, setState] = React.useState<"visible" | "hidden" | "in">("visible");

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;

    setState("hidden");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setState("in");
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
      className={cn(state !== "visible" && "reveal", state === "in" && "in", className)}
      style={state === "visible" ? undefined : { transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
