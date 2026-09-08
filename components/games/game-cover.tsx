import { cn } from "@/lib/utils";
import type { Game } from "@/lib/types";

/**
 * Procedural cover art for a game. Deterministic from `game.accentHue` + title,
 * so the prototype needs zero image assets while still looking intentional.
 * If a real `coverImageUrl` is added later, prefer rendering that instead.
 */
export function GameCover({
  game,
  className,
}: {
  game: Pick<Game, "title" | "accentHue" | "coverImageUrl">;
  className?: string;
}) {
  if (game.coverImageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={game.coverImageUrl}
        alt={`${game.title} cover art`}
        className={cn("h-full w-full object-cover", className)}
      />
    );
  }

  const hue = game.accentHue;
  const initials = game.title
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div
      role="img"
      aria-label={`${game.title} cover art`}
      className={cn("relative h-full w-full overflow-hidden", className)}
      style={{
        backgroundColor: `hsl(${hue} 45% 12%)`,
      }}
    >
      <svg
        viewBox="0 0 400 225"
        className="absolute inset-0 h-full w-full"
        aria-hidden
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id={`gc-${hue}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={`hsl(${hue} 55% 22%)`} />
            <stop offset="1" stopColor={`hsl(${(hue + 40) % 360} 45% 10%)`} />
          </linearGradient>
        </defs>
        <rect width="400" height="225" fill={`url(#gc-${hue})`} />
        <g stroke={`hsl(${hue} 60% 60% / 0.18)`} strokeWidth="1" fill="none">
          {Array.from({ length: 7 }).map((_, i) => (
            <circle key={i} cx="320" cy="40" r={20 + i * 26} />
          ))}
        </g>
      </svg>
      <span className="absolute bottom-3 left-4 font-display text-3xl font-bold tracking-tight text-white/90">
        {initials}
      </span>
    </div>
  );
}
