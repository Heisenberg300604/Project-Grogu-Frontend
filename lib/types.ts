/**
 * Project Grogu — domain models.
 *
 * These types are the single source of truth for the shape of Grogu data, and
 * the contract the API is built to satisfy: `/api/v1` returns these exact
 * shapes. Pages and components should only ever import from here — never
 * redeclare an entity inline.
 */

export type ID = string;
export type ISODateString = string;

/* -------------------------------------------------------------------------- */
/*  Shared enums / unions                                                      */
/* -------------------------------------------------------------------------- */

export type UserRole = "tester" | "developer";

export type GamePlatform = "pc" | "mac" | "linux" | "web" | "mobile" | "console";

export type GameGenre =
  | "action"
  | "adventure"
  | "rpg"
  | "strategy"
  | "puzzle"
  | "simulation"
  | "roguelike"
  | "platformer"
  | "shooter"
  | "horror";

export type GameStatus = "in-development" | "alpha" | "beta" | "released";

export type PlaytestStatus =
  | "draft"
  | "recruiting"
  | "in-progress"
  | "review"
  | "completed"
  | "closed"
  | "archived";

export type PlaytestFocus =
  | "onboarding"
  | "difficulty-balance"
  | "level-design"
  | "performance"
  | "narrative"
  | "ui-ux"
  | "multiplayer"
  | "general";

export type ExperienceLevel = "casual" | "regular" | "hardcore" | "professional";

export type ApplicationStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "withdrawn";

export type TaskType = "objective" | "survey" | "bug-report" | "free-play";

export type TaskStatus = "not-started" | "in-progress" | "submitted";

export type FeedbackSentiment = "positive" | "neutral" | "negative";

/** A studio's decision on a review. Only `submitted` reviews can be decided. */
export type ReviewStatus = "submitted" | "approved" | "rejected";

/* -------------------------------------------------------------------------- */
/*  Users                                                                      */
/* -------------------------------------------------------------------------- */

export interface User {
  id: ID;
  role: UserRole;
  name: string;
  handle: string;
  email: string;
  /** Optional — the UI renders an initials avatar when absent. */
  avatarUrl?: string;
  location: string;
  bio: string;
  joinedAt: ISODateString;
}

export interface TesterProfile {
  userId: ID;
  experienceLevel: ExperienceLevel;
  /** Genres the tester enjoys and is credible testing. */
  preferredGenres: GameGenre[];
  platforms: GamePlatform[];
  /** Spoken/written languages, used to match narrative playtests. */
  languages: string[];
  /** Weekly hours the tester can commit. */
  weeklyAvailabilityHours: number;
  /**
   * Reputation points: the sum of the tester's reputation events (profile
   * bonuses, participation, approved reviews). Unbounded; see `level`.
   */
  reputation: number;
  /** Level from the server's threshold table (`reputationLevels`). */
  level: number;
  levelTitle: string;
  /** Reputation at which the current level starts. */
  levelFloor: number;
  /** Reputation needed for the next level; null at the top level. */
  nextLevelAt: number | null;
  completedPlaytests: number;
  averageFeedbackRating: number;
  /** Short, human-readable strengths shown on the public profile. */
  badges: string[];
}

export interface DeveloperProfile {
  userId: ID;
  studioName: string;
  studioSize: "solo" | "small" | "mid" | "large";
  website: string;
  foundedYear: number;
  gamesPublished: number;
  activePlaytests: number;
}

/* -------------------------------------------------------------------------- */
/*  Games                                                                      */
/* -------------------------------------------------------------------------- */

export interface Game {
  id: ID;
  developerId: ID;
  title: string;
  tagline: string;
  description: string;
  genres: GameGenre[];
  platforms: GamePlatform[];
  status: GameStatus;
  /** Optional — the UI renders procedural cover art from `accent` when absent. */
  coverImageUrl?: string;
  /** Accent hue (0–360) used to generate the game's cover art + card treatment. */
  accentHue: number;
  buildVersion: string;
  updatedAt: ISODateString;
}

/* -------------------------------------------------------------------------- */
/*  Playtests                                                                  */
/* -------------------------------------------------------------------------- */

export interface TesterRequirements {
  minExperienceLevel: ExperienceLevel;
  platforms: GamePlatform[];
  /** Optional genre familiarity the developer wants. */
  preferredGenres: GameGenre[];
  languages: string[];
  minReputation: number;
  estimatedHours: number;
  ndaRequired: boolean;
}

export interface PlaytestTask {
  id: ID;
  title: string;
  description: string;
  type: TaskType;
  required: boolean;
  estimatedMinutes: number;
}

