/**
 * Pure domain helpers — no React, no store, no data imports.
 *
 * Shared by the server-side seed accessors (`data/index.ts`) and the client
 * selector hooks (`lib/hooks/*`) so join / filter / aggregate logic lives in
 * exactly one place.
 */

import type {
  Application,
  DeveloperProfile,
  ExperienceLevel,
  Feedback,
  FeedbackRatings,
  FeedbackRewards,
  Game,
  GameGenre,
  GamePlatform,
  Playtest,
  PlaytestAnalytics,
  PlaytestStatus,
  PlaytestWithRelations,
  TestProgress,
  TesterProfile,
  TesterTest,
  User,
} from "@/lib/types";
import { formatRupees } from "@/lib/utils";

export const EXPERIENCE_ORDER: ExperienceLevel[] = [
  "casual",
  "regular",
  "hardcore",
  "professional",
];

export const PLAYTEST_STATUS_TRANSITIONS: Record<
  PlaytestStatus,
  readonly PlaytestStatus[]
> = {
  draft: ["recruiting"],
  recruiting: ["in-progress", "closed"],
  "in-progress": ["review", "closed"],
  review: ["completed", "closed"],
  completed: ["archived"],
  closed: ["archived"],
  archived: [],
};

export function canTransitionPlaytestStatus(
  from: PlaytestStatus,
  to: PlaytestStatus,
): boolean {
  return PLAYTEST_STATUS_TRANSITIONS[from].includes(to);
}

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

/* -------------------------------------------------------------------------- */
/*  Playtest capacity + urgency                                                */
/* -------------------------------------------------------------------------- */

/** Days a playtest counts as "closing soon" for the purposes of a badge. */
export const CLOSING_SOON_DAYS = 5;

export interface PlaytestCapacity {
  spotsLeft: number;
  /** 0–1, how much of the roster is filled. */
  filledRatio: number;
  isFull: boolean;
  /** Fewer than a quarter of the slots remain, but it isn't full yet. */
  isNearlyFull: boolean;
}

/** Roster maths for a playtest. Shared by cards, the apply panel and manage. */
export function playtestCapacity(
  playtest: Pick<Playtest, "maxTesters" | "acceptedTesters">,
): PlaytestCapacity {
  const max = Math.max(1, playtest.maxTesters);
  const spotsLeft = Math.max(0, playtest.maxTesters - playtest.acceptedTesters);
  const filledRatio = Math.min(1, playtest.acceptedTesters / max);
  return {
    spotsLeft,
    filledRatio,
    isFull: spotsLeft === 0,
    isNearlyFull: spotsLeft > 0 && spotsLeft / max <= 0.25,
  };
}

/** True when applications close within `CLOSING_SOON_DAYS` (and haven't yet). */
export function isClosingSoon(closesAt: string): boolean {
  const ms = new Date(closesAt).getTime() - Date.now();
  const days = Math.ceil(ms / (1000 * 60 * 60 * 24));
  return days >= 0 && days <= CLOSING_SOON_DAYS;
}

/* -------------------------------------------------------------------------- */
/*  Tester + studio directory                                                  */
/* -------------------------------------------------------------------------- */

export interface TesterDirectoryEntry {
  user: User;
  profile: TesterProfile;
}

export interface StudioDirectoryEntry {
  user: User;
  profile: DeveloperProfile;
}

export type StudioSize = DeveloperProfile["studioSize"];

/** Pairs each tester profile with its user, dropping orphans. */
export function joinTesters(
  users: User[],
  profiles: TesterProfile[],
): TesterDirectoryEntry[] {
  const byId = new Map(users.map((u) => [u.id, u]));
  return profiles.flatMap((profile) => {
    const user = byId.get(profile.userId);
    return user && user.role === "tester" ? [{ user, profile }] : [];
  });
}

/** Pairs each studio profile with its owner, dropping orphans. */
export function joinStudios(
  users: User[],
  profiles: DeveloperProfile[],
): StudioDirectoryEntry[] {
  const byId = new Map(users.map((u) => [u.id, u]));
  return profiles.flatMap((profile) => {
    const user = byId.get(profile.userId);
    return user && user.role === "developer" ? [{ user, profile }] : [];
  });
}

export interface TesterFilters {
  search: string;
  experience: ExperienceLevel[];
  platforms: GamePlatform[];
  genres: GameGenre[];
}

export const EMPTY_TESTER_FILTERS: TesterFilters = {
  search: "",
  experience: [],
  platforms: [],
  genres: [],
};

