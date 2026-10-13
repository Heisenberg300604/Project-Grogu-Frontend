import type {
  DeveloperProfile,
  Feedback,
  Game,
  Playtest,
  PlaytestWithRelations,
  TesterProfile,
  User,
} from "@/lib/types";

/** Fixture builders for unit tests. Each takes overrides for the fields a test cares about. */
export const NOW = "2026-01-01T00:00:00.000Z";

export function makePlaytest(overrides: Partial<Playtest> = {}): Playtest {
  return {
    id: "1",
    gameId: "1",
    developerId: "1",
    title: "Winter build",
    summary: "First impressions",
    goals: [],
    focusAreas: [],
    status: "recruiting",
    requirements: {
      minExperienceLevel: "casual",
      platforms: ["pc"],
      preferredGenres: [],
      languages: ["English"],
      minReputation: 0,
      estimatedHours: 3,
      ndaRequired: false,
    },
    tasks: [],
    reward: "",
    maxTesters: 10,
    acceptedTesters: 0,
    applicantCount: 0,
    buildUrl: "",
    installInstructions: "",
    accessKey: "",
    opensAt: NOW,
    closesAt: NOW,
    createdAt: NOW,
    ...overrides,
  };
}

export function makeGame(overrides: Partial<Game> = {}): Game {
  return {
    id: "1",
    developerId: "1",
    title: "Lanternfall",
    tagline: "",
    description: "",
    genres: ["simulation"],
    platforms: ["pc"],
    status: "beta",
    accentHue: 34,
    buildVersion: "0.1.0",
    updatedAt: NOW,
    ...overrides,
  };
}

export function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: "1",
    role: "developer",
    name: "Driftwood Games",
    handle: "driftwood",
    email: "",
    location: "",
    bio: "",
    joinedAt: NOW,
    ...overrides,
  };
}

export function makeFeedback(overrides: Partial<Feedback> = {}): Feedback {
  return {
    id: "1",
    playtestId: "1",
    testerId: "1",
    ratings: { fun: 4, difficulty: 3, clarity: 4, performance: 5, polish: 4 },
    sentiment: "positive",
    summary: "",
    highlights: [],
    painPoints: [],
    bugs: [],
    answers: [],
    wouldRecommend: true,
    hoursPlayed: 2,
    media: [],
    submittedAt: NOW,
    reviewStatus: "submitted",
    reviewNote: null,
    reviewedAt: null,
    rewards: { reputation: 0, cash: 0, gameKey: false },
    ...overrides,
  };
}

export function withRelations(
  playtest: Playtest,
  game: Game = makeGame(),
  developer: User = makeUser(),
): PlaytestWithRelations {
  return { ...playtest, game, developer };
}


export function makeTesterProfile(
  overrides: Partial<TesterProfile> = {},
): TesterProfile {
  return {
    userId: "1",
    experienceLevel: "regular",
    preferredGenres: ["rpg"],
    platforms: ["pc"],
    languages: ["English"],
    weeklyAvailabilityHours: 6,
    reputation: 50,
    level: 2,
    levelTitle: "Rookie",
    levelFloor: 25,
    nextLevelAt: 60,
    completedPlaytests: 0,
    averageFeedbackRating: 0,
    badges: [],
    ...overrides,
  };
}

export function makeDeveloperProfile(
  overrides: Partial<DeveloperProfile> = {},
): DeveloperProfile {
  return {
    userId: "1",
    studioName: "Driftwood Games",
    studioSize: "small",
    website: "",
    foundedYear: 2020,
    gamesPublished: 0,
    activePlaytests: 0,
    ...overrides,
  };
}
