import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { PlaceholderPage } from "@/components/layout/placeholder-page";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "How playtesting on Grogu works for testers and developers, step by step.",
};

export default function HowItWorksPage() {
  return (
    <>
      <section className="border-b border-border py-16">
        <Container>
          <SectionHeading
            eyebrow="Overview"
            title="How Grogu works"
            lead="The short version lives on the home page. This page will expand into a full walkthrough for each role in a later task."
          />
        </Container>
      </section>
      <HowItWorks />
      <Container className="pb-20">
        <PlaceholderPage
          title="Detailed walkthrough coming soon"
          description="Role-by-role guides (tester journey, developer journey), FAQs, and reputation mechanics will be built here."
          plannedFor="Marketing content task"
          backHref="/"
        />
      </Container>
    </>
  );
}
