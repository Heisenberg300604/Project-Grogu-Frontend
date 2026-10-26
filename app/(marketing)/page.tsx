import {
  getDiscoverablePlaytests,
  getPlatformStats,
} from "@/data";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Marquee } from "@/components/ui/marquee";
import { Reveal } from "@/components/ui/reveal";
import { Hero } from "@/components/marketing/hero";
import { PlatformWorkflowShowcase } from "@/components/marketing/platform-workflow-showcase";
import { FeaturedPlaytests } from "@/components/marketing/featured-playtests";
import { BugSquash } from "@/components/marketing/bug-squash";
import { PlatformStats } from "@/components/marketing/audience-sections";
import { ClosingCta } from "@/components/marketing/closing-cta";

const TICKER = [
  "Observe the build",
  "Find the signal",
  "Roguelike",
  "Platformer",
  "Strategy",
  "Co-op",
  "Puzzle",
  "Shooter",
  "Cozy sim",
  "RPG",
];

export default async function LandingPage() {
  const [stats, openPlaytests] = await Promise.all([
    getPlatformStats(),
    getDiscoverablePlaytests(),
  ]);

  return (
    <>
      <Hero stats={stats} />

      <Marquee items={TICKER} />

      <PlatformWorkflowShowcase />

      <FeaturedPlaytests playtests={openPlaytests.slice(0, 3)} />

      <section>
        <Container className="grid items-center gap-12 py-24 lg:grid-cols-2">
          <Reveal>
            <Eyebrow tone="coral">Warm-up round</Eyebrow>
            <h2 className="text-display-sm">
              Think like a tester. <span className="hl">Spot the bug.</span>
            </h2>
            <p className="mt-5 max-w-md text-muted-foreground">
              Good testers notice what is broken and what is working as intended. You
              have 20 seconds, nine holes, and zero mercy.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <BugSquash />
          </Reveal>
        </Container>
      </section>

      <PlatformStats stats={stats} />

      <ClosingCta />
    </>
  );
}
