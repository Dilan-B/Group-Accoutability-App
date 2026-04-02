# Lockd (Phase 1)

Lockd is a mobile accountability app built with Expo + React Native + Firebase.
This repository currently includes Milestone 0 + Milestone 1 + Milestone 2 foundations from `docs/PLAN_phase1.md`.

## Implemented so far

### Milestone 0
- Expo SDK 54 scaffold with Expo Go-compatible workflow
- Bottom tabs shell: Feed, Goals, Lock-in (placeholder), Squad/Profile
- Project structure + Firebase bootstrap files
- ESLint + Jest setup

### Milestone 1
- Firebase app/bootstrap through `firebase/client.js`
- Auth state management with Zustand (`src/features/auth/authStore.js`)
- Sign-in flow UI with phone-first option and email fallback (`src/features/auth/AuthScreen.js`)
- Profile create/edit for display name, avatar URL, and optional tagline (`src/features/profile/ProfileScreen.js`)
- `users/{uid}` profile document initialization on first successful auth
- Logout flow
- Guarded app navigation for signed-out vs signed-in users (`src/navigation/AppNavigator.js`)

### Milestone 2
- Create squad flow (private by default)
- Join squad by invite code
- Squad switcher and selected squad state
- Squad member list view with basic role display (`admin` / `member`)

## Deferred (not implemented yet)
- Goals and check-ins (Milestone 3+)
- Feed and reactions (Milestone 4+)
- Lock-in mode implementation
- Points / streaks
- Notifications
- Suggestions

## Requirements

- Node.js 20+
- npm 10+
- Android Studio and/or Xcode (for native dev-client builds)

## Install

```bash
npm install
```

## Environment variables

Create a `.env` file with:

```bash
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
```

## Run

```bash
npm run start
# scan QR code with Expo Go on iPhone
npm run android
npm run ios
```

## Quality checks

```bash
npm run lint
npm run test
npm run check
```
