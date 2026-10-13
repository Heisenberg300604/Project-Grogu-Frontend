import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Gamepad2,
  Globe,
  ListChecks,
  MapPin,
} from "lucide-react";

import { formatDate } from "@/lib/utils";
import { STUDIO_SIZE_LABELS } from "@/lib/constants";
import { safeHttpUrl } from "@/lib/safe-url";
import type { StudioDirectoryEntry } from "@/lib/domain";
import type { Game, PlaytestWithRelations } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/states";
import { StatCard, StatCardGrid } from "@/components/dashboard/stat-card";
import { GameCard } from "@/components/games/game-card";
import { PlaytestCard } from "@/components/playtests/playtest-card";

/**
 * A studio as the public sees it: who they are, what they have built, and the
 * playtests currently open to apply to.
 */
export function StudioPublicProfile({
  entry,
  games,
  playtests,
}: {
  entry: StudioDirectoryEntry;
  games: Game[];
  playtests: PlaytestWithRelations[];
}) {
  const { user, profile } = entry;
  const website = safeHttpUrl(profile.website);
  const open = playtests.filter((p) => p.status === "recruiting");

  return (
    <div className="space-y-10">
      <Link
        href="/studios"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden /> All studios
      </Link>

      <section className="overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
          <UserAvatar
            name={profile.studioName}
            src={user.avatarUrl}
            className="size-20 text-xl"
          />

          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="font-display text-2xl font-semibold">
                {profile.studioName}
              </h1>
              <Badge tone="primary" size="md">
                <Building2 /> Studio
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Led by {user.name} · joined {formatDate(user.joinedAt)}
            </p>
            {user.bio && (
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {user.bio}
              </p>
            )}
            <dl className="flex flex-wrap gap-x-5 gap-y-1.5 pt-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Building2
                  className="size-3.5 text-subtle-foreground"
                  aria-hidden
                />
                <dt className="sr-only">Studio size</dt>
                <dd>
                  {STUDIO_SIZE_LABELS[profile.studioSize]} · founded{" "}
                  {profile.foundedYear}
                </dd>
              </div>
              {user.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin
                    className="size-3.5 text-subtle-foreground"
                    aria-hidden
                  />
                  <dt className="sr-only">Location</dt>
                  <dd>{user.location}</dd>
                </div>
              )}
              {website && (
                <div className="flex items-center gap-1.5">
                  <Globe
                    className="size-3.5 text-subtle-foreground"
                    aria-hidden
                  />
                  <dt className="sr-only">Website</dt>
                  <dd>
                    <a
                      href={website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-secondary"
                    >
                      {website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </section>

      <StatCardGrid>
        <StatCard label="Games" value={profile.gamesPublished} icon={Gamepad2} />
        <StatCard
          label="Open playtests"
          value={open.length}
          icon={ListChecks}
        />
      </StatCardGrid>

      <section className="space-y-5">
        <h2 className="font-display text-lg font-semibold">Open playtests</h2>
        {open.length === 0 ? (
          <EmptyState
            icon={ListChecks}
            title="No open playtests right now"
            description="This studio isn't recruiting testers at the moment. Check back soon."
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {open.map((playtest) => (
              <PlaytestCard key={playtest.id} playtest={playtest} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-5">
        <h2 className="font-display text-lg font-semibold">Games</h2>
        {games.length === 0 ? (
          <EmptyState
            icon={Gamepad2}
            title="No games yet"
            description="This studio hasn't added a game."
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
