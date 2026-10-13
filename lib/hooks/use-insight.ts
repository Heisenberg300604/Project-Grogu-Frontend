"use client";

import type { PlaytestInsight } from "@/lib/types";
import { insightsService } from "@/lib/services";
import { useAiResource } from "@/lib/hooks/use-ai-resource";

export interface InsightState {
  /** The latest summary the client has for this playtest, if any. */
  insight: PlaytestInsight | undefined;
  /** First load, with nothing to show yet. */
  loading: boolean;
  /** A new AI summary is being written. */
  generating: boolean;
  /** The summary could not be loaded at all (not an AI failure — see `insight.notice`). */
  error: string | null;
  /** Ask for a new AI summary now. */
  generate: () => Promise<void>;
  /** Try the first load again. */
  reload: () => void;
}

/**
 * The feedback summary for one playtest: loads it, and writes a new AI summary
 * once per visit when feedback has arrived since the last one.
 */
export function useInsight(playtestId: string): InsightState {
  const { data, ...state } = useAiResource({
    key: `insight:${playtestId}`,
    select: (s) => s.insights.find((entry) => entry.id === playtestId),
    load: () => insightsService.loadInsight(playtestId),
    refresh: () => insightsService.refreshInsight(playtestId),
    loadError: "Couldn't load the feedback summary. Please try again.",
  });

  return { insight: data, ...state };
}
