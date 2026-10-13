import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getDeveloperProfile,
  getGamesByDeveloper,
  getPlaytestsByDeveloper,
} from "@/data";
import { Container } from "@/components/ui/container";
import { StudioPublicProfile } from "@/components/directory/studio-public-profile";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const studio = await getDeveloperProfile(id);
  if (!studio) return { title: "Studio" };
  return {
    title: studio.profile.studioName,
    description: `${studio.profile.studioName} on Grogu — games and open playtests.`,
  };
}

export default async function StudioProfilePage({ params }: Params) {
  const { id } = await params;
  const studio = await getDeveloperProfile(id);
  if (!studio) notFound();

  const [games, playtests] = await Promise.all([
    getGamesByDeveloper(id),
    getPlaytestsByDeveloper(id),
  ]);

  return (
    <Container className="py-10">
      <StudioPublicProfile entry={studio} games={games} playtests={playtests} />
    </Container>
  );
}
