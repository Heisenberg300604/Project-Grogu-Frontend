# Architecture

Project Grogu frontend — a game playtesting platform prototype connecting indie
**developers** with **playtesters**.

**Phase: API-integrated.** The frontend talks to the Grogu API
(`grogu-backend`, .NET 5 + PostgreSQL). Authentication is a real bearer token,
and every read and mutation goes over HTTP. The seam the prototype was built
around — `lib/services/*` — is where that happens; pages, components and
selector hooks were not changed when the backend landed.

## Stack

| Concern         | Choice                                            |
| --------------- | ------------------------------------------------- |
| Framework       | Next.js 16 (App Router, Turbopack)                |
| Language        | TypeScript (strict)                               |
| Styling         | Tailwind CSS v4 (CSS-first `@theme`)              |
| UI primitives   | Radix UI + hand-rolled, shadcn/ui-compatible      |
| Icons           | lucide-react                                      |
| Forms           | React Hook Form + Zod (`@hookform/resolvers`)     |
| Client state    | Zustand — a cache of server state                 |
| Charts          | Recharts                                          |
| Package manager | npm                                               |

## Layers

```
components/**            UI. Reads via hooks, writes via services. Never touches the store directly.
        │
lib/hooks/**             Reactive selector hooks over the cache (reads).
lib/services/**          The API client (reads + writes + auth). THE SEAM.
lib/services/http.ts     fetch wrapper: base URL, bearer token, ServiceError mapping.
        │
lib/store/grogu-store    Zustand store — a cache of GET /api/v1/bootstrap. Only the session persists.
        │
data/index.ts            Server Component accessors; reads the public bootstrap slice.
lib/domain.ts            Pure join / filter / aggregate helpers (no React, no store).
lib/types.ts             Domain models — and the contract the API is built to satisfy.
```

Rule of thumb: **components call `lib/hooks/*` to read and `lib/services/*` to
write.** Nothing else fetches, and nothing outside the services mutates the store.

## How data arrives

`GET /api/v1/bootstrap` returns every collection in one document, scoped to the
bearer token. `components/providers/grogu-provider.tsx` fetches it on mount (and
when the tab regains focus) and drops it into the store. The selector hooks in
`lib/hooks/use-grogu.ts` then join across collections locally, exactly as they
did over seed data.

One snapshot, rather than an endpoint per view, is deliberate: the UI's ~30
selector hooks read several collections together (a playtest row needs its game,
its developer, its applications and its feedback), so per-view endpoints would
mean either N requests or reshaping every hook.

Mutations `POST`/`PATCH` a single resource, merge the returned entity into the
cache for immediate feedback, and then re-read the snapshot so server-derived
values (`applicantCount`, notifications, progress rows) stay correct.

`useHydrated()` is true once the stored session has rehydrated **and** the first
snapshot has settled, so the loading states already present in the views cover
the network fetch.

## Configuration

`NEXT_PUBLIC_API_BASE_URL` points at the API; see `.env.example`. It is public
by nature (the browser calls the API directly) — no secret belongs in this app.

## App Router structure

Routes live at the repo root in `app/` (no `src/`). Route **groups** attach a
shared layout without adding a URL segment:

```
app/
  layout.tsx                 Root: <html>, fonts, metadata
  not-found.tsx

  (marketing)/               Public — SiteHeader + SiteFooter (session-aware)
    page.tsx                 "/"  Landing
    how-it-works/  developers/
    discover/                "/discover"          (public browse)
    playtests/[id]/          "/playtests/[id]"    (public detail + apply)

  (auth)/                     Split layout — form + game-art panel
    login/  signup/

  (tester)/                   AppShell role="tester" — top nav, route-guarded
    dashboard/  applications/  profile/
    tests/  tests/[id]/  tests/[id]/feedback/

  (developer)/                AppShell role="developer" — top nav, route-guarded
    developer/dashboard/  developer/games/  developer/games/new/
    developer/playtests/  developer/playtests/new/  developer/playtests/[id]/
    developer/analytics/  developer/profile/
```

`AppShell` (client) guards the authenticated areas: it redirects to `/login`
when signed out and to the other role's home on a role mismatch, and it gates
rendering on store hydration.

## Server vs. Client Components

Server Components are the default. Client Components are used where there is real
interactivity: the app shell + navigation, every form, dialogs, tabs, charts,
and any view that reads the persisted store.

Pattern for interactive pages: a **thin Server Component `page.tsx`** (exports
`metadata`, awaits `params`) renders a **client feature component** from
`components/`.

Public read pages (`/discover`, `/playtests/[id]`) fetch seed data in the Server
Component and pass it to the client component as `initialData`. The client uses
that value until the store has hydrated, then switches to live store state — so
the page shows content immediately with no SSR/CSR mismatch.

## Data flow (read)

```
Server Component  ──►  data/index.ts (seed)  ──►  props
Client Component  ──►  lib/hooks/use-grogu   ──►  useGroguStore selector + useMemo derive
```

## Data flow (write)

```
Component event ──► lib/services/<entity>.<verb>()  (async, ~simulated latency)
                      └─► useGroguStore.getState().<action>()  (immutable update)
                            └─► persist middleware writes localStorage
                                  └─► subscribed hooks re-render
```

## Future API integration

Every service function is already `async` and returns a domain type. Swap the
body for `fetch` / an SDK call — the signatures and every call site stay the
same. Reads would move to TanStack Query (already a documented dependency in
`AGENTS.md`); the selector hooks in `lib/hooks/*` are the seam for that.

See `docs/data.md` and `docs/state-management.md` for specifics.

## Conventions

- Path alias `@/*` → repo root.
- No raw hex or magic strings in components — colours are design tokens
  (`docs/design-system.md`), labels come from `lib/constants.ts`.
- `cn()` merges class names; every primitive accepts `className`.
- Dates are ISO strings; format with `lib/utils.ts` helpers.
- No `any`. Strict TypeScript. ESLint (`eslint-config-next`) must pass clean.
