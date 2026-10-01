import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Check,
  ClipboardList,
  Gamepad2,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { PlatformStats } from "@/components/marketing/audience-sections";
import { ScrollToTop } from "@/components/layout/scroll-to-top";

interface AudienceLandingProps {
  kind: "developers" | "gametesters";
  stats: { games: number; activePlaytests: number; testers: number; feedbackSubmitted: number };
}

const CONTENT = {
  developers: {
    eyebrow: "FOR STUDIOS",
    title: "Know what to fix before players find it for you.",
    description: "Grogu gives teams a focused way to recruit players, run structured sessions, and turn individual reactions into a clearer next build.",
    primary: { href: "/signup", label: "Create a studio account" },
    secondary: { href: "/discover", label: "See open playtests" },
    image: "/images/grogu-studio-signals.png",
    imageAlt: "A game studio team discussing an unreleased fantasy game on a large screen.",
    signal: "Studio signal map",
    focus: "From brief to build decision",
    steps: [
      { icon: Users, title: "Define the audience", body: "Set the genre, platform, experience, and time commitment that make a player useful for this build." },
      { icon: ClipboardList, title: "Run a focused session", body: "Give accepted testers a clear mission, relevant context, and the exact questions your team needs answered." },
      { icon: BarChart3, title: "Review what repeats", body: "Bring ratings, completion, bugs, and written feedback together before deciding what the next build should address." },
    ],
    proof: ["Applicant review with platform and profile context", "Task-level feedback with room for reproducible bug details", "A shared view of feedback, completion, and patterns"],
  },
  gametesters: {
    eyebrow: "FOR PLAYERS",
    title: "Play the next great game before everyone else.",
    description: "Grogu helps thoughtful players find fitting builds, understand the mission, and build a credible record through feedback that helps studios move forward.",
    primary: { href: "/discover", label: "Find a playtest" },
    secondary: { href: "/signup", label: "Create a tester profile" },
    image: "/images/grogu-tester-discovery.png",
    imageAlt: "A player testing an unreleased fantasy exploration game at a desk.",
    signal: "Player journey map",
    focus: "From discovery to useful feedback",
    steps: [
      { icon: Search, title: "Find your match", body: "Browse by genre, platform, reward, and time so every application starts with a playtest that fits." },
      { icon: Gamepad2, title: "Play with a purpose", body: "Use the brief and task list to keep observations connected to the parts of the build the studio is testing." },
      { icon: ShieldCheck, title: "Build your reputation", body: "Submit useful feedback on time and show studios how you approach the work of playtesting." },
    ],
    proof: ["See time, platform, and reward context before applying", "Keep build instructions, tasks, and feedback in one workspace", "Build a profile developers can review with confidence"],
  },
} as const;

