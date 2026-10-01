import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, Compass, RadioTower } from "lucide-react";

import { formatCompactNumber } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

interface HeroStats {
  games: number;
  activePlaytests: number;
  testers: number;
  feedbackSubmitted: number;
}

export function Hero({ stats }: { stats: HeroStats }) {
  return (
    <section className="relative isolate flex min-h-[46rem] overflow-hidden bg-dark sm:min-h-[52rem] lg:min-h-dvh">
      <Image
        src="/images/grogu-hero-cinematic.png"
        alt="An explorer overlooking an unreleased fantasy game world of mountains, bridges, and a distant city."
        fill
        priority
        sizes="100vw"
        className="object-cover object-[63%_center] sm:object-center"
      />
      <div aria-hidden className="hero-scrim absolute inset-0" />
      <div aria-hidden className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/45 to-transparent" />

      <Container className="relative z-10 flex w-full flex-col justify-center pb-20 pt-28 sm:pb-24 lg:pb-16 lg:pt-20">
        <div className="max-w-2xl">
          <div className="animate-rise flex items-center gap-3 text-secondary">
            <span className="size-1.5 rounded-full bg-secondary shadow-[0_0_0_4px_rgb(158_200_203_/_12%)]" />
            <p className="telemetry-label">The playtest network</p>
            <span className="h-px w-10 signal-rule" />
            <p className="telemetry-label hidden text-secondary-muted sm:block">Signal / 01</p>
          </div>

          <h1 className="mt-6 max-w-xl text-display text-foreground sm:mt-7 lg:max-w-2xl">
            Build better games with the players who actually play them.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-[#d9d5cb] sm:text-lg sm:leading-8">
            Recruit the right testers, run structured playtests, and turn real gameplay
            into feedback your team can act on.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/discover" className={buttonVariants({ variant: "primary", size: "xl" })}>
              <Compass />
              Find playtests
              <ArrowRight aria-hidden />
            </Link>
            <Link href="/signup" className={buttonVariants({ variant: "outline", size: "xl", className: "border-white/35 bg-black/15 text-[#f2eee5] hover:border-white/60 hover:bg-black/30" })}>
              Run a playtest
            </Link>
          </div>

          <dl className="mt-10 grid max-w-xl grid-cols-3 border-y border-white/15 py-4 text-[#dedbd2] sm:mt-12">
            <div className="border-r border-white/15 pr-3">
              <dt className="telemetry-label text-[#aaa89f]">Open now</dt>
              <dd className="mt-1 text-sm font-semibold tabular-nums text-foreground">{stats.activePlaytests} playtests</dd>
            </div>
            <div className="border-r border-white/15 px-3">
              <dt className="telemetry-label text-[#aaa89f]">Network</dt>
              <dd className="mt-1 text-sm font-semibold tabular-nums text-foreground">{formatCompactNumber(stats.testers)} testers</dd>
            </div>
            <div className="pl-3">
              <dt className="telemetry-label text-[#aaa89f]">Signals</dt>
              <dd className="mt-1 text-sm font-semibold tabular-nums text-foreground">{formatCompactNumber(stats.feedbackSubmitted)} reports</dd>
            </div>
          </dl>
        </div>

        <div className="absolute bottom-7 left-5 hidden items-center gap-3 text-[#b9b6ae] sm:left-8 lg:left-12 lg:flex">
          <RadioTower className="size-3.5 text-secondary" aria-hidden />
          <span className="telemetry-label">Observe the build. Find the signal.</span>
        </div>
        <a href="#platform" className="absolute bottom-7 right-5 inline-flex items-center gap-2 text-xs font-medium text-[#dedbd2] transition-colors hover:text-white sm:right-8 lg:right-12">
          Explore Grogu <ArrowDown className="size-4" aria-hidden />
        </a>
      </Container>
    </section>
  );
}
