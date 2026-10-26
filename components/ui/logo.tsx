import Link from "next/link";

import { cn } from "@/lib/utils";
import { SITE } from "@/lib/constants";

/**
 * Grogu wordmark: a pixel "G" tile that tips over on hover, beside the name.
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
        className="grid size-9 place-items-center rounded-[10px] border-2 border-line bg-grape font-pixel text-lg text-white shadow-sm transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-110"
      >
        G
      </span>
      {!compact && (
        <span className="font-display text-xl font-extrabold">{SITE.name}</span>
      )}
    </Link>
  );
}
