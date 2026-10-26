import { ClipboardList, MessageSquareText, Search, UserCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";

interface Step {
  icon: LucideIcon;
  title: string;
  description: string;
  audience: "Testers" | "Developers";
  tile: string;
}

const STEPS: Step[] = [
  {
    icon: Search,
    title: "Discover a playtest",
    description:
      "Browse open playtests filtered by platform, genre, time commitment, and the skills the developer is looking for.",
    audience: "Testers",
    tile: "bg-gold",
  },
  {
    icon: UserCheck,
    title: "Apply and get accepted",
    description:
      "Send a short pitch. Developers review applicants against their requirements and build a focused tester group.",
    audience: "Testers",
    tile: "bg-azure",
  },
  {
    icon: ClipboardList,
    title: "Complete structured tasks",
    description:
      "Work through the developer's objectives, surveys, and bug-report tasks — with time estimates so nothing is a surprise.",
    audience: "Testers",
    tile: "bg-mint",
  },
  {
    icon: MessageSquareText,
    title: "Submit feedback that ships",
    description:
      "Ratings, highlights, pain points, and repro steps land in one place. Developers see analytics; testers build reputation.",
    audience: "Developers",
    tile: "bg-coral",
  },
];

/**
 * The four-step loop, drawn as a level map: numbered badges on a dashed trail.
 */
export function HowItWorks() {
  return (
    <section className="border-b-2 border-line bg-elevated py-24">
      <Container>
        <Reveal>
          <Eyebrow tone="coral">The shared loop</Eyebrow>
          <h2 className="text-display-sm md:text-6xl">
            From first brief to feedback you can act on
          </h2>
          <p className="mt-5 max-w-xl text-muted-foreground">
            Four steps keep the session focused for players and useful for the people building the game.
          </p>
        </Reveal>

        <ol className="relative mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div
            aria-hidden
            className="absolute inset-x-0 top-9 hidden h-0 border-t-4 border-dashed border-line lg:block"
          />
          {STEPS.map((step, index) => (
            <li key={step.title}>
              <Reveal delay={index * 110}>
                <div className="wiggle-hover relative">
                  <div className="relative z-10 mb-5 flex items-center gap-3">
                    <span
                      className={`wiggle-target grid size-[72px] place-items-center rounded-full border-2 border-line text-ink shadow-sm ${step.tile}`}
                    >
                      <step.icon size={28} aria-hidden />
                    </span>
                    <span className="hud rounded-md border-2 border-line bg-surface px-2 py-1.5">
                      Lv {index + 1}
                    </span>
                  </div>
                  <div className="h-full rounded-xl border-2 border-line bg-surface p-5 shadow-md">
                    <h3 className="text-xl font-bold">{step.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
                    <div className="hud mt-4 text-secondary">{step.audience}</div>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
