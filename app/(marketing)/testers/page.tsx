import type { Metadata } from "next";

import { getTesterDirectory } from "@/data";
import { Container } from "@/components/ui/container";
import { DirectoryTabs } from "@/components/directory/directory-tabs";
import { TesterDirectory } from "@/components/directory/tester-directory";

export const metadata: Metadata = {
  title: "Testers",
  description:
    "Browse the playtesters on Grogu. Filter by experience, platform, and genre.",
};

export default async function TestersPage() {
  const entries = await getTesterDirectory();

  return (
    <>
      <div className="surface-grid border-b border-border">
        <Container className="py-12 sm:py-16">
          <DirectoryTabs className="mb-6" />
          <p className="text-label text-secondary">Community</p>
          <h1 className="text-display-sm mt-3 max-w-2xl">Meet the testers</h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            The players who give studios structured feedback. Browse by
            experience, platform and the genres they know best.
          </p>
        </Container>
      </div>

      <Container className="py-10">
        <TesterDirectory initialEntries={entries} />
      </Container>
    </>
  );
}
