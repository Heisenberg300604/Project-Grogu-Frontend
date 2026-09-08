import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/layout/placeholder-page";

export const metadata: Metadata = {
  title: "Your applications",
  description: "Track the status of your playtest applications.",
};

export default function ApplicationsPage() {
  return (
    <PlaceholderPage
      title="Your applications"
      description="A list of the tester's applications grouped by status (pending, accepted, rejected, withdrawn), each linking back to the playtest."
      plannedFor="Tester applications task"
      backHref="/"
    />
  );
}
