/** Mock games service (developer side). */

import type { Game, NewGameInput } from "@/lib/types";
import { useGroguStore } from "@/lib/store/grogu-store";

import { delay, ServiceError } from "./http";

export async function createGame(input: NewGameInput): Promise<Game> {
  await delay(800);
  const store = useGroguStore.getState();
  if (!store.session || store.session.role !== "developer") {
    throw new ServiceError("Sign in as a developer to add a game.", "forbidden");
  }
  return store.createGame(store.session.user.id, input);
}
