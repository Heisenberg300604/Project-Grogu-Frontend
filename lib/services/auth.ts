/**
 * Authentication against the Grogu API.
 *
 * Was a mock that matched an email against seed data and fabricated a session.
 * Now `POST /api/v1/auth/{login,signup}` returns a bearer token plus the user;
 * the token is stored by `lib/services/http`, and the full dataset is loaded
 * straight afterwards so the UI has data the moment it redirects.
 */

import type {
  DeveloperProfile,
  ExperienceLevel,
  GameGenre,
  GamePlatform,
  Session,
  User,
  UserRole,
} from "@/lib/types";
import { useGroguStore } from "@/lib/store/grogu-store";

import { apiFetch, setAuthToken } from "./http";

/**
 * Demo accounts shown as one-click buttons on the login form. They are seeded
 * into the database by `db/migrations/004_demo_accounts.sql`; the password is
 * deliberately public because these are shared demo logins, and they hold no
 * data that is not already visible in the demo.
 */
export const DEMO_PASSWORD = "playtest";

export const DEMO_ACCOUNTS: Record<UserRole, { email: string; label: string }> = {
  tester: { email: "priya.nair@example.com", label: "Priya Nair · Tester" },
  developer: { email: "mara@driftwoodgames.dev", label: "Mara Okafor · Developer" },
};

interface AuthResponse {
  token: string;
  expiresAt: string;
  user: User;
  role: UserRole;
}

export interface LoginInput {
  email: string;
  password: string;
}

/** Stores the token, then loads the caller's data before returning. */
async function establishSession(response: AuthResponse): Promise<Session> {
  setAuthToken(response.token);

  const session: Session = {
    user: response.user,
    role: response.role,
    issuedAt: Date.now(),
  };

  useGroguStore.getState().setSession(session, response.token);
  await useGroguStore.getState().refresh();

  return useGroguStore.getState().session ?? session;
}

export async function login(input: LoginInput): Promise<Session> {
  const response = await apiFetch<AuthResponse>("/api/v1/auth/login", {
    method: "POST",
    auth: false,
    body: { email: input.email.trim(), password: input.password },
  });

  return establishSession(response);
}

export async function loginAsDemo(role: UserRole): Promise<Session> {
  return login({ email: DEMO_ACCOUNTS[role].email, password: DEMO_PASSWORD });
}

export interface TesterSignupInput {
  role: "tester";
  name: string;
  email: string;
  password: string;
  location: string;
  experienceLevel: ExperienceLevel;
  preferredGenres: GameGenre[];
  platforms: GamePlatform[];
  weeklyAvailabilityHours: number;
}

export interface DeveloperSignupInput {
  role: "developer";
  name: string;
  email: string;
  password: string;
  location: string;
  studioName: string;
  studioSize: DeveloperProfile["studioSize"];
  website: string;
}

export type SignupInput = TesterSignupInput | DeveloperSignupInput;

export async function signup(input: SignupInput): Promise<Session> {
  const response = await apiFetch<AuthResponse>("/api/v1/auth/signup", {
    method: "POST",
    auth: false,
    body: { ...input, email: input.email.trim(), name: input.name.trim() },
  });

  return establishSession(response);
}

export async function logout(): Promise<void> {
  try {
    await apiFetch<unknown>("/api/v1/auth/logout", { method: "POST" });
  } catch {
    // Tokens are stateless, so the local session is cleared either way; a
    // failed call must not strand someone in a signed-in shell.
  }

  useGroguStore.getState().setSession(null);
}

/** Synchronous read of the current session (the store holds it). */
export function getSession(): Session | null {
  return useGroguStore.getState().session;
}
