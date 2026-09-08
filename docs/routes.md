# Routes

Status legend: **Built** = implemented this phase · **Placeholder** = route +
metadata exist, content is a stub for a later task.

## Marketing — `app/(marketing)/`

| Route | User | Purpose | Status |
| --- | --- | --- | --- |
| `/` | Public | Landing page: hero, how-it-works, featured games, developer CTA, footer | **Built** |
| `/how-it-works` | Public | Explains the playtest loop for both roles | Placeholder (reuses the `HowItWorks` section) |
| `/developers` | Public / developers | Developer-focused marketing | Placeholder (reuses the `DeveloperCta` section) |

## Auth — `app/(auth)/`

| Route | User | Purpose | Status |
| --- | --- | --- | --- |
| `/login` | Public | Log in | Placeholder — no auth in this phase |
| `/signup` | Public | Create a tester or developer account | Placeholder — form + role selection later (RHF + Zod) |

## Tester area — `app/(tester)/`

Shared shell: `AppShell` with `roleLabel="Tester"` and `TESTER_NAV`.

| Route | User | Purpose | Status |
| --- | --- | --- | --- |
| `/discover` | Tester | Browse/filter open playtests | Placeholder |
| `/playtests/[id]` | Tester | Playtest detail + apply flow | Placeholder (resolves mock playtest by id; `generateStaticParams` from mock data) |
| `/applications` | Tester | Track application statuses | Placeholder |
| `/tests/[id]` | Tester | Active-test workspace: tasks + feedback form | Placeholder |
| `/profile` | Tester | Tester profile & reputation | Placeholder |

## Developer area — `app/(developer)/`

Shared shell: `AppShell` with `roleLabel="Developer"` and `DEVELOPER_NAV`.

| Route | User | Purpose | Status |
| --- | --- | --- | --- |
| `/developer/dashboard` | Developer | Overview of games, playtests, pending applicants, recent feedback | Placeholder |
| `/developer/games` | Developer | Manage games | Placeholder |
| `/developer/games/new` | Developer | Add a game (form) | Placeholder |
| `/developer/playtests/new` | Developer | Create a playtest (multi-step form) | Placeholder |
| `/developer/playtests/[id]` | Developer | Manage a playtest: applicants, testers, feedback, analytics | Placeholder (resolves mock playtest by id; `generateStaticParams` from mock data) |

## System

| Route | Purpose |
| --- | --- |
| `not-found` (`app/not-found.tsx`) | Global 404 |

## Notes

- Route **groups** `(marketing)` / `(auth)` / `(tester)` / `(developer)` do not
  appear in URLs — they exist to attach a shared `layout.tsx`.
- The `/developer` prefix on developer routes is a real segment; only the layout
  is shared via the group.
- Placeholder pages render `components/layout/placeholder-page.tsx` with a short
  description of what the finished screen will contain.
