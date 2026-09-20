# App Status

Last updated: 2026-09-20 · Phase: **integrated with the Grogu API**

Every screen is backed by `grogu-backend` (.NET 5 + PostgreSQL on Neon). Auth is
a real bearer token; reads come from `GET /api/v1/bootstrap` and writes go to
`/api/v1/*`. No mock data remains in the shipped app.

## Validation

| Check | Result |
| --- | --- |
| `npm run lint` | ✅ clean (2026-09-20) |
| `npm run typecheck` | ✅ clean (2026-09-20) |
| `npm run build` | ✅ 26 routes (2026-09-20) |
| Backend stored-function suite (44 scenarios) | ✅ (2026-09-20) |
| Backend HTTP suite (47 assertions, containerised API + Postgres) | ✅ (2026-09-20) |
| Server-rendered pages against a live API | ✅ Discover / landing render real rows |
| Signed-in browser flows (apply → accept → test → feedback) | ⚠️ not re-run since integration — see below |

## Screens — all implemented

| Area | Screen | State |
| --- | --- | --- |
| Marketing | Landing (`/`) | ✅ |
| Marketing | How it works, For developers | ✅ |
| Marketing | Discover (`/discover`) — working search + filters | ✅ |
| Marketing | Playtest detail (`/playtests/[id]`) + apply | ✅ |
| Auth | Login — demo accounts + email (API) | ✅ |
| Auth | Signup — role selection + role forms (RHF + Zod) | ✅ |
| Tester | Dashboard | ✅ |
| Tester | Applications (with withdraw) | ✅ |
| Tester | My tests | ✅ |
| Tester | Test workspace (build → tasks → feedback) | ✅ |
| Tester | Feedback form | ✅ |
| Tester | Profile + edit profile | ✅ |
| Developer | Dashboard | ✅ |
| Developer | Games + Create game | ✅ |
| Developer | Edit game | ✅ |
| Developer | Playtests + 4-step Create playtest wizard | ✅ |
| Developer | Edit draft playtest | ✅ |
| Developer | Manage playtest — Overview / Applicants / Testers / Feedback / Analytics | ✅ |
| Developer | Analytics (cross-playtest) | ✅ |
| Developer | Studio profile + edit profile | ✅ |

The full product workflow runs end to end against the API.

## Known limitations

- **No `buildUrl` on new playtests.** The create/edit wizard has no field for it
  (`NewPlaytestInput` has no `buildUrl`), so the column is stored empty and the
  workspace's download button records progress without linking to a build. The
  form needs the field before this closes.
- **Signed-in browser flows not re-verified** since the integration. The API is
  covered by 47 HTTP assertions and the server-rendered pages were checked
  against a live backend, but the client-side journeys (apply → accept → test →
  feedback) have not been re-run in a browser.
- **Whole-snapshot reads.** Every refresh re-fetches all collections. Fine at
  this scale; it will need per-view endpoints or a query cache as data grows.
- **Session is a 12-hour bearer token in `localStorage`.** No refresh token, and
  no revocation — signing out discards the client's copy only.
- **Procedural art.** Game covers and avatars are generated from a hue + initials
  — no real image upload/hosting (`GameCover`, `UserAvatar`).
- **No email / notifications delivery.** Notifications are store rows only.
- **No file handling.** "Download build" records progress; there is no build
  hosting or upload.
- **Lifecycle editing is intentionally constrained.** Games can be edited;
  playtest drafts can be edited while published, active, completed, closed, and
  archived playtests are protected from content edits. `recruiting` is the
  existing published/open status in this model.
- **No pagination / virtualization.** Fine at the current scale.
- **`/tests/[id]` and `/developer/playtests/[id]`** render on demand (not
  prerendered) because they're session-gated.
- **First load of an authenticated page** shows a skeleton until the session
  rehydrates and the first bootstrap returns (public pages are server-rendered
  with content).

## Not started (out of scope)

Payments / rewards fulfilment · real-time chat · AI feedback analysis ·
recommendation engine beyond a simple filter · admin tools · email delivery ·
image upload and build hosting. See `AGENTS.md` §5.

## Visual system (redesign pass)

The whole frontend was re-skinned against a single design system; no routes,
services, hooks, store, or data shapes changed.

- **Navigation** moved from a sidebar to a role-aware top nav (`AppNavBar`),
  with a mobile drawer. Sidebars read as an admin console; this product should
  read as a gaming platform.
- **Game art** is now genre-driven and deterministic (`GameCover`), framed by
  `GameArt` so every game image in the product crops identically.
- **Cards are rationed.** Page structure uses headings, hairlines and
  whitespace; cards are reserved for repeated units and side rails. See
  `docs/design-system.md` § Cards vs. sections.
- **New primitives:** `meta.tsx`, `toast.tsx`, `tooltip.tsx`, `pagination.tsx`,
  plus `SuccessState` and four skeleton shapes in `states.tsx`.
- **Multi-step flows:** playtest creation is 5 steps, feedback is 3, both with a
  progress bar.
- **Motion** is token-driven and fully disabled under `prefers-reduced-motion`.

## Next tasks (suggested)

1. Tester ↔ developer messaging on a playtest.
2. Real image upload for covers/avatars.
3. Wire a backend: start with auth + read APIs behind TanStack Query.
