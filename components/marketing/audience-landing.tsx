import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bug,
  Check,
  ClipboardList,
  Gamepad2,
  Search,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { Segments } from "@/components/ui/segments";
import { Sprite } from "@/components/art/pixel-art";
import { PlatformStats } from "@/components/marketing/audience-sections";
import { CountUp } from "@/components/marketing/count-up";
import { ScrollToTop } from "@/components/layout/scroll-to-top";

interface AudienceLandingProps {
  kind: "developers" | "gametesters";
  stats: { games: number; activePlaytests: number; testers: number; feedbackSubmitted: number };
}

const CONTENT = {
  developers: {
    eyebrow: "For studios",
    title: ["Know what to fix", "before players", "find it for you."],
    description: "Grogu gives teams a focused way to recruit players, run structured sessions, and turn individual reactions into a clearer next build.",
    primary: { href: "/signup", label: "Create a studio account" },
    secondary: { href: "/discover", label: "See open playtests" },
    signal: "Studio signal map",
    focus: "From brief to build decision",
    steps: [
      { icon: Users, title: "Define the audience", body: "Set the genre, platform, experience, and time commitment that make a player useful for this build.", tile: "bg-gold" },
      { icon: ClipboardList, title: "Run a focused session", body: "Give accepted testers a clear mission, relevant context, and the exact questions your team needs answered.", tile: "bg-azure" },
      { icon: BarChart3, title: "Review what repeats", body: "Bring ratings, completion, bugs, and written feedback together before deciding what the next build should address.", tile: "bg-mint" },
    ],
    proof: ["Applicant review with platform and profile context", "Task-level feedback with room for reproducible bug details", "A shared view of feedback, completion, and patterns"],
  },
  gametesters: {
    eyebrow: "For players",
    title: ["Play the next", "great game before", "everyone else."],
    description: "Grogu helps thoughtful players find fitting builds, understand the mission, and build a credible record through feedback that helps studios move forward.",
    primary: { href: "/discover", label: "Find a playtest" },
    secondary: { href: "/signup", label: "Create a tester profile" },
    signal: "Player journey map",
    focus: "From discovery to useful feedback",
    steps: [
      { icon: Search, title: "Find your match", body: "Browse by genre, platform, reward, and time so every application starts with a playtest that fits.", tile: "bg-gold" },
      { icon: Gamepad2, title: "Play with a purpose", body: "Use the brief and task list to keep observations connected to the parts of the build the studio is testing.", tile: "bg-azure" },
      { icon: ShieldCheck, title: "Build your reputation", body: "Submit useful feedback on time and show studios how you approach the work of playtesting.", tile: "bg-mint" },
    ],
    proof: ["See time, platform, and reward context before applying", "Keep build instructions, tasks, and feedback in one workspace", "Build a profile developers can review with confidence"],
  },
} as const;

