import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Game } from "@/lib/types";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { GameCard } from "@/components/games/game-card";

export function FeaturedGames({ games }: { games: Game[] }) {
  return (
    <section className="border-t border-border bg-surface/40 py-20">
      <Container className="flex flex-col gap-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Featured games"
            title="Studios currently looking for testers"
            lead="A snapshot of what's in testing on Grogu right now."
          />
          <Link
            href="/discover"
            className={buttonVariants({ variant: "secondary", size: "md" })}
          >
            Browse all
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </Container>
    </section>
  );
}
