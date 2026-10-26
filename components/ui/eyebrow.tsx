import * as React from "react";

import { cn } from "@/lib/utils";

const TONES = {
  grape: "bg-grape",
  gold: "bg-gold",
  mint: "bg-mint",
  coral: "bg-coral",
  azure: "bg-azure",
} as const;

/** Pixel-font section label with a blinking square, as in the design. */
export function Eyebrow({
  children,
  tone = "grape",
  className,
}: {
  children: React.ReactNode;
  tone?: keyof typeof TONES;
  className?: string;
}) {
  return (
    <div className={cn("hud mb-4 flex items-center gap-2 text-foreground", className)}>
      <span aria-hidden className={cn("a-blink inline-block size-2.5", TONES[tone])} />
      {children}
    </div>
  );
}
