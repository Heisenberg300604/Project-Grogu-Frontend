"use client";

import { useSyncExternalStore } from "react";

import { useGroguStore } from "@/lib/store/grogu-store";

/**
 * True once the app has data to render.
 *
 * This used to mean only "localStorage has rehydrated". It now also waits for
 * the first `GET /api/v1/bootstrap` to settle, so every view already gated on
 * it shows its existing skeleton while the API responds instead of flashing an
 * empty state. A failed load also counts as settled — the error is surfaced
 * through {@link useLoadError} rather than leaving the UI spinning forever.
 */
export function useHydrated(): boolean {
  const persisted = useSyncExternalStore(
    (onChange) => useGroguStore.persist.onFinishHydration(onChange),
    () => useGroguStore.persist.hasHydrated(),
    () => false,
  );

  const status = useGroguStore((s) => s.status);

  return persisted && (status === "ready" || status === "error");
}

/** The message from the last failed load, if any. */
export function useLoadError(): string | null {
  return useGroguStore((s) => s.loadError);
}
