/**
 * The one read the app makes.
 *
 * `GET /api/v1/bootstrap` returns every collection the store holds, scoped to
 * whoever the bearer token identifies. The UI joins across collections locally
 * (see `lib/hooks/use-grogu.ts`), so fetching them together is what lets those
 * hooks keep working unchanged now that the data is real.
 */

import type {
  Application,
  DeveloperProfile,
  Feedback,
  Game,
  Notification,
  Playtest,
  Session,
  TestProgress,
  TesterProfile,
  User,
  UserRole,
} from "@/lib/types";

import { apiBaseUrl } from "@/lib/config";

import { apiFetch, ServiceError } from "./http";

/** What the server sends. `session` is null for an anonymous caller. */
export interface BootstrapSnapshot {
  session: { user: User; role: UserRole } | null;
  users: User[];
  testerProfiles: TesterProfile[];
  developerProfiles: DeveloperProfile[];
  games: Game[];
  playtests: Playtest[];
  applications: Application[];
  feedback: Feedback[];
  testProgress: TestProgress[];
  notifications: Notification[];
  /** Platform-wide totals for the marketing pages; always public. */
  stats: PlatformStats;
}

export interface PlatformStats {
  games: number;
  activePlaytests: number;
  testers: number;
  feedbackSubmitted: number;
}

export const EMPTY_SNAPSHOT: BootstrapSnapshot = {
  session: null,
  users: [],
  testerProfiles: [],
  developerProfiles: [],
  games: [],
  playtests: [],
  applications: [],
  feedback: [],
  testProgress: [],
  notifications: [],
  stats: { games: 0, activePlaytests: 0, testers: 0, feedbackSubmitted: 0 },
};

export async function fetchBootstrap(options?: {
  signal?: AbortSignal;
  cache?: RequestCache;
}): Promise<BootstrapSnapshot> {
  try {
    return await apiFetch<BootstrapSnapshot>("/api/v1/bootstrap", {
      signal: options?.signal,
      cache: options?.cache,
    });
  } catch (error) {
    // A 404 on this endpoint is never a missing record — the route itself is
    // absent, which means the configured API is an older build that predates
    // `/api/v1`. Say that, instead of the generic "we couldn't find that".
    if (error instanceof ServiceError && error.status === 404) {
      throw new ServiceError(
        `The API at ${apiBaseUrl()} has no /api/v1 endpoints. That backend is ` +
          "running a build from before the integration — deploy the current " +
          "grogu-backend, or point NEXT_PUBLIC_API_BASE_URL at one that has it.",
        "server-error",
        404,
      );
    }
    throw error;
  }
}

/** Turns the snapshot's session into the {@link Session} the store keeps. */
export function sessionFromSnapshot(snapshot: BootstrapSnapshot): Session | null {
  if (!snapshot.session) return null;

  return {
    user: snapshot.session.user,
    role: snapshot.session.role,
    issuedAt: Date.now(),
  };
}
