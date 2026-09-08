import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { formatRelativeTime } from "@/lib/utils";
import { APPLICATION_STATUS_META } from "@/lib/constants";
import type { Application, PlaytestWithRelations } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GameCover } from "@/components/games/game-cover";

export function ApplicationCard({
  application,
  playtest,
  onWithdraw,
  withdrawing,
}: {
  application: Application;
  playtest: PlaytestWithRelations;
  onWithdraw?: () => void;
  withdrawing?: boolean;
}) {
  const meta = APPLICATION_STATUS_META[application.status];

  return (
    <Card className="flex flex-col gap-4 p-4 sm:flex-row">
      <Link
        href={`/playtests/${playtest.id}`}
        className="relative aspect-video w-full shrink-0 overflow-hidden rounded-lg border border-border sm:h-24 sm:w-40"
      >
        <GameCover game={playtest.game} />
      </Link>

      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={meta.tone}>{meta.label}</Badge>
          <span className="text-xs text-muted-foreground">
            Applied {formatRelativeTime(application.submittedAt)}
          </span>
        </div>
        <h3 className="font-display text-sm font-semibold">
          <Link href={`/playtests/${playtest.id}`} className="hover:text-secondary">
            {playtest.title}
          </Link>
        </h3>
        <p className="text-xs text-muted-foreground">
          {playtest.game.title} · {playtest.developer.name}
        </p>
        {application.status === "rejected" && application.decisionNote && (
          <p className="mt-1 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs text-muted-foreground">
            {application.decisionNote}
          </p>
        )}
      </div>

      <div className="flex shrink-0 flex-row gap-2 sm:flex-col">
        {application.status === "accepted" && (
          <Button asChild size="sm">
            <Link href={`/tests/${playtest.id}`}>
              Open test <ArrowRight className="size-4" />
            </Link>
          </Button>
        )}
        {application.status === "pending" && onWithdraw && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onWithdraw}
            loading={withdrawing}
          >
            Withdraw
          </Button>
        )}
        {(application.status === "rejected" || application.status === "withdrawn") && (
          <Button asChild size="sm" variant="secondary">
            <Link href="/discover">Find more</Link>
          </Button>
        )}
      </div>
    </Card>
  );
}
