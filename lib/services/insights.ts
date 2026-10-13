/**
 * Feedback insights — developer side. Backed by `/api/v1/playtests/{id}/insights`.
 *
 * `loadInsight` (GET) never calls the AI: it returns the cached AI summary or a
 * rule-based one. `refreshInsight` (POST) asks the server to write a new AI
 * summary, which it only does when feedback has arrived since the last one. In
 * both cases the server falls back instead of failing when Gemini is off,
 * rate-limited or down, and says why in `notice`.
 */

import type { PlaytestInsight } from "@/lib/types";
import { useGroguStore } from "@/lib/store/grogu-store";

import { dedupe } from "./dedupe";
import { apiFetch } from "./http";

function keep(insight: PlaytestInsight): PlaytestInsight {
  useGroguStore.getState().applyEntity("insights", insight);
  return insight;
}

/** The summary as it stands. Does not call the AI. */
export function loadInsight(playtestId: string): Promise<PlaytestInsight> {
  return dedupe(`insight:GET:${playtestId}`, () =>
    apiFetch<PlaytestInsight>(`/api/v1/playtests/${playtestId}/insights`).then(keep),
  );
}

/** Asks for a new AI summary if one is due; otherwise returns the current one. */
export function refreshInsight(playtestId: string): Promise<PlaytestInsight> {
  return dedupe(`insight:POST:${playtestId}`, () =>
    apiFetch<PlaytestInsight>(`/api/v1/playtests/${playtestId}/insights`, {
      method: "POST",
    }).then(keep),
  );
}
