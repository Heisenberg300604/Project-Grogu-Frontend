import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/layout/placeholder-page";

export const metadata: Metadata = {
  title: "Create a playtest",
  description: "Set up a new playtest for one of your games.",
};

export default function NewPlaytestPage() {
  return (
    <PlaceholderPage
      title="Create a playtest"
      description="Multi-step form: pick a game, write goals and focus areas, define tester requirements, and add testing tasks."
      plannedFor="Developer playtest creation task"
      backHref="/developer/dashboard"
      backLabel="Back to dashboard"
    />
  );
}
