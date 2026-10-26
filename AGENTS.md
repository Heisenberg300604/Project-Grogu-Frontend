# Project Grogu — Agent Instructions

## 1. Project Overview

Project Grogu is a college minor-project prototype for a game playtesting platform.

Grogu connects:

1. Game developers who need players to test their games.
2. Playtesters who discover games, participate in playtests, and submit structured feedback.

The current phase is API-INTEGRATED.

The frontend is backed by `grogu-backend` (.NET 5 + PostgreSQL on Neon). All
data comes from `/api/v1`; there is no mock data in the shipped app.

`lib/types.ts` is the contract. When a screen needs data the API does not
return, change the backend to provide it — the frontend defines what the
product needs. Do not reintroduce local mock data to paper over a gap.

---

## 2. Current Development Goal

The immediate goal is to build a polished, responsive frontend using:

* Next.js
* TypeScript
* Tailwind CSS
* shadcn/ui
* Lucide React

The UI should feel like a real production product, and is now backed by one.

Prioritize:

* UX
* visual hierarchy
* responsive behavior
* reusable components
* accessibility
* maintainable architecture
* consistent design system

---

## 3. Core Product Flows

### Playtester

Landing
→ Signup/Login
→ Discover Playtests
→ Playtest Details
→ Apply
→ Dashboard
→ Accepted Playtest
→ Playtest Workspace
→ Feedback Form
→ Profile

### Developer

Landing
→ Signup/Login
→ Developer Dashboard
→ My Games
→ Create Playtest
→ Manage Playtest
→ Applicants
→ Feedback
→ Analytics

---

## 4. MVP Screens

The MVP currently consists of approximately 15 primary screens:

1. Landing Page
2. Login
3. Signup / Role Selection
4. Playtester Discover
5. Playtest Details
6. Apply for Playtest
7. Tester Dashboard
8. Playtest Workspace
9. Feedback Form
10. Tester Profile
11. Developer Dashboard
12. My Games
13. Create Playtest
14. Manage Playtest / Applicants
15. Feedback Analytics

Do not unnecessarily expand the MVP.

---

## 5. Explicitly Out of Scope for Current Frontend Phase

Do not implement these unless explicitly requested:

* Real authentication
* Real payments
* Stripe
* Production database
* Prisma
* PostgreSQL
* Firebase
* Supabase
* Real game hosting
* Real-time chat
* AI beyond Phase 6 (see `implementation-phases.md`). In scope: the studio's
  per-playtest feedback summary, and matching (suggested testers, recommended
  playtests). Both run on the backend, work without a key, and never expose it
* A recommendation engine beyond the rule-based matching in Phase 6 (no learned
  models, no tracking of browsing behaviour)
* Notification *delivery* (email/push — in-app rows exist and are persisted)
* Admin dashboard
* Payments. Rewards are in scope as records only: a cash ledger and UPI ID
  with no payout, and game keys allocated from a studio's inventory with no
  email delivery (see `implementation-phases.md`, Phases 4 and 5)
* Build hosting — studios link to their own hosting. Image and video uploads
  (game posters, review screenshots and recordings) are in scope; see
  `implementation-phases.md`

---

## 6. Technology Rules

Use:

* Next.js App Router
* TypeScript
* Tailwind CSS
* shadcn/ui
* Lucide React
* React Hook Form
* Zod
* Zustand only when global client state is actually required
* TanStack Query when real API/server state is introduced
* Recharts for analytics visualizations
* Motion for purposeful animations

Prefer native Next.js capabilities before introducing another dependency.

Do not install a package simply because it is convenient.

Before adding a dependency, determine whether the functionality can reasonably be implemented with existing project tools.

---

## 7. Next.js Rules

Use the App Router.

Prefer Server Components by default.

Use `"use client"` only when client-side behavior is required, such as:

* interactive forms
* dialogs
* dropdowns
* tabs requiring client state
* browser APIs
* interactive charts
* client-side state

Do not turn entire route trees into Client Components unnecessarily.

Use layouts for shared navigation and page shells.

Use dynamic routes for entities such as:

* `/playtests/[id]`
* `/tests/[id]`
* `/developer/playtests/[id]`

---

## 8. Component Architecture

Components should be reusable and domain-oriented.

Preferred structure:

```text
components/
├── ui/
├── layout/
├── navigation/
├── games/
├── playtests/
├── feedback/
├── dashboard/
└── charts/
```

Do not create massive components.

If a component becomes difficult to understand or contains multiple independent UI responsibilities, split it.

Avoid premature abstraction.

Only extract a component when:

* it is reused,
* it represents a meaningful UI concept,
* or extraction materially improves readability.

---

## 9. Data

All data comes from the API. Nothing hardcodes business data.

```text
lib/types.ts        Domain entities — the contract the API satisfies
lib/services/       The only place that calls the API
lib/store/          Cache of GET /api/v1/bootstrap
lib/hooks/          Selector hooks over the cache (reads)
data/index.ts       Server Component accessors (public slice)
```

Rules:

* Components read through `lib/hooks/*` and write through `lib/services/*`.
  Nothing else fetches; nothing else mutates the store.
* Do not scatter hardcoded business data through JSX.
* Every entity has a type in `lib/types.ts`. Never redeclare one inline.
* If the API is missing a field or an endpoint, add it to the backend rather
  than faking it client-side.

