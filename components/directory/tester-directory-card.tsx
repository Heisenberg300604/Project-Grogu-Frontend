import Link from "next/link";
import { CheckCircle2, Clock, MapPin } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  EXPERIENCE_LABELS,
  GENRE_LABELS,
  PLATFORM_LABELS,
} from "@/lib/constants";
import type { TesterDirectoryEntry } from "@/lib/domain";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/ui/avatar";

const MAX_GENRES = 3;

/**
 * A tester in the public directory. The whole card is one link target, with the
 * name carrying the accessible name.
 */
export function TesterDirectoryCard({
  entry,
  className,
}: {
  entry: TesterDirectoryEntry;
  className?: string;
}) {
  const { user, profile } = entry;
  const extraGenres = profile.preferredGenres.length - MAX_GENRES;

  return (
    <article
      className={cn(
        "lift group relative flex flex-col gap-4 rounded-xl border border-border bg-surface p-5",
        "hover:border-border-strong focus-within:border-border-strong",
        className,
      )}
    >
      <div className="flex items-start gap-3.5">
        <UserAvatar
          name={user.name}
          src={user.avatarUrl}
          className="size-12 shrink-0"
        />
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-display text-base font-semibold">
            <Link
              href={`/testers/${user.id}`}
              className="transition-colors hover:text-secondary"
            >
              {/* Stretched link: the card is clickable without a div-button. */}
              <span className="absolute inset-0" aria-hidden />
              {user.name}
            </Link>
          </h3>
          <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
            <MapPin className="size-3 shrink-0" aria-hidden />
            <span className="truncate">{user.location || "Location not set"}</span>
          </p>
        </div>

        <div className="shrink-0 rounded-lg border border-primary-line bg-primary-soft px-2.5 py-1.5 text-center">
          <p className="font-display text-lg font-semibold leading-none tabular-nums text-secondary">
            {profile.reputation}
          </p>
          <p className="text-label mt-1 text-[10px] text-subtle-foreground">
            Rep · Lv {profile.level}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Badge tone="primary">{EXPERIENCE_LABELS[profile.experienceLevel]}</Badge>
        {profile.platforms.map((platform) => (
          <Badge key={platform} tone="muted">
            {PLATFORM_LABELS[platform]}
          </Badge>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        {profile.preferredGenres.length === 0
          ? "No genres listed"
          : profile.preferredGenres
              .slice(0, MAX_GENRES)
              .map((g) => GENRE_LABELS[g])
              .join(" • ") + (extraGenres > 0 ? ` +${extraGenres}` : "")}
      </p>

      <dl className="mt-auto flex flex-wrap gap-x-5 gap-y-1.5 border-t border-border pt-3.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="size-3.5 text-subtle-foreground" aria-hidden />
          <dt className="sr-only">Completed playtests</dt>
          <dd>{profile.completedPlaytests} completed</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="size-3.5 text-subtle-foreground" aria-hidden />
          <dt className="sr-only">Weekly availability</dt>
          <dd>{profile.weeklyAvailabilityHours}h / week</dd>
        </div>
      </dl>
    </article>
  );
}
