/**
 * Matching — who fits which playtest.
 *
 * - Studio side: `/api/v1/playtests/{id}/suggestions` and `/invites`.
 * - Tester side: `/api/v1/recommendations` (always the signed-in tester).
 *
 * As with insights, `load*` (GET) never calls the AI and `rank*` (POST) asks
 * the server for a fresh AI ranking, which it only produces when the list has
 * changed. Gemini being off or failing is never an error: the rule-based order
 * comes back with a `notice`.
 */

import type { PlaytestRecommendations, TesterSuggestions } from "@/lib/types";
import { useGroguStore } from "@/lib/store/grogu-store";

import { dedupe } from "./dedupe";
import { apiFetch } from "./http";

function keepSuggestions(list: TesterSuggestions): TesterSuggestions {
  useGroguStore.getState().applyEntity("testerSuggestions", list);
  return list;
}

function keepRecommendations(list: PlaytestRecommendations): PlaytestRecommendations {
  useGroguStore.getState().applyEntity("playtestRecommendations", list);
  return list;
}

/* ---- Studio side --------------------------------------------------------- */

export function loadSuggestions(playtestId: string): Promise<TesterSuggestions> {
  return dedupe(`suggestions:GET:${playtestId}`, () =>
    apiFetch<TesterSuggestions>(`/api/v1/playtests/${playtestId}/suggestions`).then(keepSuggestions),
  );
}

export function rankSuggestions(playtestId: string): Promise<TesterSuggestions> {
  return dedupe(`suggestions:POST:${playtestId}`, () =>
    apiFetch<TesterSuggestions>(`/api/v1/playtests/${playtestId}/suggestions`, {
      method: "POST",
    }).then(keepSuggestions),
  );
}

/**
 * Invites a tester to apply. They get an in-app notification, once. The
 * suggestion is marked invited straight away, then the list is re-read.
 */
export async function inviteTester(playtestId: string, testerId: string): Promise<void> {
  await apiFetch(`/api/v1/playtests/${playtestId}/invites`, {
    method: "POST",
    body: { testerId },
  });

  const current = useGroguStore
    .getState()
    .testerSuggestions.find((list) => list.id === playtestId);
  if (current) {
    keepSuggestions({
      ...current,
      suggestions: current.suggestions.map((s) =>
        s.testerId === testerId ? { ...s, invited: true } : s,
      ),
    });
  }

  void loadSuggestions(playtestId);
}

/* ---- Tester side --------------------------------------------------------- */

export function loadRecommendations(): Promise<PlaytestRecommendations> {
  return dedupe("recommendations:GET", () =>
    apiFetch<PlaytestRecommendations>("/api/v1/recommendations").then(keepRecommendations),
  );
}

export function rankRecommendations(): Promise<PlaytestRecommendations> {
  return dedupe("recommendations:POST", () =>
    apiFetch<PlaytestRecommendations>("/api/v1/recommendations", { method: "POST" }).then(
      keepRecommendations,
    ),
  );
}
