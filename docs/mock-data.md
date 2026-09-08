# Mock Data

All data is mocked for the frontend-first phase. It is realistic, internally
consistent, and typed by `lib/types.ts`.

## Files

| File | Exports | Contents |
| --- | --- | --- |
| `data/users.ts` | `users`, `testerProfiles`, `developerProfiles` | 3 developers, 6 testers, and the role-specific profile for each |
| `data/games.ts` | `games` | 6 games across the 3 developers |
| `data/playtests.ts` | `playtests` | 6 playtests (one per game), covering every `PlaytestStatus` of interest |
| `data/applications.ts` | `applications` | 21 applications across the playtests |
| `data/feedback.ts` | `feedback` | 9 feedback submissions for the in-progress / in-review / completed playtests |
| `data/index.ts` | accessor functions | **The only module pages import from.** |

## Entities & relationships

```
User (role: developer)  1 ──── *  Game            Game.developerId
User (role: developer)  1 ──── *  Playtest        Playtest.developerId
Game                    1 ──── *  Playtest        Playtest.gameId
Playtest                1 ──── *  Application     Application.playtestId
User (role: tester)     1 ──── *  Application     Application.testerId
Playtest                1 ──── *  Feedback        Feedback.playtestId
User (role: tester)     1 ──── *  Feedback        Feedback.testerId
Playtest                1 ──── 1  PlaytestTask[]  (embedded in Playtest.tasks)
User (role: tester)     1 ──── 1  TesterProfile   TesterProfile.userId
User (role: developer)  1 ──── 1  DeveloperProfile DeveloperProfile.userId
```

Composed view-models (in `lib/types.ts`):

- `PlaytestWithRelations` = `Playtest` + its `game` + its `developer`
- `PlaytestAnalytics` = aggregates computed from `feedback` for one playtest

## Consistency rules kept by hand

- `Playtest.acceptedTesters` == count of `accepted` applications for that playtest.
- `Playtest.applicantCount` == total applications for that playtest.
- Every `Feedback` / `Application` `testerId` is a `role: "tester"` user; every
  `developerId` is a `role: "developer"` user.
- `Feedback` only exists for playtests with status `in-progress`, `review`, or
  `completed`.
- All dates are ISO strings; "today" in the dataset is around **2026-09-08**.

## How mock data is consumed

Pages call the `async` accessors in `data/index.ts` — never the raw arrays:

```ts
import { getFeaturedGames, getPlatformStats } from "@/data";

export default async function LandingPage() {
  const [stats, games] = await Promise.all([
    getPlatformStats(),
    getFeaturedGames(6),
  ]);
  // ...
}
```

Key accessors:

| Function | Returns |
| --- | --- |
| `getGames()` / `getGameById(id)` / `getFeaturedGames(limit)` / `getGamesByDeveloper(id)` | `Game`(s) |
| `getUserById(id)` / `getTesterProfile(id)` / `getDeveloperProfile(id)` | user + profile |
| `getPlaytests({ status })` / `getDiscoverablePlaytests()` / `getPlaytestById(id)` / `getPlaytestsByDeveloper(id)` | `PlaytestWithRelations`(s) |
| `getApplicationsByTester(id)` / `getApplicationsForPlaytest(id)` | `Application[]` |
| `getFeedbackForPlaytest(id)` / `getPlaytestAnalytics(id)` | `Feedback[]` / `PlaytestAnalytics` |
| `getPlatformStats()` | landing-page totals |

## Replacing with a real API

Every accessor is already `async` and returns a domain type. Swap the function
body for a `fetch` / SDK call; pages and components do not change. See
`docs/architecture.md` → "Future API integration strategy".
