import type { Metadata } from "next";
import { Suspense } from "react";

import { getDiscoverablePlaytests } from "@/data";
import { Container } from "@/components/ui/container";
import { CardGridSkeleton } from "@/components/ui/states";
import { DirectoryTabs } from "@/components/directory/directory-tabs";
import { DiscoverExplorer } from "@/components/playtests/discover-explorer";

export const metadata: Metadata = {
  title: "Discover playtests",
  description:
    "Browse indie games looking for testers. Filter by genre, platform, and time commitment.",
};

/**
 * The list waits for the API; the heading does not. Streaming it behind a
 * Suspense boundary lets the page paint at once while the server fetches.
 */
async function DiscoverList() {
  const playtests = await getDiscoverablePlaytests();
  return <DiscoverExplorer initialPlaytests={playtests} />;
}

function DiscoverListFallback() {
  return (
    <div className="space-y-4" role="status" aria-live="polite">
      <CardGridSkeleton />
      <p className="text-center text-sm text-muted-foreground">
        Loading playtests. The first visit after the server has been idle can take
        up to a minute.
      </p>
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <>
      <div className="surface-grid border-b border-border">
        <Container className="py-12 sm:py-16">
          <DirectoryTabs className="mb-6" />
          <p className="text-label text-secondary">Discover</p>
          <h1 className="text-display-sm mt-3 max-w-2xl">
            Find your next playtest
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            Every playtest below is open for applications right now. Sign in as a
            tester to apply.
          </p>
        </Container>
      </div>

      <Container className="py-10">
        <Suspense fallback={<DiscoverListFallback />}>
          <DiscoverList />
        </Suspense>
      </Container>
    </>
  );
}
