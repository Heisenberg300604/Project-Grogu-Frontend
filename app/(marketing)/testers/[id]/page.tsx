import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getTesterProfile } from "@/data";
import { Container } from "@/components/ui/container";
import { TesterPublicProfile } from "@/components/directory/tester-public-profile";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const tester = await getTesterProfile(id);
  if (!tester) return { title: "Tester" };
  return {
    title: tester.user.name,
    description: `${tester.user.name} is a playtester on Grogu with a reputation of ${tester.profile.reputation}.`,
  };
}

export default async function TesterProfilePage({ params }: Params) {
  const { id } = await params;
  const tester = await getTesterProfile(id);
  if (!tester) notFound();

  return (
    <Container className="py-10">
      <TesterPublicProfile entry={tester} />
    </Container>
  );
}
