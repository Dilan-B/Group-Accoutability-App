# AGENTS.md

## Repo contract

This repository is for **Lockd**, a mobile accountability app built with Expo + React Native + Firebase.

Codex should treat this file as the durable operating contract for the repo.
Keep changes small, verifiable, and aligned with `docs/PRD.md` and `docs/PLAN_phase1.md`.

## Primary objective

Build the Phase 1 social loop first:

1. auth + profile
2. squad creation + joining
3. goal creation
4. check-ins
5. squad feed + reactions

Do **not** start Lock-in mode, points, streak logic, push notifications, or growth tooling unless the active task explicitly asks for them.

## Tech choices

- Mobile app: Expo + React Native
- Expo version: use the latest stable Expo SDK available at implementation time
- Workflow: Expo Dev Client, not Expo Go
- Navigation: React Navigation v6
- State: Zustand
- Forms: React Hook Form
- Backend: Firebase Auth + Firestore + Cloud Functions
- Testing: Jest + React Native Testing Library
- Language: JavaScript for v1, with JSDoc in shared modules and utilities
- Styling: React Native Paper plus small custom components
- Animations: React Native Reanimated

## Deep link rule

Do not use Firebase Dynamic Links.

For invite flows:
- use invite codes immediately
- support native deep-link plumbing with iOS Universal Links and Android App Links
- use a simple web fallback page later if needed

## Phase 1 architecture rules

- All point calculation, streak logic, and anti-cheat business logic must live in Cloud Functions, never only on the client.
- The squad feed should be treated as a denormalized server-backed feed, not assembled client-side from many collections.
- Firestore timestamps are the source of truth.
- Every async screen must implement three states:
  - loading
  - data
  - error
- Check-ins and reactions should use optimistic UI when safe.
- Keep the repo structured by feature, not by giant screen dumps.

## Suggested repo structure

- `src/navigation/`
- `src/screens/`
- `src/features/auth/`
- `src/features/profile/`
- `src/features/squads/`
- `src/features/goals/`
- `src/features/checkins/`
- `src/features/feed/`
- `src/components/`
- `src/lib/`
- `src/state/`
- `src/theme/`
- `src/types/`  (for JSDoc typedefs / shared shapes)
- `firebase/`   (client config)
- `functions/`  (Cloud Functions)
- `docs/`

## Script contract

If missing, create and maintain these scripts in `package.json`:

- `start`: `expo start --dev-client`
- `android`: `expo run:android`
- `ios`: `expo run:ios`
- `lint`
- `test`
- `check`: runs lint + test

Prefer commands that already exist in the repo. If a lockfile exists, honor it.

## Dependency rules

- Prefer Expo-compatible packages.
- Do not add heavy dependencies unless they clearly save time or reduce risk.
- Avoid duplicate libraries for the same job.
- Do not introduce Redux, Expo Router, or a custom backend in Phase 1.

## Definition of done for any task

A task is not done unless all of these are true:

1. The implementation matches the active milestone in `docs/PLAN_phase1.md`
2. Lint passes
3. Tests pass or meaningful tests were added for the new logic
4. No obvious dead code or placeholder TODOs remain for the task
5. Any new scripts, env vars, or setup steps are documented in `README.md`

## Working style

- Read the relevant docs file before changing code.
- Make the smallest useful change that advances the milestone.
- Prefer clear code over clever code.
- If a validation command fails, fix that before moving on.
- When making a tradeoff, choose faster delivery for the core social loop over completeness.
- Do not silently drift into future milestones.
