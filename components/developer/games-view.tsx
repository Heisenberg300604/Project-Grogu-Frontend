"use client";

import Link from "next/link";
import { Gamepad2, Plus } from "lucide-react";

import { GENRE_LABELS } from "@/lib/constants";
import {
  useDeveloperGames,
  useDeveloperPlaytests,
} from "@/lib/hooks/use-grogu";
import { useGroguStore } from "@/lib/store/grogu-store";
import { useSession } from "@/lib/hooks/use-session";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/states";
import { StatusBadge } from "@/components/ui/status-badge";
import { PageHeader } from "@/components/layout/page-header";
import { GameCover } from "@/components/games/game-cover";

export function GamesView() {
  const { user } = useSession();
  const games = useDeveloperGames(user?.id);
  const playtests = useDeveloperPlaytests(user?.id);
  const applications = useGroguStore((s) => s.applications);
  const feedback = useGroguStore((s) => s.feedback);

  if (!user) return null;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Your games"
        description="Every game you've registered on Grogu. Add a game before creating its playtest."
        actions={
          <Button asChild>
            <Link href="/developer/games/new">
              <Plus className="size-4" /> Add game
            </Link>
          </Button>
        }
      />

      {games.length === 0 ? (
        <EmptyState
          icon={Gamepad2}
          title="No games yet"
          description="Add your first game to start recruiting playtesters."
          action={
            <Button asChild size="sm">
              <Link href="/developer/games/new">Add a game</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {games.map((game) => {
            const gamePlaytests = playtests.filter((p) => p.gameId === game.id);
            const playtestIds = new Set(gamePlaytests.map((p) => p.id));
            const testers = applications.filter(
              (a) => playtestIds.has(a.playtestId) && a.status === "accepted",
            ).length;
            const feedbackCount = feedback.filter((f) =>
              playtestIds.has(f.playtestId),
            ).length;
            const activeCount = gamePlaytests.filter(
              (p) => p.status === "recruiting" || p.status === "in-progress",
            ).length;

            return (
              <Card key={game.id} className="flex flex-col overflow-hidden">
                <div className="relative aspect-[16/9] border-b border-border">
                  <GameCover game={game} />
                  <div className="absolute right-3 top-3">
                    <StatusBadge kind="game" status={game.status} />
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <div>
                    <h3 className="font-display text-base font-semibold">
                      {game.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{game.tagline}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {game.genres.map((g) => (
                      <Badge key={g} tone="muted">
                        {GENRE_LABELS[g]}
                      </Badge>
                    ))}
                  </div>
                  <dl className="grid grid-cols-3 gap-2 border-t border-border pt-3 text-center text-xs text-muted-foreground">
                    <div>
                      <dt>Playtests</dt>
                      <dd className="font-display text-base font-semibold text-foreground">
                        {gamePlaytests.length}
                      </dd>
                    </div>
                    <div>
                      <dt>Testers</dt>
                      <dd className="font-display text-base font-semibold text-foreground">
                        {testers}
                      </dd>
                    </div>
                    <div>
                      <dt>Feedback</dt>
                      <dd className="font-display text-base font-semibold text-foreground">
                        {feedbackCount}
                      </dd>
                    </div>
                  </dl>
                  <div className="mt-auto flex gap-2 pt-1">
                    <Button asChild size="sm" variant="secondary" className="flex-1">
                      <Link href={`/developer/playtests/new?game=${game.id}`}>
                        New playtest
                      </Link>
                    </Button>
                    {activeCount > 0 && (
                      <Button asChild size="sm" variant="ghost">
                        <Link href="/developer/playtests">
                          {activeCount} active
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
