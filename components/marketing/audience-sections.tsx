import Link from "next/link";
import {
  BarChart3,
  Check,
  ClipboardList,
  Filter,
  Gamepad2,
  Gift,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { CountUp } from "@/components/marketing/count-up";

interface Reason {
  icon: LucideIcon;
  title: string;
  body: string;
}

const DEVELOPER_REASONS: Reason[] = [
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

const TESTER_REASONS: Reason[] = [
  {
    icon: Gamepad2,
    title: "Play games before anyone else",
    body: "Unreleased builds from indie studios, across PC, console, browser, and mobile — with the developer actually listening.",
  },
  {
    icon: Gift,
    title: "Know the reward upfront",
    body: "Every listing states what you get — a key, a gift card, credits — alongside the time it will take. No surprises.",
  },
  {
    icon: Trophy,
    title: "Build a tester reputation",
    body: "Thorough, on-time feedback raises your score and unlocks playtests with higher requirements.",
  },
  {
    icon: ShieldCheck,
    title: "Structure instead of guesswork",
    body: "Clear tasks and a guided feedback form, so you always know what the developer needs from you.",
  },
];

function ReasonList({
  reasons,
  accent,
}: {
  reasons: Reason[];
  accent: "primary" | "secondary";
}) {
  return (
    <ul className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
      {reasons.map((reason) => (
        <li key={reason.title} className="flex gap-4">
          <span
            className={cn(
              "grid size-9 shrink-0 place-items-center rounded-lg",
              accent === "primary"
                ? "border-2 border-line bg-primary-soft text-secondary"
                : "border-2 border-line bg-elevated text-secondary",
            )}
          >
            <reason.icon className="size-4" aria-hidden />
          </span>
          <div className="space-y-1.5">
            <h3 className="text-sm font-bold">{reason.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {reason.body}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** "Why developers use Grogu" — the studio side of the pitch. */
export function WhyDevelopers() {
  return (
    <section className="border-b-2 border-dashed border-border bg-surface/40 py-20">
      <Container className="flex flex-col gap-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="For developers"
            title="Stop recruiting testers in Discord threads"
            lead="Publish a playtest, choose your testers, and get feedback that's already structured for triage."
          />
          <Link
            href="/developers"
            className={buttonVariants({ variant: "secondary" })}
          >
            Grogu for studios
          </Link>
        </div>
        <ReasonList reasons={DEVELOPER_REASONS} accent="primary" />
      </Container>
    </section>
  );
}

/** "Why playtesters use Grogu" — the player side of the pitch. */
export function WhyTesters() {
  return (
    <section className="border-b-2 border-dashed border-border py-20">
      <Container className="flex flex-col gap-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="For playtesters"
            title="Get paid attention for playing carefully"
            lead="Grogu is built for players who write the paragraph nobody else writes — and want that to count for something."
          />
          <Link
            href="/discover"
            className={buttonVariants({ variant: "secondary" })}
          >
            Find a playtest
          </Link>
        </div>
        <ReasonList reasons={TESTER_REASONS} accent="secondary" />
      </Container>
    </section>
  );
}

/** Social proof band, driven by the seeded catalogue rather than invented numbers. */
export function PlatformStats({
  stats,
}: {
  stats: {
    games: number;
    activePlaytests: number;
    testers: number;
    feedbackSubmitted: number;
  };
}) {
  const figures = [
    { label: "Games in testing", value: stats.games, bar: "bg-gold" },
    { label: "Active playtests", value: stats.activePlaytests, bar: "bg-azure" },
    { label: "Verified testers", value: stats.testers, bar: "bg-mint" },
    { label: "Feedback reports", value: stats.feedbackSubmitted, bar: "bg-coral" },
  ];

  return (
    <section className="pb-24">
      <Container>
        <Reveal>
          <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {figures.map((figure) => (
              <div
                key={figure.label}
                className="relative overflow-hidden rounded-xl border-2 border-line bg-surface p-5 shadow-md"
              >
                <span aria-hidden className={cn("absolute inset-x-0 top-0 h-3", figure.bar)} />
                <dd className="mt-2 font-display text-5xl font-extrabold tabular-nums sm:text-6xl">
                  <CountUp value={figure.value} />
                </dd>
                <dt className="hud mt-3 text-muted-foreground">{figure.label}</dt>
              </div>
            ))}
          </dl>
        </Reveal>
      </Container>
    </section>
  );
}

const CTA_POINTS = [
  "Define tester requirements once — Grogu handles the matching",
  "Review applicants side by side with reputation and platform data",
  "Feedback arrives structured, with per-task answers and repro steps",
];

/** Closing call to action for studios. */
export function DeveloperCta() {
  return (
    <section className="pt-24">
      <Container>
        <Reveal>
          <div className="grid gap-8 overflow-hidden rounded-xl border-2 border-line bg-grape p-8 text-white shadow-[8px_8px_0_var(--shadow-ink)] md:p-12 lg:grid-cols-2">
            <div>
              <h2 className="text-display-sm">Run your next playtest on Grogu</h2>
              <p className="mb-7 mt-4 max-w-md text-white/85">
                Set up a game, publish a playtest, and get a focused group of testers
                who understand the assignment — without living in a spreadsheet.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/signup"
                  className={buttonVariants({ variant: "primary", size: "lg" })}
                >
                  Create a developer account
                </Link>
                <Link
                  href="/developers"
                  className={buttonVariants({
                    variant: "secondary",
                    size: "lg",
                    className: "!bg-white !text-ink",
                  })}
                >
                  See how it works
                </Link>
              </div>
            </div>

            <ul className="grid content-center gap-4">
              {CTA_POINTS.map((point) => (
                <li key={point} className="flex gap-3 font-semibold">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-md bg-gold text-ink">
                    <Check className="size-3.5" strokeWidth={3} aria-hidden />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
