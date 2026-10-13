"use client";

import Link from "next/link";
import { Compass, Info, Mail, Sparkles } from "lucide-react";

import type { PlaytestRecommendation, PlaytestWithRelations } from "@/lib/types";
import { canRankWithAi, matchStatusLine, matchStrength } from "@/lib/matching";
import { usePlaytests } from "@/lib/hooks/use-grogu";
import { usePlaytestRecommendations } from "@/lib/hooks/use-matching";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardGridSkeleton, EmptyState, ErrorState } from "@/components/ui/states";
import { SectionTitle } from "@/components/layout/page-header";
import { PlaytestCard } from "@/components/playtests/playtest-card";

/** Why this playtest is recommended, under its card. */
function WhyItFits({ recommendation }: { recommendation: PlaytestRecommendation }) {
  const strength = matchStrength(recommendation.score);

  return (
    <div className="space-y-2 border-t border-border pt-3">
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge tone={strength.tone}>{strength.label}</Badge>
        {recommendation.invited && (
          <Badge tone="info">
            <Mail className="size-3" aria-hidden /> Invited
          </Badge>
        )}
      </div>
      {recommendation.aiReason && (
        <p className="flex gap-1.5 text-xs leading-relaxed text-foreground">
          <Sparkles className="mt-0.5 size-3 shrink-0 text-secondary" aria-hidden />
          <span className="min-w-0 break-words">{recommendation.aiReason}</span>
        </p>
      )}
      <ul className="space-y-1 text-xs text-muted-foreground" aria-label="Why it fits">
        {recommendation.reasons.map((reason) => (
          <li key={reason} className="flex gap-1.5">
            <span aria-hidden className="text-subtle-foreground">
              •
            </span>
            <span className="min-w-0 break-words">{reason}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Open playtests that fit the signed-in tester, best match first. The server's
 * rules decide which ones the tester qualifies for and score them; Gemini, when
 * it is on, re-orders them and adds a line each.
 */
export function RecommendedPlaytests({ testerId }: { testerId: string }) {
  const playtests = usePlaytests();
  const { data, loading, generating, error, generate, reload } =
    usePlaytestRecommendations(testerId);

  const byId = new Map<string, PlaytestWithRelations>(playtests.map((p) => [p.id, p]));
  const items = (data?.recommendations ?? [])
    .map((recommendation) => ({ recommendation, playtest: byId.get(recommendation.playtestId) }))
    .filter((item): item is { recommendation: PlaytestRecommendation; playtest: PlaytestWithRelations } =>
      Boolean(item.playtest),
    );

  const isAi = data?.source === "ai";
  const status = data ? matchStatusLine(data) : null;

  return (
    <section className="space-y-5" aria-label="Recommended for you">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <SectionTitle
          title="Recommended for you"
          description="Open playtests you qualify for, best match first."
        />
        <div className="flex flex-wrap items-center gap-2">
          {data && items.length > 0 && (
            <Badge tone={isAi ? "primary" : "muted"}>
              {isAi && <Sparkles className="size-3" aria-hidden />}
              {isAi ? "AI-ranked" : "Rule-based order"}
            </Badge>
          )}
          {data && canRankWithAi(data) && (
            <Button size="sm" variant="ghost" onClick={() => void generate()} loading={generating}>
              <Sparkles aria-hidden /> {isAi ? "Update" : "Rank with AI"}
            </Button>
          )}
        </div>
      </div>

      <div aria-live="polite">
        {!generating && status && (
          <p
            className="flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-sm text-foreground"
            role="status"
          >
            <Info className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
            {status}
          </p>
        )}
      </div>

      {error && !data ? (
        <ErrorState title="Couldn't load your recommendations" description={error} onRetry={reload} />
      ) : loading || !data ? (
        <CardGridSkeleton count={3} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={Compass}
          title="No matches right now"
          description="None of the open playtests fit your platforms, languages, experience and reputation yet. Adding platforms or genres to your profile widens your matches."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <Button asChild size="sm" variant="secondary">
                <Link href="/discover">Browse all playtests</Link>
              </Button>
              <Button asChild size="sm" variant="ghost">
                <Link href="/profile/edit">Edit profile</Link>
              </Button>
            </div>
          }
        />
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {items.map(({ recommendation, playtest }) => (
              <PlaytestCard
                key={playtest.id}
                playtest={playtest}
                footer={<WhyItFits recommendation={recommendation} />}
              />
            ))}
          </div>
          {data.aiEnabled && (
            <p className="text-xs text-subtle-foreground">
              AI ranking uses your testing profile, without your name, and can only re-order playtests you qualify for.
            </p>
          )}
        </>
      )}
    </section>
  );
}
