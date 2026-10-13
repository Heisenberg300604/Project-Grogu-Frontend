import { describe, expect, it } from "vitest";

import { canRankWithAi, matchStatusLine, matchStrength } from "@/lib/matching";

describe("matchStrength", () => {
  it("bands the score", () => {
    expect(matchStrength(90).label).toBe("Strong match");
    expect(matchStrength(75).label).toBe("Strong match");
    expect(matchStrength(74).label).toBe("Good match");
    expect(matchStrength(55).label).toBe("Good match");
    expect(matchStrength(54).label).toBe("Possible match");
    expect(matchStrength(0).label).toBe("Possible match");
  });
});

describe("matchStatusLine", () => {
  it("says nothing without a notice", () => {
    expect(matchStatusLine({ notice: null })).toBeNull();
  });

  it("names the rule-based order when the AI did not run", () => {
    expect(matchStatusLine({ notice: "The AI service is busy." })).toBe(
      "The AI service is busy. Showing the rule-based order.",
    );
  });
});

describe("canRankWithAi", () => {
  it("needs an AI-enabled server and a changed list", () => {
    expect(canRankWithAi({ aiEnabled: true, stale: true })).toBe(true);
    expect(canRankWithAi({ aiEnabled: true, stale: false })).toBe(false);
    expect(canRankWithAi({ aiEnabled: false, stale: true })).toBe(false);
  });
});
