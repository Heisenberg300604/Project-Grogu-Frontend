/** Applications service. Backed by `/api/v1/playtests/{id}/applications` and `/api/v1/applications`. */

import type { Application, ApplicationInput } from "@/lib/types";
import { useGroguStore } from "@/lib/store/grogu-store";

import { apiFetch } from "./http";

export async function applyToPlaytest(
  playtestId: string,
  input: ApplicationInput,
): Promise<Application> {
  const application = await apiFetch<Application>(
    `/api/v1/playtests/${playtestId}/applications`,
    { method: "POST", body: input },
  );

  useGroguStore.getState().applyEntity("applications", application);
  // The playtest's applicant counter changes too, so re-read.
  void useGroguStore.getState().refresh();

  return application;
}

export async function withdrawApplication(applicationId: string): Promise<void> {
  const application = await apiFetch<Application>(
    `/api/v1/applications/${applicationId}/withdraw`,
    { method: "POST" },
  );

  useGroguStore.getState().applyEntity("applications", application);
  void useGroguStore.getState().refresh();
}

export async function decideApplication(
  applicationId: string,
  decision: "accepted" | "rejected",
  note?: string,
): Promise<void> {
  const application = await apiFetch<Application>(
    `/api/v1/applications/${applicationId}/decision`,
    { method: "POST", body: { decision, note: note ?? null } },
  );

  useGroguStore.getState().applyEntity("applications", application);
  // Accepting also creates the tester's progress row and notifies them.
  void useGroguStore.getState().refresh();
}
