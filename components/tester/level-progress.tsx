import type { TesterProfile } from "@/lib/types";
import { levelProgress } from "@/lib/domain";
import { Progress } from "@/components/ui/progress";

type LevelFields = Pick<
  TesterProfile,
  "reputation" | "level" | "levelTitle" | "levelFloor" | "nextLevelAt"
>;

/** "Level 3 · Regular" — the short form used in badges and stat cards. */
export function levelLabel(profile: Pick<TesterProfile, "level" | "levelTitle">) {
  return `Level ${profile.level} · ${profile.levelTitle}`;
}

/**
 * The tester's level and how far they are from the next one. Levels come from
 * the server's threshold table; this only draws them.
 */
export function LevelProgress({ profile }: { profile: LevelFields }) {
  const { percent, toNext } = levelProgress(profile);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">{levelLabel(profile)}</span>
        <span className="tabular-nums">
          {toNext === null
            ? `${profile.reputation} reputation · top level`
            : `${profile.reputation} reputation · ${toNext} to level ${profile.level + 1}`}
        </span>
      </div>
      <Progress
        value={percent}
        aria-label={
          toNext === null
            ? `${levelLabel(profile)}, the top level`
            : `${percent}% of the way to level ${profile.level + 1}`
        }
      />
    </div>
  );
}
