"use client";

import {
  Bug,
  Info,
  Lightbulb,
  RefreshCw,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";

import type { InsightPoint, PlaytestInsight } from "@/lib/types";
import { cn, formatRelativeTime } from "@/lib/utils";
import { INSIGHT_SENTIMENT_META } from "@/lib/constants";
import {
  canRefreshInsight,
  insightCoverage,
  insightStatusLine,
} from "@/lib/insights";
import { useInsight } from "@/lib/hooks/use-insight";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/states";
import { Skeleton } from "@/components/ui/skeleton";

/** A ranked list of themes with how many reviews raised each. */
function PointList({
  icon: Icon,
  title,
  tone,
  items,
  emptyLabel,
}: {
  icon: typeof ThumbsUp;
  title: string;
  tone: string;
  items: InsightPoint[];
  emptyLabel: string;
}) {
  const max = Math.max(1, ...items.map((item) => item.mentions));

  return (
    <div className="min-w-0 space-y-3">
      <h4 className={cn("flex items-center gap-1.5 text-sm font-bold", tone)}>
        <Icon className="size-3.5" aria-hidden /> {title}
      </h4>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyLabel}</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.text} className="space-y-1.5">
              <div className="flex items-start justify-between gap-3 text-sm">
                <span className="min-w-0 break-words text-muted-foreground">
                  {item.text}
                </span>
                <span
                  className="shrink-0 text-xs tabular-nums text-subtle-foreground"
                  title={`Raised in ${item.mentions} ${item.mentions === 1 ? "review" : "reviews"}`}
                >
                  ×{item.mentions}
                </span>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-muted" aria-hidden>
                <div
                  className="h-full bg-primary/60"
                  style={{ width: `${(item.mentions / max) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function InsightSkeleton() {
  return (
    <div className="space-y-4" aria-hidden>
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="grid gap-4 pt-2 sm:grid-cols-2">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
    </div>
  );
}

function InsightBody({ insight }: { insight: PlaytestInsight }) {
  return (
    <div className="space-y-6">
      <p className="max-w-3xl text-sm leading-relaxed text-foreground">
        {insight.summary}
      </p>

      {insight.highlights.length > 0 && (
        <div className="space-y-2.5">
          <h4 className="flex items-center gap-1.5 text-sm font-bold">
            <Sparkles className="size-3.5 text-secondary" aria-hidden /> Top highlights
          </h4>
          <ul className="space-y-2">
            {insight.highlights.map((line) => (
              <li
                key={line}
                className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground"
              >
                <span aria-hidden className="text-secondary">
                  →
                </span>
                <span className="min-w-0 break-words">{line}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-6 border-t-2 border-dashed border-border pt-5 sm:grid-cols-2">
        <PointList
          icon={ThumbsUp}
          title="What testers like"
          tone="text-success"
          items={insight.likes}
          emptyLabel="No standout praise yet."
        />
        <PointList
          icon={ThumbsDown}
          title="What testers dislike"
          tone="text-warning"
          items={insight.dislikes}
          emptyLabel="No complaints raised."
        />
      </div>

      <div
        className={cn(
          "grid gap-6 border-t-2 border-dashed border-border pt-5",
          insight.actions.length > 0 && "sm:grid-cols-2",
        )}
      >
        <PointList
          icon={Bug}
          title="Bugs and technical problems"
          tone="text-destructive"
          items={insight.bugs}
          emptyLabel="No bugs reported."
        />
        {insight.actions.length > 0 && (
          <div className="min-w-0 space-y-3">
            <h4 className="flex items-center gap-1.5 text-sm font-bold text-info">
              <Lightbulb className="size-3.5" aria-hidden /> Suggested next steps
            </h4>
            <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground marker:text-subtle-foreground">
              {insight.actions.map((action) => (
                <li key={action} className="break-words">
                  {action}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * A studio's summary of one playtest's feedback: the overall mood, top
 * highlights, what testers like and dislike, bugs, and suggested next steps.
 *
 * It is written by Gemini when the server has it switched on, and refreshed
 * (at most once per visit) when new feedback has come in. Whenever the AI is
 * unavailable, an automatic summary computed from the feedback is shown
 * instead, with a note saying so. The panel never shows an error because the AI
 * failed.
 */
export function InsightsPanel({
  playtestId,
  className,
}: {
  playtestId: string;
  className?: string;
}) {
  const { insight, loading, generating, error, generate, reload } =
    useInsight(playtestId);

  const frame = cn("rounded-xl border-2 border-line bg-surface p-5 sm:p-6", className);

  if (error && !insight) {
    return (
      <ErrorState
        title="Couldn't load the summary"
        description={error}
        onRetry={reload}
      />
    );
  }

  if (loading || !insight) {
    return (
      <section className={frame} aria-busy="true" aria-label="Feedback summary">
        <InsightSkeleton />
      </section>
    );
  }

  const sentiment = INSIGHT_SENTIMENT_META[insight.sentimentLabel];
  const status = insightStatusLine(insight);
  const isAi = insight.source === "ai";

  return (
    <section className={frame} aria-labelledby={`insight-title-${playtestId}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <h3
            id={`insight-title-${playtestId}`}
            className="font-display text-base font-bold"
          >
            Feedback summary
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={isAi ? "primary" : "muted"}>
              {isAi && <Sparkles className="size-3" aria-hidden />}
              {isAi ? "AI summary" : "Automatic summary"}
            </Badge>
            {insight.totalFeedback > 0 && (
              <Badge tone={sentiment.tone}>{sentiment.label}</Badge>
            )}
          </div>
        </div>

        {canRefreshInsight(insight) && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => void generate()}
            loading={generating}
          >
            <RefreshCw aria-hidden />
            {isAi ? "Update summary" : "Write AI summary"}
          </Button>
        )}
      </div>

      <div className="mt-4 space-y-4" aria-live="polite">
        {generating && (
          <p className="text-sm text-muted-foreground">
            Writing a fresh summary. This usually takes a few seconds.
          </p>
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

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>

      <div className="mt-5">
        <InsightBody insight={insight} />
      </div>

      <p className="mt-6 text-xs leading-relaxed text-subtle-foreground">
        {isAi
          ? `${insightCoverage(insight)}${insight.generatedAt ? ` Written ${formatRelativeTime(insight.generatedAt)}.` : ""} `
          : ""}
        {insight.aiEnabled
          ? "AI summaries send the review text, without tester names, to Google Gemini. Check them against the reviews before acting on them."
          : "Counts and themes are taken directly from the reviews."}
      </p>
    </section>
  );
}
