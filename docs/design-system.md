# Design System

Direction: **playful arcade** — bright, high-contrast, game-like. Flat colour,
thick ink outlines, hard offset shadows, pixel-font labels and a lot of small,
purposeful motion. It was designed in Figma Make and ported onto the existing
component set; the Figma export is kept as a visual reference in
`design rework/` (it is its own Vite project and is excluded from `tsc` and
ESLint).

All raw colour/spacing values live in **one file**:
[`app/globals.css`](../app/globals.css). Components only use the semantic
Tailwind utilities generated from those tokens (`bg-surface`,
`text-muted-foreground`, `border-line`, …) and the brand colours.

## Themes

Light is the default; dark is a class on `<html>`.

- `app/layout.tsx` runs a tiny inline script before first paint that adds
  `dark` when `localStorage["grogu-theme"] === "dark"`, so there is no flash.
- `components/ui/theme-toggle.tsx` flips the class and stores the choice. It is
  in the public header, the app header, the auth screen and the 404 page.
- Tailwind's `dark:` variant is wired to `.dark` (`@custom-variant dark`).

## Colours

Brand colours (identical in both themes, used for flat fills):

| Utility | Hex | Typical use |
| --- | --- | --- |
| `grape` | `#5b3ff0` | Brand tile, marketing panels, links/accents in light |
| `gold` | `#ffc933` | Primary action, active nav/tab, highlights |
| `coral` | `#ff5a7a` | Destructive / bugs / notification badge |
| `mint` | `#19c58d` | Success, recruiting, accepted |
| `azure` | `#34b6ff` | Info, secondary accents |
| `lilac` | `#b9a8ff` | Avatar fallback |
| `ink` | `#17142b` | Text on bright fills, art outlines |

Semantic tokens (value differs per theme):

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `background` / `foreground` | `#fff` / `#17142b` | `#0f0d1f` / `#f3f1ff` | Canvas + text |
| `surface` | `#fff` | `#181633` | Cards, panels, inputs |
| `elevated` | `#f3f0ff` | `#201d44` | Section bands, wells, hover |
| `line` | `#17142b` | `#5d55d6` | The signature 2px outline |
| `border` | ink @ 24% | `#5d55d6` @ 45% | Quiet dividers (dashed) |
| `primary` | gold | gold | Actions; text on it is `primary-foreground` (ink) |
| `secondary` | grape | gold | Accent text, eyebrows, links |
| `muted-foreground` / `subtle-foreground` | `#5f5b7e` / `#6b6790` | `#a9a5d0` / `#8d89b8` | Secondary / tertiary text |
| `success` `warning` `destructive` `info` | darkened for text on white | the brand colour | Status **text** and tints |

Status badges use flat brand fills with ink text (`bg-mint text-ink`); the
`success`/`warning`/`destructive`/`info` tokens are for text, borders and tints
so they stay readable on white.

## Typography

Loaded with `next/font/google` in `app/layout.tsx` and exposed as CSS variables:

| Family | Variable | Used for |
| --- | --- | --- |
| **Bricolage Grotesque** | `--font-display` | `h1`–`h4`, numbers, wordmark (`font-display`) |
| **Figtree** | `--font-sans` | Body copy and UI |
| **Silkscreen** | `--font-pixel` | HUD labels (`.hud`, `.text-label`) |

Utilities: `.text-display` (hero), `.text-display-sm` (section/page titles),
`.hud` / `.text-label` (uppercase pixel label), `.hl` (tilted gold
"highlighter" word).

## Shape, outline and shadow

- Cards `rounded-xl`, controls `rounded-lg`/`rounded-md`, chips `rounded-full`,
  big panels `rounded-2xl`.
- Every bordered surface is **`border-2 border-line`**. Dividers inside a
  surface are `border-t-2 border-dashed border-border`.
