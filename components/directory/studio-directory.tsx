"use client";

import { useMemo, useState } from "react";
import { Building2, X } from "lucide-react";

import { STUDIO_SIZE_LABELS } from "@/lib/constants";
import {
  EMPTY_STUDIO_FILTERS,
  matchesStudioFilters,
  sortStudios,
  type StudioDirectoryEntry,
  type StudioFilters,
  type StudioSize,
  type StudioSort,
} from "@/lib/domain";
import { useStudioDirectory } from "@/lib/hooks/use-grogu";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { CardGridSkeleton, EmptyState } from "@/components/ui/states";
import {
  FilterChip,
  FilterGroup,
  toggle,
} from "@/components/playtests/discover-filters";
import { DirectoryLayout } from "@/components/directory/directory-layout";
import { StudioDirectoryCard } from "@/components/directory/studio-directory-card";

const SORTS: Record<StudioSort, string> = {
  active: "Most active playtests",
  games: "Most games",
  founded: "Newest studios",
  name: "Name A–Z",
};

const SIZE_OPTIONS: StudioSize[] = ["solo", "small", "mid", "large"];
const PAGE_SIZE = 12;

function hasActiveFilters(filters: StudioFilters) {
  return filters.search.trim() !== "" || filters.sizes.length > 0;
}

function StudioFilterPanel({
  filters,
  onChange,
}: {
  filters: StudioFilters;
  onChange: (next: StudioFilters) => void;
}) {
  return (
    <div className="space-y-5">
      <FilterGroup legend="Studio size">
        {SIZE_OPTIONS.map((size) => (
          <FilterChip
            key={size}
            active={filters.sizes.includes(size)}
            onClick={() =>
              onChange({ ...filters, sizes: toggle(filters.sizes, size) })
            }
          >
            {STUDIO_SIZE_LABELS[size]}
          </FilterChip>
        ))}
      </FilterGroup>

      {hasActiveFilters(filters) && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full"
          onClick={() => onChange(EMPTY_STUDIO_FILTERS)}
        >
          <X /> Clear all filters
        </Button>
      )}
    </div>
  );
}

/**
 * The public studio directory. Renders the server-fetched list first, then
 * switches to the live store once it has hydrated, like Discover does.
 */
export function StudioDirectory({
  initialEntries,
}: {
  initialEntries: StudioDirectoryEntry[];
}) {
  const hydrated = useHydrated();
  const storeEntries = useStudioDirectory();
  const [filters, setFilters] = useState<StudioFilters>(EMPTY_STUDIO_FILTERS);
  const [sort, setSort] = useState<StudioSort>("active");
  const [page, setPage] = useState(1);

  const source = hydrated ? storeEntries : initialEntries;

  const results = useMemo(
    () =>
      sortStudios(
        source.filter((entry) => matchesStudioFilters(entry, filters)),
        sort,
      ),
    [source, filters, sort],
  );

  const totalPages = Math.ceil(results.length / PAGE_SIZE);
  const currentPage = Math.min(page, Math.max(1, totalPages));
  const visible = results.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function updateFilters(next: StudioFilters) {
    setFilters(next);
    setPage(1);
  }

  return (
    <DirectoryLayout
      searchLabel="Search studios"
      searchPlaceholder="Search by studio, lead or location…"
      search={filters.search}
      onSearchChange={(search) => updateFilters({ ...filters, search })}
      sortLabel="Sort studios"
      sort={sort}
      sortOptions={SORTS}
      onSortChange={(next) => {
        setSort(next);
        setPage(1);
      }}
      filterPanel={
        <StudioFilterPanel filters={filters} onChange={updateFilters} />
      }
      filterCount={filters.sizes.length}
      filtering={hasActiveFilters(filters)}
      onClearFilters={() => updateFilters(EMPTY_STUDIO_FILTERS)}
      resultCount={results.length}
      noun={{ singular: "studio", plural: "studios" }}
    >
      {!hydrated && initialEntries.length === 0 ? (
        <CardGridSkeleton count={6} />
      ) : results.length === 0 ? (
        <EmptyState
          icon={Building2}
          title={
            source.length === 0
              ? "No studios yet"
              : "No studios match your filters"
          }
          description={
            source.length === 0
              ? "Studios appear here once they have created a profile."
              : "Try widening your search — clear a filter to see more studios."
          }
          action={
            source.length > 0 ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => updateFilters(EMPTY_STUDIO_FILTERS)}
              >
                Clear all filters
              </Button>
            ) : undefined
          }
        />
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((entry) => (
              <StudioDirectoryCard key={entry.user.id} entry={entry} />
            ))}
          </div>
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </DirectoryLayout>
  );
}