/** Illustrative studio panel. Headline figures are the real platform numbers. */
function StudioPanel({ stats }: { stats: AudienceLandingProps["stats"] }) {
  const tiles = [
    ["Games", stats.games],
    ["Playtests", stats.activePlaytests],
    ["Testers", stats.testers],
  ] as const;
  const rows = [
    { title: "Crash on level 3 portal", severity: "Critical", tone: "bg-coral" },
    { title: "Dash feels floaty", severity: "Medium", tone: "bg-gold" },
    { title: "Shop text clipped", severity: "Low", tone: "bg-azure" },
  ];

  return (
    <div className="overflow-hidden rounded-xl border-2 border-line bg-surface shadow-[8px_8px_0_var(--shadow-ink)]">
      <div className="flex items-center gap-2 border-b-2 border-line bg-elevated px-4 py-3">
        <span aria-hidden className="size-3 rounded-full bg-coral" />
        <span aria-hidden className="size-3 rounded-full bg-gold" />
        <span aria-hidden className="size-3 rounded-full bg-mint" />
        <span className="hud ml-3 text-muted-foreground">Example build report</span>
      </div>
      <div className="grid gap-4 p-5">
        <div className="grid grid-cols-3 gap-3">
          {tiles.map(([label, value]) => (
            <div key={label} className="rounded-xl border-2 border-line p-3">
              <div className="hud text-muted-foreground">{label}</div>
              <span className="font-display text-3xl font-extrabold">
                <CountUp value={value} />
              </span>
            </div>
          ))}
        </div>
        <div
          role="img"
          aria-label="Example completion chart"
          className="flex h-24 items-end gap-2 rounded-xl border-2 border-line bg-elevated p-3"
        >
          {[40, 62, 55, 78, 70, 92, 85].map((height, i) => (
            <span
              key={i}
              className="flex-1 rounded-t-md border-2 border-line bg-grape"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
        <ul className="grid gap-2">
          {rows.map((row) => (
            <li key={row.title} className="flex items-center gap-3 rounded-xl border-2 border-line p-3 text-sm font-semibold">
              <Bug size={16} className="text-destructive" aria-hidden />
              <span className="flex-1">{row.title}</span>
              <span className={cn("rounded-full border-2 border-line px-2.5 py-0.5 text-xs font-bold text-ink", row.tone)}>
                {row.severity}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Illustrative tester card: an example profile, not a real person. */
function PlayerCard() {
  const badges = [
    { Icon: Star, tone: "bg-gold" },
    { Icon: ShieldCheck, tone: "bg-mint" },
    { Icon: Bug, tone: "bg-coral" },
    { Icon: Gamepad2, tone: "bg-azure" },
  ];

  return (
    <div className="relative overflow-hidden rounded-xl border-2 border-line bg-surface p-6 shadow-[8px_8px_0_var(--shadow-ink)]">
      <div className="hud mb-4 flex items-center justify-between text-muted-foreground">
        <span>Example tester ID</span>
        <span className="flex items-center gap-1 text-secondary">
          <Star size={13} fill="currentColor" aria-hidden /> Veteran
        </span>
      </div>
      <div className="flex items-center gap-5">
        <div className="a-float grid size-28 place-items-center rounded-2xl border-2 border-line bg-azure">
          <Sprite size={7} />
        </div>
        <div>
          <div className="font-display text-3xl font-extrabold">Player One</div>
          <div className="text-sm text-muted-foreground">Any city · Hardcore</div>
          <div className="mt-3 flex gap-2">
            {["RPG", "Roguelike"].map((genre) => (
              <span key={genre} className="rounded-full border-2 border-line bg-surface px-3 py-0.5 text-xs font-bold">
                {genre}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6">
        <div className="hud mb-2 flex justify-between">
          <span>Level 5</span>
          <span className="text-muted-foreground">203 / 250 REP</span>
        </div>
        <Segments value={0.81} label="Level progress" />
      </div>
      <div className="mt-5 grid grid-cols-4 gap-2" aria-hidden>
        {badges.map(({ Icon, tone }, i) => (
          <div
            key={i}
            className={cn("a-pop grid aspect-square place-items-center rounded-xl border-2 border-line text-ink", tone)}
            style={{ animationDelay: `${i * 120 + 300}ms` }}
          >
            <Icon size={22} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function AudienceLanding({ kind, stats }: AudienceLandingProps) {
  const content = CONTENT[kind];
  const signalMetric = kind === "developers" ? stats.feedbackSubmitted : stats.activePlaytests;
  const signalLabel = kind === "developers" ? "feedback reports in the network" : "playtests currently open";

  return (
    <>
      <ScrollToTop />
      <section className="dots border-b-2 border-line">
        <Container className="grid items-center gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div>
            <Eyebrow tone="coral">{content.eyebrow}</Eyebrow>
            <h1 className="text-display">
              {content.title.map((line, i) => (
                <span key={line} className="block">
                  {i === content.title.length - 1 ? <span className="hl">{line}</span> : line}
                </span>
              ))}
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground">{content.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={content.primary.href} className={buttonVariants({ variant: "primary", size: "xl" })}>
                {content.primary.label}
                <ArrowRight aria-hidden className="arrow" />
              </Link>
              <Link href={content.secondary.href} className={buttonVariants({ variant: "secondary", size: "xl" })}>
                {content.secondary.label}
              </Link>
            </div>
            <dl className="mt-10 flex max-w-sm items-center gap-5 border-t-2 border-dashed border-border pt-6">
              <div>
                <dt className="hud text-muted-foreground">Network signal</dt>
                <dd className="font-display text-4xl font-extrabold">
                  <CountUp value={signalMetric} />
                </dd>
              </div>
              <div aria-hidden className="h-10 w-0.5 bg-border" />
              <dd className="text-sm font-bold">{signalLabel}</dd>
            </dl>
          </div>
          <Reveal>{kind === "developers" ? <StudioPanel stats={stats} /> : <PlayerCard />}</Reveal>
        </Container>
      </section>

      <section>
        <Container className="grid gap-12 py-24 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <Eyebrow>{content.signal}</Eyebrow>
            <h2 className="text-display-sm">{content.focus}</h2>
            <p className="mt-5 text-muted-foreground">
              A useful playtest is a connected sequence, not a collection of disconnected
              screens. Grogu keeps the work legible from the first choice through the
              feedback that comes back.
            </p>
            <ul className="mt-8 grid gap-3 border-t-2 border-dashed border-border pt-6">
              {content.proof.map((point) => (
                <li key={point} className="flex items-center gap-3 text-sm font-semibold">
                  <span className="grid size-6 shrink-0 place-items-center rounded-md border-2 border-line bg-mint text-ink">
                    <Check size={14} strokeWidth={3} aria-hidden />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>

          <ol className="relative grid gap-5">
            <div aria-hidden className="absolute bottom-10 left-[39px] top-10 hidden border-l-4 border-dashed border-border sm:block" />
            {content.steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <li key={step.title}>
                  <Reveal delay={index * 100}>
                    <div className="card-lift wiggle-hover relative flex items-start gap-5 rounded-xl border-2 border-line bg-surface p-5 shadow-md">
                      <span className={cn("wiggle-target grid size-16 shrink-0 place-items-center rounded-2xl border-2 border-line text-ink", step.tile)}>
                        <Icon size={26} aria-hidden />
                      </span>
                      <div className="flex-1">
                        <div className="hud mb-1.5 text-muted-foreground">Stage 0{index + 1}</div>
                        <h3 className="text-2xl font-bold">{step.title}</h3>
                        <p className="mt-1.5 text-muted-foreground">{step.body}</p>
                      </div>
                      <span className="hud hidden text-muted-foreground sm:block">0{index + 1} / 03</span>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </Container>
      </section>

      <section className="border-y-2 border-line bg-elevated py-20">
        <Container className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <Eyebrow tone="azure">What stays connected</Eyebrow>
            <h2 className="text-display-sm">The details that make a session useful remain visible.</h2>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-3">
            {content.proof.map((point, index) => (
              <Reveal key={point} delay={index * 90}>
                <div className="card-lift h-full rounded-xl border-2 border-line bg-surface p-5 shadow-md">
                  <div className="hud mb-8 text-secondary">0{index + 1}</div>
                  <p className="font-semibold">{point}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <div className="pt-20">
        <PlatformStats stats={stats} />
      </div>
    </>
  );
}
