import { cn } from "@/lib/utils";
import { assetUrl } from "@/lib/assets";
import type { Game, GameGenre } from "@/lib/types";

/**
 * Procedural cover art for a game.
 *
 * The prototype ships no image assets, so cover art is generated: a motif
 * chosen from the game's primary genre, coloured from `accentHue`, with the
 * layout jittered by a hash of the title. Everything is deterministic, so the
 * server and client render byte-identical SVG and each game keeps the same
 * artwork on every visit.
 *
 * An uploaded poster (`coverImageUrl`) wins when present and loadable; the
 * generator is the fallback for games without one.
 */

type Motif = "ridge" | "shards" | "grid" | "contour" | "orbit" | "fog";

/** Which motif a genre reads as. First matching genre on the game wins. */
const GENRE_MOTIF: Record<GameGenre, Motif> = {
  adventure: "ridge",
  rpg: "ridge",
  platformer: "ridge",
  action: "shards",
  shooter: "shards",
  puzzle: "grid",
  strategy: "grid",
  simulation: "contour",
  roguelike: "orbit",
  horror: "fog",
};

/** FNV-1a — small, stable, and identical across server and client. */
function hash(value: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Seeded PRNG so a title always produces the same layout. */
function rng(seed: number) {
  let state = seed || 1;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function motifFor(genres: GameGenre[] | undefined): Motif {
  for (const genre of genres ?? []) {
    const motif = GENRE_MOTIF[genre];
    if (motif) return motif;
  }
  return "contour";
}

/* -------------------------------------------------------------------------- */
/*  Motifs — each draws into a 400 × 225 viewBox                               */
/*                                                                            */
/*  Flat colour, thick ink outlines, one or two shapes that move. Colours are  */
/*  derived from the game's hue, so a game keeps its identity in both themes.  */
/* -------------------------------------------------------------------------- */

const INK = "#17142b";

interface MotifProps {
  hue: number;
  /** Each motif seeds its own generator, so a render is a pure function of
      (hue, seed) — React may render twice in development and must get the same art. */
  seed: number;
}

/** HSL helper that keeps hue in range. */
const tone = (hue: number, s: number, l: number, shift = 0) =>
  `hsl(${(((hue + shift) % 360) + 360) % 360} ${s}% ${l}%)`;

/** Sunny hills with a flag-pole castle. Reads as "world to explore". */
function Ridge({ hue, seed }: MotifProps) {
  const random = rng(seed);
  const layers = [0, 1, 2].map((i) => {
    const baseY = 112 + i * 30;
    const points: string[] = [];
    for (let x = -20; x <= 420; x += 70) {
      points.push(`${x},${Math.round(baseY - random() * (46 - i * 10))}`);
    }
    return {
      d: `M-20,240 L${points.join(" L")} L420,240 Z`,
      fill: tone(hue, 58 + i * 8, 70 - i * 10, 150 + i * 24),
    };
  });
  const sunX = 70 + Math.round(random() * 240);

  return (
    <>
      <circle cx={sunX} cy={56} r={26} fill="#ffc933" stroke={INK} strokeWidth={4} className="svg-anim a-pulse" />
      {layers.map((layer, i) => (
        <path key={i} d={layer.d} fill={layer.fill} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      ))}
      <rect x={0} y={196} width={400} height={29} fill="#19c58d" stroke={INK} strokeWidth={4} />
    </>
  );
}

/** Spinning crosshair over diagonal stripes. Reads as speed / impact. */
function Shards({ hue, seed }: MotifProps) {
  const random = rng(seed);
  const bands = Array.from({ length: 5 }, (_, i) => ({
    x: -40 + i * 90 + random() * 20,
    w: 28 + random() * 26,
  }));

  return (
    <>
      {bands.map((band, i) => (
        <path
          key={i}
          d={`M${band.x},-20 L${band.x + band.w},-20 L${band.x + band.w - 90},245 L${band.x - 90},245 Z`}
          fill={tone(hue, 90, i % 2 ? 72 : 66, 24)}
        />
      ))}
      <g stroke={INK} strokeWidth={6} fill="none" className="svg-anim a-spin-slow">
        <circle cx={200} cy={112} r={50} />
        <path d="M200 44v36M200 144v36M132 112h36M232 112h36" />
      </g>
      <circle cx={200} cy={112} r={8} fill="#ff5a7a" stroke={INK} strokeWidth={3} />
    </>
  );
}

/** Block field with a few lit tiles that bob. Reads as systems / puzzles. */
function Grid({ hue, seed }: MotifProps) {
  const random = rng(seed);
  const cells: { x: number; y: number; lit: boolean }[] = [];
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 11; col++) {
      cells.push({ x: col * 38 + (row % 2 ? 19 : 0) - 6, y: row * 38 - 2, lit: random() > 0.8 });
    }
  }

  return (
    <>
      {cells.map((cell, i) => (
        <rect
          key={i}
          x={cell.x}
          y={cell.y}
          width={30}
          height={30}
          rx={6}
          fill={cell.lit ? tone(hue, 90, 64, 150) : tone(hue, 70, 78)}
          stroke={INK}
          strokeWidth={cell.lit ? 3 : 2}
          strokeOpacity={cell.lit ? 1 : 0.35}
          className={cell.lit ? (i % 2 ? "svg-anim a-float" : "svg-anim a-float-2") : undefined}
        />
      ))}
    </>
  );
}

