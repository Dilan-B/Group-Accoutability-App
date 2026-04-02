# PLAN_phase1.md

## Goal

Deliver a usable Phase 1 version of Lockd where a small real friend group can:
- sign up
- create or join a squad
- create goals
- check in
- see each other’s activity
- react in the squad feed

This plan deliberately excludes Lock-in mode, points, streaks, push notifications, and advanced onboarding.

## Stop rule

If validation fails at the end of a milestone:
1. stop
2. fix the failure
3. rerun validation
4. only then continue

Do not start the next milestone with a broken repo.

## Milestone 0: bootstrap the repo

### Tasks
- initialize Expo app with the latest stable SDK
- use Expo Dev Client workflow
- set up folder structure from `AGENTS.md`
- install and wire:
  - React Navigation v6
  - Zustand
  - React Hook Form
  - React Native Paper
  - Firebase client SDK
  - Jest
  - React Native Testing Library
  - ESLint
- add `start`, `android`, `ios`, `lint`, `test`, and `check` scripts
- create a simple tab shell:
  - Feed
  - Goals
  - Lock-in
  - Squad / Profile
- create placeholder screens for each tab
- document setup steps in `README.md`

### Acceptance criteria
- app boots successfully
- bottom tabs render
- lint passes
- tests pass
- README explains local setup and required env vars

### Validation
- `npm install`
- `npm run lint`
- `npm test`

## Milestone 1: auth and profile

### Tasks
- configure Firebase app bootstrap
- implement auth state management
- implement sign-in flow:
  - phone number preferred
  - email fallback
- implement profile creation/edit:
  - display name
  - avatar
  - optional tagline
- create `users/{uid}` document on first successful auth
- add logout flow
- add guarded navigation so signed-out users cannot access app tabs

### Acceptance criteria
- a new user can sign in and reach the app
- profile doc exists in Firestore
- signed-out user is redirected to auth flow
- profile edits persist

### Validation
- `npm run lint`
- `npm test`

## Milestone 2: squads

### Tasks
- implement create squad flow
- implement join squad by invite code flow
- store squad membership in Firestore
- support 2 to 8 member constraint in schema/service layer
- add squad switcher UI
- implement squad member list view
- implement basic role support:
  - creator is admin
- do not build install-aware deep linking yet
- do support shareable invite code text

### Acceptance criteria
- user can create a squad
- second user can join with invite code
- squad switching works for a user in multiple squads
- non-members cannot read private squad data in Firestore rules

### Validation
- `npm run lint`
- `npm test`

## Milestone 3: goals and check-ins

### Tasks
- implement goal CRUD for daily and weekly goals
- fields:
  - title
  - description
  - frequency
  - target_value
  - target_unit
  - is_active
  - squad_id
  - created_at
- enforce max 8 active goals per squad per user
- implement one-tap completion
- implement optional note and optional numeric progress
- support photo attachment only if it does not block milestone completion
- create check-in records in Firestore
- render user goal lists by selected squad

### Acceptance criteria
- user can create, edit, pause, archive goals
- user can check in against a goal
- goal state updates correctly in UI and Firestore
- local loading and error states exist

### Validation
- `npm run lint`
- `npm test`

## Milestone 4: squad feed and reactions

### Tasks
- implement feed rendering for selected squad
- first feed item types:
  - goal completed
  - check-in note
  - system event: squad created / joined
- create denormalized feed write path
- use optimistic UI for new check-ins when safe
- implement reactions:
  - fire
  - flex
  - clap
  - 100
- render basic comment count or placeholder, but full threaded comments are optional for Phase 1
- ensure feed updates without full app refresh

### Acceptance criteria
- a second user can see another member’s check-ins in the feed
- reactions persist
- feed ordering is correct
- empty, loading, and error states are all present

### Validation
- `npm run lint`
- `npm test`

## Milestone 5: hardening and handoff

### Tasks
- clean up placeholder code that is no longer needed
- review navigation flows for obvious dead ends
- improve loading/error states
- add seed/dev instructions to README if helpful
- add a short `docs/phase1_notes.md` with:
  - what is implemented
  - what is deferred
  - what technical debt exists

### Acceptance criteria
- repo is understandable to a new contributor
- phase boundaries are still respected
- README is enough to run the app locally

### Validation
- `npm run check`

## Explicit deferrals

Do not implement these during Phase 1:
- Lock-in mode native modules
- iOS Screen Time entitlements
- Android app blocking overlays
- points
- streaks
- push notifications
- suggestion system UI and backend
- leaderboard
- legal pages
- analytics integrations beyond tiny setup placeholders

## Notes for the agent

- Favor a real working social loop over completeness.
- Prefer a thin vertical slice over a perfect architecture.
- Avoid repo churn.
- If a requirement in this plan conflicts with `docs/PRD.md`, prefer the plan for Phase 1 execution and note the conflict in the final summary.