- Shadows are hard offsets with no blur: `shadow-sm` 2px, `shadow-md` 4px,
  `shadow-lg` 6px, in `--shadow-ink`. Buttons use 3px that grows to 5px on
  hover and collapses to 0 when pressed.
- Focus: inputs get a 4px grape offset shadow; everything else gets the global
  3px `:focus-visible` outline (grape, gold in dark). Do not remove it.

## Primitives (`components/ui/`)

`Button` (variants `primary` gold, `secondary` white, `outline`, `grape`, `ink`,
`destructive`, `success`, `ghost`, `link`), `Badge` (flat fills; `dot` on a
success badge becomes a white chip with a pulsing green dot), `Card`, `Input` /
`Textarea` / `Select`, `Tabs` (active = gold), `Dialog`, `Sheet`,
`DropdownMenu`, `Checkbox`, `Radio`, `Progress`, `Avatar` (initials get a
stable flat colour), `Skeleton`, `states` (empty/error/success), `Pagination`,
`Toast`, `Tooltip`, and the additions below.

New: `Eyebrow`, `Segments` (segmented XP bar), `Marquee`, `Reveal`,
`AnimatedNumber`, `ThemeToggle`; `components/art/pixel-art.tsx` has `Sprite`,
`SpriteTile` and `HeroScene`.

## Motion

Defined once in `globals.css`. Keyframes are prefixed `g-`.

| Class | Effect | Where |
| --- | --- | --- |
| `.card-lift` | Hover: lift up-left, longer shadow, slight tilt | Cards, tiles |
| `.page-in` | Route content rises in | App shell, auth, 404 |
| `.a-pop` | Springy scale-in | Stat tiles, menus, toasts, errors |
| `.a-float` / `.a-float-2` / `.a-hop` / `.a-coin` / `.a-wave` / `.a-pulse` / `.a-drift` / `.a-spin-slow` | Ambient loops | Hero scene, covers, empty states |
| `.a-marquee` | Ticker | Landing page band |
| `.a-blink` | Cursor blink | Eyebrows, footer |
| `.a-live` | Pulsing green ring | Live status dot |
| `.a-shake` | Wiggle | Form errors |
| `.wiggle-hover` + `.wiggle-target` | Icon wiggles when its card is hovered | Feature cards |
| `.reveal` / `<Reveal>` | Fade-and-rise on scroll | Marketing sections |
| `.btn .arrow` | Arrow nudges forward on hover | Buttons |

JS-driven: `<Reveal>` (IntersectionObserver), `AnimatedNumber` and the
marketing `CountUp` (number counters), `Segments` (staggered fill), the brief
card (auto-rotating tabs), and the landing-page `BugSquash` mini-game.

**Rules.** `<Reveal>` only hides blocks that are below the fold after mount, so
server-rendered content is never invisible. `prefers-reduced-motion: reduce`
collapses all animation/transition durations, disables the card tilt, and
`AnimatedNumber` skips counting. Motion must never carry information that is
not also shown statically.

## Game artwork

`components/games/game-cover.tsx` generates cover art when a game has no
uploaded poster. The motif still comes from the first genre
(`ridge`, `shards`, `grid`, `contour`, `orbit`, `fog`) and the colour from
`accentHue`, seeded by the title so it is deterministic. The art is now flat
and outlined, with one or two animated shapes. **Always use `GameArt`** so
every game image crops the same way.

## Charts

`components/charts/chart-theme.ts`: brand colours for fills (same in both
themes); lines and text use CSS variables (`var(--border)`,
`var(--muted-foreground)`) so they follow the theme.

## Cards vs. sections

Use a card for a repeated unit (playtest, game, tester, feedback report), a
side rail or a genuinely bounded panel. Use headings, dashed dividers and
whitespace for page structure. `StatCard` is a card on purpose in this design:
a coloured icon chip, a HUD label and a counting number; chip colours cycle
gold / azure / mint / coral by position in `StatCardGrid`.
