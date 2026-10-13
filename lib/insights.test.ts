import { describe, expect, it } from "vitest";

import {
  canRefreshInsight,
  insightCoverage,
  insightStatusLine,
  newReviewCount,
} from "@/lib/insights";

describe("newReviewCount", () => {
  it("counts reviews newer than an AI summary", () => {
    expect(newReviewCount({ source: "ai", feedbackCount: 4, totalFeedback: 7 })).toBe(3);
  });

  it("is zero for a rule-based summary, which always covers everything", () => {
    expect(newReviewCount({ source: "rules", feedbackCount: 7, totalFeedback: 7 })).toBe(0);
  });

  it("never goes negative if reviews were removed", () => {
    expect(newReviewCount({ source: "ai", feedbackCount: 5, totalFeedback: 3 })).toBe(0);
  });
});

describe("insightStatusLine", () => {
  it("says nothing without a notice", () => {
    expect(insightStatusLine({ source: "ai", notice: null })).toBeNull();
  });

  it("names the automatic summary when AI did not run", () => {
    expect(insightStatusLine({ source: "rules", notice: "The AI service is busy." })).toBe(
      "The AI service is busy. Showing an automatic summary.",
    );
  });

  it("names the last AI summary when a refresh failed", () => {
    expect(insightStatusLine({ source: "ai", notice: "The AI service didn't respond." })).toBe(
      "The AI service didn't respond. Showing the last AI summary.",
    );
  });
});

describe("canRefreshInsight", () => {
  it("needs both an AI-enabled server and something new to summarise", () => {
    expect(canRefreshInsight({ aiEnabled: true, stale: true })).toBe(true);
    expect(canRefreshInsight({ aiEnabled: true, stale: false })).toBe(false);
    expect(canRefreshInsight({ aiEnabled: false, stale: true })).toBe(false);
  });
});

describe("insightCoverage", () => {
  it("states the review count", () => {
    expect(insightCoverage({ source: "ai", feedbackCount: 1, totalFeedback: 1 })).toBe("Based on 1 review.");
  });

  it("mentions newer reviews", () => {
    expect(insightCoverage({ source: "ai", feedbackCount: 5, totalFeedback: 6 })).toBe(
      "Based on 5 reviews. 1 newer review has come in since.",
    );
    expect(insightCoverage({ source: "ai", feedbackCount: 3, totalFeedback: 6 })).toBe(
      "Based on 3 reviews. 3 newer reviews have come in since.",
    );
  });
});
