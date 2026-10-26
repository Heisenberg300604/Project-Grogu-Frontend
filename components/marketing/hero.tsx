import Link from "next/link";
import { ArrowRight, Bug, Compass, Star } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { HeroScene } from "@/components/art/pixel-art";
import { CountUp } from "@/components/marketing/count-up";

interface HeroStats {
  games: number;
  activePlaytests: number;
  testers: number;
  feedbackSubmitted: number;
}

const GENRE_CHIPS = ["Co-op", "RPG", "Roguelike"];

export function Hero({ stats }: { stats: HeroStats }) {
  const figures = [
    { label: "Open now", value: stats.activePlaytests, unit: "playtests", shadow: "var(--gold)" },
    { label: "Network", value: stats.testers, unit: "testers", shadow: "var(--azure)" },
    { label: "Signals", value: stats.feedbackSubmitted, unit: "reports", shadow: "var(--coral)" },
  ];

  return (
    <section className="dots relative overflow-hidden border-b-2 border-line">
      <Container className="grid items-center gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        <div>
          <div className="hud a-pop mb-6 inline-flex items-center gap-2 rounded-lg border-2 border-line bg-surface px-3 py-2 shadow-sm">
            <span aria-hidden className="a-live size-2.5 rounded-full bg-mint" />
            The playtest network
            <span aria-hidden className="a-blink">
              ▮
            </span>
          </div>

          <h1 className="text-display">
            Build better games with the players who{" "}
            <span className="hl">actually play them.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-muted-foreground">
            Recruit the right testers, run structured playtests, and turn real gameplay
            into feedback your team can act on.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/discover" className={buttonVariants({ variant: "primary", size: "xl" })}>
              <Compass aria-hidden />
              Find playtests
              <ArrowRight aria-hidden className="arrow" />
            </Link>
            <Link href="/signup" className={buttonVariants({ variant: "secondary", size: "xl" })}>
              Run a playtest
            </Link>
          </div>

          <dl className="mt-10 grid max-w-lg grid-cols-3 gap-3">
            {figures.map((figure) => (
              <div
                key={figure.label}
                className="rounded-xl border-2 border-line bg-surface px-3 py-3"
                style={{ boxShadow: `3px 3px 0 ${figure.shadow}` }}
              >
                <dt className="hud text-muted-foreground">{figure.label}</dt>
                <dd className="mt-2 text-sm font-bold">
                  <span className="font-display text-2xl font-extrabold">
                    <CountUp value={figure.value} />
                  </span>{" "}
                  {figure.unit}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <div className="relative aspect-[1.1] overflow-hidden rounded-[28px] border-2 border-line bg-surface shadow-[8px_8px_0_var(--shadow-ink)]">
            <HeroScene className="size-full" />
            <div className="hud absolute left-4 top-4 flex items-center gap-2 rounded-lg border-2 border-line bg-surface px-3 py-2">
              <Star size={12} className="text-gold" fill="currentColor" aria-hidden />
              Lvl 5 · Veteran
            </div>
          </div>

          <div aria-hidden className="a-float absolute -right-2 top-10 sm:-right-5">
            <span className="hud inline-block rounded-lg border-2 border-line bg-mint px-3 py-2 text-ink shadow-sm">
              +25 REP
            </span>
          </div>
          <div aria-hidden className="a-float-2 absolute -left-2 bottom-24 sm:-left-6">
            <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-line bg-surface px-3 py-1.5 text-xs font-bold shadow-sm">
              <Bug size={14} className="text-destructive" /> Bug found! Repro saved.
            </span>
          </div>
          <div aria-hidden className="absolute -bottom-5 right-6 flex gap-2">
            {GENRE_CHIPS.map((genre, i) => (
              <span
                key={genre}
                className="rounded-full border-2 border-line bg-surface px-3 py-1 text-xs font-bold shadow-sm"
                style={{ transform: `rotate(${(i - 1) * 3}deg)` }}
              >
                {genre}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
