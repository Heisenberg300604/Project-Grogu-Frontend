import Link from "next/link";
import { Building2, Gamepad2, MapPin, Radio } from "lucide-react";

import { cn } from "@/lib/utils";
import { STUDIO_SIZE_LABELS } from "@/lib/constants";
import type { StudioDirectoryEntry } from "@/lib/domain";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/ui/avatar";

/**
 * A studio in the public directory. The whole card is one link target, with the
 * studio name carrying the accessible name.
 */
export function StudioDirectoryCard({
  entry,
  className,
}: {
  entry: StudioDirectoryEntry;
  className?: string;
}) {
  const { user, profile } = entry;

  return (
    <article
      className={cn(
        "card-lift shadow-md group relative flex flex-col gap-4 rounded-xl border-2 border-line bg-surface p-5",
        "hover:border-border-strong",
        className,
      )}
    >
      <div className="flex items-center gap-3.5">
        <UserAvatar
          name={profile.studioName}
          src={user.avatarUrl}
          className="size-12 shrink-0"
        />
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-display text-base font-bold">
            <Link
              href={`/studios/${user.id}`}
              className="transition-colors hover:text-secondary"
            >
              <span className="absolute inset-0" aria-hidden />
              {profile.studioName}
            </Link>
          </h3>
          <p className="truncate text-xs text-muted-foreground">
            Led by {user.name}
          </p>
        </div>
        {profile.activePlaytests > 0 && (
          <Badge tone="success" className="shrink-0">
            <Radio /> Recruiting
          </Badge>
        )}
      </div>

      <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
        {user.bio || "This studio hasn't added a description yet."}
      </p>

      <dl className="mt-auto flex flex-wrap gap-x-5 gap-y-1.5 border-t-2 border-dashed border-border pt-3.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Building2 className="size-3.5 text-subtle-foreground" aria-hidden />
          <dt className="sr-only">Studio size</dt>
          <dd>{STUDIO_SIZE_LABELS[profile.studioSize]}</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <Gamepad2 className="size-3.5 text-subtle-foreground" aria-hidden />
          <dt className="sr-only">Games</dt>
          <dd>
            {profile.gamesPublished}{" "}
            {profile.gamesPublished === 1 ? "game" : "games"}
          </dd>
        </div>
        {user.location && (
          <div className="flex items-center gap-1.5">
            <MapPin className="size-3.5 text-subtle-foreground" aria-hidden />
            <dt className="sr-only">Location</dt>
            <dd>{user.location}</dd>
          </div>
        )}
      </dl>
    </article>
  );
}
