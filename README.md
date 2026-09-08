# Project Grogu — Frontend

A game **playtesting platform** prototype that connects indie developers with
dedicated playtesters. College minor-project, **frontend-first phase**: no
backend yet, all data is realistic mock data behind an API-shaped seam.

## Quick start

```bash
pnpm install
pnpm dev            # http://localhost:3000
```

## Stack

Next.js 16 (App Router, Turbopack) · TypeScript (strict) · Tailwind CSS v4 ·
shadcn/ui-compatible primitives · lucide-react · React Hook Form + Zod (for
forms in later tasks) · pnpm.

## What exists today

- Full route skeleton for both roles (tester + developer) and the marketing/auth
  surfaces — see `docs/routes.md`.
- Design system with semantic tokens — see `docs/design-system.md`.
- Domain model (`lib/types.ts`) + consistent mock data (`data/`) behind async
  accessors (`data/index.ts`) — see `docs/mock-data.md`.
- A polished, responsive **landing page** at `/`.
- Everything else is a clearly-labelled placeholder, built incrementally in
  later tasks.

## Scripts

| Command | |
| --- | --- |
| `pnpm dev` | Dev server |
| `pnpm build` | Production build (+ type check) |
| `pnpm start` | Serve production build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `tsc --noEmit` |

## Documentation

| Doc | |
| --- | --- |
| [`docs/architecture.md`](docs/architecture.md) | Next.js architecture, structure, data flow, future API strategy |
| [`docs/design-system.md`](docs/design-system.md) | Colours, typography, spacing, component conventions |
| [`docs/routes.md`](docs/routes.md) | Every route, its purpose and user type |
| [`docs/components.md`](docs/components.md) | Reusable components and where they live |
| [`docs/mock-data.md`](docs/mock-data.md) | Mock entities, relationships, consumption |
| [`docs/development.md`](docs/development.md) | Install, run, lint, type-check, build, conventions |
