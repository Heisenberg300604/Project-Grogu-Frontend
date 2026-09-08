"use client";

import { Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  GENRE_LABELS,
  GENRE_OPTIONS,
  PLATFORM_LABELS,
  PLATFORM_OPTIONS,
} from "@/lib/constants";
import type { DiscoverFilters } from "@/lib/domain";
import { EMPTY_DISCOVER_FILTERS } from "@/lib/domain";
import type { GameGenre, GamePlatform } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value];
}

const HOUR_OPTIONS = [2, 5, 10] as const;

export function DiscoverFilterPanel({
  filters,
  onChange,
  resultCount,
}: {
  filters: DiscoverFilters;
  onChange: (next: DiscoverFilters) => void;
  resultCount: number;
}) {
  const hasFilters =
    filters.search !== "" ||
    filters.genres.length > 0 ||
    filters.platforms.length > 0 ||
    filters.ndaOnly ||
    filters.maxHours != null;

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          type="search"
          placeholder="Search games, studios, playtests…"
          aria-label="Search playtests"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className="pl-9"
        />
      </div>

      <fieldset className="space-y-2">
        <legend className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Genre
        </legend>
        <div className="flex flex-wrap gap-1.5">
          {GENRE_OPTIONS.map((genre: GameGenre) => {
            const active = filters.genres.includes(genre);
            return (
              <button
                key={genre}
                type="button"
                aria-pressed={active}
                onClick={() =>
                  onChange({ ...filters, genres: toggle(filters.genres, genre) })
                }
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  active
                    ? "border-primary bg-primary/15 text-secondary"
                    : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground",
                )}
              >
                {GENRE_LABELS[genre]}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Platform
        </legend>
        <div className="flex flex-wrap gap-1.5">
          {PLATFORM_OPTIONS.map((platform: GamePlatform) => {
            const active = filters.platforms.includes(platform);
            return (
              <button
                key={platform}
                type="button"
                aria-pressed={active}
                onClick={() =>
                  onChange({
                    ...filters,
                    platforms: toggle(filters.platforms, platform),
                  })
                }
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  active
                    ? "border-primary bg-primary/15 text-secondary"
                    : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground",
                )}
              >
                {PLATFORM_LABELS[platform]}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Max time commitment
        </legend>
        <div className="flex flex-wrap gap-1.5">
          {HOUR_OPTIONS.map((hours) => {
            const active = filters.maxHours === hours;
            return (
              <button
                key={hours}
                type="button"
                aria-pressed={active}
                onClick={() =>
                  onChange({
                    ...filters,
                    maxHours: active ? null : hours,
                  })
                }
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  active
                    ? "border-primary bg-primary/15 text-secondary"
                    : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground",
                )}
              >
                ≤ {hours}h
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="flex items-center gap-2">
        <Checkbox
          id="nda-only"
          checked={filters.ndaOnly}
          onCheckedChange={(checked) =>
            onChange({ ...filters, ndaOnly: checked === true })
          }
        />
        <Label htmlFor="nda-only" className="font-normal text-muted-foreground">
          Only show playtests that require an NDA
        </Label>
      </div>

      <div className="flex items-center justify-between border-t border-border pt-4">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {resultCount} {resultCount === 1 ? "playtest" : "playtests"}
        </p>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange(EMPTY_DISCOVER_FILTERS)}
          >
            <X className="size-3.5" />
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}
