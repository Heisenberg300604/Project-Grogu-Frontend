/**
 * Review decisions — developer side. Backed by `POST /api/v1/feedback/{id}/review`.
 *
 * Approving pays the tester in one server transaction: approval reputation,
 * any bonus, a ledger entry for cash, and a key from the game's inventory.
 * A review can only be decided once; a second attempt is a `conflict`.
 */

import type { Feedback, FeedbackReviewInput } from "@/lib/types";
import { useGroguStore } from "@/lib/store/grogu-store";

import { apiFetch } from "./http";

export async function reviewFeedback(
  feedbackId: string,
  input: FeedbackReviewInput,
): Promise<Feedback> {
  const feedback = await apiFetch<Feedback>(
    `/api/v1/feedback/${feedbackId}/review`,
    { method: "POST", body: input },
  );

  useGroguStore.getState().applyEntity("feedback", feedback);
  // A key may have left the inventory and the tester's profile changed.
  void useGroguStore.getState().refresh();

  return feedback;
}
