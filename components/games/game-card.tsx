import { cn } from "@/lib/utils";
import { GENRE_LABELS, PLATFORM_LABELS } from "@/lib/constants";
import type { Game } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { GameCover } from "@/components/games/game-cover";

const STATUS_LABELS: Record<Game["status"], string> = {
  "in-development": "In development",
  alpha: "Alpha",
  beta: "Beta",
  released: "Released",
};

/** Compact game card used in marketing "Featured Games" and future catalogues. */
export function GameCard({
  game,
  className,
}: {
  game: Game;
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "flex flex-col overflow-hidden transition-colors hover:border-border-strong",
        className,
      )}
    >
      <div className="relative aspect-[16/9] w-full border-b border-border">
        <GameCover game={game} />
        <Badge tone="outline" className="absolute right-3 top-3 bg-background/70">
          {STATUS_LABELS[game.status]}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="space-y-1">
          <h3 className="font-display text-lg font-semibold">{game.title}</h3>
          <p className="text-sm text-muted-foreground">{game.tagline}</p>
        </div>

        <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
          {game.genres.slice(0, 2).map((genre) => (
            <Badge key={genre} tone="muted">
              {GENRE_LABELS[genre]}
            </Badge>
          ))}
          {game.platforms.slice(0, 3).map((platform) => (
            <Badge key={platform} tone="default">
              {PLATFORM_LABELS[platform]}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
}
