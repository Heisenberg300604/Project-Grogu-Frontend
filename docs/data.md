# Data

All data comes from the Grogu API (`grogu-backend`). Shapes are declared in
`lib/types.ts`, which is the contract the API is built to satisfy — the server
returns these exact shapes, so nothing is remapped on arrival.

## Where it comes from

`GET /api/v1/bootstrap` returns every collection in one document, scoped to the
caller's bearer token:

| Key | Contents | Scope |
| --- | --- | --- |
| `session` | The signed-in user, or `null` | self |
| `users` | Every non-admin user; **other people's `email` is `""`** | public |
| `testerProfiles`, `developerProfiles` | Public profile data | public |
| `games` | All games | public |
| `playtests` | All non-draft playtests, plus the caller's own drafts | mixed |
| `applications` | The caller's own, plus those on playtests they own | private |
| `feedback` | The caller's own, plus that on playtests they own | private |
| `testProgress` | The caller's own, plus that on playtests they own | private |
| `notifications` | The caller's own only | private |
| `stats` | Platform totals for the marketing pages | public |

An anonymous request returns the public rows only, with all four private
collections empty. That is what the marketing and discover pages render.

## How it's consumed

**Server Components** (`app/(marketing)/*`) call the `async` accessors in
`data/index.ts`, which read the anonymous bootstrap.

**Client Components** call selector hooks in `lib/hooks/use-grogu.ts`, which read
the cache filled by `components/providers/grogu-provider.tsx`. Writes go through
`lib/services/*`. See `docs/state-management.md`.

## Demo accounts

Seeded by the backend's `db/migrations/004_demo_accounts.sql`. The login screen
offers both as one-click buttons (`DEMO_ACCOUNTS` in `lib/services/auth.ts`).

| Role | Name | Email | Password |
| --- | --- | --- | --- |
| Tester | Priya Nair | `priya.nair@example.com` | `playtest` |
| Developer | Mara Okafor (Driftwood Games) | `mara@driftwoodgames.dev` | `playtest` |

These are shared demo logins with no elevated role. Changing the email or
password means changing `DEMO_ACCOUNTS` and migration 004 together.

## Entities & relationships

```
User(developer) 1─* Game            Game.developerId
User(developer) 1─* Playtest        Playtest.developerId
Game            1─* Playtest        Playtest.gameId
Playtest        1─* Application     Application.playtestId
User(tester)    1─* Application     Application.testerId
Playtest        1─* Feedback        Feedback.playtestId
User(tester)    1─* Feedback        Feedback.testerId
Playtest        1─* TestProgress    (per accepted tester)
Playtest        1─1 PlaytestTask[]  (embedded in the playtest document)
User            1─1 Tester/DeveloperProfile
User            1─* Notification
```

Composed view models (`lib/types.ts`): `PlaytestWithRelations`, `TesterTest`,
`PlaytestAnalytics`, `Session`.

## Invariants the server guarantees

- `applicantCount` and `acceptedTesters` are computed per request from the
  applications table, never stored. The client cannot disagree with them.
- Every returned playtest has a `gameId` that resolves within the same payload
  and a `developerId` present in `users` — `joinPlaytest` silently drops a
  playtest whose game or developer is missing, so the API must not emit one.
- A playtest's `requirements` always carries all seven `TesterRequirements`
  fields. Components read `requirements.platforms` and
  `requirements.estimatedHours` without guards, so a partial object crashes the
  Discover page; `grogu_requirements_json` merges every write over a complete
  default derived from the game.
- Ids are numeric strings (the database's integer primary keys).
- Dates are UTC ISO-8601 strings, fixed width, so string comparison sorts them.