Domain entities: `User`, `Game`, `Playtest`, `Application`, `Feedback`,
`TestProgress`, `Notification`, `TesterProfile`, `DeveloperProfile`.

See `docs/data.md` for the payload and `docs/state-management.md` for the
read/write cycle.

---

## 10. Design System

Grogu uses a playful "arcade" look: bright, high-contrast, flat colour with
thick ink outlines, hard offset shadows, pixel-font labels and motion. It ships
a light theme (default) and a dark theme, toggled by the user.

Brand palette (the same in both themes): grape `#5b3ff0`, gold `#ffc933`,
coral `#ff5a7a`, mint `#19c58d`, azure `#34b6ff`, lilac `#b9a8ff`, ink `#17142b`.

All raw colour values live in `app/globals.css`. Components use the semantic
tokens (`background`, `foreground`, `surface`, `elevated`, `border`, `line`,
`primary`, `secondary`, `muted`, `success`, `warning`, `destructive`, `info`)
and the brand utilities (`bg-gold`, `text-ink`, ...). See
`docs/design-system.md` for the full reference.

The final design should feel:

* playful and game-like
* high contrast and legible
* consistent: one outline weight, one shadow style, one motion language

Keep contrast accessible: brand colours are fills; status text uses the
theme-aware `success` / `warning` / `destructive` / `info` tokens.

---

## 11. UI Principles

Grogu should feel closer to:

a playful game launcher with the clarity of a modern SaaS product

than:

LinkedIn + generic dashboard template.

Prioritize:

* strong game imagery
* large visual cards
* clear status indicators
* tester reputation
* progress indicators
* structured feedback
* meaningful empty states
* clear calls to action

Motion is part of the design (see `docs/design-system.md`), but it must stay
purposeful, respect `prefers-reduced-motion`, and never hide content or state.

Every visual element should support usability.

---

## 12. Responsive Design

Every page must work at:

* mobile
* tablet
* desktop
* large desktop

Use Tailwind responsive utilities.

Do not design desktop first and ignore mobile.

Navigation, cards, grids, tables, forms, and dashboards must have intentional responsive behavior.

---

## 13. Accessibility

Follow accessible HTML and UI patterns.

Requirements:

* semantic HTML
* keyboard navigation
* visible focus states
* sufficient contrast
* proper labels for form inputs
* accessible buttons
* meaningful alt text
* ARIA only where necessary

Do not use clickable `<div>` elements when a semantic button/link is appropriate.

---

## 14. Forms

Use React Hook Form + Zod for meaningful forms.

Forms should include:

* validation
* useful error messages
* loading/submission states
* disabled states
* success states where applicable

Do not create fake validation logic that contradicts the intended product behavior.

---

## 15. Loading / Empty / Error States

Do not design only the happy path.

Important pages should account for:

* loading
* empty
* error
* disabled
* success
* pending
* rejected
* completed states

Use skeletons where appropriate.

---

## 16. Images and Assets

Use assets from:

```text
public/
```

Do not invent external image URLs inside components unless explicitly requested.

If an image asset is missing, use a clear placeholder abstraction rather than hardcoding random external URLs.

Keep image usage intentional.

---

## 17. Documentation

Project documentation belongs in:

```text
docs/
```

Maintain:

```text
docs/
├── architecture.md
├── design-system.md
├── routes.md
├── components.md
├── data.md
└── development.md
```

Documentation should be updated when architecture or major implementation decisions change.

Do not create unnecessary documentation files.

---

## 18. Coding Style

Prefer:

* small readable functions
* descriptive names
* typed props
* early returns
* composition
* reusable primitives
* simple data flow

Avoid:

* `any`
* giant components
* deeply nested conditionals
* duplicated UI
* magic numbers
* unexplained constants
* unnecessary abstractions
* unnecessary dependencies

Use TypeScript strictly.

Do not suppress TypeScript errors unless there is a documented reason.

---

## 19. Before Making Changes

Before implementing a feature:

1. Inspect the existing project structure.
2. Read relevant files.
3. Check existing components before creating new ones.
4. Check existing design tokens before introducing new styles.
5. Check documentation when relevant.
6. Follow the existing architecture.
7. Avoid rewriting working code unnecessarily.

---

## 20. After Making Changes

After implementation:

1. Run lint.
2. Run type checking.
3. Run the relevant build/test commands.
4. Fix errors introduced by the changes.
5. Check responsive behavior.
6. Check accessibility basics.
7. Update documentation if the architecture changed.

Do not claim a feature is complete if the project does not build.

---

## 21. Agent Behavior

Do not blindly follow instructions if they conflict with the architecture or create unnecessary technical debt.

If there is a better implementation, explain the tradeoff briefly before making a significant architectural change.

Do not introduce backend infrastructure during the frontend phase.

Do not redesign unrelated pages while implementing a specific feature unless required for consistency.

Do not replace existing working components without a clear reason.

When requirements are ambiguous, prefer the simplest implementation consistent with the product specification.

---

## 22. Current Priority

The current implementation priority is:

1. Project setup
2. Global design system
3. Landing page
4. Authentication UI
5. Playtester discovery
6. Playtest details
7. Application flow
8. Tester dashboard
9. Playtest workspace
10. Feedback
11. Developer dashboard
12. Game management
13. Playtest creation
14. Playtest management
15. Analytics
16. Final responsive/accessibility polish

Build incrementally.

Do not implement the entire application in one pass.
