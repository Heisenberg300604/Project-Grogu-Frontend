# Components

Location map and responsibilities. Import via the `@/components/...` alias.

## `components/ui/` — design-system primitives

No domain knowledge, no data access. Every component accepts `className` and
forwards it through `cn()`.

| Component | Responsibility |
| --- | --- |
| `button.tsx` — `Button`, `buttonVariants` | Button styles as CVA variants. `buttonVariants()` is exported so links can adopt button styling without a Slot dependency. |
| `card.tsx` — `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` | Surface container and its sub-parts. |
| `badge.tsx` — `Badge` | Small status pill. `tone` values line up with the metadata maps in `lib/constants.ts`. |
| `input.tsx` — `Input` | Text input primitive. |
| `container.tsx` — `Container` | Max-width page gutter (`.container-page`). |
| `section-heading.tsx` — `SectionHeading` | Eyebrow + title + lead block for sections. |
| `logo.tsx` — `Logo` | Grogu wordmark + mark, links home by default. |

## `components/layout/` — page structure

| Component | Responsibility |
| --- | --- |
| `site-footer.tsx` — `SiteFooter` | Marketing footer: link columns + legal row. Server component. |
| `app-shell.tsx` — `AppShell` | Shell for the authenticated tester/developer areas: header with logo, role badge, nav, "Exit" link. **Client** (active nav via `usePathname`). Props: `roleLabel`, `nav: NavItem[]`, `children`. |
| `placeholder-page.tsx` — `PlaceholderPage` | Stub content for not-yet-built routes. Props: `title`, `description`, `plannedFor?`, `backHref?`, `backLabel?`. |

## `components/navigation/`

| Component | Responsibility |
| --- | --- |
| `site-header.tsx` — `SiteHeader` | Marketing top nav: logo, `MARKETING_NAV` links, log in / get started, responsive mobile menu. **Client** (menu disclosure + active link). |

## `components/marketing/` — landing-page sections

All server components. Composed by `app/(marketing)/page.tsx`.

| Component | Responsibility | Data |
| --- | --- | --- |
| `hero.tsx` — `Hero` | Headline, subcopy, primary CTAs, platform stat strip. | `stats` prop from `getPlatformStats()` |
| `how-it-works.tsx` — `HowItWorks` | Four-step explanation of the playtest loop. | Static content in-file |
| `featured-games.tsx` — `FeaturedGames` | "Studios looking for testers" grid. | `games` prop from `getFeaturedGames()` |
| `developer-cta.tsx` — `DeveloperCta` | Conversion band for developers. | Static content in-file |

## `components/games/` — game domain components

| Component | Responsibility |
| --- | --- |
| `game-card.tsx` — `GameCard` | Game summary card: cover, status badge, title, tagline, genre/platform badges. Props: `game: Game`. |
| `game-cover.tsx` — `GameCover` | Procedural cover art from `game.accentHue` + title initials (deterministic SVG, no image asset needed). Renders `game.coverImageUrl` instead when present. Includes accessible `role="img"` + label. |

## Reserved (empty until later tasks)

`components/playtests/`, `components/feedback/`, `components/dashboard/`,
`components/charts/` — created to establish the structure; populated when those
screens are built.

## Adding components

1. Primitive with no domain meaning → `components/ui/`.
2. Reused across one domain → `components/<domain>/` (`games`, `playtests`, …).
3. Used by exactly one page and unlikely to be reused → keep it in the route
   folder as a co-located file, promote later if it spreads.
4. Check `components/ui/` for an existing primitive before writing a new one.
