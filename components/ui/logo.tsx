import Link from "next/link";

import { cn } from "@/lib/utils";
import { SITE } from "@/lib/constants";

/** Grogu wordmark. The mark is a stylised radar sweep — "find your testers". */
export function Logo({
  className,
  href = "/",
}: {
  className?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 rounded-md text-lg font-semibold tracking-tight text-foreground",
        className,
      )}
      aria-label={`${SITE.name} home`}
    >
      <span
        aria-hidden
        className="grid size-7 place-items-center rounded-md bg-primary text-primary-foreground"
      >
        <svg viewBox="0 0 24 24" className="size-4" fill="none">
          <path
            d="M12 12 20 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="12" cy="12" r="7.5" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="12" r="2" fill="currentColor" />
        </svg>
      </span>
      <span className="font-display">{SITE.name}</span>
    </Link>
  );
}
