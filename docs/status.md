# App Status

Last updated: 2026-10-13 · Phase: **integrated with the Grogu API; production rework in progress** (see `implementation-phases.md` one level up)

Every screen is backed by `grogu-backend` (.NET 5 + PostgreSQL on Neon). Auth is
a real bearer token; reads come from `GET /api/v1/bootstrap` and writes go to
`/api/v1/*`. No mock data remains in the shipped app.

## Validation

| Check | Result |
| --- | --- |
| `npm run lint` | ✅ clean (2026-10-13) |
| `npm run typecheck` | ✅ clean (2026-10-13) |
| `npm test` (Vitest, 61 tests) | ✅ (2026-10-13) |
| `npm run build` | ✅ 35 routes incl. metadata, 44 static pages generated (2026-10-13) |
| Database SQL tests (`db/apply.sh tests`) | ✅ signup/login, the full apply → accept → test → feedback loop, build-access / asset validation, and review approval, rewards, key inventory, reputation rules, levels and UPI wallet (2026-10-13) |
| Feedback summaries: SQL tests (rules, staleness, validation, ownership, anonymised input); API checks against a Gemini stub (54: success, sanitising, 8 failure modes, timeout, cooldown, stale-summary fallback, access control, key and review text absent from logs; plus concurrency and per-minute cap); 32 browser checks (AI and no-AI, mobile) | ✅ (2026-10-13). Also run once against real Gemini (`gemini-3.1-flash-lite`). |
| Matching: SQL tests (every eligibility filter, scores and weights, reasons, AI-ranking cache, access control, invites and the cap); 40 API checks against a Gemini stub (anonymised keys, re-ordering, invented and repeated keys, failures, invites); 28 browser checks (AI and no-AI, invite flow, mobile) | ✅ (2026-10-13). Also run against real Gemini on both sides. |
| Concurrent approvals of two reviews of one game | ✅ two sessions against local Postgres each took a different key; neither waited on the other (2026-10-13) |
| Browser walk-through of the reward screens (headless Chrome, `next start` + local API) | ✅ 36 checks: approve with reputation/cash/key, key inventory add/remove, tester rewards page, workspace review outcome, dashboard level, new notifications, avatar upload, UPI validation, no horizontal scroll at 390px (2026-10-13) |
| Core loop over HTTP against a local API + Postgres | ✅ apply → accept → download → tasks → feedback (2026-10-13) |
| Uploads over HTTP (type sniffing, size, role, traversal) and the poster → playtest access → review attachment flow | ✅ against a local API + Postgres (2026-10-13) |
| Anonymous server-rendered playtest page carries no build link, key or notes | ✅ (2026-10-13) |
| Directory pages against a live seeded API | ✅ `/testers`, `/studios` and profile pages render real rows; unknown ids return 404 (2026-10-13) |
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
| Marketing | Tester directory (`/testers`) + public profile | ✅ |
| Marketing | Studio directory (`/studios`) + public profile | ✅ |
| Marketing | Playtest detail (`/playtests/[id]`) + apply | ✅ |
| Auth | Login — demo accounts + email (API) | ✅ |
| Auth | Signup — role selection + role forms (RHF + Zod) | ✅ |
| Tester | Dashboard, with **Recommended for you** (rule-based, AI-ranked when on) | ✅ |
| Tester | Applications (with withdraw) | ✅ |
| Tester | My tests | ✅ |
| Tester | Test workspace (build → tasks → feedback) | ✅ |
| Tester | Feedback form | ✅ |
| Tester | Profile + edit profile (profile picture upload, UPI ID) | ✅ |
| Tester | Rewards — ledger balance, level, ways to earn, review outcomes, reputation history | ✅ |
| Developer | Dashboard | ✅ |
| Developer | Games + Create game | ✅ |
| Developer | Edit game + reward-key inventory | ✅ |
| Developer | Playtests + 4-step Create playtest wizard | ✅ |
| Developer | Edit draft playtest | ✅ |
| Developer | Manage playtest — Overview / Applicants (with suggested testers and invites) / Testers / Feedback (approve or reject with rewards) / Analytics | ✅ |
| Developer | Analytics (cross-playtest), with the feedback summary when one playtest is selected | ✅ |
| Developer | Feedback summary — AI or automatic, per playtest | ✅ |
| Developer | Studio profile + edit profile | ✅ |

The full product workflow runs end to end against the API.

## Known limitations

- **No payouts.** Cash rewards are ledger entries; the UPI ID is stored and
  format-checked, but no payment method is integrated.
- **Game keys are not emailed.** The tester is told to check their email, and the
  studio sees which key to send next to the approved review. Email delivery is
  not built.

- **Uploads are stored on the API's local disk.** Posters and review media live in
  `Storage__Path` (default `<app>/uploads`). On a host with an ephemeral
  filesystem they vanish on redeploy, so production needs a persistent disk or a
  hosted `IFileStore`. Files are served at unguessable URLs but are not
  access-controlled, and removing a poster or attachment does not delete the file.
- **One shared access key per playtest.** Studios set a single build link, key and
  install note that every accepted tester sees. Per-tester unique keys and their
  allocation are not built.
- **Upload UI is untested in a browser.** The upload endpoint, validation, access
  rules and server-rendered output are verified over HTTP; the file pickers, upload
  progress and gallery have only been type-checked and linted.
- **Signed-in browser flows not re-verified** since the integration. The API is
  covered by 47 HTTP assertions and the server-rendered pages were checked
  against a live backend, but the client-side journeys (apply → accept → test →
  feedback) have not been re-run in a browser.
- **Whole-snapshot reads.** Every refresh re-fetches all collections. Fine at
  this scale; it will need per-view endpoints or a query cache as data grows.
- **Session is a 12-hour bearer token in `localStorage`.** No refresh token, and
  no revocation — signing out discards the client's copy only.
- **Procedural art as the fallback.** Games without a poster get generated cover art,
  and avatars are still initials only (profile pictures are not built yet).
- **No email / notifications delivery.** Notifications are store rows only.
- **No build hosting.** Studios link to wherever they host the game (Steam beta,
  itch.io, a direct download); Grogu only stores the link.
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

Payments / payouts · real-time chat · matching that learns from outcomes (the
rule-based matching with AI re-ordering is built) ·
admin tools · email delivery · build hosting. See `AGENTS.md` §5.

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