/** Nested terrain rings. Reads as simulation. */
function Contour({ hue, seed }: MotifProps) {
  const random = rng(seed);
  const cx = 110 + random() * 180;
  const cy = 80 + random() * 60;

  return (
    <>
      {[5, 4, 3, 2, 1].map((n, i) => (
        <ellipse
          key={n}
          cx={cx}
          cy={cy}
          rx={n * 34}
          ry={n * 24}
          fill={tone(hue, 70, 66 + (i % 2 ? 14 : 0), i * 18)}
          stroke={INK}
          strokeWidth={4}
        />
      ))}
      <g className="svg-anim a-float">
        <circle cx={cx} cy={cy - 6} r={13} fill="#ffc933" stroke={INK} strokeWidth={4} />
        <rect x={cx - 2} y={cy - 13} width={4} height={14} fill={INK} />
      </g>
    </>
  );
}

/** Night sky, moon and orbiting rings. Reads as runs / procedural depth. */
function Orbit({ hue, seed }: MotifProps) {
  const random = rng(seed);
  const stars = Array.from({ length: 14 }, () => ({
    x: random() * 390,
    y: random() * 140,
  }));

  return (
    <>
      <rect width={400} height={225} fill={tone(hue, 48, 22)} />
      <g fill="#fff">
        {stars.map((star, i) => (
          <rect key={i} x={star.x} y={star.y} width={4} height={4} opacity={0.85} />
        ))}
      </g>
      <polygon points="0,225 70,150 130,190 200,130 270,180 340,140 400,175 400,225" fill={tone(hue, 40, 32)} />
      <g className="svg-anim a-spin-slow" fill="none" stroke={tone(hue, 90, 72, 30)} strokeWidth={4}>
        <ellipse cx={290} cy={70} rx={70} ry={22} transform="rotate(-20 290 70)" />
      </g>
      <circle cx={290} cy={70} r={28} fill="#e9e6ff" stroke={INK} strokeWidth={4} />
    </>
  );
}

