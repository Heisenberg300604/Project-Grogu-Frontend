/**
 * Profile service. Backed by `PATCH /api/v1/profile`.
 *
 * New: the prototype had no way to edit a profile, because there was nowhere to
 * save it to. The payload covers the shared `User` fields plus whichever role
 * profile applies; the server picks the right one from the caller's role.
 */

import type {
  DeveloperProfile,
  ExperienceLevel,
  GameGenre,
  GamePlatform,
  User,
} from "@/lib/types";
import { useGroguStore } from "@/lib/store/grogu-store";

import { apiFetch } from "./http";

export interface ProfileInput {
  name?: string;
  location?: string;
  bio?: string;
  avatarUrl?: string;
  /* tester */
  experienceLevel?: ExperienceLevel;
  preferredGenres?: GameGenre[];
  platforms?: GamePlatform[];
  languages?: string[];
  weeklyAvailabilityHours?: number;
  /* developer */
  studioName?: string;
  studioSize?: DeveloperProfile["studioSize"];
  website?: string;
  foundedYear?: number;
}

export async function saveProfile(input: ProfileInput): Promise<User> {
  const user = await apiFetch<User>("/api/v1/profile", {
    method: "PATCH",
    body: input,
  });

  await useGroguStore.getState().refresh();

  return user;
}
