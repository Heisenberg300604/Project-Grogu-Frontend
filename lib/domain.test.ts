import { describe, expect, it } from "vitest";
import {
  EMPTY_DISCOVER_FILTERS,
  PLAYTEST_STATUS_TRANSITIONS,
  averageRatings,
  canTransitionPlaytestStatus,
  computeAnalytics,
  experienceRank,
  isClosingSoon,
  matchesDiscoverFilters,
  overallRating,
  playtestCapacity,
} from "@/lib/domain";
import {
  makeFeedback,
  makePlaytest,
  withRelations,
} from "@/lib/testing/factories";

describe("playtest status transitions", () => {
  it("allows the documented forward moves", () => {
    expect(canTransitionPlaytestStatus("draft", "recruiting")).toBe(true);
    expect(canTransitionPlaytestStatus("recruiting", "in-progress")).toBe(true);
    expect(canTransitionPlaytestStatus("review", "completed")).toBe(true);
  });

  it("rejects skipping steps and moving backwards", () => {
    expect(canTransitionPlaytestStatus("draft", "completed")).toBe(false);
    expect(canTransitionPlaytestStatus("completed", "recruiting")).toBe(false);
  });

  it("treats archived as terminal", () => {
    expect(PLAYTEST_STATUS_TRANSITIONS.archived).toEqual([]);
  });

  it("lets every non-terminal status be closed or progressed", () => {
    for (const [status, next] of Object.entries(PLAYTEST_STATUS_TRANSITIONS)) {
      if (status === "archived") continue;
      expect(next.length).toBeGreaterThan(0);
    }
  });
});

describe("experienceRank", () => {
  it("orders levels from casual to professional", () => {
    expect(experienceRank("casual")).toBeLessThan(experienceRank("regular"));
    expect(experienceRank("regular")).toBeLessThan(experienceRank("hardcore"));
    expect(experienceRank("hardcore")).toBeLessThan(
      experienceRank("professional"),
    );
  });
});

describe("playtestCapacity", () => {
  it("reports spots left and fill ratio", () => {
    const c = playtestCapacity({ maxTesters: 10, acceptedTesters: 4 });
    expect(c.spotsLeft).toBe(6);
    expect(c.filledRatio).toBeCloseTo(0.4);
    expect(c.isFull).toBe(false);
    expect(c.isNearlyFull).toBe(false);
  });

  it("flags nearly full at a quarter of the roster or less", () => {
    expect(
      playtestCapacity({ maxTesters: 8, acceptedTesters: 6 }).isNearlyFull,
    ).toBe(true);
  });

  it("flags full and never reports negative spots", () => {
    const c = playtestCapacity({ maxTesters: 5, acceptedTesters: 7 });
    expect(c.spotsLeft).toBe(0);
    expect(c.isFull).toBe(true);
    expect(c.isNearlyFull).toBe(false);
    expect(c.filledRatio).toBe(1);
  });
});

describe("isClosingSoon", () => {
  const daysFromNow = (d: number) =>
    new Date(Date.now() + d * 24 * 60 * 60 * 1000).toISOString();

  it("is true inside the closing window", () => {
    expect(isClosingSoon(daysFromNow(2))).toBe(true);
  });

  it("is false when the window is far away", () => {
    expect(isClosingSoon(daysFromNow(30))).toBe(false);
  });

  it("is false once the date has passed", () => {
    expect(isClosingSoon(daysFromNow(-3))).toBe(false);
  });
});

describe("matchesDiscoverFilters", () => {
  const playtest = withRelations(makePlaytest());

  it("matches everything with empty filters", () => {
    expect(matchesDiscoverFilters(playtest, EMPTY_DISCOVER_FILTERS)).toBe(true);
  });

  it("searches title, game and developer case-insensitively", () => {
    const f = { ...EMPTY_DISCOVER_FILTERS };
    expect(matchesDiscoverFilters(playtest, { ...f, search: "LANTERN" })).toBe(
      true,
    );
    expect(matchesDiscoverFilters(playtest, { ...f, search: "driftwood" })).toBe(
      true,
    );
    expect(matchesDiscoverFilters(playtest, { ...f, search: "nonsense" })).toBe(
      false,
    );
  });

  it("filters by genre and platform", () => {
    const f = { ...EMPTY_DISCOVER_FILTERS };
    expect(matchesDiscoverFilters(playtest, { ...f, genres: ["horror"] })).toBe(
      false,
    );
    expect(
      matchesDiscoverFilters(playtest, { ...f, genres: ["simulation"] }),
    ).toBe(true);
    expect(
      matchesDiscoverFilters(playtest, { ...f, platforms: ["console"] }),
    ).toBe(false);
  });

  it("filters by NDA and estimated hours", () => {
    const f = { ...EMPTY_DISCOVER_FILTERS };
    expect(matchesDiscoverFilters(playtest, { ...f, ndaOnly: true })).toBe(
      false,
    );
    expect(matchesDiscoverFilters(playtest, { ...f, maxHours: 2 })).toBe(false);
    expect(matchesDiscoverFilters(playtest, { ...f, maxHours: 3 })).toBe(true);
  });
});

describe("feedback aggregation", () => {
  it("returns zeroes when there is no feedback", () => {
    expect(averageRatings([])).toEqual({
      fun: 0,
      difficulty: 0,
      clarity: 0,
      performance: 0,
      polish: 0,
    });
  });

  it("averages each rating to one decimal", () => {
    const entries = [
      makeFeedback({
        ratings: { fun: 5, difficulty: 3, clarity: 4, performance: 4, polish: 4 },
      }),
      makeFeedback({
        id: "2",
        ratings: { fun: 4, difficulty: 3, clarity: 4, performance: 5, polish: 4 },
      }),
    ];
    expect(averageRatings(entries).fun).toBe(4.5);
    expect(averageRatings(entries).performance).toBe(4.5);
  });

  it("ignores difficulty in the overall rating", () => {
    expect(
      overallRating({
        fun: 4,
        difficulty: 1,
        clarity: 4,
        performance: 4,
        polish: 4,
      }),
    ).toBe(4);
  });

  it("computes response rate, sentiment, bugs and hours", () => {
    const playtest = makePlaytest({ acceptedTesters: 4 });
    const entries = [
      makeFeedback({ bugs: ["crash"], hoursPlayed: 2 }),
      makeFeedback({
        id: "2",
        sentiment: "negative",
        bugs: ["glitch", "freeze"],
        hoursPlayed: 4,
      }),
    ];
    const a = computeAnalytics(playtest, entries);
    expect(a.responseRate).toBe(50);
    expect(a.sentimentBreakdown).toEqual({
      positive: 1,
      neutral: 0,
      negative: 1,
    });
    expect(a.totalBugs).toBe(3);
    expect(a.averageHoursPlayed).toBe(3);
  });

  it("reports a zero response rate when nobody was accepted", () => {
    expect(computeAnalytics(makePlaytest(), []).responseRate).toBe(0);
  });
});
