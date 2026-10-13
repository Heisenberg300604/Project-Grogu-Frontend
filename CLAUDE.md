# Project Grogu

**Grogu is a two-sided playtesting platform.** Indie game developers recruit real players to test unreleased builds and give structured feedback. Playtesters discover those games, get accepted into playtests, play, and submit feedback. Studios review each piece of feedback and reward the tester with reputation, a game key, and/or cash.

It is a college project that is being built toward a real product. The app is live-integrated with its API: all data comes from the backend, there is no mock data.

## Who uses it

| Role | Goal |
| --- | --- |
| **Developer / studio** | Get relevant players to test a game, see comparable feedback, and decide what to fix next. |
| **Tester (playtester)** | Find interesting games to test, build a visible record of testing work, and earn rewards. |
| **Visitor (signed out)** | Browse open playtests, games, testers and studios before signing up. |

## Core loop

1. Developer creates a game and a playtest (goals, focus areas, requirements, tasks, reward, capacity, closing date) and publishes it.
2. Tester browses, opens a playtest, and applies with a message.
3. Developer accepts or rejects applicants and manages the roster.
4. Accepted tester downloads the build, completes the tasks, and submits structured feedback.
5. Developer reviews each feedback submission. Approving it pays the tester (see Rewards).
6. Developer reads feedback and analytics across playtests.

## Features

### Public (signed out)
- **Landing page** with featured playtests, featured games, platform stats, and separate value propositions for developers and testers.
- **How it works**, **For developers**, and **For gamers** informational pages.
- **Discover**: browse open playtests with search, sorting, and filters for genre, platform, time, and NDA.
- **Playtest detail**: goals, focus areas, requirements, tasks, reward, capacity, and the developer. Applying requires signing in.
- **Tester directory** (`/testers`): search, experience/platform/genre filters, sorting, pagination.
- **Tester public profile**: reputation, level, headline numbers, badges, skills. Testing history and feedback stay private.
- **Studio directory** (`/studios`) and **studio public profile**: details, open playtests, games.

### Accounts and access
- Email/password sign-up (choose tester or developer) and login. Sessions use a bearer token that expires.
- Separate tester and developer areas; each role sees only its own workspace.
- Playtest ownership and roster access are enforced by the backend, not only by the UI.
- Demo accounts are available on the login screen once the backend seed is applied.

### Developer / studio workspace
- **Dashboard**: studio stats, active playtests with roster and feedback progress, recent feedback.
- **Games**: create and edit games (title, genre, platform, status, build version, cover image or generated cover, accent colour). Each game holds an inventory of reward keys.
- **Playtests**: list by status; a four-step create flow (game and info, requirements and reward, tasks, review). Save as draft or publish. Drafts are editable; published and finished playtests are locked.
- **Playtest management**, with tabs:
  - *Overview*: details and status control (open, close, and other lifecycle states).
  - *Applicants*: accept or reject applications. While recruiting, **Suggested testers** lists testers who meet the requirements and haven't applied, best fit first, with reasons, and an **Invite** button that notifies them.
  - *Testers*: the accepted roster and their progress.
  - *Feedback*: review each submission (approve or reject), with the reward applied on approval.
  - *Analytics*: per-playtest charts.
- **Playtest access settings**: the build link, game key, and install notes are shared with accepted testers, and can be changed after publishing.
- **Analytics** across playtests: ratings, sentiment, common pain points and bugs, response rate, playtime, qualitative feed, with a scope selector.
- **Feedback summary** per playtest (on the Analytics tab, and on the Analytics page when one playtest is selected): overall picture, top highlights, what testers like and dislike, bugs, and suggested next steps. Written by Gemini when the server has a key, refreshed when new feedback arrives, and replaced by an automatic summary computed from the feedback whenever the AI is off, rate-limited or down. Review text is sent without tester names.
- **Studio profile**: edit studio name, size, founding year, website, and owner details.
- **Uploads**: poster images for playtests, and game cover images by URL.

### Tester workspace
- **Dashboard**: welcome, reputation and level, counts, continue-testing, recent applications, and **Recommended for you**: open playtests the tester qualifies for, best match first, with why each fits. Playtests a studio invited them to are marked and rank higher.
- **Applications**: all applications grouped by status; withdraw pending ones.
- **My tests**: accepted playtests, split into active and completed, with progress.
- **Test workspace** (per playtest): a step-by-step flow of download build, complete tasks, then submit feedback. Each step unlocks the next.
- **Feedback form**: five ratings, sentiment, summary, highlights, pain points, controls, bugs, task answers, recommendation, and hours played. Submitting marks the test complete. One submission per tester per playtest.
- **Review media**: testers can attach screenshots or short video (images up to 10 MB, video up to 50 MB).
- **Rewards page**: reputation, game keys, cash balance, and the reward history for each approved review.
- **Profile**: public profile (reputation, completion rate, badges, testing history, preferences). Editable identity, experience, platforms, genres, languages, availability, bio, and profile picture.
- **Payout details**: a UPI id can be saved for payouts. Visible only to the tester.
- **Notifications**: in-app only. Covers application decisions, review decisions, level-ups, and profile milestones. Can be marked read individually or all at once.

### Reputation and levels
- Testers earn reputation for real activity. Each reward is awarded once, and every change is recorded in a reputation history.
- Earning rules:
  - Profile: bio (+5), personal details (+5), profile picture (+10).
  - Participation: accepted to a playtest (+2), playtest completed (+10).
  - Review: approved by a studio (+15), a detailed review (+5), and an optional studio bonus of up to +50.
- Reputation is unbounded. Levels are derived from thresholds: Newcomer (0), Rookie (25), Regular (60), Skilled (100), Veteran (160), Expert (250), Elite (400), Legend (600).

### Rewards on approval
When a studio approves a review, the tester can receive any combination of:
- **Reputation**: +15, plus an optional studio bonus of up to 50.
- **A game key**: taken from the game's key inventory. The tester is told to check their email; the studio sees which key went to which review.
- **Cash**: recorded as an entry in the tester's balance ledger. No payment provider is connected, so payout is handled outside the app.

Approval is final and happens once per review. If no key is left, nothing is written.

## Current limitations
- No payment, email, push, or realtime service is connected. Notifications are in-app only.
- AI covers the per-playtest feedback summary and the ranking of match lists. It needs a Gemini API key on the server. Without one, studios see an automatic summary, and match lists keep their rule-based order.
- No messaging between testers and developers.
- No admin dashboard.
- Uploaded files are stored on local disk in development; production file storage is not yet chosen.
- Matching is rule-based with optional AI re-ordering. It does not learn from outcomes yet; its weights are set by hand in the database.

## Planned, not built
- Production file storage for uploads.
- Production release on the hosted database.

## Development
Engineering conventions, architecture, and the API contract live in `AGENTS.md` and `docs/`. The API contract is `lib/types.ts`.
