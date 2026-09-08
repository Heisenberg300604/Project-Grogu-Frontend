import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { formatCompactNumber } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";

interface HeroStats {
  games: number;
  activePlaytests: number;
  testers: number;
  feedbackSubmitted: number;
}

export function Hero({ stats }: { stats: HeroStats }) {
  const figures = [
    { label: "Games in testing", value: stats.games },
    { label: "Active playtests", value: stats.activePlaytests },
    { label: "Verified testers", value: stats.testers },
    { label: "Feedback reports", value: stats.feedbackSubmitted },
  ];

  return (
    <section className="surface-grid border-b border-border">
      <Container className="flex flex-col items-start gap-8 py-20 md:py-28">
        <Badge tone="primary">Playtesting, minus the chaos</Badge>

        <h1 className="max-w-3xl text-4xl font-semibold leading-[1.08] sm:text-5xl md:text-6xl">
          Get your game in front of testers who actually finish the build.
        </h1>

        <p className="max-w-xl text-lg text-muted-foreground">
          Grogu matches indie developers with dedicated playtesters, then keeps
          everyone on track — clear tasks, structured feedback, and a reputation
          system that rewards good testing.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/discover"
            className={buttonVariants({ variant: "primary", size: "lg" })}
          >
            Find a playtest
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/developers"
            className={buttonVariants({ variant: "secondary", size: "lg" })}
          >
            I&apos;m a developer
          </Link>
        </div>

        <dl className="mt-8 grid w-full grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4">
          {figures.map((figure) => (
            <div key={figure.label} className="bg-surface p-5">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                {figure.label}
              </dt>
              <dd className="mt-1 font-display text-2xl font-semibold tabular-nums">
                {formatCompactNumber(figure.value)}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