export interface Playtest {
  id: ID;
  gameId: ID;
  developerId: ID;
  title: string;
  summary: string;
  goals: string[];
  focusAreas: PlaytestFocus[];
  status: PlaytestStatus;
  requirements: TesterRequirements;
  tasks: PlaytestTask[];
  /** What testers get. Free-text for the prototype (e.g. "Steam key + credit"). */
  reward: string;
  /** Cash portion of the reward, in whole Indian rupees, when applicable. */
  cashReward?: number;
  maxTesters: number;
  acceptedTesters: number;
  applicantCount: number;
  /**
   * How testers get the game. These three are only populated for the studio
   * that owns the playtest and for testers accepted to it; everyone else
   * receives empty strings.
   */
  buildUrl: string;
  installInstructions: string;
  accessKey: string;
  opensAt: ISODateString;
  /** Applications close on this date. */
  closesAt: ISODateString;
  createdAt: ISODateString;
}

/* -------------------------------------------------------------------------- */
/*  Applications                                                               */
/* -------------------------------------------------------------------------- */

export interface Application {
  id: ID;
  playtestId: ID;
  testerId: ID;
  status: ApplicationStatus;
  /** Tester's pitch to the developer. */
  message: string;
  submittedAt: ISODateString;
  decidedAt: ISODateString | null;
  /** Developer's private note about the decision. */
  decisionNote: string | null;
}

/* -------------------------------------------------------------------------- */
/*  Feedback                                                                   */
/* -------------------------------------------------------------------------- */

export interface FeedbackRatings {
  /** All ratings are on a 1–5 scale. */
  fun: number;
  difficulty: number;
  clarity: number;
  performance: number;
  polish: number;
}

export interface FeedbackAnswer {
  taskId: ID;
  question: string;
  answer: string;
}

export interface Feedback {
  id: ID;
  playtestId: ID;
  testerId: ID;
  ratings: FeedbackRatings;
  sentiment: FeedbackSentiment;
  /** Free-form summary written by the tester. */
  summary: string;
  highlights: string[];
  painPoints: string[];
  bugs: string[];
  answers: FeedbackAnswer[];
  wouldRecommend: boolean;
  hoursPlayed: number;
  /** Screenshots and recordings the tester attached. */
  media: FeedbackMedia[];
  submittedAt: ISODateString;
  reviewStatus: ReviewStatus;
  /** The studio's note to the tester, if it left one. */
  reviewNote: string | null;
  reviewedAt: ISODateString | null;
  /** What the studio granted. All zero/false until the review is approved. */
  rewards: FeedbackRewards;
}

export interface FeedbackRewards {
  /** Approval reputation plus any studio bonus. */
  reputation: number;
  /** Whole rupees credited to the tester's ledger. */
  cash: number;
  /** A key from the game's inventory was allocated to this review. */
  gameKey: boolean;
}

export interface FeedbackMedia {
  /** A path under the API (`/uploads/…`) or an absolute https URL. */
  url: string;
  kind: "image" | "video";
  name: string;
}

/* -------------------------------------------------------------------------- */
/*  Composed view models                                                       */
/* -------------------------------------------------------------------------- */

/** A playtest joined with its game + developer, ready for list/detail views. */
export interface PlaytestWithRelations extends Playtest {
  game: Game;
  developer: User;
}

/** Aggregated numbers shown on a developer's playtest analytics view. */
export interface PlaytestAnalytics {
  playtestId: ID;
  responseRate: number;
  averageRatings: FeedbackRatings;
  sentimentBreakdown: Record<FeedbackSentiment, number>;
  totalBugs: number;
  averageHoursPlayed: number;
}

/* -------------------------------------------------------------------------- */
/*  Tester test progress (workspace workflow)                                  */
/* -------------------------------------------------------------------------- */

export type TestStage =
  | "not-started"
  | "in-progress"
  | "tasks-complete"
  | "feedback-submitted"
  | "completed";

/** One tester's progress through one playtest they were accepted to. */
export interface TestProgress {
  id: ID;
  playtestId: ID;
  testerId: ID;
  stage: TestStage;
  completedTaskIds: ID[];
  buildDownloaded: boolean;
  startedAt: ISODateString | null;
  completedAt: ISODateString | null;
  feedbackId: ID | null;
}

/** A playtest joined with the current tester's application + progress. */
export interface TesterTest {
  playtest: PlaytestWithRelations;
  application: Application;
  progress: TestProgress | null;
}

/* -------------------------------------------------------------------------- */
/*  Notifications                                                              */
/* -------------------------------------------------------------------------- */

