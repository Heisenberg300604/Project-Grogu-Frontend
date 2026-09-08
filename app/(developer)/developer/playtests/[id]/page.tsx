import type { Metadata } from "next";

import { getPlaytestById, getPlaytests } from "@/data";
import { PlaceholderPage } from "@/components/layout/placeholder-page";

export const metadata: Metadata = {
  title: "Manage playtest",
  description: "Review applicants, testers, and feedback for a playtest.",
};

export async function generateStaticParams() {
  const playtests = await getPlaytests();
  return playtests.map((p) => ({ id: p.id }));
}

export default async function ManagePlaytestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const playtest = await getPlaytestById(id);

  return (
    <PlaceholderPage
      title={playtest ? `Manage: ${playtest.title}` : `Manage playtest ${id}`}
      description={
        playtest
          ? `Developer view for "${playtest.game.title}": applicant review (accept/reject), accepted testers, submitted feedback, and basic analytics.`
          : `No mock playtest matches the id "${id}". The management view is built in a later task.`
      }
      plannedFor="Developer playtest management + analytics task"
      backHref="/developer/dashboard"
      backLabel="Back to dashboard"
    />
  );
}
