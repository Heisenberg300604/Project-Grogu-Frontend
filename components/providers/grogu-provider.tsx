"use client";

import { useEffect } from "react";

import { useGroguStore } from "@/lib/store/grogu-store";

/**
 * Loads the dataset once on mount and keeps it fresh.
 *
 * Mounted in the root layout so every route — marketing pages included, which
 * read the public slice — has data available. The fetch runs after
 * rehydration so the stored bearer token is attached and the response is
 * scoped to the right person.
 *
 * It also re-reads when the tab regains focus, because a developer accepting an
 * applicant in one tab should not leave another tab showing the old roster.
 */
export function GroguProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (cancelled) return;
      await useGroguStore.getState().refresh();
    }

    // `persist` may already have finished before this effect runs, in which
    // case `onFinishHydration` never fires — so check first, then subscribe.
    if (useGroguStore.persist.hasHydrated()) {
      void load();
    }

    const unsubscribe = useGroguStore.persist.onFinishHydration(() => {
      void load();
    });

    function onFocus() {
      if (document.visibilityState === "visible") {
        void useGroguStore.getState().refresh();
      }
    }

    document.addEventListener("visibilitychange", onFocus);

    return () => {
      cancelled = true;
      unsubscribe?.();
      document.removeEventListener("visibilitychange", onFocus);
    };
  }, []);

  return <>{children}</>;
}
