"use client";

import * as React from "react";
import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

/** Read-only star rating. */
export function RatingStars({
  value,
  max = 5,
  className,
  size = "sm",
}: {
  value: number;
  max?: number;
  className?: string;
  size?: "sm" | "md";
}) {
  const rounded = Math.round(value);
  return (
    <span
      className={cn("inline-flex items-center gap-0.5", className)}
      aria-label={`${value} out of ${max}`}
      role="img"
    >
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          aria-hidden
          className={cn(
            size === "sm" ? "size-3.5" : "size-5",
            i < rounded
              ? "fill-gold text-ink dark:text-line"
              : "fill-transparent text-border",
          )}
        />
      ))}
    </span>
  );
}

/** Interactive 1–5 rating using an accessible radio group. */
export function RatingInput({
  value,
  onChange,
  max = 5,
  labelledBy,
}: {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  labelledBy?: string;
}) {
  const [hovered, setHovered] = React.useState(0);
  // Preview the hovered value so the control feels responsive before commit.
  const shown = hovered || value;

  return (
    <div
      role="radiogroup"
      aria-labelledby={labelledBy}
      className="inline-flex items-center gap-1"
      onMouseLeave={() => setHovered(0)}
    >
      {Array.from({ length: max }).map((_, i) => {
        const rating = i + 1;
        const active = rating <= shown;
        return (
          <button
            key={rating}
            type="button"
            role="radio"
            aria-checked={value === rating}
            aria-label={`${rating} star${rating > 1 ? "s" : ""}`}
            onClick={() => onChange(rating)}
            onMouseEnter={() => setHovered(rating)}
            className="rounded p-0.5 transition-transform duration-[120ms] hover:scale-125 active:scale-95"
          >
            <Star
              className={cn(
                "size-7 transition-colors duration-[120ms]",
                active
                  ? "fill-gold text-ink dark:text-line"
                  : "fill-transparent text-border",
              )}
            />
          </button>
        );
      })}
      <span className="ml-2.5 text-sm tabular-nums text-muted-foreground">
        {value ? `${value}/${max}` : "—"}
      </span>
    </div>
  );
}

/** Horizontal bar for an averaged rating dimension (analytics). */
export function RatingBar({
  label,
  value,
  max = 5,
}: {
  label: string;
  value: number;
  max?: number;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-bold tabular-nums">{value.toFixed(1)}</span>
      </div>
      <div className="h-3.5 overflow-hidden rounded-full border-2 border-line bg-elevated">
        <div
          className="h-full rounded-full border-r-2 border-line bg-primary transition-[width] duration-700 ease-[var(--ease-out-soft)]"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
