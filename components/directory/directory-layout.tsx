"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

/**
 * Shared frame for the tester and studio directories: search, sort, a filter
 * rail (a drawer below `lg`) and a live result count. The directories differ
 * only in their filters and cards, which they pass in.
 */
export function DirectoryLayout<SortKey extends string>({
  searchLabel,
  searchPlaceholder,
  search,
  onSearchChange,
  sortLabel,
  sort,
  sortOptions,
  onSortChange,
  filterPanel,
  filterCount,
  filtering,
  onClearFilters,
  resultCount,
  noun,
  children,
}: {
  searchLabel: string;
  searchPlaceholder: string;
  search: string;
  onSearchChange: (value: string) => void;
  sortLabel: string;
  sort: SortKey;
  sortOptions: Record<SortKey, string>;
  onSortChange: (value: SortKey) => void;
  filterPanel: React.ReactNode;
  filterCount: number;
  filtering: boolean;
  onClearFilters: () => void;
  resultCount: number;
  noun: { singular: string; plural: string };
  children: React.ReactNode;
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-subtle-foreground"
            aria-hidden
          />
          <Input
            type="search"
            placeholder={searchPlaceholder}
            aria-label={searchLabel}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-12 pl-10 text-base"
          />
        </div>

        <div className="flex items-center gap-2">
          <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="secondary" size="lg" className="lg:hidden">
                <SlidersHorizontal />
                Filters
                {filterCount > 0 && (
                  <Badge tone="primary" className="ml-0.5">
                    {filterCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="max-w-sm overflow-y-auto">
              <SheetTitle className="font-display text-base font-semibold">
                Filters
              </SheetTitle>
              {filterPanel}
              <Button
                className="mt-2 w-full"
                onClick={() => setFiltersOpen(false)}
              >
                Show {resultCount}{" "}
                {resultCount === 1 ? noun.singular : noun.plural}
              </Button>
            </SheetContent>
          </Sheet>

          <Select
            value={sort}
            onValueChange={(value) => onSortChange(value as SortKey)}
          >
            <SelectTrigger className="h-12 w-full sm:w-52" aria-label={sortLabel}>
              {/* Radix renders SelectValue empty until the menu has been opened
                  once, so the current label is passed explicitly. */}
              <SelectValue>{sortOptions[sort]}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {(Object.entries(sortOptions) as [SortKey, string][]).map(
                ([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[15rem_1fr] lg:gap-12">
        <aside className="hidden lg:sticky lg:top-24 lg:block lg:h-fit">
          <h2 className="sr-only">Filters</h2>
          {filterPanel}
        </aside>

        <div className="min-w-0 space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground" aria-live="polite">
              <span className="font-medium text-foreground">{resultCount}</span>{" "}
              {resultCount === 1 ? noun.singular : noun.plural}
              {filtering && " match your filters"}
            </p>
            {filtering && (
              <Button variant="ghost" size="sm" onClick={onClearFilters}>
                <X /> Clear filters
              </Button>
            )}
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
