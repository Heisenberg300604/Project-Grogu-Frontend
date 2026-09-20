/** Games service — developer side. Backed by `/api/v1/games`. */

import type { Game, NewGameInput, UpdateGameInput } from "@/lib/types";
import { useGroguStore } from "@/lib/store/grogu-store";

import { apiFetch } from "./http";

export async function createGame(input: NewGameInput): Promise<Game> {
  const game = await apiFetch<Game>("/api/v1/games", {
    method: "POST",
    body: input,
  });

  // Show the new row immediately, then re-read so server-derived values
  // (the developer's `gamesPublished` count, for one) stay correct.
  useGroguStore.getState().applyEntity("games", game);
  void useGroguStore.getState().refresh();

  return game;
}

export async function updateGame(
  gameId: string,
  input: UpdateGameInput,
): Promise<Game> {
  const game = await apiFetch<Game>(`/api/v1/games/${gameId}`, {
    method: "PATCH",
    body: input,
  });

  useGroguStore.getState().applyEntity("games", game);
  void useGroguStore.getState().refresh();

  return game;
}
