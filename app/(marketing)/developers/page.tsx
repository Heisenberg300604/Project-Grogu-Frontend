import type { Metadata } from "next";
import Link from "next/link";

import { getPlatformStats } from "@/data";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  DeveloperCta,
  PlatformStats,
  WhyDevelopers,
} from "@/components/marketing/audience-sections";

export const metadata: Metadata = {
  title: "For developers",
  description:
    "Run structured playtests, review applicants, and get feedback you can act on.",
};

export default async function DevelopersPage() {
  const stats = await getPlatformStats();

  return (
    <>
      <section className="surface-grid border-b border-border">
        <Container className="py-20">
          <SectionHeading
            eyebrow="For developers"
            title="Playtesting infrastructure for small teams"
            lead="Publish a playtest, pick your testers, and get structured feedback with analytics — all in one place, free for the prototype."
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/signup" className={buttonVariants({ variant: "primary", size: "lg" })}>
              Create a developer account
            </Link>
            <Link href="/discover" className={buttonVariants({ variant: "secondary", size: "lg" })}>
              See live playtests
            </Link>
          </div>
        </Container>
      </section>

      <WhyDevelopers />
      <PlatformStats stats={stats} />
      <DeveloperCta />
    </>
  );
}
