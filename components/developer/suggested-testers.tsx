"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Info, Send, Sparkles, UserSearch } from "lucide-react";

import type { PlaytestWithRelations, TesterSuggestion } from "@/lib/types";
import { canRankWithAi, matchStatusLine, matchStrength } from "@/lib/matching";
import { useTesterProfile } from "@/lib/hooks/use-grogu";
import { useTesterSuggestions } from "@/lib/hooks/use-matching";
import { matchingService, ServiceError } from "@/lib/services";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/states";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/toast";

function SuggestionRow({
  playtestId,
  suggestion,
}: {
  playtestId: string;
  suggestion: TesterSuggestion;
}) {
  const toast = useToast();
  const tester = useTesterProfile(suggestion.testerId);
  const [inviting, setInviting] = useState(false);
  const strength = matchStrength(suggestion.score);

  if (!tester) return null;
  const { user, profile } = tester;

  async function invite() {
    setInviting(true);
    try {
      await matchingService.inviteTester(playtestId, suggestion.testerId);
      toast({ title: `Invite sent to ${user.name}`, description: "They'll get a notification with a link to apply." });
    } catch (error) {
      toast({
        title: "Couldn't send the invite",
        description: error instanceof ServiceError ? error.message : "Please try again.",
        tone: "error",
      });
    } finally {
      setInviting(false);
    }
  }

  return (
    <li className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex min-w-0 gap-3">
        <UserAvatar name={user.name} src={user.avatarUrl} className="size-10 shrink-0" />
        <div className="min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/testers/${user.id}`}
              className="truncate text-sm font-medium transition-colors hover:text-secondary"
            >
              {user.name}
            </Link>
            <Badge tone={strength.tone}>
              {strength.label} · {suggestion.score}
            </Badge>
          </div>
          <p className="text-xs text-subtle-foreground">
            Level {profile.level} · {profile.levelTitle} · {profile.reputation} reputation
          </p>
          {suggestion.aiReason && (
            <p className="flex gap-1.5 text-sm leading-relaxed text-foreground">
              <Sparkles className="mt-0.5 size-3.5 shrink-0 text-secondary" aria-hidden />
              <span className="min-w-0 break-words">{suggestion.aiReason}</span>
            </p>
          )}
          {suggestion.reasons.length > 0 && (
            <ul className="flex flex-wrap gap-1.5" aria-label="Why they fit">
              {suggestion.reasons.map((reason) => (
                <li
                  key={reason}
                  className="rounded-full border-2 border-line px-2.5 py-0.5 text-xs text-muted-foreground"
                >
                  {reason}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="flex shrink-0 gap-2 sm:pt-0.5">
        {suggestion.invited ? (
          <Badge tone="success">
            <Check className="size-3" aria-hidden /> Invited
          </Badge>
        ) : (
          <Button size="sm" variant="secondary" onClick={invite} loading={inviting}>
            <Send aria-hidden /> Invite
          </Button>
        )}
      </div>
    </li>
  );
}

/**
 * Testers who meet the playtest's requirements and have not applied yet, best
 * fit first, each with the reasons they fit. The rules on the server decide who
 * is eligible and score them; Gemini, when it is on, only re-orders the list
 * and adds a line per tester. A studio can invite any of them to apply.
 *
 * Shown only while the playtest is recruiting.
 */
export function SuggestedTesters({ playtest }: { playtest: PlaytestWithRelations }) {
  const recruiting = playtest.status === "recruiting";
  const { data, loading, generating, error, generate, reload } = useTesterSuggestions(
    playtest.id,
    recruiting,
  );

  if (!recruiting) return null;

  const frame = "rounded-xl border-2 border-line bg-surface p-5 sm:p-6";

  if (error && !data) {
    return <ErrorState title="Couldn't load suggested testers" description={error} onRetry={reload} />;
  }

  if (loading || !data) {
    return (
      <section className={frame} aria-busy="true" aria-label="Suggested testers">
        <div className="space-y-4" aria-hidden>
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      </section>
    );
  }

  const isAi = data.source === "ai";
  const status = matchStatusLine(data);

  return (
    <section className={frame} aria-labelledby="suggested-testers-title">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <h3 id="suggested-testers-title" className="font-display text-base font-bold">
            Suggested testers
          </h3>
          <p className="max-w-xl text-sm text-muted-foreground">
            Testers who meet this playtest&apos;s requirements and haven&apos;t applied yet, best fit
            first. Invite the ones you want; they&apos;ll get a notification.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={isAi ? "primary" : "muted"}>
              {isAi && <Sparkles className="size-3" aria-hidden />}
              {isAi ? "AI-ranked" : "Rule-based order"}
            </Badge>
            <span className="text-xs text-subtle-foreground">
              {data.eligibleCount} {data.eligibleCount === 1 ? "tester fits" : "testers fit"}
            </span>
          </div>
        </div>

        {canRankWithAi(data) && (
          <Button size="sm" variant="secondary" onClick={() => void generate()} loading={generating}>
            <Sparkles aria-hidden />
            {isAi ? "Update ranking" : "Rank with AI"}
          </Button>
        )}
      </div>

      <div className="mt-4 space-y-3" aria-live="polite">
        {generating && (
          <p className="text-sm text-muted-foreground">Ranking the shortlist. This usually takes a few seconds.</p>
        )}
        {!generating && status && (
          <p
            className="flex items-start gap-2 rounded-lg border-2 border-warning bg-warning/10 px-3 py-2 text-sm text-foreground"
            role="status"
          >
            <Info className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
            {status}
          </p>
        )}
      </div>

      <div className="mt-5">
        {!data.open ? (
          <p className="text-sm text-muted-foreground">
            Every spot is taken, so there is nobody to suggest.
          </p>
        ) : data.suggestions.length === 0 ? (
          <div className="flex items-start gap-3 rounded-lg border-2 border-dashed border-line p-4">
            <UserSearch className="mt-0.5 size-4 shrink-0 text-subtle-foreground" aria-hidden />
            <p className="text-sm text-muted-foreground">
              Nobody who hasn&apos;t applied meets the requirements right now. A lower minimum
              reputation or experience, or more platforms or languages, widens the pool.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {data.suggestions.map((suggestion) => (
              <SuggestionRow
                key={suggestion.testerId}
                playtestId={playtest.id}
                suggestion={suggestion}
              />
            ))}
          </ul>
        )}
      </div>

      <p className="mt-5 text-xs leading-relaxed text-subtle-foreground">
        {data.aiEnabled
          ? "AI ranking sends these profiles to Google Gemini without names or bios. It can only re-order this list, not add to it."
          : "Ranked by genres, level, finished tests, approved reviews, hours and experience."}
      </p>
    </section>
  );
}
