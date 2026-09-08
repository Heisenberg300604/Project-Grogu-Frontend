import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { DeveloperCta } from "@/components/marketing/developer-cta";
import { PlaceholderPage } from "@/components/layout/placeholder-page";

export const metadata: Metadata = {
  title: "For developers",
  description:
    "Run structured playtests, review applicants, and get feedback you can act on.",
};

export default function DevelopersPage() {
  return (
    <>
      <section className="border-b border-border py-16">
        <Container>
          <SectionHeading
            eyebrow="For developers"
            title="Playtesting infrastructure for small teams"
            lead="Publish a playtest, pick your testers, and get structured feedback with analytics. The full marketing page is built in a later task."
          />
        </Container>
      </section>
      <DeveloperCta />
      <Container className="pb-20">
        <PlaceholderPage
          title="Developer landing page coming soon"
          description="Feature breakdown, pricing (free for the prototype), testimonials, and a product tour will live here."
          plannedFor="Marketing content task"
          backHref="/"
        />
      </Container>
    </>
  );
}
