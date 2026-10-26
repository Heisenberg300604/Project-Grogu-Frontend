import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border-2 font-bold [&_svg]:size-3 [&_svg]:shrink-0",
  {
    variants: {
      tone: {
        default: "border-line bg-surface text-surface-foreground",
        muted: "border-border bg-elevated text-muted-foreground",
        primary: "border-line bg-grape text-white",
        success: "border-line bg-mint text-ink",
        warning: "border-line bg-gold text-ink",
        destructive: "border-line bg-coral text-ink",
        info: "border-line bg-azure text-ink",
        outline: "border-line bg-transparent text-foreground",
        /** For badges sitting on top of game art. */
        overlay: "border-line bg-surface text-surface-foreground",
      },
      size: {
        sm: "px-2 py-0.5 text-[11px] leading-4",
        md: "px-2.5 py-1 text-xs leading-4",
      },
    },
    defaultVariants: { tone: "default", size: "sm" },
  },
);

const DOT_TONE = {
  default: "bg-ink dark:bg-foreground",
  muted: "bg-muted-foreground",
  primary: "bg-white",
  success: "bg-ink",
  warning: "bg-ink",
  destructive: "bg-ink",
  info: "bg-ink",
  outline: "bg-foreground",
  overlay: "bg-mint a-live",
} as const;

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /** Leading status dot. Use for live/state badges, not for labels. */
  dot?: boolean;
}

export function Badge({
  className,
  tone,
  size,
  dot,
  children,
  ...props
}: BadgeProps) {
  // A live status (recruiting, in progress) reads as a white chip with a
  // pulsing green dot, as in the design.
  const live = dot && tone === "success";
  return (
    <span
      className={cn(
        badgeVariants({ tone, size }),
        live && "bg-surface text-surface-foreground",
        className,
      )}
      {...props}
    >
      {dot && (
        <span
          aria-hidden
          className={cn(
            "size-2 rounded-full",
            live ? "a-live bg-mint" : DOT_TONE[tone ?? "default"],
          )}
        />
      )}
      {children}
    </span>
  );
}