export function matchesTesterFilters(
  { user, profile }: TesterDirectoryEntry,
  filters: TesterFilters,
): boolean {
  const query = filters.search.trim().toLowerCase();
  if (query) {
    const haystack =
      `${user.name} ${user.handle} ${user.location} ${user.bio}`.toLowerCase();
    if (!haystack.includes(query)) return false;
  }
  if (
    filters.experience.length &&
    !filters.experience.includes(profile.experienceLevel)
  ) {
    return false;
  }
  if (
    filters.platforms.length &&
    !filters.platforms.some((p) => profile.platforms.includes(p))
  ) {
    return false;
  }
  if (
    filters.genres.length &&
    !filters.genres.some((g) => profile.preferredGenres.includes(g))
  ) {
    return false;
  }
  return true;
}

export type TesterSort = "reputation" | "completed" | "availability" | "name";

/** Returns a new array; ties fall back to name so the order is stable. */
export function sortTesters(
  list: TesterDirectoryEntry[],
  sort: TesterSort,
): TesterDirectoryEntry[] {
  const byName = (a: TesterDirectoryEntry, b: TesterDirectoryEntry) =>
    a.user.name.localeCompare(b.user.name);
  const key = (e: TesterDirectoryEntry) => {
    switch (sort) {
      case "completed":
        return e.profile.completedPlaytests;
      case "availability":
        return e.profile.weeklyAvailabilityHours;
      case "reputation":
        return e.profile.reputation;
      default:
        return 0;
    }
  };
  return [...list].sort((a, b) =>
    sort === "name" ? byName(a, b) : key(b) - key(a) || byName(a, b),
  );
}

export interface StudioFilters {
  search: string;
  sizes: StudioSize[];
}

export const EMPTY_STUDIO_FILTERS: StudioFilters = { search: "", sizes: [] };

export function matchesStudioFilters(
  { user, profile }: StudioDirectoryEntry,
  filters: StudioFilters,
): boolean {
  const query = filters.search.trim().toLowerCase();
  if (query) {
    const haystack =
      `${profile.studioName} ${user.name} ${user.location} ${user.bio}`.toLowerCase();
    if (!haystack.includes(query)) return false;
  }
  if (filters.sizes.length && !filters.sizes.includes(profile.studioSize)) {
    return false;
  }
  return true;
}

export type StudioSort = "active" | "games" | "founded" | "name";

/** Returns a new array; ties fall back to studio name so the order is stable. */
export function sortStudios(
  list: StudioDirectoryEntry[],
  sort: StudioSort,
): StudioDirectoryEntry[] {
  const byName = (a: StudioDirectoryEntry, b: StudioDirectoryEntry) =>
    a.profile.studioName.localeCompare(b.profile.studioName);
  const key = (e: StudioDirectoryEntry) => {
    switch (sort) {
      case "games":
        return e.profile.gamesPublished;
      case "founded":
        return e.profile.foundedYear;
      case "active":
        return e.profile.activePlaytests;
      default:
        return 0;
    }
  };
  return [...list].sort((a, b) =>
    sort === "name" ? byName(a, b) : key(b) - key(a) || byName(a, b),
  );
}

/* -------------------------------------------------------------------------- */
/*  Reputation                                                                 */
/* -------------------------------------------------------------------------- */

export interface LevelProgress {
  /** 0–100 through the current level; 100 at the top level. */
  percent: number;
  /** Reputation still needed for the next level; null at the top level. */
  toNext: number | null;
}

/** How far a tester is through their current level, from the server's fields. */
export function levelProgress(
  profile: Pick<TesterProfile, "reputation" | "levelFloor" | "nextLevelAt">,
): LevelProgress {
  if (profile.nextLevelAt === null) return { percent: 100, toNext: null };

  const span = Math.max(1, profile.nextLevelAt - profile.levelFloor);
  const into = Math.min(span, Math.max(0, profile.reputation - profile.levelFloor));
  return {
    percent: Math.round((into / span) * 100),
    toNext: Math.max(0, profile.nextLevelAt - profile.reputation),
  };
}

/**
 * A UPI id in `handle@provider` form. Format only, and the same pattern the
 * server enforces (grogu_upi_id); no payment method is integrated.
 */
const UPI_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]{1,255}@[A-Za-z][A-Za-z0-9]{1,63}$/;

export function isValidUpiId(value: string): boolean {
  return UPI_ID_PATTERN.test(value.trim());
}

/** "+25 reputation, ₹500, a game key" — empty when nothing was granted. */
export function rewardSummary(rewards: FeedbackRewards): string {
  const parts: string[] = [];
  if (rewards.reputation > 0) parts.push(`+${rewards.reputation} reputation`);
  if (rewards.cash > 0) parts.push(formatRupees(rewards.cash));
  if (rewards.gameKey) parts.push("a game key");
  return parts.join(", ");
}
