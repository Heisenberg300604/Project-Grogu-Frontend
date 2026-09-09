import {
  getDiscoverablePlaytests,
  getFeaturedGames,
  getPlatformStats,
} from "@/data";
import { Hero } from "@/components/marketing/hero";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { FeaturedPlaytests } from "@/components/marketing/featured-playtests";
import { FeaturedGames } from "@/components/marketing/featured-games";
import {
  DeveloperCta,
  PlatformStats,
  WhyDevelopers,
  WhyTesters,
} from "@/components/marketing/audience-sections";

export default async function LandingPage() {
  const [stats, featuredGames, openPlaytests] = await Promise.all([
    getPlatformStats(),
    getFeaturedGames(3),
    getDiscoverablePlaytests(),
  ]);

  return (
    <>
      <Hero stats={stats} showcase={openPlaytests} />
      <FeaturedPlaytests playtests={openPlaytests.slice(0, 3)} />
      <HowItWorks />
      <WhyTesters />
      <WhyDevelopers />
      <PlatformStats stats={stats} />
      <FeaturedGames games={featuredGames} />
      <DeveloperCta />
    </>
  );
}
