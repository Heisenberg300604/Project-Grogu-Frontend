import { cn } from "@/lib/utils";

/** Grogu's signal aperture: a precise, architectural G monogram. */
export function GroguMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={cn("size-5", className)} aria-hidden>
      <path d="M25.5 9.4A10.7 10.7 0 1 0 24.8 23" stroke="currentColor" strokeWidth="2.35" strokeLinecap="square" />
      <path d="M17.1 16.5H26.2V24.7" stroke="currentColor" strokeWidth="2.35" strokeLinecap="square" strokeLinejoin="miter" />
      <path d="M8.3 5.8H12.1M5.8 8.3V12.1" stroke="currentColor" strokeWidth="1.15" strokeLinecap="square" opacity=".48" />
      <circle cx="25.9" cy="16.5" r="1.55" fill="var(--color-secondary)" />
    </svg>
  );
}
