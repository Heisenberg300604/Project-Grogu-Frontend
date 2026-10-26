import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Check,
  Gamepad2,
  Users,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

const AUDIENCES = [
  {
    label: "For gamers",
    title: "Play early. Make your feedback matter.",
    description:
      "Find unreleased games that fit your taste, play with a clear brief, and build a reputation studios can trust.",
    icon: Gamepad2,
    tile: "bg-gold",
    href: "/discover",
    action: "Explore playtests",
    points: ["Match by genre, platform, and time", "Know the reward before you apply", "Turn thoughtful notes into reputation"],
  },
  {
    label: "For studios",
    title: "Replace guesswork with player signal.",
    description:
      "Bring the right players into your build, give them focused objectives, and see the patterns worth shipping against.",
    icon: BarChart3,
    tile: "bg-azure",
    href: "/developers",
    action: "See the studio workflow",
    points: ["Define the audience you actually need", "Ship tasks with every build", "Turn feedback into a clear next move"],
  },
] as const;

export function HowItWorksAudience() {
  return (
    <section id="top" className="dots border-b-2 border-line">
      <Container className="py-16 lg:py-20">
        <Eyebrow>The playtest loop</Eyebrow>
        <h1 className="max-w-4xl text-display">
          One platform. Two ways to <span className="hl">move a game forward.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted-foreground">
          Grogu gives players a better way to discover and contribute, while studios get a focused signal before launch day.
        </p>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {AUDIENCES.map((audience, i) => (
            <Reveal key={audience.label} delay={i * 100}>
              <article className="card-lift wiggle-hover relative h-full overflow-hidden rounded-xl border-2 border-line bg-surface p-7 shadow-md">
                <div className="mb-8 flex items-center justify-between">
                  <span className={cn("wiggle-target grid size-14 place-items-center rounded-2xl border-2 border-line text-ink", audience.tile)}>
                    <audience.icon size={26} aria-hidden />
                  </span>
                  <span className="hud text-muted-foreground">{audience.label}</span>
                </div>
                <h2 className="text-3xl font-extrabold">{audience.title}</h2>
                <p className="mt-3 text-muted-foreground">{audience.description}</p>
                <ul className="my-6 grid gap-3 border-t-2 border-dashed border-border pt-6">
                  {audience.points.map((point) => (
                    <li key={point} className="flex items-center gap-3 font-semibold">
                      <span className="grid size-6 place-items-center rounded-md border-2 border-line bg-mint text-ink">
                        <Check size={14} strokeWidth={3} aria-hidden />
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
                <Link href={audience.href} className={buttonVariants({ variant: "secondary" })}>
                  {audience.action}
                  <ArrowRight size={16} aria-hidden className="arrow" />
                </Link>
              </article>
            </Reveal>
          ))}
        </div>

        <p className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Users size={16} aria-hidden />
          Both sides meet in one shared loop: a clear brief, a real session, and feedback that lands.
        </p>
      </Container>
    </section>
  );
}
