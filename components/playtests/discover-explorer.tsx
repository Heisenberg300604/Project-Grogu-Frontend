"use client";

import { useState } from "react";
import Link from "next/link";
import { Compass } from "lucide-react";

import { EMPTY_DISCOVER_FILTERS, type DiscoverFilters } from "@/lib/domain";
import { useDiscoverPlaytests } from "@/lib/hooks/use-grogu";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CardGridSkeleton, EmptyState } from "@/components/ui/states";
import { PlaytestCard } from "@/components/playtests/playtest-card";
import { DiscoverFilterPanel } from "@/components/playtests/discover-filters";

export function DiscoverExplorer() {
  const hydrated = useHydrated();
  const [filters, setFilters] = useState<DiscoverFilters>(EMPTY_DISCOVER_FILTERS);
  const results = useDiscoverPlaytests(filters);

  return (
    <div className="grid gap-8 lg:grid-cols-[18rem_1fr]">
      <aside className="lg:sticky lg:top-24 lg:h-fit">
        <Card className="p-5">
          <DiscoverFilterPanel
            filters={filters}
            onChange={setFilters}
            resultCount={hydrated ? results.length : 0}
          />
        </Card>
      </aside>

      <div>
        {!hydrated ? (
          <CardGridSkeleton count={6} />
        ) : results.length === 0 ? (
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
            Run playtests for your own game?
          </p>
          <Button asChild variant="secondary" size="sm">
            <Link href="/developers">Learn about Grogu for developers</Link>
          </Button>
        </Card>
      </div>
    </div>
  );
}
