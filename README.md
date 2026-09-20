# Project Grogu — Frontend

A game **playtesting platform** connecting indie developers with dedicated
playtesters. College minor-project. This app is the client; it talks to
[`grogu-backend`](../Grogu_backend) (.NET 5 + PostgreSQL) over `/api/v1`.

## Quick start

```bash
npm install
npm run dev         # http://localhost:3000
```

### Pointing at an API

`NEXT_PUBLIC_API_BASE_URL` is the only environment variable this app needs, and
it is public by nature — the browser calls the API directly, so no secret
belongs here. Sensible defaults are committed, so there is nothing to set up:

| Command | File used | API |
| --- | --- | --- |
| `npm run dev` | `.env.development` | `http://localhost:8080` |
| `npm run build` / `npm run start` | `.env.production` | `https://grogu-backend.onrender.com` |

So **`npm run dev` expects a backend running locally on port 8080**:

```bash
# in the Grogu_backend repo
docker build -t grogu-backend .
docker run --rm -p 8080:80 \
  -e ConnectionStrings__NeonDBConnection="..." \
  -e Jwt__Key="$(openssl rand -base64 48)" \
  grogu-backend
```

`dotnet run --project Grogu_backend` serves `http://localhost:5000` instead —
change the port in `.env.development`, or override it just for yourself by
copying `.env.example` to `.env.local` (it wins over both files and is not
committed). That is also how you point `npm run dev` at the deployed API.

Changing an env file needs a dev-server restart; Next reads them at startup.

On Vercel, set `NEXT_PUBLIC_API_BASE_URL` in the project's environment
variables; that overrides `.env.production`.

Then: **Log in** → "Continue as Priya Nair · Tester" (or Mara Okafor · Developer).
Both demo accounts use the password `playtest` and are seeded by the backend's
migration `004_demo_accounts.sql`.

## Stack

Next.js 16 (App Router, Turbopack) · TypeScript (strict) · Tailwind CSS v4 ·
Radix UI + shadcn-compatible primitives · lucide-react · React Hook Form + Zod ·
Zustand (API cache) · Recharts · npm.

## What's built

The full MVP for both roles:

- **Marketing**: landing, how-it-works, developers, public **Discover** (working
  filters) and **playtest detail**.
- **Auth**: login with demo accounts or any registered email, role-select signup.
  Bearer token, bcrypt-hashed passwords, server-enforced authorization.
- **Tester**: dashboard, applications (with withdraw), my tests, test workspace
  (build → tasks → feedback), structured feedback form, profile.
- **Developer**: dashboard, games + create-game, playtests + 4-step create-playtest
  wizard, manage playtest (overview / applicants / testers / feedback / analytics),
  cross-playtest analytics, studio profile.
- The complete workflow runs end to end against the API — apply → accept →
  test → feedback → analytics — so the two sides can be driven from different
  browsers.

## Scripts

| Command | |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build (+ type check) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |

## Documentation

| Doc | |
| --- | --- |
| [`docs/architecture.md`](docs/architecture.md) | Layers, App Router structure, data flow, future API |
| [`docs/state-management.md`](docs/state-management.md) | The Zustand store, mock auth, service layer, full workflow |
| [`docs/design-system.md`](docs/design-system.md) | Colours, typography, spacing, component conventions |
| [`docs/routes.md`](docs/routes.md) | Every route, its purpose and user type |
| [`docs/components.md`](docs/components.md) | Reusable components and where they live |
| [`docs/data.md`](docs/data.md) | API payload, entities, relationships, demo accounts |
| [`docs/development.md`](docs/development.md) | Install, run, conventions, walkthrough |
| [`docs/status.md`](docs/status.md) | What's built, known limitations, what's left |

## Not real

There is no backend, database, or authentication provider. This is a frontend
prototype driven by mock data and simulated client state.
