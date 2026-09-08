/**
 * App-wide constants: brand metadata, navigation config, and human-readable
 * labels for the domain unions in `types.ts`. Keeping these here avoids magic
 * strings in components and gives us one place to localise later.
 */

import type {
  ApplicationStatus,
  ExperienceLevel,
  GameGenre,
  GamePlatform,
  PlaytestFocus,
  PlaytestStatus,
} from "@/lib/types";

export const SITE = {
  name: "Grogu",
  fullName: "Project Grogu",
  description:
    "Grogu connects indie game developers with dedicated playtesters — structured playtests, actionable feedback, and a reputation system that rewards good testing.",
  url: "https://grogu.example.com",
} as const;

/* -------------------------------------------------------------------------- */
/*  Navigation                                                                 */
/* -------------------------------------------------------------------------- */

export interface NavItem {
  label: string;
  href: string;
  description?: string;
}

export const MARKETING_NAV: NavItem[] = [
  { label: "How it works", href: "/how-it-works" },
  { label: "For developers", href: "/developers" },
  { label: "Discover games", href: "/discover" },
];

export const TESTER_NAV: NavItem[] = [
  { label: "Discover", href: "/discover", description: "Find playtests to join" },
  { label: "Applications", href: "/applications", description: "Track your applications" },
  { label: "Profile", href: "/profile", description: "Your tester reputation" },
];

export const DEVELOPER_NAV: NavItem[] = [
  { label: "Dashboard", href: "/developer/dashboard", description: "Overview of your playtests" },
  { label: "Games", href: "/developer/games", description: "Manage your games" },
];

/* -------------------------------------------------------------------------- */
/*  Domain labels                                                              */
/* -------------------------------------------------------------------------- */

export const GENRE_LABELS: Record<GameGenre, string> = {
  action: "Action",
  adventure: "Adventure",
  rpg: "RPG",
  strategy: "Strategy",
  puzzle: "Puzzle",
  simulation: "Simulation",
  roguelike: "Roguelike",
  platformer: "Platformer",
  shooter: "Shooter",
  horror: "Horror",
};

export const PLATFORM_LABELS: Record<GamePlatform, string> = {
  pc: "PC",
  mac: "macOS",
  linux: "Linux",
  web: "Browser",
  mobile: "Mobile",
  console: "Console",
};

export const EXPERIENCE_LABELS: Record<ExperienceLevel, string> = {
  casual: "Casual",
  regular: "Regular",
  hardcore: "Hardcore",
  professional: "Professional",
};

export const FOCUS_LABELS: Record<PlaytestFocus, string> = {
  onboarding: "Onboarding",
  "difficulty-balance": "Difficulty & balance",
  "level-design": "Level design",
  performance: "Performance",
  narrative: "Narrative",
  "ui-ux": "UI / UX",
  multiplayer: "Multiplayer",
  general: "General impressions",
};

/** Badge tone maps to a semantic colour token (see `components/ui/badge`). */
export const PLAYTEST_STATUS_META: Record<
  PlaytestStatus,
  { label: string; tone: "success" | "info" | "warning" | "muted" }
> = {
  draft: { label: "Draft", tone: "muted" },
  recruiting: { label: "Recruiting", tone: "success" },
  "in-progress": { label: "In progress", tone: "info" },
  review: { label: "In review", tone: "warning" },
  completed: { label: "Completed", tone: "muted" },
  closed: { label: "Closed", tone: "muted" },
};

export const APPLICATION_STATUS_META: Record<
  ApplicationStatus,
  { label: string; tone: "success" | "warning" | "destructive" | "muted" }
> = {
  pending: { label: "Pending", tone: "warning" },
  accepted: { label: "Accepted", tone: "success" },
  rejected: { label: "Rejected", tone: "destructive" },
  withdrawn: { label: "Withdrawn", tone: "muted" },
};

/** Rating dimensions shown in the feedback UI, in display order. */
export const RATING_DIMENSIONS = [
  { key: "fun", label: "Fun" },
  { key: "difficulty", label: "Difficulty" },
  { key: "clarity", label: "Clarity" },
  { key: "performance", label: "Performance" },
  { key: "polish", label: "Polish" },
] as const;
