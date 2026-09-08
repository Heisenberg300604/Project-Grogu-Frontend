import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/layout/placeholder-page";

export const metadata: Metadata = {
  title: "Developer dashboard",
  description: "Overview of your games and playtests.",
};

export default function DeveloperDashboardPage() {
  return (
    <PlaceholderPage
      title="Developer dashboard"
      description="At-a-glance view of the developer's games, active playtests, pending applicants to review, and recent feedback."
      plannedFor="Developer dashboard task"
      backHref="/"
    />
  );
}
