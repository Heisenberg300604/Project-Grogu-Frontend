# Project Grogu

Read `AGENTS.md` before making changes.

`AGENTS.md` is the canonical source of project architecture, frontend rules, design principles, scope, and development conventions.

## Important

Grogu is a college project. This repo is the frontend; it is integrated with
`grogu-backend` (.NET 5 + PostgreSQL on Neon) over `/api/v1`.

Current stack:

* Next.js App Router
* TypeScript
* Tailwind CSS
* shadcn/ui
* Lucide React
* React Hook Form
* Zod
* Zustand (cache of the API snapshot)

All data comes from the API — there is no mock data left in the app. `lib/types.ts`
is the contract the backend is built to satisfy. If a screen needs something the
API does not return, extend the backend rather than faking it here.

Do not introduce payments, AI services, or real-time systems unless explicitly requested.

Before changing code:

1. Inspect the existing implementation.
2. Reuse existing components.
3. Follow the established design system.
4. Avoid unnecessary dependencies.
5. Keep components maintainable and responsive.

After changes:

1. Run lint.
2. Run type checking.
3. Run the production build or relevant checks.
4. Fix issues introduced by the change.

Read relevant files inside `docs/` before making architectural changes.
