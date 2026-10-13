"use client";

import { useMemo, useState } from "react";
import { Users, X } from "lucide-react";

import {
  EXPERIENCE_LABELS,
  EXPERIENCE_OPTIONS,
  GENRE_LABELS,
  GENRE_OPTIONS,
  PLATFORM_LABELS,
  PLATFORM_OPTIONS,
} from "@/lib/constants";
import {
  EMPTY_TESTER_FILTERS,
  matchesTesterFilters,
  sortTesters,
  type TesterDirectoryEntry,
  type TesterFilters,
  type TesterSort,
} from "@/lib/domain";
import { useTesterDirectory } from "@/lib/hooks/use-grogu";
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
import { TesterDirectoryCard } from "@/components/directory/tester-directory-card";

const SORTS: Record<TesterSort, string> = {
  reputation: "Highest reputation",
  completed: "Most playtests completed",
  availability: "Most available",
  name: "Name A–Z",
};

const PAGE_SIZE = 12;

function activeFilterCount(filters: TesterFilters) {
  return (
    filters.experience.length + filters.platforms.length + filters.genres.length
  );
}

function hasActiveFilters(filters: TesterFilters) {
  return filters.search.trim() !== "" || activeFilterCount(filters) > 0;
}

function TesterFilterPanel({
  filters,
  onChange,
}: {
  filters: TesterFilters;
  onChange: (next: TesterFilters) => void;
}) {
  return (
    <div className="space-y-5">
      <FilterGroup legend="Experience">
        {EXPERIENCE_OPTIONS.map((level) => (
          <FilterChip
            key={level}
            active={filters.experience.includes(level)}
            onClick={() =>
              onChange({
                ...filters,
                experience: toggle(filters.experience, level),
              })
            }
          >
            {EXPERIENCE_LABELS[level]}
          </FilterChip>
        ))}
      </FilterGroup>

      <FilterGroup legend="Platform">
        {PLATFORM_OPTIONS.map((platform) => (
          <FilterChip
            key={platform}
            active={filters.platforms.includes(platform)}
            onClick={() =>
              onChange({
                ...filters,
                platforms: toggle(filters.platforms, platform),
              })
            }
          >
            {PLATFORM_LABELS[platform]}
          </FilterChip>
        ))}
      </FilterGroup>

      <FilterGroup legend="Genre">
        {GENRE_OPTIONS.map((genre) => (
          <FilterChip
            key={genre}
            active={filters.genres.includes(genre)}
            onClick={() =>
              onChange({ ...filters, genres: toggle(filters.genres, genre) })
            }
          >
            {GENRE_LABELS[genre]}
          </FilterChip>
        ))}
      </FilterGroup>

      {hasActiveFilters(filters) && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full"
          onClick={() => onChange(EMPTY_TESTER_FILTERS)}
        >
          <X /> Clear all filters
        </Button>
      )}
    </div>
  );
}

/**
 * The public tester directory. Renders the server-fetched list first, then
 * switches to the live store once it has hydrated, like Discover does.
 */
export function TesterDirectory({
  initialEntries,
}: {
  initialEntries: TesterDirectoryEntry[];
}) {
  const hydrated = useHydrated();
  const storeEntries = useTesterDirectory();
  const [filters, setFilters] = useState<TesterFilters>(EMPTY_TESTER_FILTERS);
  const [sort, setSort] = useState<TesterSort>("reputation");
  const [page, setPage] = useState(1);

  const source = hydrated ? storeEntries : initialEntries;

  const results = useMemo(
    () =>
      sortTesters(
        source.filter((entry) => matchesTesterFilters(entry, filters)),
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

  function updateFilters(next: TesterFilters) {
    setFilters(next);
    setPage(1);
  }

  return (
    <DirectoryLayout
      searchLabel="Search testers"
      searchPlaceholder="Search by name, location or bio…"
      search={filters.search}
      onSearchChange={(search) => updateFilters({ ...filters, search })}
      sortLabel="Sort testers"
      sort={sort}
      sortOptions={SORTS}
      onSortChange={(next) => {
        setSort(next);
        setPage(1);
      }}
      filterPanel={
        <TesterFilterPanel filters={filters} onChange={updateFilters} />
      }
      filterCount={activeFilterCount(filters)}
      filtering={hasActiveFilters(filters)}
      onClearFilters={() => updateFilters(EMPTY_TESTER_FILTERS)}
      resultCount={results.length}
      noun={{ singular: "tester", plural: "testers" }}
    >
      {!hydrated && initialEntries.length === 0 ? (
        <CardGridSkeleton count={6} />
      ) : results.length === 0 ? (
        <EmptyState
          icon={Users}
          title={
            source.length === 0
              ? "No testers yet"
              : "No testers match your filters"
          }
          description={
            source.length === 0
              ? "Testers appear here once they have created a profile."
              : "Try widening your search — clear a filter or two to see more testers."
          }
          action={
            source.length > 0 ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => updateFilters(EMPTY_TESTER_FILTERS)}
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
              <TesterDirectoryCard key={entry.user.id} entry={entry} />
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