/** Tall pillars and a bobbing ghost. Reads as dread, but friendly. */
function Fog({ hue, seed }: MotifProps) {
  const random = rng(seed);
  const pillars = Array.from({ length: 7 }, (_, i) => ({
    x: 12 + i * 58 + random() * 10,
    w: 22 + random() * 16,
    top: 90 + random() * 60,
  }));

  return (
    <>
      <circle cx={320} cy={54} r={24} fill="#e9e6ff" stroke={INK} strokeWidth={4} />
      {pillars.map((pillar, i) => (
        <rect
          key={i}
          x={pillar.x}
          y={pillar.top}
          width={pillar.w}
          height={240 - pillar.top}
          fill={tone(hue, 36, 24 + (i % 2) * 8)}
          stroke={INK}
          strokeWidth={4}
        />
      ))}
      <g className="svg-anim a-float">
        <path d="M150 96a26 26 0 0 1 52 0v44l-9-8-8 8-9-8-9 8-9-8-8 8z" fill="#fff" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
        <rect x={163} y={88} width={6} height={10} fill={INK} />
        <rect x={183} y={88} width={6} height={10} fill={INK} />
      </g>
    </>
  );
}

const MOTIFS: Record<Motif, (props: MotifProps) => React.JSX.Element> = {
  ridge: Ridge,
  shards: Shards,
  grid: Grid,
  contour: Contour,
  orbit: Orbit,
  fog: Fog,
};

/** Backdrop colour per motif: bright for the daytime motifs, deep for the night ones. */
const BACKDROP: Record<Motif, (hue: number) => string> = {
  ridge: (hue) => tone(hue, 85, 76, 200),
  shards: (hue) => tone(hue, 95, 58, 10),
  grid: (hue) => tone(hue, 80, 58),
  contour: (hue) => tone(hue, 75, 74, 170),
  orbit: (hue) => tone(hue, 48, 22),
  fog: (hue) => tone(hue, 42, 34),
};

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export function GameCover({
  game,
  className,
  /** Adds a soft bottom scrim so overlaid text stays readable. */
  scrim = false,
}: {
  game: Pick<Game, "title" | "accentHue" | "coverImageUrl"> &
    Partial<Pick<Game, "genres">>;
  className?: string;
  scrim?: boolean;
}) {
  const poster = assetUrl(game.coverImageUrl);
  if (poster) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={poster}
        alt={`${game.title} cover art`}
        className={cn("h-full w-full object-cover", className)}
      />
    );
  }

  const hue = game.accentHue;
  const seed = hash(`${game.title}:${hue}`);
  const motif = motifFor(game.genres);
  const Motif = MOTIFS[motif];
  const backdrop = BACKDROP[motif](hue);

  return (
    <div
      role="img"
      aria-label={`${game.title} cover art`}
      className={cn("relative h-full w-full overflow-hidden", className)}
      style={{ backgroundColor: backdrop }}
    >
      <svg
        viewBox="0 0 400 225"
        className="absolute inset-0 h-full w-full"
        aria-hidden
        preserveAspectRatio="xMidYMid slice"
      >
        <rect width="400" height="225" fill={backdrop} />
        <Motif hue={hue} seed={seed} />
      </svg>

      {scrim && (
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t from-dark/90 via-dark/45 to-transparent"
        />
      )}
    </div>
  );
}

/**
 * Cover art in a fixed-ratio frame. Use this instead of hand-rolling an
 * `aspect-*` wrapper so every game image in the product crops identically.
 */
export function GameArt({
  game,
  ratio = "16/9",
  className,
  scrim,
  children,
}: {
  game: Pick<Game, "title" | "accentHue" | "coverImageUrl"> &
    Partial<Pick<Game, "genres">>;
  ratio?: "16/9" | "16/10" | "3/2" | "21/9";
  className?: string;
  scrim?: boolean;
  /** Overlay content — badges, titles. Positioned above the art. */
  children?: React.ReactNode;
}) {
  const ratioClass = {
    "16/9": "aspect-[16/9]",
    "16/10": "aspect-[16/10]",
    "3/2": "aspect-[3/2]",
    "21/9": "aspect-[21/9]",
  }[ratio];

  return (
    <div className={cn("relative overflow-hidden bg-dark", ratioClass, className)}>
      <GameCover game={game} scrim={scrim} />
      {children}
    </div>
  );
}
