/**
 * Pure helpers for the match lists (suggested testers, recommended playtests).
 * No React, no store.
 */

import type { BadgeTone } from "@/lib/constants";
import type { MatchList } from "@/lib/types";

/** Score bands. The score itself comes from the server's weighted rules. */
export const MATCH_BANDS = { strong: 75, good: 55 } as const;

export function matchStrength(score: number): { label: string; tone: BadgeTone } {
  if (score >= MATCH_BANDS.strong) return { label: "Strong match", tone: "success" };
  if (score >= MATCH_BANDS.good) return { label: "Good match", tone: "primary" };
  return { label: "Possible match", tone: "muted" };
}

/**
 * One sentence on why the list is not AI-ranked right now, or null. The server
 * supplies the reason; this adds what is shown instead.
 */
export function matchStatusLine(list: Pick<MatchList, "notice">): string | null {
  return list.notice ? `${list.notice} Showing the rule-based order.` : null;
}

/** Whether asking for a fresh AI ranking can do anything. */
export function canRankWithAi(list: Pick<MatchList, "aiEnabled" | "stale">): boolean {
  return list.aiEnabled && list.stale;
}
