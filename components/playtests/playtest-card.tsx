import Link from "next/link";
import { Clock, Users } from "lucide-react";

import { cn, formatDeadline } from "@/lib/utils";
import { FOCUS_LABELS, GENRE_LABELS } from "@/lib/constants";
import type { PlaytestWithRelations } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { GameCover } from "@/components/games/game-cover";

/** Playtest summary card — the primary unit on Discover and dashboards. */
export function PlaytestCard({
  playtest,
  href,
  className,
}: {
  playtest: PlaytestWithRelations;
  href?: string;
  className?: string;
}) {
  const link = href ?? `/playtests/${playtest.id}`;
  const spotsLeft = Math.max(0, playtest.maxTesters - playtest.acceptedTesters);

  return (
    <Card
      className={cn(
        "group flex flex-col overflow-hidden transition-colors hover:border-border-strong",
        className,
      )}
    >
      <Link
        href={link}
        className="relative block aspect-[16/9] border-b border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <GameCover game={playtest.game} />
        <div className="absolute left-3 top-3 flex gap-1.5">
          <StatusBadge kind="playtest" status={playtest.status} />
          {playtest.requirements.ndaRequired && <Badge tone="outline">NDA</Badge>}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">
            {playtest.game.title} · {playtest.developer.name}
          </p>
          <h3 className="font-display text-base font-semibold leading-snug">
            <Link
              href={link}
              className="transition-colors hover:text-secondary focus-visible:outline-none focus-visible:underline"
            >
              {playtest.title}
            </Link>
          </h3>
        </div>

        <p className="line-clamp-2 text-sm text-muted-foreground">
          {playtest.summary}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {playtest.game.genres.slice(0, 1).map((g) => (
            <Badge key={g} tone="muted">
              {GENRE_LABELS[g]}
            </Badge>
          ))}
          {playtest.focusAreas.slice(0, 2).map((focus) => (
            <Badge key={focus} tone="primary">
              {FOCUS_LABELS[focus]}
            </Badge>
          ))}
        </div>

        <dl className="mt-auto flex flex-wrap gap-x-5 gap-y-1 border-t border-border pt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Users className="size-3.5" aria-hidden />
            <dt className="sr-only">Spots</dt>
            <dd>{spotsLeft > 0 ? `${spotsLeft} spots left` : "Full"}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="size-3.5" aria-hidden />
            <dt className="sr-only">Estimated time</dt>
            <dd>~{playtest.requirements.estimatedHours}h</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <dt className="sr-only">Deadline</dt>
            <dd>{formatDeadline(playtest.closesAt)}</dd>
          </div>
        </dl>
      </div>
    </Card>
  );
}
