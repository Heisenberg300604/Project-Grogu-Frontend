import Link from "next/link";
import { ArrowRight, Clock, Users } from "lucide-react";

import { formatCompactNumber } from "@/lib/utils";
import { playtestCapacity } from "@/lib/domain";
import { GENRE_LABELS } from "@/lib/constants";
import type { PlaytestWithRelations } from "@/lib/types";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { GameArt, GameCover } from "@/components/games/game-cover";

interface HeroStats {
  games: number;
  activePlaytests: number;
  testers: number;
  feedbackSubmitted: number;
}

/**
 * Landing hero.
 *
 * The right-hand stack is built from real playtests in the catalogue rather
 * than a stock illustration — the first thing a visitor sees is the actual
 * product surface, with live-looking test metadata on it.
 */
export function Hero({
  stats,
  showcase,
}: {
  stats: HeroStats;
  /** Playtests rendered into the art stack. Up to three are used. */
  showcase: PlaytestWithRelations[];
}) {
  const featured = showcase.slice(0, 3);
  const [lead, ...rest] = featured;

  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* Ambient wash pulled from the lead game's art. Heavily blurred so it
          reads as atmosphere, never as an image. */}
      {lead && (
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-25">
          <GameCover game={lead.game} className="scale-125 blur-3xl" />
        </div>
      )}
      <div aria-hidden className="absolute inset-0 bg-linear-to-b from-background/40 via-background/85 to-background" />
      <div aria-hidden className="surface-grid absolute inset-0" />

      <Container className="relative grid items-center gap-14 py-20 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:py-28">
        <div className="animate-rise flex flex-col items-start gap-7">
          <Badge tone="primary" size="md" dot>
            {stats.activePlaytests} playtests recruiting now
          </Badge>

          <h1 className="text-display max-w-2xl">
            Play. Test.{" "}
            <span className="text-secondary">Make games better.</span>
          </h1>

          <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
            Grogu connects game developers with real players for structured
            playtesting — clear tasks, honest feedback, and a reputation system
            that rewards testers who actually finish the build.
          </p>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/discover"
              className={buttonVariants({ variant: "primary", size: "xl" })}
            >
              Find games to test
              <ArrowRight />
            </Link>
            <Link
              href="/developers"
              className={buttonVariants({ variant: "secondary", size: "xl" })}
            >
              I&apos;m a developer
            </Link>
          </div>

          <p className="text-sm text-subtle-foreground">
            <span className="font-medium text-foreground">
              {formatCompactNumber(stats.testers)} testers
            </span>{" "}
            across {stats.games} games · no fees, no spreadsheets
          </p>
        </div>

        {/* Art stack — decorative composition of live playtests. */}
        {lead && (
          <div className="animate-rise relative hidden lg:block">
            <div className="relative mx-auto max-w-lg">
              <ShowcaseTile playtest={lead} size="lg" />
              <div className="mt-4 grid grid-cols-2 gap-4">
                {rest.map((playtest) => (
                  <ShowcaseTile key={playtest.id} playtest={playtest} size="sm" />
                ))}
              </div>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}

function ShowcaseTile({
  playtest,
  size,
}: {
  playtest: PlaytestWithRelations;
  size: "lg" | "sm";
}) {
  const { spotsLeft, isFull } = playtestCapacity(playtest);

  return (
    <Link
      href={`/playtests/${playtest.id}`}
      className="lift block overflow-hidden rounded-xl border border-border bg-surface shadow-md hover:border-border-strong"
    >
      <GameArt
        game={playtest.game}
        ratio={size === "lg" ? "16/9" : "3/2"}
        scrim
      >
        <div className="absolute inset-x-3 bottom-3">
          <p
            className={
              size === "lg"
                ? "font-display text-xl font-semibold text-white"
                : "truncate font-display text-sm font-semibold text-white"
            }
          >
            {playtest.game.title}
          </p>
          {size === "lg" && (
            <p className="mt-0.5 text-xs text-white/70">
              {playtest.game.genres.map((g) => GENRE_LABELS[g]).join(" • ")}
            </p>
          )}
        </div>
      </GameArt>

      {size === "lg" && (
        <div className="flex items-center justify-between gap-3 px-4 py-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Users className="size-3.5 text-subtle-foreground" aria-hidden />
            {isFull ? "Full" : `${spotsLeft} slots left`}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5 text-subtle-foreground" aria-hidden />~
            {playtest.requirements.estimatedHours}h
          </span>
          <span className="truncate font-medium text-foreground">
            {playtest.reward.split(/[+·]/)[0].trim()}
          </span>
        </div>
      )}
    </Link>
  );
}
