import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";

import { testCompletion } from "@/lib/domain";
import { TEST_STAGE_META } from "@/lib/constants";
import type { TesterTest } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/ui/status-badge";
import { GameCover } from "@/components/games/game-cover";

/** Row/card for one of a tester's accepted tests (dashboard + My tests). */
export function TestProgressCard({ test }: { test: TesterTest }) {
  const { playtest, progress } = test;
  const stage = progress?.stage ?? "not-started";
  const meta = TEST_STAGE_META[stage];
  const completion = testCompletion(progress, playtest);
  const pct = Math.round(completion.ratio * 100);

  return (
    <Card className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
      <Link
        href={`/tests/${playtest.id}`}
        className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-lg border border-border sm:w-40"
      >
        <GameCover game={playtest.game} />
      </Link>

      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge kind="test" status={stage} />
          <span className="text-xs text-muted-foreground">
            {playtest.game.title}
          </span>
        </div>
        <h3 className="font-display text-sm font-semibold">
          <Link href={`/tests/${playtest.id}`} className="hover:text-secondary">
            {playtest.title}
          </Link>
        </h3>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {completion.done}/{completion.total} required tasks
            </span>
            <span>{meta.label}</span>
          </div>
          <Progress value={stage === "completed" ? 100 : pct} />
        </div>
      </div>

      <div className="shrink-0">
        <Button asChild size="sm" variant={stage === "completed" ? "secondary" : "primary"}>
          <Link href={`/tests/${playtest.id}`}>
            {stage === "completed" ? (
              "View"
            ) : progress?.buildDownloaded ? (
              <>
                Continue <ArrowRight className="size-4" />
              </>
            ) : (
              <>
                <Download className="size-4" /> Start
              </>
            )}
          </Link>
        </Button>
      </div>
    </Card>
  );
}
