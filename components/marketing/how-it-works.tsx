import { ClipboardList, MessageSquareText, Search, UserCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";

interface Step {
  icon: LucideIcon;
  title: string;
  description: string;
  audience: "Testers" | "Developers";
}

const STEPS: Step[] = [
  {
    icon: Search,
    title: "Discover a playtest",
    description:
      "Browse open playtests filtered by platform, genre, time commitment, and the skills the developer is looking for.",
    audience: "Testers",
  },
  {
    icon: UserCheck,
    title: "Apply and get accepted",
    description:
      "Send a short pitch. Developers review applicants against their requirements and build a focused tester group.",
    audience: "Testers",
  },
  {
    icon: ClipboardList,
    title: "Complete structured tasks",
    description:
      "Work through the developer's objectives, surveys, and bug-report tasks — with time estimates so nothing is a surprise.",
    audience: "Testers",
  },
  {
    icon: MessageSquareText,
    title: "Submit feedback that ships",
    description:
      "Ratings, highlights, pain points, and repro steps land in one place. Developers see analytics; testers build reputation.",
    audience: "Developers",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          eyebrow="How Grogu works"
          title="A playtest loop that respects everyone's time"
          lead="Four steps from 'looking for testers' to feedback you can act on. No spreadsheets, no chasing people in Discord."
        />

        <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <li key={step.title}>
              <Card className="h-full">
                <CardContent className="flex h-full flex-col gap-4 p-6">
                  <div className="flex items-center justify-between">
                    <span className="grid size-10 place-items-center rounded-md bg-primary/15 text-secondary">
                      <step.icon className="size-5" aria-hidden />
                    </span>
                    <span className="font-display text-sm text-muted-foreground">
                      0{index + 1}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-base font-semibold">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                  <span className="mt-auto text-xs uppercase tracking-wide text-muted-foreground">
                    {step.audience}
                  </span>
                </CardContent>
              </Card>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
