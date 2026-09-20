/**
 * Server-side data accessors.
 *
 * Used by Server Components (landing, /discover, /playtests/[id], the auth
 * layout) for the initial render. Client Components read live state through
 * `lib/hooks/*` over the client cache instead; mutations go through
 * `lib/services/*`.
 *
 * These read the public slice of `GET /api/v1/bootstrap` — no bearer token, so
 * the API returns only what an anonymous visitor may see. Every signature is
 * unchanged from when this file returned hardcoded seed data; only the source
 * moved.
 */

import type {
  Application,
  Feedback,
  Game,
  Playtest,
  PlaytestAnalytics,
  PlaytestWithRelations,
  User,
} from "@/lib/types";
import { computeAnalytics, joinPlaytest, joinPlaytests } from "@/lib/domain";
import {
  type BootstrapSnapshot,
  EMPTY_SNAPSHOT,
  fetchBootstrap,
} from "@/lib/services/bootstrap";

/**
 * One fetch per render pass. Next.js dedupes identical `fetch` calls within a
 * request, and a short revalidate window keeps the marketing pages from hitting
 * the API on every visit while still reflecting new playtests promptly.
 *
 * A failed load degrades to empty collections rather than throwing: a marketing
 * page with no featured games still renders, an error page helps nobody.
 */
async function snapshot(): Promise<BootstrapSnapshot> {
  try {
    return await fetchBootstrap({ cache: "no-store" });
  } catch (error) {
    // Server-rendered marketing pages must still render when the API is down or
    // misconfigured, so this degrades to empty rather than throwing. One line,
    // because Next surfaces console output in the dev overlay.
    console.error(
      "[grogu] bootstrap unavailable, rendering empty:",
      error instanceof Error ? error.message : error,
    );
    return EMPTY_SNAPSHOT;
  }
}

/* -------------------------------------------------------------------------- */
/*  Games                                                                      */
/* -------------------------------------------------------------------------- */

export async function getGames(): Promise<Game[]> {
  return (await snapshot()).games;
}

export async function getGameById(id: string): Promise<Game | undefined> {
  return (await snapshot()).games.find((g) => g.id === id);
}

/** Games surfaced on the marketing landing page. */
export async function getFeaturedGames(limit = 3): Promise<Game[]> {
  const { games, playtests } = await snapshot();

  const recruitingGameIds = new Set(
    playtests.filter((p) => p.status === "recruiting").map((p) => p.gameId),
  );

  return [...games]
    .sort((a, b) => {
      const aHot = recruitingGameIds.has(a.id) ? 1 : 0;
      const bHot = recruitingGameIds.has(b.id) ? 1 : 0;
      if (aHot !== bHot) return bHot - aHot;
      return b.updatedAt.localeCompare(a.updatedAt);
    })
    .slice(0, limit);
}

export async function getGamesByDeveloper(developerId: string): Promise<Game[]> {
  return (await snapshot()).games.filter((g) => g.developerId === developerId);
}

/* -------------------------------------------------------------------------- */
/*  Users                                                                      */
/* -------------------------------------------------------------------------- */

export async function getUserById(id: string): Promise<User | undefined> {
  return (await snapshot()).users.find((u) => u.id === id);
}

export async function getTesterProfile(userId: string) {
  const { users, testerProfiles } = await snapshot();
  const user = users.find((u) => u.id === userId && u.role === "tester");
  const profile = testerProfiles.find((p) => p.userId === userId);
  if (!user || !profile) return undefined;
  return { user, profile };
}

export async function getDeveloperProfile(userId: string) {
  const { users, developerProfiles } = await snapshot();
  const user = users.find((u) => u.id === userId && u.role === "developer");
  const profile = developerProfiles.find((p) => p.userId === userId);
  if (!user || !profile) return undefined;
  return { user, profile };
}

/* -------------------------------------------------------------------------- */
/*  Playtests                                                                  */
/* -------------------------------------------------------------------------- */

export async function getPlaytests(options?: {
  status?: Playtest["status"];
}): Promise<PlaytestWithRelations[]> {
  const { playtests, games, users } = await snapshot();

  return joinPlaytests(
    playtests.filter((p) => (options?.status ? p.status === options.status : true)),
    games,
    users,
  );
}

/** Open playtests a tester can currently apply to. */
export async function getDiscoverablePlaytests(): Promise<
  PlaytestWithRelations[]
> {
  return (await getPlaytests({ status: "recruiting" })).sort((a, b) =>
    a.closesAt.localeCompare(b.closesAt),
  );
}

export async function getPlaytestById(
  id: string,
): Promise<PlaytestWithRelations | undefined> {
  const { playtests, games, users } = await snapshot();
  const match = playtests.find((p) => p.id === id);
  return match ? joinPlaytest(match, games, users) : undefined;
}

export async function getPlaytestsByDeveloper(
  developerId: string,
): Promise<PlaytestWithRelations[]> {
  return (await getPlaytests()).filter((p) => p.developerId === developerId);
}

/* -------------------------------------------------------------------------- */
/*  Applications                                                               */
/* -------------------------------------------------------------------------- */
// The public snapshot carries no applications, so these return empty on the
// server. Both are read from the client cache in practice, where the signed-in
// caller's own applications are present.

export async function getApplicationsByTester(
  testerId: string,
): Promise<Application[]> {
  return (await snapshot()).applications
    .filter((a) => a.testerId === testerId)
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
}

export async function getApplicationsForPlaytest(
  playtestId: string,
): Promise<Application[]> {
  return (await snapshot()).applications.filter(
    (a) => a.playtestId === playtestId,
  );
}

/* -------------------------------------------------------------------------- */
/*  Feedback + analytics                                                       */
/* -------------------------------------------------------------------------- */

export async function getFeedbackForPlaytest(
  playtestId: string,
): Promise<Feedback[]> {
  return (await snapshot()).feedback.filter((f) => f.playtestId === playtestId);
}

export async function getPlaytestAnalytics(
  playtestId: string,
): Promise<PlaytestAnalytics | undefined> {
  const { playtests, feedback } = await snapshot();
  const playtest = playtests.find((p) => p.id === playtestId);
  if (!playtest) return undefined;

  // Shared with the client hook so both agree on how a rate is rounded.
  return computeAnalytics(
    playtest,
    feedback.filter((f) => f.playtestId === playtestId),
  );
}

/* -------------------------------------------------------------------------- */
/*  Landing-page aggregate stats                                               */
/* -------------------------------------------------------------------------- */

// Served as counts by the API rather than derived from the arrays: an
// anonymous caller receives no feedback rows, so counting locally would report
// zero submissions on the public pages.
export async function getPlatformStats() {
  return (await snapshot()).stats;
}
