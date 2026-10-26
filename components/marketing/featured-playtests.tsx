import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

import type { PlaytestWithRelations } from "@/lib/types";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { EmptyState } from "@/components/ui/states";
import { PlaytestCard } from "@/components/playtests/playtest-card";

/** Live playtests on the landing page. Same card as Discover, no special case. */
export function FeaturedPlaytests({
  playtests,
}: {
  playtests: PlaytestWithRelations[];
}) {
  return (
    <section className="border-y-2 border-line bg-elevated py-24">
      <Container>
        <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <Eyebrow tone="mint">Open now</Eyebrow>
            <h2 className="text-display-sm">Playtests looking for testers</h2>
            <p className="mt-4 max-w-lg text-muted-foreground">
              Each listing gives you the mission context, the time commitment, and the
              reward before you apply.
            </p>
          </div>
          <Link href="/discover" className={buttonVariants({ variant: "secondary" })}>
            Browse all playtests
            <ArrowRight aria-hidden className="arrow" />
          </Link>
        </Reveal>

        {playtests.length === 0 ? (
          <EmptyState
            icon={Compass}
            title="No playtests are open right now"
            description="New playtests go live as studios publish them — check back shortly."
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {playtests.map((playtest, i) => (
              <Reveal key={playtest.id} delay={i * 100}>
                <PlaytestCard playtest={playtest} />
              </Reveal>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