export type NotificationType =
  | "application-accepted"
  | "application-rejected"
  | "application-received"
  | "feedback-received"
  | "playtest-published"
  | "test-reminder"
  | "system"
  | "feedback-approved"
  | "feedback-rejected"
  | "game-key-sent"
  | "reputation-earned"
  | "level-up"
  | "playtest-invite";

export interface Notification {
  id: ID;
  userId: ID;
  type: NotificationType;
  title: string;
  body: string;
  /** In-app link the notification points to, if any. */
  href: string | null;
  read: boolean;
  createdAt: ISODateString;
}

/* -------------------------------------------------------------------------- */
/*  Rewards and reputation                                                     */
/* -------------------------------------------------------------------------- */

/**
 * One key in a game's reward inventory. Only the studio that owns the game
 * ever receives these; testers are told to check their email instead.
 */
export interface GameKey {
  id: ID;
  gameId: ID;
  code: string;
  status: "available" | "allocated";
  /** The tester the key was given to. */
  allocatedTo: ID | null;
  feedbackId: ID | null;
  allocatedAt: ISODateString | null;
  createdAt: ISODateString;
}

/**
 * One line of a tester's money ledger. The balance is the sum of entries;
 * there is no stored balance. Whole Indian rupees.
 */
export interface LedgerEntry {
  id: ID;
  userId: ID;
  /** Positive for credits; a future payout would be negative. */
  amount: number;
  kind: "review-reward" | "payout" | "adjustment";
  playtestId: ID | null;
  feedbackId: ID | null;
  note: string;
  createdAt: ISODateString;
}

/** The signed-in tester's payout details. Never sent to anyone else. */
export interface Wallet {
  /** Sum of the tester's ledger entries, in rupees. */
  balance: number;
  /** Where payouts would go. Empty when unset. */
  upiId: string;
}

export type ReputationCategory = "profile" | "participation" | "review" | "other";

/** How reputation is earned. Amounts come from the server's rules table. */
export interface ReputationRule {
  reason: string;
  amount: number;
  /** The amount is chosen per award (the studio bonus), capped at `maxAmount`. */
  variable: boolean;
  maxAmount: number | null;
  category: ReputationCategory;
  label: string;
  description: string;
}

/** One change to a tester's reputation. */
export interface ReputationEvent {
  id: ID;
  userId: ID;
  reason: string;
  label: string;
  amount: number;
  playtestId: ID | null;
  feedbackId: ID | null;
  note: string;
  createdAt: ISODateString;
}

export interface ReputationLevel {
  level: number;
  title: string;
  minReputation: number;
}

/* -------------------------------------------------------------------------- */
/*  Feedback insights                                                          */
/* -------------------------------------------------------------------------- */

/** A theme testers raised, with how many different reviews mentioned it. */
export interface InsightPoint {
  text: string;
  mentions: number;
}

export type InsightSource = "ai" | "rules";

export type InsightSentiment = "positive" | "mixed" | "negative" | "neutral" | "none";

/**
 * A studio's summary of one playtest's feedback. Not part of the bootstrap:
 * it is fetched per playtest (`insightsService`).
 *
 * `source` says where the text came from. "ai" is a Gemini summary the server
 * cached; "rules" is computed from the feedback itself and is what a studio
 * sees when Gemini is off, rate-limited, down, or has not run yet. The sentiment
 * counts always come from the feedback rows, never from the model.
 */
export interface PlaytestInsight {
  /** Same as `playtestId`, so the store can upsert it. */
  id: ID;
  playtestId: ID;
  source: InsightSource;
  /** Whether this server can produce AI summaries at all. */
  aiEnabled: boolean;
  /** Newer feedback exists than the shown summary covers, or no AI summary yet. */
  stale: boolean;
  /** Reviews the shown summary covers. */
  feedbackCount: number;
  /** Reviews that exist now. */
  totalFeedback: number;
  generatedAt: ISODateString | null;
  model: string | null;
  /** Why a fresh AI summary was not produced, when that is worth saying. */
  notice: string | null;
  sentiment: Record<FeedbackSentiment, number>;
  sentimentLabel: InsightSentiment;
  summary: string;
  /** Short takeaways for the studio, most important first. */
  highlights: string[];
  likes: InsightPoint[];
  dislikes: InsightPoint[];
  bugs: InsightPoint[];
  /** Suggested next steps. Empty for rule-based summaries. */
  actions: string[];
}

/* -------------------------------------------------------------------------- */
/*  Matching                                                                   */
/* -------------------------------------------------------------------------- */
/*
 * Who fits which playtest. The server decides eligibility (platform, language,
 * experience, reputation, not already applied, playtest open) and scores each
 * eligible pair 0–100. When Gemini is on it may re-order the top of that list
 * and add `aiReason`; it never adds anyone. Neither list is in the bootstrap.
 */

