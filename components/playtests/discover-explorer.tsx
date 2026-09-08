"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Compass } from "lucide-react";

import {
  EMPTY_DISCOVER_FILTERS,
  matchesDiscoverFilters,
  type DiscoverFilters,
} from "@/lib/domain";
import type { PlaytestWithRelations } from "@/lib/types";
import { usePlaytests } from "@/lib/hooks/use-grogu";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/states";
import { PlaytestCard } from "@/components/playtests/playtest-card";
import { DiscoverFilterPanel } from "@/components/playtests/discover-filters";

export function DiscoverExplorer({
  initialPlaytests,
}: {
  initialPlaytests: PlaytestWithRelations[];
}) {
  const hydrated = useHydrated();
  const [filters, setFilters] = useState<DiscoverFilters>(EMPTY_DISCOVER_FILTERS);
  const storePlaytests = usePlaytests();

  // Use the server-rendered list until the persisted store has hydrated, so the
  // page shows content immediately and the first client render matches the HTML.
  const source = hydrated
    ? storePlaytests.filter((p) => p.status === "recruiting")
    : initialPlaytests;

  const results = useMemo(
    () =>
      source
        .filter((p) => matchesDiscoverFilters(p, filters))
        .sort((a, b) => a.closesAt.localeCompare(b.closesAt)),
    [source, filters],
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[18rem_1fr]">
      <aside className="lg:sticky lg:top-24 lg:h-fit">
        <Card className="p-5">
          <DiscoverFilterPanel
            filters={filters}
            onChange={setFilters}
            resultCount={results.length}
          />
        </Card>
      </aside>

      <div>
        {results.length === 0 ? (
          <EmptyState
            icon={Compass}
            title="No playtests match your filters"
            description="Try widening your search — clear a filter or two to see more open playtests."
            action={
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setFilters(EMPTY_DISCOVER_FILTERS)}
              >
                Clear all filters
              </Button>
            }
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((playtest) => (
              <PlaytestCard key={playtest.id} playtest={playtest} />
            ))}
          </div>
        )}

        <Card className="mt-8 flex flex-col items-start gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Running playtests for your own game?
          </p>
          <Button asChild variant="secondary" size="sm">
            <Link href="/developers">Learn about Grogu for developers</Link>
          </Button>
        </Card>
      </div>
    </div>
  );
}
