import { getFeaturedGames, getPlatformStats } from "@/data";
import { Hero } from "@/components/marketing/hero";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { FeaturedGames } from "@/components/marketing/featured-games";
import { DeveloperCta } from "@/components/marketing/developer-cta";

export default async function LandingPage() {
  const [stats, featuredGames] = await Promise.all([
    getPlatformStats(),
    getFeaturedGames(6),
  ]);

  return (
    <>
      <Hero stats={stats} />
      <HowItWorks />
      <FeaturedGames games={featuredGames} />
      <DeveloperCta />
    </>
  );
}
