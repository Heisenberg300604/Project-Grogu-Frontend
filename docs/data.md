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
| `gameKeys` | Reward keys, codes included, for games the caller owns | private |
| `ledgerEntries` | The caller's own money ledger | private |
| `wallet` | `{ balance, upiId }` for a signed-in tester, otherwise `null` | private |
| `reputationEvents` | The caller's own reputation history | private |
| `reputationRules` | How reputation is earned, with amounts | public |
| `reputationLevels` | Level thresholds | public |

An anonymous request returns the public rows only, with every private
collection empty.

## Feedback insights

A playtest's feedback summary (`PlaytestInsight`) is **not** in the bootstrap. It
is fetched per playtest, by the studio that owns it, from
`GET /api/v1/playtests/{id}/insights` and held in the store's `insights`
collection (`insightsService.loadInsight`). `refreshInsight` (POST) asks the
server for a new AI summary, which it writes only when feedback has arrived since
the last one.

- `source` is `"ai"` (a cached Gemini summary) or `"rules"` (computed from the
  feedback by the server). The shape is the same for both.
- Sentiment counts always come from the feedback rows, never from the model.
- `stale` means newer feedback exists than the shown summary covers (or no AI
  summary exists yet); `aiEnabled` says whether the server can write one at all;
  `notice` is the reason a fresh AI summary was not produced.
- The panel never treats an AI failure as an error: the server falls back and
  says why. Only a failure to load the summary at all is an error state.

## Matching

`TesterSuggestions` (studio side, per playtest) and `PlaytestRecommendations`
(tester side) are not in the bootstrap either. They are fetched on demand by
`matchingService` into the store's `testerSuggestions` and
`playtestRecommendations` collections.

- The server decides eligibility and the 0–100 `score`; `reasons` are its
  strongest factors. Never filter or re-score on the client.
- `source` is `"ai"` when Gemini re-ordered the list and added `aiReason`, or
  `"rules"`. Gemini cannot add entries.
- `invited` marks a studio invitation (`matchingService.inviteTester`).
- `stale`, `aiEnabled` and `notice` mean what they mean for insights.

## Rewards and reputation

- A review (`Feedback.reviewStatus`) goes `submitted` → `approved` or
  `rejected`, once, decided by the studio that owns the playtest
  (`feedbackService.reviewFeedback`). `Feedback.rewards` is what approval granted.
- Money is a ledger: the balance is the sum of `ledgerEntries`, computed by the
  server as `wallet.balance`. There is no stored balance and no payout.
- `TesterProfile.reputation` is unbounded points: the sum of the tester's
  reputation events. `level`, `levelTitle`, `levelFloor` and `nextLevelAt` come
  from the server's threshold table; `levelProgress()` in `lib/domain.ts` only
  turns them into a bar. Never compute a level on the client.
- `Playtest.requirements.minReputation` is on the same points scale. That is what the marketing and discover pages render.

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
Feedback        1─* FeedbackMedia   (embedded: uploaded screenshots / recordings, up to 6)
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

## Build access and uploads

`Playtest.buildUrl`, `installInstructions` and `accessKey` are **not public**. The
API returns empty strings for them to everyone except the studio that owns the
playtest and testers who have been accepted to it (`grogu_playtest_view` in the
database decides this, per viewer, when the bootstrap document is built). Do not
render them from server-side accessors in `data/index.ts`: those use the
anonymous slice and will always see blanks.

Uploaded files are stored as `/uploads/<name>` paths and turned into loadable URLs
by `assetUrl()` in `lib/assets.ts`, which refuses anything that is not an upload
path or an `https` URL. Uploads go through `uploadsService` (`lib/services/uploads.ts`),
which checks type and size for a fast error; the server re-checks from the file's
real bytes.