export function AudienceLanding({ kind, stats }: AudienceLandingProps) {
  const content = CONTENT[kind];
  const signalMetric = kind === "developers" ? stats.feedbackSubmitted : stats.activePlaytests;
  const signalLabel = kind === "developers" ? "feedback reports in the network" : "playtests currently open";

  return (
    <>
      <ScrollToTop />
      <section className="relative isolate min-h-[44rem] overflow-hidden border-b border-border bg-dark lg:min-h-[calc(100svh-4rem)]">
        <Image src={content.image} alt={content.imageAlt} fill priority sizes="100vw" className="object-cover object-center" />
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,9,9,.94)_0%,rgba(6,10,10,.78)_36%,rgba(6,10,10,.24)_70%,rgba(6,10,10,.2)_100%),linear-gradient(0deg,#080c0d_0%,transparent_28%)]" />
        <Container className="relative z-10 flex min-h-[44rem] items-center py-28 lg:min-h-[calc(100svh-4rem)] lg:py-24">
          <div className="max-w-2xl">
            <p className="telemetry-label flex items-center gap-3 text-secondary"><span className="size-1.5 rounded-full bg-secondary" /> {content.eyebrow}</p>
            <h1 className="mt-6 text-display">{content.title}</h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-[#d8d5cc] sm:text-lg sm:leading-8">{content.description}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={content.primary.href} className={buttonVariants({ variant: "primary", size: "xl" })}>{content.primary.label}<ArrowRight aria-hidden /></Link>
              <Link href={content.secondary.href} className={buttonVariants({ variant: "outline", size: "xl", className: "border-white/30 bg-black/20 text-foreground hover:bg-black/35" })}>{content.secondary.label}</Link>
            </div>
            <dl className="mt-10 flex max-w-md border-t border-white/15 pt-4">
              <div className="pr-8"><dt className="telemetry-label text-[#9d9e98]">Network signal</dt><dd className="mt-1 text-lg font-semibold tabular-nums text-foreground">{signalMetric}</dd></div>
              <div className="border-l border-white/15 pl-8"><dt className="telemetry-label text-[#9d9e98]">Available context</dt><dd className="mt-1 text-sm font-medium text-foreground">{signalLabel}</dd></div>
            </dl>
          </div>
        </Container>
      </section>

      <section className="relative overflow-hidden border-b border-border bg-background py-24 sm:py-32 lg:min-h-[52rem] lg:py-40">
        <div aria-hidden className="surface-grid pointer-events-none absolute inset-0 opacity-20" />
        <Container className="relative grid gap-14 lg:grid-cols-[.78fr_1.22fr] lg:items-center lg:gap-24">
          <div className="max-w-xl">
            <p className="telemetry-label flex items-center gap-3 text-secondary"><span className="size-1.5 rounded-full bg-secondary" /> {content.signal}</p>
            <h2 className="mt-5 text-display-sm">{content.focus}</h2>
            <p className="mt-6 text-base leading-7 text-muted-foreground">A useful playtest is a connected sequence, not a collection of disconnected screens. Grogu keeps the work legible from the first choice through the feedback that comes back.</p>
            <ul className="mt-8 space-y-4 border-t border-border pt-6">
              {content.proof.map((point) => <li key={point} className="flex gap-3 text-sm leading-6 text-foreground"><Check className="mt-1 size-4 shrink-0 text-secondary" aria-hidden />{point}</li>)}
            </ul>
          </div>

          <ol className="relative grid gap-3 before:absolute before:bottom-12 before:left-7 before:top-12 before:w-px before:bg-border sm:before:left-10">
            {content.steps.map((step, index) => {
              const Icon = step.icon;
              return <li key={step.title} className="relative grid grid-cols-[3.5rem_1fr] gap-4 border border-border bg-surface p-5 sm:grid-cols-[5rem_1fr_auto] sm:gap-6 sm:p-7">
                <span className="relative z-10 grid size-10 place-items-center border border-primary-line bg-elevated text-secondary sm:size-14"><Icon className="size-4 sm:size-5" aria-hidden /></span>
                <div><p className="telemetry-label text-subtle-foreground">Stage 0{index + 1}</p><h3 className="mt-2 text-xl font-semibold text-foreground sm:text-2xl">{step.title}</h3><p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">{step.body}</p></div>
                <span className="hidden self-start font-mono text-xs text-secondary lg:block">0{index + 1} / 03</span>
              </li>;
            })}
          </ol>
        </Container>
      </section>

      <section className="border-b border-border bg-surface py-20 sm:py-28 lg:py-32">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
          <div><p className="telemetry-label text-secondary">What stays connected</p><h2 className="mt-4 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">The details that make a session useful remain visible.</h2></div>
          <div className="grid gap-px border border-border bg-border sm:grid-cols-3">
            {content.proof.map((point, index) => <div key={point} className="min-h-44 bg-surface p-6"><span className="font-mono text-xs text-secondary">0{index + 1}</span><p className="mt-8 text-sm leading-6 text-muted-foreground">{point}</p></div>)}
          </div>
        </Container>
      </section>

      <PlatformStats stats={stats} />
    </>
  );
}
