# Lockd PRD
Updated Codex-ready product brief

## 1. Product summary

Lockd is a mobile group accountability app where friends form private squads, create personal goals, track progress in public-to-the-squad, and use lightweight social pressure to stay consistent.

The product should feel like:
- a friend-group accountability layer
- a simple habit tracker
- a focus app for intentional sessions
- a dopamine-heavy but not punishing feedback loop

## 2. Core insight

Solo productivity apps fail because there is no real social cost for quitting.

Lockd works because:
- your progress is visible to people you know
- your friends can push you to set harder goals
- your squad can see momentum or slacking in real time
- the group is rewarded together

## 3. Target users

### Primary
- high school and college students
- friend groups of 2 to 8
- people trying to be more consistent with studying, fitness, or creative work

### Secondary
- roommates
- off-season athletic teams
- coworkers or friends doing side projects together

## 4. Product goals

### P0
- users complete goals more consistently
- squads stay active after week 1
- the app feels fast enough to use daily
- the social loop is strong enough that users invite friends

### P1
- users trust Lock-in mode
- goal suggestions become a real behavior, not a gimmick
- group points increase return usage without creating guilt

## 5. MVP product principles

- high accountability, low shame
- private by default
- progress logging must be extremely fast
- the home screen should instantly show squad activity
- missing one day should not make the app feel dead
- the social loop must work before advanced mechanics are layered on top

## 6. MVP scope

### 6.1 Auth and profile
Users can:
- sign up with phone number
- use email fallback
- set display name
- set avatar
- optionally add a short tagline

### 6.2 Squads
Users can:
- create a squad
- join a squad by invite code
- share squad invite
- view squad members
- switch between squads
- belong to up to 3 squads
- squads should be private by default

### 6.3 Goals
Users can:
- create daily or weekly goals
- set title, description, optional target value, optional unit
- pause or archive a goal
- have goals visible to the selected squad
- keep up to 8 active goals per squad

### 6.4 Check-ins
Users can:
- one-tap mark complete
- optionally add note
- optionally add photo
- optionally log numeric progress

Rules:
- daily goals reset at local midnight
- weekly goals reset Monday 00:00 local time
- missed check-ins are visible as missing

### 6.5 Squad feed
The squad feed is the core home screen.

Feed items:
- goal completion
- check-in note/photo
- suggestion received / resolved
- lock-in session completion later
- milestone cards later
- system events

Reactions:
- fire
- flex
- clap
- 100

Comments are allowed, but keep the first implementation shallow and simple.

### 6.6 Goal suggestions
This is a differentiator.

A squad member can suggest a harder version of someone else’s goal.
The owner can:
- accept
- modify then accept
- decline

Rules:
- suggestions are visible to the squad
- no silent overwrites
- max 1 pending suggestion per goal

### 6.7 Group points
Not Phase 1.

Points are shared at squad level and are mostly for feedback and momentum.
They should not be treated like money or deep gamification.
Points and streak logic must live in Cloud Functions.

### 6.8 Lock-in mode
Not Phase 1 implementation.

Lock-in mode is a focus session that blocks distracting apps while explicitly allowing music and audio apps.

Product rules:
- social apps blocked by default
- music apps always exempt
- user can customize blocklist and allowlist
- session can end early with friction
- emergency override exists
- force-quit should not silently disable session behavior

Important:
Lock-in mode is the hardest feature and should be approached as a separate native-heavy phase after the social loop is already working.

## 7. Screen map

Bottom tabs:

1. Feed
2. Goals
3. Lock-in
4. Squad / Profile

Phase 1 should fully implement:
- Feed
- Goals
- Squad / Profile

Lock-in tab may exist as a placeholder shell in Phase 1, but not as a working feature.

## 8. Technical direction

### App
- Expo + React Native
- React Navigation v6
- Zustand
- React Hook Form
- React Native Paper
- Reanimated

### Backend
- Firebase Auth
- Firestore
- Firebase Cloud Functions
- Firebase Storage for user-uploaded images in v1

### Data model summary
Top-level collections:
- `users`
- `squads`
- `lockin_sessions`

Nested squad collections:
- `goals`
- `checkins`
- `suggestions`
- `reactions`
- `feed`

### Architecture rules
- server is source of truth for derived squad stats
- feed should be denormalized for fast rendering
- security rules must enforce squad membership
- Cloud Functions own derived writes such as points and streaks

## 9. Deep linking and invites

Do not use Firebase Dynamic Links.

Invite strategy:
- Phase 1: invite code and in-app join flow
- Later: native iOS Universal Links + Android App Links
- Optional later fallback: simple web join page that hands off to the app

Install-aware referral growth matters, but it is not the first thing to implement.

## 10. Phase breakdown

### Phase 1
- auth + profile
- squad creation + joining
- goal creation and editing
- check-ins
- squad feed
- reactions
- basic README and setup docs
- basic tests

### Phase 2
- native Lock-in mode spike and prototype
- permission flows
- iOS Screen Time integration
- Android foreground-service / usage-based blocking strategy
- active session state visible to squad

### Phase 3
- points
- streaks
- suggestion polish
- notifications
- onboarding polish

### Phase 4
- beta hardening
- analytics
- legal pages
- store assets
- growth loops

## 11. Explicit out of scope for Phase 1

- working Lock-in mode
- points and streaks
- push notifications
- public squads
- DMs
- leaderboards
- premium tier
- web app
- AI goal generation
- scheduled Lock-in
- location-triggered Lock-in

## 12. Phase 1 success criteria

Phase 1 is successful if a real group of 3 to 5 users can:
- install the app
- sign in
- create or join a squad
- create goals
- check in daily
- react to each other
- naturally understand what to do next without explanation

If that social loop does not feel sticky, do not move on to Lock-in mode yet.
