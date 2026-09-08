# Architecture

Project Grogu frontend — a game playtesting platform prototype. **Frontend-first
phase**: no backend, all data is mocked. The architecture is built so the mock
layer can be swapped for a real API without touching pages or components.

## Stack

| Concern        | Choice                                   |
| -------------- | ---------------------------------------- |
| Framework      | Next.js 16 (App Router, Turbopack)       |
| Language       | TypeScript (strict)                      |
| Styling        | Tailwind CSS v4 (CSS-first `@theme`)     |
| UI primitives  | Hand-rolled, shadcn/ui-compatible        |
| Icons          | lucide-react                             |
| Forms (later)  | React Hook Form + Zod (`@hookform/resolvers`) |
| Package manager | pnpm                                    |

## App Router structure

Routes live at the repo root in `app/` (no `src/` directory). Route **groups**
separate the four surfaces of the product without adding URL segments:

```
app/
  layout.tsx              Root layout: <html>, fonts, global metadata
  not-found.tsx           Global 404
  globals.css             Design tokens + base layer (see design-system.md)

  (marketing)/            Public site — SiteHeader + SiteFooter
    layout.tsx
    page.tsx              "/"  Landing page
    how-it-works/page.tsx
    developers/page.tsx

  (auth)/                 Centered card layout, no chrome
    login/page.tsx
    signup/page.tsx

  (tester)/               Authenticated tester area — AppShell (roleLabel="Tester")
    discover/page.tsx
    playtests/[id]/page.tsx
    applications/page.tsx
    tests/[id]/page.tsx
    profile/page.tsx

  (developer)/            Authenticated developer area — AppShell (roleLabel="Developer")
    developer/dashboard/page.tsx
    developer/games/page.tsx
    developer/games/new/page.tsx
    developer/playtests/new/page.tsx
    developer/playtests/[id]/page.tsx
```

Each group owns a `layout.tsx` that provides its shell. The developer routes keep
a literal `/developer/...` prefix (the group is only for the shared layout).

## Component organization

```
components/
  ui/            Design-system primitives (Button, Card, Badge, Input,
                 Container, SectionHeading, Logo). No domain knowledge.
  layout/        Page-level structure: SiteFooter, AppShell, PlaceholderPage
  navigation/    SiteHeader (marketing nav + mobile menu)
  marketing/     Landing-page sections: Hero, HowItWorks, FeaturedGames, DeveloperCta
  games/         Domain components for games: GameCard, GameCover
  playtests/ feedback/ dashboard/ charts/   Reserved for later tasks
```

Rules:

- `components/ui/*` never imports from `data/` or `components/*` outside `ui`.
- Domain components (`games/`, later `playtests/`, …) compose `ui/` primitives
  and accept typed props — they do not fetch data themselves.
- Pages fetch data and pass it down.

## Server vs. Client Components

Server Components are the default. `"use client"` is used in exactly two places
so far, both for genuine interactivity:

- `components/navigation/site-header.tsx` — mobile menu disclosure + active link
- `components/layout/app-shell.tsx` — active nav link via `usePathname()`

Everything else — including the landing page and every section component —
renders on the server.

## Data flow

```
data/*.ts  (raw mock arrays, typed by lib/types.ts)
   │
   ▼
data/index.ts  (async accessor functions — the API seam)
   │
   ▼
app/**/page.tsx  (Server Component: await the accessors)
   │
   ▼
components/**  (presentational, receive typed props)
```

- **Types** (`lib/types.ts`) are the single source of truth for entity shapes.
- **Mock data** (`data/games.ts`, `data/users.ts`, …) implements those types.
- **Accessors** (`data/index.ts`) are `async` and return domain types /
  view-models. Pages only ever import from `@/data`, never the raw arrays.

## Future API integration strategy

Because every read already goes through an `async` function in `data/index.ts`
with a domain-typed signature, migrating to a real backend is a body swap:

```ts
// today
export async function getPlaytestById(id: string) {
  const match = playtests.find((p) => p.id === id);
  return match ? joinPlaytest(match) : undefined;
}

// later
export async function getPlaytestById(id: string) {
  const res = await fetch(`${API_URL}/playtests/${id}`, { next: { revalidate: 60 } });
  if (!res.ok) return undefined;
  return (await res.json()) as PlaytestWithRelations;
}
```

Call sites, components, and types are unaffected. Mutations (apply to a playtest,
accept an applicant, submit feedback) will be added as Server Actions or route
handlers in `app/` when the backend exists.

## Conventions

- Path alias `@/*` → repo root (e.g. `@/lib/types`, `@/components/ui/button`).
- No magic strings for domain unions — use the label maps in `lib/constants.ts`.
- `cn()` (`lib/utils.ts`) merges class names; every primitive accepts `className`.
- Dates are ISO strings in data; format with helpers in `lib/utils.ts`.
