import * as React from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { AnimatedNumber } from "@/components/ui/animated-number";

/**
 * Metric tile for dashboards: a coloured icon chip, a HUD label and a big
 * number that counts up. Whole numbers animate; anything else (money, "—")
 * renders as given. The chip colour comes from the tile's position in its
 * `StatCardGrid`, so a row of tiles reads gold / blue / green / pink.
 */
export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  /** Draws attention to a number that needs action (e.g. pending applicants). */
  emphasis = false,
  className,
}: {
  label: string;
  value: React.ReactNode;
  icon?: LucideIcon;
  hint?: string;
  emphasis?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "card-lift a-pop rounded-xl border-2 border-line p-4 shadow-md",
        emphasis ? "bg-primary-soft" : "bg-surface",
        className,
      )}
    >
      <div className="hud flex min-h-6 items-center gap-2 text-muted-foreground">
        {Icon && (
          <span
            className={cn(
              "stat-chip grid size-6 shrink-0 place-items-center rounded-md border-2 border-line bg-gold text-ink",
            )}
          >
            <Icon className="size-3.5" aria-hidden />
          </span>
        )}
        <span className="truncate">{label}</span>
      </div>
      <p className="mt-3 font-display text-4xl font-extrabold leading-none tabular-nums">
        {typeof value === "number" ? <AnimatedNumber value={value} /> : value}
      </p>
      {hint && (
        <p className="mt-2 truncate text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}

export function StatCardGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4",
        // Tiles pop in one after another.
        "[&>*:nth-child(2)]:[animation-delay:80ms] [&>*:nth-child(3)]:[animation-delay:160ms] [&>*:nth-child(4)]:[animation-delay:240ms]",
        "[&>*:nth-child(4n+2)_.stat-chip]:bg-azure [&>*:nth-child(4n+3)_.stat-chip]:bg-mint [&>*:nth-child(4n)_.stat-chip]:bg-coral",
        className,
      )}
    >
      {children}
    </div>
  );
}
