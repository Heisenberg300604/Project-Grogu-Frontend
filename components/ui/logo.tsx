import Link from "next/link";

import { cn } from "@/lib/utils";
import { SITE } from "@/lib/constants";
import { GroguMark } from "@/components/ui/grogu-mark";

/**
 * Grogu wordmark. The mark is a signal waypoint: the connection between an
 * unreleased build and the people who can make it better.
 */
export function Logo({
  className,
  href = "/",
  /** Mark only, for tight spaces. */
  compact = false,
}: {
  className?: string;
  href?: string;
  compact?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-md text-foreground",
        className,
      )}
      aria-label={`${SITE.name} home`}
    >
      <span
        aria-hidden
        className="grid size-8 place-items-center rounded-md border border-primary/70 bg-[#12191a] text-primary shadow-sm transition-colors duration-[120ms] group-hover:border-primary-hover group-hover:bg-[#182021]"
      >
        <GroguMark className="size-5" />
      </span>
      {!compact && (
        <span className="font-display text-lg font-semibold tracking-tight">
          {SITE.name}
        </span>
      )}
    </Link>
  );
}
