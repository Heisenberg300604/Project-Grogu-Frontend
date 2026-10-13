/**
 * Pure helpers for the feedback-summary panel: what to say about where a
 * summary came from, and whether it can be refreshed. No React, no store.
 */

import type { PlaytestInsight } from "@/lib/types";

type Coverage = Pick<PlaytestInsight, "source" | "feedbackCount" | "totalFeedback">;

/** Reviews that arrived after the shown AI summary was written. */
export function newReviewCount(insight: Coverage): number {
  return insight.source === "ai"
    ? Math.max(0, insight.totalFeedback - insight.feedbackCount)
    : 0;
}

/**
 * One sentence on why the shown summary may not be the AI's latest, or null
 * when there is nothing to say. The server supplies the reason (`notice`); this
 * adds what the studio is looking at instead.
 */
export function insightStatusLine(
  insight: Pick<PlaytestInsight, "source" | "notice">,
): string | null {
  if (!insight.notice) return null;

  return insight.source === "ai"
    ? `${insight.notice} Showing the last AI summary.`
    : `${insight.notice} Showing an automatic summary.`;
}

/** Whether asking the server for a new AI summary can do anything. */
export function canRefreshInsight(
  insight: Pick<PlaytestInsight, "aiEnabled" | "stale">,
): boolean {
  return insight.aiEnabled && insight.stale;
}

/** How much feedback the shown summary is based on. */
export function insightCoverage(insight: Coverage): string {
  const reviews = (n: number) => `${n} ${n === 1 ? "review" : "reviews"}`;
  const fresh = newReviewCount(insight);

  return fresh > 0
    ? `Based on ${reviews(insight.feedbackCount)}. ${fresh} newer ${fresh === 1 ? "review has" : "reviews have"} come in since.`
    : `Based on ${reviews(insight.feedbackCount)}.`;
}
