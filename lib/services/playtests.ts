/**
 * Playtests service — developer side. Backed by `/api/v1/playtests`.
 *
 * The ownership, draft-only-editing and status-transition rules this file used
 * to check locally are now enforced by the server as well, and it is the
 * server's error that surfaces; the client can no longer be the only guard.
 */

import type {
  NewPlaytestInput,
  Playtest,
  PlaytestStatus,
  UpdatePlaytestInput,
} from "@/lib/types";
import { useGroguStore } from "@/lib/store/grogu-store";

import { apiFetch } from "./http";

export async function createPlaytest(
  input: NewPlaytestInput,
): Promise<Playtest> {
  const playtest = await apiFetch<Playtest>("/api/v1/playtests", {
    method: "POST",
    body: input,
  });

  useGroguStore.getState().applyEntity("playtests", playtest);
  void useGroguStore.getState().refresh();

  return playtest;
}

export async function updatePlaytest(
  playtestId: string,
  input: UpdatePlaytestInput,
): Promise<Playtest> {
  const playtest = await apiFetch<Playtest>(`/api/v1/playtests/${playtestId}`, {
    method: "PATCH",
    body: input,
  });

  useGroguStore.getState().applyEntity("playtests", playtest);
  void useGroguStore.getState().refresh();

  return playtest;
}

export async function setPlaytestStatus(
  playtestId: string,
  status: PlaytestStatus,
): Promise<void> {
  const playtest = await apiFetch<Playtest>(
    `/api/v1/playtests/${playtestId}/status`,
    { method: "POST", body: { status } },
  );

  useGroguStore.getState().applyEntity("playtests", playtest);
  void useGroguStore.getState().refresh();
}
