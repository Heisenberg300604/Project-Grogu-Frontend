"use client";

import Link from "next/link";
import { Compass, Target } from "lucide-react";

import { formatDate } from "@/lib/utils";
import { FOCUS_LABELS, GENRE_LABELS, PLATFORM_LABELS } from "@/lib/constants";
import type { PlaytestWithRelations } from "@/lib/types";
import { usePlaytest, useDeveloperProfile } from "@/lib/hooks/use-grogu";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { EmptyState, PageSkeleton } from "@/components/ui/states";
import { StatusBadge } from "@/components/ui/status-badge";
import { GameCover } from "@/components/games/game-cover";
import { DeveloperCard } from "@/components/games/developer-card";
import { RequirementsList } from "@/components/playtests/requirements-list";
import { TaskList } from "@/components/playtests/task-list";
import { ApplyPanel } from "@/components/playtests/apply-panel";

export function PlaytestDetail({
  playtestId,
  initialPlaytest,
}: {
  playtestId: string;
  initialPlaytest: PlaytestWithRelations | null;
}) {
  const hydrated = useHydrated();
  const fromStore = usePlaytest(playtestId);
  const playtest = hydrated ? fromStore : (initialPlaytest ?? undefined);
  const developer = useDeveloperProfile(playtest?.developerId);

  if (!hydrated && !initialPlaytest) {
    return (
      <Container className="py-12">
        <PageSkeleton />
      </Container>
    );
  }

  if (!playtest) {
    return (
      <Container className="py-16">
        <EmptyState
          icon={Compass}
          title="Playtest not found"
          description="This playtest may have been closed or removed."
          action={
            <Button asChild variant="secondary" size="sm">
              <Link href="/discover">Browse open playtests</Link>
            </Button>
          }
        />
      </Container>
    );
  }

  return (
    <div>
      <div className="relative border-b border-border">
        <div className="absolute inset-0">
          <GameCover game={playtest.game} className="opacity-30" />
          <div className="absolute inset-0 bg-linear-to-t from-background via-background/80 to-background/40" />
        </div>
        <Container className="relative py-10 sm:py-14">
          <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted-foreground">
            <Link href="/discover" className="hover:text-foreground">
              Discover
            </Link>
            <span className="mx-1">/</span>
            <span className="text-foreground">{playtest.game.title}</span>
          </nav>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge kind="playtest" status={playtest.status} />
            {playtest.game.genres.map((g) => (
              <Badge key={g} tone="muted">
                {GENRE_LABELS[g]}
              </Badge>
            ))}
          </div>
          <h1 className="mt-3 max-w-3xl text-3xl font-semibold sm:text-4xl">
            {playtest.title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {playtest.game.title} · {playtest.developer.name} · build{" "}
            {playtest.game.buildVersion} · {" "}
            {playtest.requirements.platforms
              .map((p) => PLATFORM_LABELS[p])
              .join(", ")}
          </p>
        </Container>
      </div>

      <Container className="grid gap-10 py-10 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-10">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">About this playtest</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {playtest.summary}
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {playtest.game.description}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Target className="size-4 text-secondary" aria-hidden />
              What the developer wants to learn
            </h2>
            <ul className="space-y-2">
              {playtest.goals.map((goal) => (
                <li
                  key={goal}
                  className="flex gap-2 rounded-lg border border-border bg-surface p-3 text-sm"
                >
                  <span aria-hidden className="text-secondary">
                    →
                  </span>
                  {goal}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {playtest.focusAreas.map((focus) => (
                <Badge key={focus} tone="primary">
                  {FOCUS_LABELS[focus]}
                </Badge>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">
              Testing tasks ({playtest.tasks.length})
            </h2>
            <p className="text-sm text-muted-foreground">
              You&apos;ll work through these once accepted. Required tasks must be
              done before submitting feedback.
            </p>
            <TaskList tasks={playtest.tasks} />
          </section>

          <section className="lg:hidden">
            {developer && (
              <DeveloperCard user={developer.user} profile={developer.profile} />
            )}
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
          <ApplyPanel playtest={playtest} />
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tester requirements</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <RequirementsList
                requirements={playtest.requirements}
                playtest={playtest}
              />
            </CardContent>
          </Card>
          <div className="hidden lg:block">
            {developer && (
              <DeveloperCard user={developer.user} profile={developer.profile} />
            )}
          </div>
          <p className="text-center text-xs text-muted-foreground">
            Playtest opened {formatDate(playtest.opensAt)}
          </p>
        </aside>
      </Container>
    </div>
  );
}
