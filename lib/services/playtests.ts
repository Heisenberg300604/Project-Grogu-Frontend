/** Mock playtests service (developer side). */

import type { NewPlaytestInput, Playtest, PlaytestStatus } from "@/lib/types";
import { useGroguStore } from "@/lib/store/grogu-store";

import { delay, ServiceError } from "./http";

export async function createPlaytest(
  input: NewPlaytestInput,
): Promise<Playtest> {
  await delay(900);
  const store = useGroguStore.getState();
  if (!store.session || store.session.role !== "developer") {
    throw new ServiceError(
      "Sign in as a developer to create a playtest.",
      "forbidden",
    );
  }
  if (!store.games.some((g) => g.id === input.gameId)) {
    throw new ServiceError("Pick a game for this playtest.", "validation");
  }
  return store.createPlaytest(store.session.user.id, input);
}

export async function setPlaytestStatus(
  playtestId: string,
  status: PlaytestStatus,
): Promise<void> {
  await delay(400);
  useGroguStore.getState().setPlaytestStatus(playtestId, status);
}
