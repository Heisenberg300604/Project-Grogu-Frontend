import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { DiscoverExplorer } from "@/components/playtests/discover-explorer";

export const metadata: Metadata = {
  title: "Discover playtests",
  description:
    "Browse indie games looking for testers. Filter by genre, platform, and time commitment.",
};

export default function DiscoverPage() {
  return (
    <Container className="py-12">
      <SectionHeading
        eyebrow="Discover"
        title="Playtests looking for testers"
        lead="Every playtest below is open for applications right now. Sign in as a tester to apply."
        className="mb-10"
      />
      <DiscoverExplorer />
    </Container>
  );
}
