import type { Metadata } from "next";

import { getPlaytestById, getPlaytests } from "@/data";
import { PlaceholderPage } from "@/components/layout/placeholder-page";

export const metadata: Metadata = {
  title: "Playtest details",
  description: "View playtest details and apply.",
};

export async function generateStaticParams() {
  const playtests = await getPlaytests();
  return playtests.map((p) => ({ id: p.id }));
}

export default async function PlaytestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const playtest = await getPlaytestById(id);

  return (
    <PlaceholderPage
      title={playtest ? playtest.title : `Playtest ${id}`}
      description={
        playtest
          ? `Detail view for "${playtest.game.title}" — goals, requirements, tasks, and an apply flow. Mock data for this playtest already exists.`
          : `No mock playtest matches the id "${id}". The detail view and apply flow are built in a later task.`
      }
      plannedFor="Playtest detail + application task"
      backHref="/discover"
      backLabel="Back to discover"
    />
  );
}
