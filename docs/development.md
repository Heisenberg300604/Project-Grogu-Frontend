# Development

## Prerequisites

- **Node.js** ≥ 20 (developed on Node 24)
- **pnpm** ≥ 11 (`corepack enable` or `npm i -g pnpm`)

## Install

```bash
pnpm install
```

## Run locally

```bash
pnpm dev
```

Serves on http://localhost:3000 (Next.js picks the next free port if 3000 is
taken). Uses Turbopack with Fast Refresh.

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start the dev server |
| `pnpm build` | Production build (`next build`) — also runs full type checking |
| `pnpm start` | Serve the production build (run `pnpm build` first) |
| `pnpm lint` | ESLint (`eslint-config-next` — core-web-vitals + TypeScript rules) |
| `pnpm typecheck` | `tsc --noEmit` |

Run all three before committing:

```bash
pnpm lint && pnpm typecheck && pnpm build
```

## Project layout

See `docs/architecture.md`. Short version:

```
app/        Routes (App Router, route groups per surface)
components/ ui/ · layout/ · navigation/ · marketing/ · games/ · (reserved dirs)
data/       Mock data + the async accessor layer (data/index.ts)
lib/        types.ts (domain models) · constants.ts (labels/nav) · utils.ts (cn + formatters)
docs/       This documentation
public/     Static assets (images/ is a placeholder — cover art is procedural)
```

## Conventions

- **Server Components by default.** Add `"use client"` only for real
  interactivity (state, effects, browser APIs, `usePathname`). Keep client
  components small and at the leaves.
- **Types are centralized** in `lib/types.ts`. Never redeclare an entity shape in
  a page or component. No `any`.
- **No raw hex / magic numbers** in components — colours come from the design
  tokens (`docs/design-system.md`), domain labels from `lib/constants.ts`.
- **Data access only through `@/data`.** Components receive typed props; they do
  not import raw arrays or fetch.
- **Reuse `components/ui/` primitives** before writing new ones. Domain
  components compose primitives.
- **Accessibility**: semantic elements (`<button>`, `<nav>`, `<ol>`, `<dl>`…),
  `aria-current` on active nav links, meaningful `alt` / `aria-label` on
  imagery, visible focus rings (global `:focus-visible` rule).
- **Imports**: use the `@/` alias; group external → internal.
- **Formatting**: match surrounding code. Class lists ordered
  layout → box → color → state.

## Adding a route

1. Create `app/(group)/<segment>/page.tsx` (pick the group whose layout/shell
   fits: marketing, auth, tester, developer).
2. Export `metadata` (title + description).
3. For not-yet-built screens, render `<PlaceholderPage />`.
4. Update `docs/routes.md`.

## Adding a dependency

Keep the surface small. The following are intentionally **out of scope** for this
phase and must not be added: Prisma, Postgres clients, Firebase, Supabase,
Auth.js, Stripe, Socket.io, AI SDKs. Discuss before adding anything beyond the
current set (see `docs/architecture.md` → Stack).
