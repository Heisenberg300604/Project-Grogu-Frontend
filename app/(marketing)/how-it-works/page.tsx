import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardCheck, MessagesSquare, Search, Trophy } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { HowItWorks } from "@/components/marketing/how-it-works";

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
        <Container className="py-16">
          <SectionHeading
            eyebrow="How it works"
            title="A playtest loop that respects everyone's time"
            lead="Grogu keeps testers and developers on the same page — clear tasks, structured feedback, and a reputation system that rewards good testing."
          />
        </Container>
      </section>

      <HowItWorks />

      <section className="border-t border-border py-16">
        <Container className="space-y-8">
          <SectionHeading eyebrow="For testers" title="Your journey, end to end" />
          <ol className="grid gap-4 md:grid-cols-2">
            {TESTER_STEPS.map((step, i) => (
              <li key={step.title}>
                <Card className="h-full">
                  <CardContent className="flex h-full gap-4 p-6">
                    <span className="grid size-10 shrink-0 place-items-center rounded-md bg-primary/15 text-secondary">
                      <step.icon className="size-5" aria-hidden />
                    </span>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold">
                        {i + 1}. {step.title}
                      </p>
                      <p className="text-sm text-muted-foreground">{step.body}</p>
                    </div>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap gap-3">
            <Link href="/discover" className={buttonVariants({ variant: "primary" })}>
              Browse open playtests
            </Link>
            <Link href="/developers" className={buttonVariants({ variant: "secondary" })}>
              I&apos;m a developer
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
