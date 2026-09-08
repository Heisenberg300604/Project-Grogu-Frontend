import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/layout/placeholder-page";

export const metadata: Metadata = {
  title: "Tester profile",
  description: "Your tester profile and reputation.",
};

export default function ProfilePage() {
  return (
    <PlaceholderPage
      title="Tester profile"
      description="Public tester profile: reputation score, completed playtests, badges, preferred genres/platforms, and editable availability."
      plannedFor="Tester profile task"
      backHref="/"
    />
  );
}
