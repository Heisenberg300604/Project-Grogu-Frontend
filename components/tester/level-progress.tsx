import { Flame } from "lucide-react";

import type { TesterProfile } from "@/lib/types";
import { levelProgress } from "@/lib/domain";
import { Segments } from "@/components/ui/segments";

type LevelFields = Pick<
  TesterProfile,
  "reputation" | "level" | "levelTitle" | "levelFloor" | "nextLevelAt"
>;

/** "Level 3 · Regular" — the short form used in badges and stat cards. */
export function levelLabel(profile: Pick<TesterProfile, "level" | "levelTitle">) {
  return `Level ${profile.level} · ${profile.levelTitle}`;
}

/**
 * The tester's level and how far they are from the next one, drawn as a
 * segmented XP bar. Levels come from the server's threshold table; this only
 * draws them.
 */
export function LevelProgress({ profile }: { profile: LevelFields }) {
  const { percent, toNext } = levelProgress(profile);

  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-sm text-muted-foreground">
        <span className="flex items-center gap-2 font-bold text-foreground">
          <Flame className="size-[18px] text-destructive" aria-hidden />
          {levelLabel(profile)}
        </span>
        <span className="tabular-nums">
          {toNext === null
            ? `${profile.reputation} reputation · top level`
            : `${profile.reputation} reputation · ${toNext} to level ${profile.level + 1}`}
        </span>
      </div>
      <Segments
        value={percent / 100}
        total={24}
        label={
          toNext === null
            ? `${levelLabel(profile)}, the top level`
            : `${percent}% of the way to level ${profile.level + 1}`
        }
      />
    </div>
  );
}
