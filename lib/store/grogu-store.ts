"use client";

/**
 * Grogu client store — a cache of server state.
 *
 * It used to be the app's mutable source of truth, seeded from `data/` and
 * persisted whole. The server owns the data now, so this holds a snapshot of
 * `GET /api/v1/bootstrap` plus the signed-in session, and the selector hooks in
 * `lib/hooks/use-grogu.ts` read from it exactly as before.
 *
 * Two rules keep it honest:
 *
 *  - Nothing here invents or derives data. Mutations go through
 *    `lib/services/*`, which call the API and hand the server's response back
 *    via `applyEntity` / `refresh`. Counters like `applicantCount` are computed
 *    server-side, so nothing can drift.
 *  - Only the session is persisted. Collections are per-user and go stale, and
 *    writing them to localStorage would leave one account's data readable after
 *    another signs in on the same browser.
 */

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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
} from "@/lib/types";
import {
  type BootstrapSnapshot,
  EMPTY_SNAPSHOT,
  fetchBootstrap,
  sessionFromSnapshot,
} from "@/lib/services/bootstrap";
import { ServiceError, setAuthToken } from "@/lib/services/http";

export interface Collections {
  users: User[];
  testerProfiles: TesterProfile[];
  developerProfiles: DeveloperProfile[];
  games: Game[];
  playtests: Playtest[];
  applications: Application[];
  feedback: Feedback[];
  notifications: Notification[];
  testProgress: TestProgress[];
}

/** Where the first load has got to. The UI gates on this via `useHydrated`. */
export type LoadStatus = "idle" | "loading" | "ready" | "error";

export interface GroguState extends Collections {
  session: Session | null;
  status: LoadStatus;
  /** Set when the last load failed, so the UI can offer a retry. */
  loadError: string | null;

  /** Replace the cache with a freshly fetched snapshot. */
  applySnapshot: (snapshot: BootstrapSnapshot) => void;
  /** Re-read everything from the server. */
  refresh: () => Promise<void>;
  /** Sign-in/out. Passing null clears both the token and the cache. */
  setSession: (session: Session | null, token?: string | null) => void;
  /**
   * Merge one entity returned by a mutation into the cache, so the UI updates
   * before the follow-up `refresh` lands.
   */
  applyEntity: <K extends keyof Collections>(
    collection: K,
    entity: Collections[K][number],
  ) => void;
}

function emptyCollections(): Collections {
  return {
    users: [],
    testerProfiles: [],
    developerProfiles: [],
    games: [],
    playtests: [],
    applications: [],
    feedback: [],
    notifications: [],
    testProgress: [],
  };
}

/** Replace by id if present, otherwise prepend. */
function upsertById<T extends { id: string }>(list: T[], entity: T): T[] {
  return list.some((item) => item.id === entity.id)
    ? list.map((item) => (item.id === entity.id ? entity : item))
    : [entity, ...list];
}

export const useGroguStore = create<GroguState>()(
  persist(
    (set, get) => ({
      ...emptyCollections(),
      session: null,
      status: "idle",
      loadError: null,

      applySnapshot: (snapshot) =>
        set({
          users: snapshot.users ?? [],
          testerProfiles: snapshot.testerProfiles ?? [],
          developerProfiles: snapshot.developerProfiles ?? [],
          games: snapshot.games ?? [],
          playtests: snapshot.playtests ?? [],
          applications: snapshot.applications ?? [],
          feedback: snapshot.feedback ?? [],
          notifications: snapshot.notifications ?? [],
          testProgress: snapshot.testProgress ?? [],
          // The server is authoritative about who the caller is: if the token
          // has expired it returns no session, and the stale one is dropped.
          session: sessionFromSnapshot(snapshot) ?? null,
          status: "ready",
          loadError: null,
        }),

      refresh: async () => {
        set({ status: get().status === "ready" ? "ready" : "loading" });

        try {
          const snapshot = await fetchBootstrap();
          get().applySnapshot(snapshot);
        } catch (error) {
          if (error instanceof DOMException && error.name === "AbortError") {
            return;
          }

          // An expired or rejected token: drop it and carry on anonymously
          // rather than leaving the user staring at a broken signed-in shell.
          if (error instanceof ServiceError && error.status === 401) {
            setAuthToken(null);
            set({ ...emptyCollections(), session: null, status: "ready", loadError: null });
            return;
          }

          set({
            status: "error",
            loadError:
              error instanceof ServiceError
                ? error.message
                : "Couldn't load your Grogu data.",
          });
        }
      },

      setSession: (session, token) => {
        if (token !== undefined) {
          setAuthToken(token);
        }

        if (session === null) {
          setAuthToken(null);
          set({ ...emptyCollections(), session: null, status: "ready", loadError: null });
          return;
        }

        set({ session });
      },

      applyEntity: (collection, entity) =>
        set((state) => ({
          [collection]: upsertById(
            state[collection] as Array<{ id: string }>,
            entity as { id: string },
          ),
        }) as Partial<GroguState>),
    }),
    {
      name: "grogu-store-v2",
      storage: createJSONStorage(() => localStorage),
      version: 3,
      // Only the session is kept. Earlier versions persisted every collection;
      // those entries are dropped rather than migrated, because they hold mock
      // ids that no longer resolve against the API.
      migrate: () => ({ session: null }),
      partialize: (state) => ({ session: state.session }),
    },
  ),
);

export { EMPTY_SNAPSHOT };
