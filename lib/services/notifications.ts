/**
 * Notifications service. Backed by `/api/v1/notifications`.
 *
 * `markAllRead` still takes a user id because the call sites pass one, but the
 * server clears only the token holder's notifications.
 */

import type { Notification } from "@/lib/types";
import { useGroguStore } from "@/lib/store/grogu-store";

import { apiFetch } from "./http";

export async function markRead(id: string): Promise<void> {
  const notification = await apiFetch<Notification>(
    `/api/v1/notifications/${id}/read`,
    { method: "POST" },
  );

  useGroguStore.getState().applyEntity("notifications", notification);
}

export async function markAllRead(_userId: string): Promise<void> {
  await apiFetch<{ updated: number }>("/api/v1/notifications/read-all", {
    method: "POST",
  });

  await useGroguStore.getState().refresh();
}
