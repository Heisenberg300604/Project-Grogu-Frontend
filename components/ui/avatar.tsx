"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { assetUrl } from "@/lib/assets";
import { cn } from "@/lib/utils";

export const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex size-9 shrink-0 overflow-hidden rounded-full border-2 border-line",
      className,
    )}
    {...props}
  />
));
Avatar.displayName = "Avatar";

export const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square size-full object-cover", className)}
    {...props}
  />
));
AvatarImage.displayName = "AvatarImage";

export const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex size-full items-center justify-center bg-azure text-xs font-bold text-ink",
      className,
    )}
    {...props}
  />
));
AvatarFallback.displayName = "AvatarFallback";

/** Flat fills for initials avatars; the same name always gets the same one. */
const FALLBACK_TONES = ["bg-gold", "bg-azure", "bg-mint", "bg-coral", "bg-lilac"] as const;

function toneForName(name: string) {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return FALLBACK_TONES[hash % FALLBACK_TONES.length];
}

/**
 * Convenience: initials avatar for a named user. `src` is a stored avatar link
 * (an `/uploads/...` path or an https URL); anything else shows the initials.
 */
export function UserAvatar({
  name,
  src,
  className,
}: {
  name: string;
  src?: string;
  className?: string;
}) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
  const imageSrc = assetUrl(src);
  return (
    <Avatar className={className}>
      {imageSrc ? <AvatarImage src={imageSrc} alt="" /> : null}
      <AvatarFallback aria-hidden className={toneForName(name)}>
        {initials || "?"}
      </AvatarFallback>
    </Avatar>
  );
}
