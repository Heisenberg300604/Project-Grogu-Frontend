/**
 * Pure domain helpers — no React, no store, no data imports.
 *
 * Shared by the server-side seed accessors (`data/index.ts`) and the client
 * selector hooks (`lib/hooks/*`) so join / filter / aggregate logic lives in
 * exactly one place.
 */

import type {
  Application,
  ExperienceLevel,
  Feedback,
  FeedbackRatings,
  Game,
  GameGenre,
  GamePlatform,
  Playtest,
  PlaytestAnalytics,
  PlaytestWithRelations,
  TestProgress,
  TesterTest,
  User,
} from "@/lib/types";

export const EXPERIENCE_ORDER: ExperienceLevel[] = [
  "casual",
  "regular",
  "hardcore",
  "professional",
];

export function experienceRank(level: ExperienceLevel) {
  return EXPERIENCE_ORDER.indexOf(level);
}

export function joinPlaytest(
  playtest: Playtest,
  games: Game[],
  users: User[],
): PlaytestWithRelations | undefined {
  const game = games.find((g) => g.id === playtest.gameId);
  const developer = users.find((u) => u.id === playtest.developerId);
  if (!game || !developer) return undefined;
  return { ...playtest, game, developer };
}

export function joinPlaytests(
  playtests: Playtest[],
  games: Game[],
  users: User[],
): PlaytestWithRelations[] {
  return playtests
    .map((p) => joinPlaytest(p, games, users))
    .filter((p): p is PlaytestWithRelations => Boolean(p));
}

export interface DiscoverFilters {
  search: string;
  genres: GameGenre[];
  platforms: GamePlatform[];
  ndaOnly: boolean;
  maxHours: number | null;
}

export const EMPTY_DISCOVER_FILTERS: DiscoverFilters = {
  search: "",
  genres: [],
  platforms: [],
  ndaOnly: false,
  maxHours: null,
};

export function matchesDiscoverFilters(
  playtest: PlaytestWithRelations,
  filters: DiscoverFilters,
): boolean {
  const haystack =
    `${playtest.title} ${playtest.summary} ${playtest.game.title} ${playtest.developer.name}`.toLowerCase();
  if (filters.search.trim() && !haystack.includes(filters.search.trim().toLowerCase())) {
    return false;
  }
  if (
    filters.genres.length &&
    !filters.genres.some((g) => playtest.game.genres.includes(g))
  ) {
    return false;
  }
  if (
    filters.platforms.length &&
    !filters.platforms.some((p) => playtest.requirements.platforms.includes(p))
  ) {
    return false;
  }
  if (filters.ndaOnly && !playtest.requirements.ndaRequired) return false;
  if (
    filters.maxHours != null &&
    playtest.requirements.estimatedHours > filters.maxHours
  ) {
    return false;
  }
  return true;
}

const ZERO_RATINGS: FeedbackRatings = {
  fun: 0,
  difficulty: 0,
  clarity: 0,
  performance: 0,
  polish: 0,
};

export function averageRatings(entries: Feedback[]): FeedbackRatings {
  if (!entries.length) return { ...ZERO_RATINGS };
  const sum = entries.reduce(
    (acc, f) => ({
      fun: acc.fun + f.ratings.fun,
      difficulty: acc.difficulty + f.ratings.difficulty,
      clarity: acc.clarity + f.ratings.clarity,
      performance: acc.performance + f.ratings.performance,
      polish: acc.polish + f.ratings.polish,
    }),
    { ...ZERO_RATINGS },
  );
  const round = (n: number) => Math.round((n / entries.length) * 10) / 10;
  return {
    fun: round(sum.fun),
    difficulty: round(sum.difficulty),
    clarity: round(sum.clarity),
    performance: round(sum.performance),
    polish: round(sum.polish),
  };
}

export function overallRating(ratings: FeedbackRatings): number {
  const values = [
    ratings.fun,
    ratings.clarity,
    ratings.performance,
    ratings.polish,
  ];
  const active = values.filter((v) => v > 0);
  if (!active.length) return 0;
  return Math.round((active.reduce((a, b) => a + b, 0) / active.length) * 10) / 10;
}

export function computeAnalytics(
  playtest: Playtest,
  entries: Feedback[],
): PlaytestAnalytics {
  const count = entries.length;
  return {
    playtestId: playtest.id,
    responseRate:
      playtest.acceptedTesters > 0
        ? Math.round((count / playtest.acceptedTesters) * 100)
        : 0,
    averageRatings: averageRatings(entries),
    sentimentBreakdown: {
      positive: entries.filter((f) => f.sentiment === "positive").length,
      neutral: entries.filter((f) => f.sentiment === "neutral").length,
      negative: entries.filter((f) => f.sentiment === "negative").length,
    },
    totalBugs: entries.reduce((acc, f) => acc + f.bugs.length, 0),
    averageHoursPlayed: count
      ? Math.round((entries.reduce((a, f) => a + f.hoursPlayed, 0) / count) * 10) /
        10
      : 0,
  };
}

export function buildTesterTests(
  testerId: string,
  applications: Application[],
  playtests: PlaytestWithRelations[],
  progress: TestProgress[],
): TesterTest[] {
  return applications
    .filter((a) => a.testerId === testerId && a.status === "accepted")
    .map((application) => {
      const playtest = playtests.find((p) => p.id === application.playtestId);
      if (!playtest) return null;
      return {
        playtest,
        application,
        progress:
          progress.find(
            (p) => p.playtestId === playtest.id && p.testerId === testerId,
          ) ?? null,
      } satisfies TesterTest;
    })
    .filter((t): t is TesterTest => t !== null);
}

export function testCompletion(progress: TestProgress | null, playtest: Playtest) {
  const required = playtest.tasks.filter((t) => t.required);
  const done = required.filter((t) =>
    progress?.completedTaskIds.includes(t.id),
  ).length;
  return {
    done,
    total: required.length,
    ratio: required.length ? done / required.length : 0,
  };
}
