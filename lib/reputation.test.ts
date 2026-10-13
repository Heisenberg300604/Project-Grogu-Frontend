import { describe, expect, it } from "vitest";

import { isValidUpiId, levelProgress, rewardSummary } from "@/lib/domain";
import { formatRupees } from "@/lib/utils";

describe("levelProgress", () => {
  it("measures progress through the current level", () => {
    expect(levelProgress({ reputation: 80, levelFloor: 60, nextLevelAt: 100 })).toEqual({
      percent: 50,
      toNext: 20,
    });
  });

  it("is empty at the start of a level", () => {
    expect(levelProgress({ reputation: 60, levelFloor: 60, nextLevelAt: 100 })).toEqual({
      percent: 0,
      toNext: 40,
    });
  });

  it("is full with nothing to go at the top level", () => {
    expect(levelProgress({ reputation: 900, levelFloor: 600, nextLevelAt: null })).toEqual({
      percent: 100,
      toNext: null,
    });
  });

  it("clamps out-of-range values instead of overflowing the bar", () => {
    expect(levelProgress({ reputation: 10, levelFloor: 25, nextLevelAt: 60 }).percent).toBe(0);
    expect(levelProgress({ reputation: 70, levelFloor: 25, nextLevelAt: 60 }).percent).toBe(100);
  });
});

describe("formatRupees", () => {
  it("uses Indian digit grouping and no decimals", () => {
    expect(formatRupees(150000)).toBe("₹1,50,000");
    expect(formatRupees(500)).toBe("₹500");
  });
});

describe("isValidUpiId", () => {
  it("accepts handle@provider", () => {
    expect(isValidUpiId("priya.nair@okaxis")).toBe(true);
    expect(isValidUpiId(" player-1@upi ")).toBe(true);
  });

  it("rejects anything else", () => {
    expect(isValidUpiId("")).toBe(false);
    expect(isValidUpiId("not a upi")).toBe(false);
    expect(isValidUpiId("name@")).toBe(false);
    expect(isValidUpiId("@bank")).toBe(false);
    expect(isValidUpiId("name@bank.com")).toBe(false);
  });
});

describe("rewardSummary", () => {
  it("lists what was granted", () => {
    expect(rewardSummary({ reputation: 25, cash: 500, gameKey: true })).toBe(
      "+25 reputation, ₹500, a game key",
    );
  });

  it("is empty when nothing was granted", () => {
    expect(rewardSummary({ reputation: 0, cash: 0, gameKey: false })).toBe("");
  });
});
