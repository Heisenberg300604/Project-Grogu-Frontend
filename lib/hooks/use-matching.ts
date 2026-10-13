"use client";

import { matchingService } from "@/lib/services";
import { useAiResource } from "@/lib/hooks/use-ai-resource";

/**
 * Testers who fit one of the studio's playtests. Loads the rule-based list and
 * asks for an AI ranking once per visit when the list has changed.
 */
export function useTesterSuggestions(playtestId: string, enabled = true) {
  return useAiResource({
    key: enabled ? `suggestions:${playtestId}` : null,
    select: (s) => s.testerSuggestions.find((entry) => entry.id === playtestId),
    load: () => matchingService.loadSuggestions(playtestId),
    refresh: () => matchingService.rankSuggestions(playtestId),
    loadError: "Couldn't load suggested testers. Please try again.",
  });
}

/** Open playtests that fit the signed-in tester. */
export function usePlaytestRecommendations(testerId: string | undefined) {
  return useAiResource({
    key: testerId ? `recommendations:${testerId}` : null,
    select: (s) => s.playtestRecommendations.find((entry) => entry.id === testerId),
    load: () => matchingService.loadRecommendations(),
    refresh: () => matchingService.rankRecommendations(),
    loadError: "Couldn't load your recommendations. Please try again.",
  });
}
