# State Management

The server owns the data. A single Zustand store caches it; a thin service layer
is the only thing that talks to the API.

## The store — `lib/store/grogu-store.ts`

One Zustand store holding a snapshot of `GET /api/v1/bootstrap`, plus the
session and a load status:

| Slice | Source |
| --- | --- |
| `session` | The login response, re-confirmed by every snapshot |
| `status` | `idle` → `loading` → `ready` \| `error` |
| `users`, `testerProfiles`, `developerProfiles` | bootstrap |
| `games`, `playtests`, `applications`, `feedback` | bootstrap |
| `testProgress`, `notifications` | bootstrap |

### What persists

**Only `session`** (key `grogu-store-v2`). The collections are per-user and go
stale, and writing them to `localStorage` would leave one account's data
readable after someone else signs in on the same browser. The bearer token is
kept separately by `lib/services/http.ts`.

Earlier versions persisted everything; the `migrate` step drops those entries
rather than converting them, because they hold mock ids that no longer resolve.

### Actions

`applySnapshot`, `refresh`, `setSession`, `applyEntity`.

That is the whole surface. The store no longer contains business logic — the
cross-entity effects that used to live here (accepting an applicant creates a
progress row and notifies the tester; submitting feedback completes the test)
are the server's job now, and arrive with the next snapshot.

### Hydration

`useHydrated()` is true once the stored session has rehydrated **and** the first
bootstrap has settled (`ready` or `error`). Widening it that way means every
view already gated on it shows its existing skeleton while the API responds,
instead of flashing an empty state. `useLoadError()` exposes the failure message.

Public pages pass server-rendered data as a prop and use it until
`useHydrated()` is true, as before.

## Writing — `lib/services/*`

Each mutation calls one endpoint, merges the returned entity into the cache with
`applyEntity` so the UI updates immediately, then triggers `refresh()` because
most writes change more than the entity returned (counters, notifications,
progress rows).

Failures throw `ServiceError` with a `code` the UI branches on:
`not-found`, `invalid-credentials`, `conflict`, `forbidden`, `validation`,
`network`, `server-error`. A 401 from any call clears the token and drops the
session rather than leaving a broken signed-in shell.

### Refresh

`refresh()` (User menu → "Refresh data") re-reads the snapshot. It replaced
"Reset demo data", which reseeded the local mock store — the data is the
server's now and not the current user's to reset.

## Reads — `lib/hooks/*`

- `use-session.ts` — `useSession()`, `useRequireRole(role)`, `homePathForRole()`
- `use-hydrated.ts` — `useHydrated()`
- `use-grogu.ts` — one selector hook per view need (`usePlaytests`,
  `useDiscoverPlaytests`, `useApplicationsByTester`, `useTesterTests`,
  `usePlaytestApplicants`, `useAcceptedTesters`, `useDeveloperFeedback`,
  `usePlaytestAnalytics`, `useDeveloperStats`, …). Each selects stable raw
  arrays from the store and derives with `useMemo` — no `useShallow` needed.

Join / filter / aggregate logic lives once in `lib/domain.ts` and is shared by
these hooks and the server-side `data/index.ts`.

## Writes & auth — `lib/services/*`

Async functions that add ~200–900ms of simulated latency (so the UI exercises
real loading states), then call a store action. They throw `ServiceError` with a
`code` the UI can branch on.

| Module | Functions |
| --- | --- |
| `auth.ts` (`lib/mock-auth.ts` re-exports) | `login`, `loginAsDemo`, `signup`, `logout`, `getSession` |
| `applications.ts` | `applyToPlaytest`, `withdrawApplication`, `decideApplication` |
| `tests.ts` | `downloadBuild`, `toggleTask`, `submitFeedback` |
| `games.ts` | `createGame`, `updateGame` |
| `playtests.ts` | `createPlaytest`, `updatePlaytest`, `setPlaytestStatus` |
| `notifications.ts` | `markRead`, `markAllRead` |

## Mock authentication

Frontend-only. A "session" is `{ user, role, issuedAt }` held in the store and
persisted. **No provider, no token, no password check beyond length.**

- **Demo accounts** (one click on `/login`):
  `priya.nair@example.com` (tester) · `mara@driftwoodgames.dev` (developer).
- **Email login**: any email present in the seed `users` + any 6+ char password.
- **Signup**: pick tester or developer, fill the role-specific form → a new
  `User` (+ profile) is created and you're signed in.
- Role determines the redirect target and which `AppShell` you can enter.

To make auth real, replace the three functions in `lib/services/auth.ts` and
nothing else — the rest of the app only sees `useSession()`.

## The full demo workflow this enables

```
Tester signs up / logs in
  → Discover → Playtest detail → Apply            (application: pending)
Developer logs in
  → Manage playtest → Applicants → Accept         (application: accepted, tester notified)
Tester
  → My tests → workspace: download build, tick tasks
  → Feedback form → submit                        (test: completed, developer notified)
Developer
  → Manage playtest → Feedback / Analytics update
```

Every step is a real API call, so the two sides of the flow can be driven from
different browsers by different people.

Playtest lifecycle rules are enforced **on both sides**: `lib/domain.ts` keeps
the UI honest, and the same transition table is checked in the database
(`grogu_playtest_set_status`) so a crafted request cannot bypass it. Drafts can
be edited, `recruiting` is the published/open state, active or completed
playtests are locked for editing, and `completed` or `closed` playtests may move
to terminal `archived` status.

The server also enforces rules the client never could: a tester may only open a
workspace for a playtest they were accepted to, a developer may only act on
applications to their own playtests, one feedback submission per tester per
playtest, and acceptances cannot exceed `maxTesters`.
