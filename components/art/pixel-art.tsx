import { cn } from "@/lib/utils";

/**
 * Pixel-art illustrations shared by the marketing pages, auth screen and empty
 * states. Everything is inline SVG so it needs no assets and follows the theme:
 * the sky, castle and grass read their colours from the `--scene-*` tokens in
 * globals.css, so the same scene turns into a night scene in dark mode.
 */

const HERO_ROWS = [
  "...hhhh...",
  "..hhhhhh..",
  "..ssssss..",
  "..sessse..",
  "..ssssss..",
  "...bbbb...",
  ".bbbbbbbb.",
  ".sbbbbbbs.",
  "..bbbbbb..",
  "..bb..bb..",
  "..pp..pp..",
  ".ppp..ppp.",
];

const HERO_PALETTE: Record<string, string> = {
  h: "#5b3ff0",
  s: "#ffd9b0",
  e: "#17142b",
  b: "#ff5a7a",
  p: "#17142b",
};

/** A tiny pixel hero. `size` is the pixel scale. */
export function Sprite({
  rows = HERO_ROWS,
  palette = HERO_PALETTE,
  size = 8,
  className,
}: {
  rows?: string[];
  palette?: Record<string, string>;
  size?: number;
  className?: string;
}) {
  const width = rows[0].length;
  return (
    <svg
      viewBox={`0 0 ${width} ${rows.length}`}
      width={width * size}
      height={rows.length * size}
      shapeRendering="crispEdges"
      className={className}
      aria-hidden
    >
      {rows.flatMap((row, y) =>
        [...row].map((cell, x) =>
          cell === "." ? null : (
            <rect key={`${x}-${y}`} x={x} y={y} width="1.02" height="1.02" fill={palette[cell]} />
          ),
        ),
      )}
    </svg>
  );
}

function Cloud({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} className="f-cloud">
      <rect x="0" y="16" width="90" height="22" rx="11" />
      <rect x="16" y="0" width="44" height="30" rx="15" />
      <rect x="44" y="8" width="34" height="26" rx="13" />
    </g>
  );
}

const STARS = [
  [40, 40],
  [110, 90],
  [200, 30],
  [280, 80],
  [340, 40],
  [60, 150],
  [250, 140],
  [520, 60],
  [490, 150],
];

/** The hero scene: a pixel hero running toward a castle. */
export function HeroScene({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 560 460"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label="Pixel castle scene with a hero running toward a castle"
    >
      <rect width="560" height="460" className="f-sky" />
      <g className="stars" fill="#fff">
        {STARS.map(([x, y], i) => (
          <rect key={i} x={x} y={y} width="4" height="4" />
        ))}
      </g>
      <circle cx="450" cy="100" r="46" className="f-sun svg-anim a-pulse" />
      <g className="a-drift">
        <Cloud x={0} y={70} />
      </g>
      <g className="a-drift-2">
        <Cloud x={0} y={150} scale={0.7} />
      </g>
      <polygon points="0,330 90,230 170,310 250,210 350,320 430,240 560,330 560,370 0,370" className="f-far" />
      <g>
        <rect x="372" y="236" width="140" height="130" className="f-castle" />
        <rect x="356" y="190" width="38" height="176" className="f-castle-d" />
        <rect x="490" y="190" width="38" height="176" className="f-castle-d" />
        {[356, 370, 384, 490, 504, 518].map((x) => (
          <rect key={x} x={x} y="176" width="10" height="14" className="f-castle-d" />
        ))}
        {[380, 400, 420, 440, 460, 480].map((x) => (
          <rect key={x} x={x} y="222" width="12" height="14" className="f-castle" />
        ))}
        <path d="M424 366v-36a18 18 0 0 1 36 0v36z" fill="#17142b" />
        <rect x="372" y="268" width="14" height="22" fill="#17142b" />
        <rect x="498" y="214" width="14" height="22" fill="#17142b" />
        <rect x="441" y="130" width="4" height="60" fill="#17142b" />
        <rect x="445" y="134" width="30" height="20" fill="#ff5a7a" className="svg-anim a-wave" />
      </g>
      <path d="M0 350 Q120 300 240 345 T480 340 L560 350 V380 H0z" className="f-mid" />
      <rect y="360" width="560" height="100" className="f-dirt" />
      <rect y="360" width="560" height="16" className="f-grass" />
      {Array.from({ length: 14 }).map((_, i) => (
        <rect key={i} x={i * 42 + 8} y="400" width="14" height="14" fill="#17142b" opacity=".13" />
      ))}
      <g className="svg-anim a-float">
        <rect x="120" y="190" width="44" height="44" rx="6" fill="#ffc933" stroke="#17142b" strokeWidth="3" />
        <text x="142" y="222" textAnchor="middle" style={{ fontFamily: "var(--font-pixel)" }} fontSize="26" fill="#17142b">
          ?
        </text>
      </g>
      <g className="svg-anim a-float-2">
        <rect x="170" y="190" width="44" height="44" rx="6" fill="#34b6ff" stroke="#17142b" strokeWidth="3" />
        <text x="192" y="222" textAnchor="middle" style={{ fontFamily: "var(--font-pixel)" }} fontSize="26" fill="#17142b">
          !
        </text>
      </g>
      {[
        [250, 130],
        [290, 108],
        [330, 130],
      ].map(([x, y], i) => (
        <g key={i} style={{ animationDelay: `${i * 0.2}s` }} className="svg-anim a-coin">
          <circle cx={x} cy={y} r="14" fill="#ffc933" stroke="#17142b" strokeWidth="3" />
          <rect x={x - 2} y={y - 7} width="4" height="14" fill="#17142b" />
        </g>
      ))}
      <g transform="translate(210 276)">
        <g className="a-hop svg-anim">
          <g transform="scale(7)" shapeRendering="crispEdges">
            {HERO_ROWS.flatMap((row, y) =>
              [...row].map((cell, x) =>
                cell === "." ? null : (
                  <rect key={`${x}-${y}`} x={x} y={y} width="1.02" height="1.02" fill={HERO_PALETTE[cell]} />
                ),
              ),
            )}
          </g>
        </g>
      </g>
      <ellipse cx="245" cy="364" rx="30" ry="5" fill="#17142b" opacity=".25" />
    </svg>
  );
}

/** Pixel sprite in a rounded tile, used where a page has nothing else to show. */
export function SpriteTile({
  size = 5,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "a-float grid place-items-center rounded-2xl border-2 border-line bg-elevated shadow-sm",
        className,
      )}
    >
      <Sprite size={size} />
    </div>
  );
}
