import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/layout/placeholder-page";

export const metadata: Metadata = {
  title: "Discover playtests",
  description: "Browse games looking for testers.",
};

export default function DiscoverPage() {
  return (
    <PlaceholderPage
      title="Discover playtests"
      description="A filterable list of open playtests (platform, genre, time commitment, requirements) with cards linking to each playtest's detail page."
      plannedFor="Tester discovery task"
      backHref="/"
    />
  );
}
