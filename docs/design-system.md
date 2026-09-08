# Design System

Direction: **premium · modern · dark · gaming-oriented · sophisticated.**
It should read as a serious gaming product, not a generic dashboard. No neon, no
glow, minimal gradients, no glassmorphism, no decorative animation.

All raw colour/spacing values live in **one file**: [`app/globals.css`](../app/globals.css).
Components only ever use the semantic Tailwind utilities generated from those
tokens (`bg-surface`, `text-muted-foreground`, `border-border`, …).

## Colours

Built around the reference palette:

| Reference  | Hex       | Role in the system            |
| ---------- | --------- | ----------------------------- |
| Primary    | `#6C37C3` | `--primary` (actions, brand)  |
| Secondary  | `#B0B3D7` | `--secondary` (accents, eyebrows, links) |
| Background | `#0F0D19` | `--background` (app canvas)   |
| Dark       | `#080D0A` | `--dark` (footer, deepest surfaces) |

### Semantic tokens

| Token | Value | Use |
| --- | --- | --- |
| `background` / `foreground` | `#0F0D19` / `#ECEBF4` | Page canvas + default text |
| `surface` / `surface-foreground` | `#16131F` / `#ECEBF4` | Cards, panels |
| `elevated` / `elevated-foreground` | `#1E1A2C` / `#F5F3FB` | Raised surfaces, popovers, secondary buttons |
| `dark` | `#080D0A` | Footer, deep wells |
| `border` / `border-strong` | `#2A2540` / `#3A3357` | Hairlines / emphasized dividers |
| `input` | `#221D33` | Form field background |
| `ring` | `#7D49D6` | Focus outline |
| `primary` / `primary-foreground` / `primary-hover` | `#6C37C3` / `#F6F2FE` / `#7B45D3` | Primary actions |
| `secondary` / `secondary-foreground` | `#B0B3D7` / `#14111F` | Accents, quiet emphasis |
| `muted` / `muted-foreground` | `#1B1728` / `#9A95AE` | Subtle fills / secondary text |
| `accent` / `accent-foreground` | `#262038` / `#F5F3FB` | Hover states |
| `success` | `#3FB984` | Recruiting, accepted, positive |
| `warning` | `#E0A73B` | In review, pending |
| `destructive` | `#E5555A` | Rejected, destructive actions |
| `info` | `#5B8DFF` | In progress, informational |

Status colours are used at ~15% opacity for badge fills (`bg-success/15`
`text-success`) so the UI stays calm.

The theme is **dark-only** for the prototype (`color-scheme: dark` on `:root`).
Tokens are structured so a light theme could be added later by overriding
`:root` values under a `[data-theme="light"]` selector.

## Typography

Two families, loaded via `next/font/google` (self-hosted, no layout shift):

| Family | Variable | Applied to |
| --- | --- | --- |
| **Space Grotesk** (500/600/700) | `--font-space-grotesk` → `--font-display` | `h1`–`h4`, logo wordmark, stat figures (`.font-display`) |
| **Inter** | `--font-inter` → `--font-sans` | All body text, UI, controls |

Rationale: Space Grotesk is geometric with a slightly technical character that
suits a gaming product, used **only** for headings and numeric display so it
never hurts readability. Inter carries everything else — it is the most legible
UI typeface available and keeps long-form content (playtest goals, feedback)
comfortable. A monospace stack (`--font-mono`) is defined for future
code/build-version display but no monospace webfont is loaded.

Headings use `letter-spacing: -0.02em` and `text-wrap: balance`. Base body size
is 14px (harness default) / 16px in prose contexts.

## Spacing & layout

- Page gutter: the `.container-page` utility (`max-width: 80rem`, responsive
  inline padding `1.25rem` → `2rem`). Exposed as `<Container />`.
- Section vertical rhythm: `py-20` (`py-16` for compact headers).
- Grid gaps: `gap-4`/`gap-5` for card grids, `gap-3` for inline groups.

## Border radius

`--radius: 0.75rem` base, with the shadcn-style scale:
`--radius-sm` (calc −4px) · `--radius-md` (−2px) · `--radius-lg` (base) ·
`--radius-xl` (+6px) · `--radius-2xl` (+12px). Cards use `rounded-xl`, controls
`rounded-md`, badges `rounded-full`.

## Elevation

Restrained, shadow-only (no glow):

- `--shadow-sm`: `0 1px 2px 0 rgb(0 0 0 / .35)` — cards, resting buttons
- `--shadow-md`: `0 8px 24px -8px rgb(0 0 0 / .5)` — menus, dropdowns, popovers
- `--shadow-lg`: `0 24px 60px -20px rgb(0 0 0 / .6)` — dialogs, sheets

Primary separation comes from `border` + `surface` contrast, not shadow.

## Component conventions

| Component | File | Notes |
| --- | --- | --- |
| `Button` / `buttonVariants` | `components/ui/button.tsx` | Variants: `primary`, `secondary`, `outline`, `ghost`, `destructive`, `success`, `link`. Sizes: `sm`, `md`, `lg`, `icon`, `icon-sm`. `asChild` (Radix Slot) styles a `<Link>` as a button; `loading` shows a spinner and disables. |
| `Card` (+ Header/Title/Description/Content/Footer) | `components/ui/card.tsx` | `surface` background, `border`, `rounded-xl`, `shadow-sm`. |
| `Badge` | `components/ui/badge.tsx` | Tones: `default`, `muted`, `primary`, `success`, `warning`, `destructive`, `info`, `outline`. Tone names match the metadata maps in `lib/constants.ts`. |
| `StatusBadge` | `components/ui/status-badge.tsx` | One badge for every domain status (`kind`: `playtest` / `application` / `test` / `game`) — keeps label + tone consistent. |
| `Input` / `Textarea` | `components/ui/*` | `input` background, focus moves the border to `ring`. |
| `Field` | `components/ui/field.tsx` | Label + hint + control + error, wired for a11y (`htmlFor` / `aria-describedby`). Use it for every form control. |
| Radix wrappers | `checkbox`, `radio-group`, `select`, `dialog`, `sheet`, `dropdown-menu`, `tabs`, `avatar`, `progress`, `separator` | Themed to the tokens; animations from `tw-animate-css`. |
| `states.tsx` | `EmptyState`, `ErrorState`, `LoadingState`, `PageSkeleton` | Every list/async view uses these for the non-happy paths. |
| `Container` | `components/ui/container.tsx` | Wraps `.container-page`. |
| `SectionHeading` | `components/ui/section-heading.tsx` | Eyebrow + title + lead, left or centered. |
| `Logo` | `components/ui/logo.tsx` | Wordmark + radar-sweep mark. |

### Focus states

Global rule in `globals.css`: every `:focus-visible` gets
`outline: 2px solid var(--color-ring)` with `2px` offset. Interactive elements
are real `<button>` / `<a>` so they are keyboard-reachable by default.

### Primitives & shadcn/ui

`components.json` is configured (new-york, Tailwind v4, `@/components/ui`, lucide).
The primitives in `components/ui/` are hand-written but shadcn-compatible and
built on Radix where accessibility demands it (dialog, dropdown-menu, tabs,
select, checkbox, radio-group, label, avatar, progress, separator). New
primitives can be added with `pnpm dlx shadcn@latest add <component>` — retheme
the generated CSS variables to the tokens above.

### States

Loading, empty, and error states are first-class: `components/ui/states.tsx`
provides `LoadingState`, `EmptyState`, `ErrorState`, and skeletons. Persisted-
store views render `PageSkeleton` until `useHydrated()` is true.
