"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Resets route position for the cinematic audience pages on client navigation. */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => window.scrollTo(0, 0));
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}
