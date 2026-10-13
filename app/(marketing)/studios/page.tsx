import type { Metadata } from "next";

import { getStudioDirectory } from "@/data";
import { Container } from "@/components/ui/container";
import { DirectoryTabs } from "@/components/directory/directory-tabs";
import { StudioDirectory } from "@/components/directory/studio-directory";

export const metadata: Metadata = {
  title: "Studios",
  description:
    "Browse the game studios running playtests on Grogu, from solo developers to larger teams.",
};

export default async function StudiosPage() {
  const entries = await getStudioDirectory();

  return (
    <>
      <div className="surface-grid border-b border-border">
        <Container className="py-12 sm:py-16">
          <DirectoryTabs className="mb-6" />
          <p className="text-label text-secondary">Community</p>
          <h1 className="text-display-sm mt-3 max-w-2xl">Browse studios</h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            The teams building the games you can help shape. See what they have
            made and which playtests are open.
          </p>
        </Container>
      </div>

      <Container className="py-10">
        <StudioDirectory initialEntries={entries} />
      </Container>
    </>
  );
}
