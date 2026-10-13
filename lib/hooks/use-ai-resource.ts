"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ServiceError } from "@/lib/services";
import { type GroguState, useGroguStore } from "@/lib/store/grogu-store";

/** Anything the server can refresh with AI and that says whether it should. */
interface AiRefreshable {
  aiEnabled: boolean;
  stale: boolean;
}

export interface AiResourceState<T> {
  /** The latest copy the client has, if any. */
  data: T | undefined;
  /** First load, with nothing to show yet. */
  loading: boolean;
  /** A fresh AI result is being produced. */
  generating: boolean;
  /** The resource could not be loaded at all. AI failures are not errors: see `notice`. */
  error: string | null;
  /** Ask for a fresh AI result now. */
  generate: () => Promise<void>;
  /** Try the first load again. */
  reload: () => void;
}

/**
 * Loads an on-demand AI resource (a feedback summary, a match list) and asks
 * for a fresh AI result once per visit when the server says it is stale.
 *
 * The automatic refresh happens at most once per `key` per mount, so a failing
 * AI never becomes a retry loop; the server adds its own cooldown and quota.
 * Pass `key = null` to do nothing (for example before the session is known).
 */
export function useAiResource<T extends AiRefreshable>({
  key,
  select,
  load,
  refresh,
  loadError,
}: {
  key: string | null;
  select: (state: GroguState) => T | undefined;
  load: () => Promise<T>;
  refresh: () => Promise<T>;
  /** Shown when the first load fails for a reason other than a ServiceError. */
  loadError: string;
}): AiResourceState<T> {
  const data = useGroguStore(select);
  const [generating, setGenerating] = useState(false);
  const [failure, setFailure] = useState<{ key: string; message: string } | null>(null);
  const [attempt, setAttempt] = useState(0);
  const autoTried = useRef<string | null>(null);

  // The callers pass fresh closures each render; only `key` decides identity.
  const loadRef = useRef(load);
  const refreshRef = useRef(refresh);
  useEffect(() => {
    loadRef.current = load;
    refreshRef.current = refresh;
  });

  const messageOf = useCallback(
    (error: unknown) => (error instanceof ServiceError ? error.message : loadError),
    [loadError],
  );

  const generate = useCallback(async () => {
    if (!key) return;
    setGenerating(true);
    try {
      await refreshRef.current();
      setFailure(null);
    } catch (error) {
      setFailure({ key, message: messageOf(error) });
    } finally {
      setGenerating(false);
    }
  }, [key, messageOf]);

  useEffect(() => {
    if (!key) return;
    let cancelled = false;

    async function run(current: string) {
      try {
        const loaded = await loadRef.current();
        if (cancelled) return;
        setFailure(null);

        if (loaded.aiEnabled && loaded.stale && autoTried.current !== current) {
          autoTried.current = current;
          await generate();
        }
      } catch (error) {
        if (!cancelled) setFailure({ key: current, message: messageOf(error) });
      }
    }

    void run(key);

    return () => {
      cancelled = true;
    };
  }, [key, attempt, generate, messageOf]);

  const error = key && failure?.key === key ? failure.message : null;

  return {
    data,
    loading: Boolean(key) && !data && !error,
    generating,
    error,
    generate,
    reload: () => setAttempt((n) => n + 1),
  };
}
