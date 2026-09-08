import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, ClipboardList, Filter, Users } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { DeveloperCta } from "@/components/marketing/developer-cta";

export const metadata: Metadata = {
  title: "For developers",
  description:
    "Run structured playtests, review applicants, and get feedback you can act on.",
};

const FEATURES = [
  {
    icon: ClipboardList,
    title: "Define the playtest once",
    body: "Goals, focus areas, tester requirements, and a task checklist. Testers know exactly what's expected before they apply.",
  },
  {
    icon: Filter,
    title: "Pick the right testers",
    body: "Review applicants side by side with experience level, platforms, reputation, and their pitch. Accept or reject in one click.",
  },
  {
    icon: Users,
    title: "Track the roster",
    body: "See who's downloaded the build, who's working through tasks, and who's submitted feedback — without chasing anyone.",
  },
  {
    icon: BarChart3,
    title: "Feedback you can act on",
    body: "Structured reports roll up into rating breakdowns, sentiment, recurring pain points, and a bug list.",
  },
];

export default function DevelopersPage() {
  return (
    <>
      <section className="surface-grid border-b border-border">
        <Container className="py-16">
          <SectionHeading
            eyebrow="For developers"
            title="Playtesting infrastructure for small teams"
            lead="Publish a playtest, pick your testers, and get structured feedback with analytics — all in one place, free for the prototype."
          />
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/signup" className={buttonVariants({ variant: "primary" })}>
              Create a developer account
            </Link>
            <Link href="/discover" className={buttonVariants({ variant: "secondary" })}>
              See live playtests
            </Link>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2">
            {FEATURES.map((feature) => (
              <Card key={feature.title}>
                <CardContent className="flex gap-4 p-6">
                  <span className="grid size-10 shrink-0 place-items-center rounded-md bg-primary/15 text-secondary">
                    <feature.icon className="size-5" aria-hidden />
                  </span>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">{feature.title}</p>
                    <p className="text-sm text-muted-foreground">{feature.body}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <DeveloperCta />
    </>
  );
}
