import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/layout/placeholder-page";

export const metadata: Metadata = {
  title: "Add a game",
  description: "Add a new game to Grogu.",
};

export default function NewGamePage() {
  return (
    <PlaceholderPage
      title="Add a game"
      description="Form to register a new game (title, description, genres, platforms, build info). Validated with React Hook Form + Zod."
      plannedFor="Developer games task"
      backHref="/developer/games"
      backLabel="Back to games"
    />
  );
}
