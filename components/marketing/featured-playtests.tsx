import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

import type { PlaytestWithRelations } from "@/lib/types";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/states";
import { SectionHeading } from "@/components/ui/section-heading";
import { PlaytestCard } from "@/components/playtests/playtest-card";

/** Live playtests on the landing page. Same card as Discover, no special case. */
export function FeaturedPlaytests({
  playtests,
}: {
  playtests: PlaytestWithRelations[];
}) {
  return (
    <section className="relative border-b border-border bg-surface/45 py-24 sm:py-32 lg:min-h-[calc(100svh-4rem)] lg:py-40">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-secondary/30" />
      <Container className="flex flex-col gap-12 lg:gap-16">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Open now"
            title="Playtests looking for testers"
            lead="Each listing gives you the mission context, the time commitment, and the reward before you apply."
          />
          <Link
            href="/discover"
            className={buttonVariants({ variant: "secondary" })}
          >
            Browse all playtests
            <ArrowRight />
          </Link>
        </div>

        {playtests.length === 0 ? (
          <EmptyState
            icon={Compass}
            title="No playtests are open right now"
            description="New playtests go live as studios publish them — check back shortly."
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {playtests.map((playtest) => (
              <PlaytestCard key={playtest.id} playtest={playtest} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
