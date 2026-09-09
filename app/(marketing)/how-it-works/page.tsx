import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardCheck, MessagesSquare, Search, Trophy } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { DeveloperCta } from "@/components/marketing/audience-sections";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "How playtesting on Grogu works for testers and developers, step by step.",
};

const TESTER_STEPS = [
  {
    icon: Search,
    title: "Find a playtest",
    body: "Filter open playtests by platform, genre, and time commitment. Every listing spells out the tasks, the reward, and what the developer wants to learn.",
  },
  {
    icon: ClipboardCheck,
    title: "Apply and get accepted",
    body: "Send a short pitch. The developer reviews applicants against their requirements and builds a focused group.",
  },
  {
    icon: MessagesSquare,
    title: "Test and submit feedback",
    body: "Download the build, work through the checklist, then fill in a structured feedback form — ratings, highlights, pain points, and bugs.",
  },
  {
    icon: Trophy,
    title: "Build reputation",
    body: "Helpful, on-time feedback raises your reputation score and unlocks playtests with higher requirements.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <section className="surface-grid border-b border-border">
        <Container className="py-20">
          <SectionHeading
            eyebrow="How it works"
            title="A playtest loop that respects everyone's time"
            lead="Grogu keeps testers and developers on the same page — clear tasks, structured feedback, and a reputation system that rewards good testing."
          />
        </Container>
      </section>

      <HowItWorks />

      <section className="border-b border-border py-20">
        <Container className="flex flex-col gap-12">
          <SectionHeading
            eyebrow="For testers"
            title="Your journey, end to end"
          />

          <ol className="grid gap-x-10 gap-y-8 md:grid-cols-2">
            {TESTER_STEPS.map((step, i) => (
              <li key={step.title} className="flex gap-5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-elevated font-display text-sm font-semibold tabular-nums text-secondary">
                  {i + 1}
                </span>
                <div className="space-y-2">
                  <h3 className="flex items-center gap-2 text-base font-semibold">
                    <step.icon className="size-4 text-secondary" aria-hidden />
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="flex flex-wrap gap-3">
            <Link href="/discover" className={buttonVariants({ variant: "primary", size: "lg" })}>
              Browse open playtests
            </Link>
            <Link href="/developers" className={buttonVariants({ variant: "secondary", size: "lg" })}>
              I&apos;m a developer
            </Link>
          </div>
        </Container>
      </section>

      <DeveloperCta />
    </>
  );
}