export type MatchSource = "ai" | "rules";

/** Fields both match lists share. */
export interface MatchList {
  source: MatchSource;
  /** Whether this server can AI-rank at all. */
  aiEnabled: boolean;
  /** The list changed since the last AI ranking (or none exists yet). */
  stale: boolean;
  generatedAt: ISODateString | null;
  model: string | null;
  /** Why a fresh AI ranking was not produced, when that is worth saying. */
  notice: string | null;
  /** Everyone eligible, not just the shown top of the list. */
  eligibleCount: number;
}

export interface TesterSuggestion {
  testerId: ID;
  /** 0–100 rule-based fit. */
  score: number;
  /** Up to three strengths, strongest first. */
  reasons: string[];
  /** One line from the AI, when it ranked the list. */
  aiReason: string | null;
  /** The studio already invited this tester. */
  invited: boolean;
}

/** Testers who fit a recruiting playtest, for the studio that owns it. */
export interface TesterSuggestions extends MatchList {
  /** Same as `playtestId`, so the store can upsert it. */
  id: ID;
  playtestId: ID;
  /** Recruiting with spots left. Suggestions only exist while this is true. */
  open: boolean;
  suggestions: TesterSuggestion[];
}

export interface PlaytestRecommendation {
  playtestId: ID;
  score: number;
  reasons: string[];
  aiReason: string | null;
  /** The studio invited this tester. */
  invited: boolean;
}

/** Open playtests that fit the signed-in tester. */
export interface PlaytestRecommendations extends MatchList {
  /** The tester's user id, so the store can upsert it. */
  id: ID;
  testerId: ID;
  recommendations: PlaytestRecommendation[];
}

/* -------------------------------------------------------------------------- */
/*  Session                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * The signed-in user. Produced by `lib/services/auth` from the API's login
 * response and held in the client store; the bearer token itself lives in
 * `lib/services/http`, not here.
 */
export interface Session {
  user: User;
  role: UserRole;
  /** Epoch ms — used to show a friendly "signed in" time, nothing security-related. */
  issuedAt: number;
}

/* -------------------------------------------------------------------------- */
/*  Form inputs (create flows)                                                 */
/* -------------------------------------------------------------------------- */

export interface NewGameInput {
  title: string;
  tagline: string;
  description: string;
  genres: GameGenre[];
  platforms: GamePlatform[];
  status: GameStatus;
  buildVersion: string;
  accentHue: number;
  /** Uploaded poster. `null` removes it; leaving it out keeps the current one. */
  coverImageUrl?: string | null;
}

export type UpdateGameInput = NewGameInput;

export interface NewPlaytestInput {
  gameId: ID;
  title: string;
  summary: string;
  goals: string[];
  focusAreas: PlaytestFocus[];
  requirements: TesterRequirements;
  tasks: Omit<PlaytestTask, "id">[];
  reward: string;
  maxTesters: number;
  closesAt: ISODateString;
  buildUrl: string;
  installInstructions: string;
  accessKey: string;
  publish: boolean;
}

export interface UpdatePlaytestInput {
  gameId: ID;
  title: string;
  summary: string;
  goals: string[];
  focusAreas: PlaytestFocus[];
  requirements: TesterRequirements;
  tasks: Array<Omit<PlaytestTask, "id"> & { id?: ID }>;
  reward: string;
  maxTesters: number;
  closesAt: ISODateString;
  buildUrl: string;
  installInstructions: string;
  accessKey: string;
}

/** The access details a studio can change after publishing. Partial. */
export interface PlaytestAccessInput {
  buildUrl?: string;
  installInstructions?: string;
  accessKey?: string;
}

/** Payload the tester feedback form produces. */
export interface FeedbackInput {
  ratings: FeedbackRatings;
  sentiment: FeedbackSentiment;
  summary: string;
  highlights: string[];
  painPoints: string[];
  bugs: string[];
  answers: FeedbackAnswer[];
  wouldRecommend: boolean;
  hoursPlayed: number;
  media: FeedbackMedia[];
}

/** A studio's decision on a review. Rewards are ignored on a rejection. */
export interface FeedbackReviewInput {
  decision: "approved" | "rejected";
  note?: string;
  /** Extra reputation on top of the approval award. */
  reputationBonus?: number;
  /** Whole rupees. */
  cashAmount?: number;
  /** Allocate one key from the game's inventory. */
  gameKey?: boolean;
}

/** Payload the tester application form produces. */
export interface ApplicationInput {
  message: string;
  device: string;
  experienceNote: string;
  agreedToTerms: boolean;
}
