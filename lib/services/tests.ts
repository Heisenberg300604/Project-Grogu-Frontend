/**
 * Tester workspace service. Backed by `/api/v1/tests`.
 *
 * `testerId` stays in these signatures because the call sites pass it, but the
 * server ignores any client-supplied identity and uses the bearer token, so one
 * tester cannot record progress for another.
 */

import type { Feedback, FeedbackInput, TestProgress } from "@/lib/types";
import { useGroguStore } from "@/lib/store/grogu-store";

import { apiFetch } from "./http";

export async function downloadBuild(
  playtestId: string,
  _testerId: string,
): Promise<void> {
  const progress = await apiFetch<TestProgress>(
    `/api/v1/tests/${playtestId}/download`,
    { method: "POST" },
  );

  useGroguStore.getState().applyEntity("testProgress", progress);
}

export async function toggleTask(
  playtestId: string,
  _testerId: string,
  taskId: string,
): Promise<void> {
  const progress = await apiFetch<TestProgress>(
    `/api/v1/tests/${playtestId}/tasks/${taskId}/toggle`,
    { method: "POST" },
  );

  useGroguStore.getState().applyEntity("testProgress", progress);
}

export async function submitFeedback(
  playtestId: string,
  _testerId: string,
  input: FeedbackInput,
): Promise<Feedback> {
  const result = await apiFetch<{ feedback: Feedback; progress: TestProgress }>(
    `/api/v1/tests/${playtestId}/feedback`,
    { method: "POST", body: input },
  );

  const store = useGroguStore.getState();
  store.applyEntity("feedback", result.feedback);
  store.applyEntity("testProgress", result.progress);
  void store.refresh();

  return result.feedback;
}
