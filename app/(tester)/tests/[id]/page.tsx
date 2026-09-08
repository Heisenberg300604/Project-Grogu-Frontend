import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/layout/placeholder-page";

export const metadata: Metadata = {
  title: "Active test",
  description: "Complete testing tasks and submit feedback.",
};

export default async function ActiveTestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <PlaceholderPage
      title={`Active test ${id}`}
      description="The workspace an accepted tester uses during a playtest: task checklist, build download, and the structured feedback form."
      plannedFor="Tester testing + feedback task"
      backHref="/applications"
      backLabel="Back to applications"
    />
  );
}
