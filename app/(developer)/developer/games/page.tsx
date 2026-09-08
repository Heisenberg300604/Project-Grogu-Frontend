import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/layout/placeholder-page";

export const metadata: Metadata = {
  title: "Your games",
  description: "Manage the games you have on Grogu.",
};

export default function DeveloperGamesPage() {
  return (
    <PlaceholderPage
      title="Your games"
      description="List of the developer's games with status, latest build, and links to create a playtest. 'New game' lives at /developer/games/new."
      plannedFor="Developer games task"
      backHref="/developer/dashboard"
      backLabel="Back to dashboard"
    />
  );
}
