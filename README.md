# Lockd (Phase 1)

Lockd is a mobile accountability app built with Expo + React Native + Firebase.
This repository currently contains **Milestone 0** bootstrap work from `docs/PLAN_phase1.md`.

## Milestone 0 status

Implemented:
- Expo SDK 55 project scaffold with Expo Dev Client workflow
- Bottom tabs with placeholder screens only:
  - Feed
  - Goals
  - Lock-in (placeholder only)
  - Squad / Profile
- Phase-1 folder structure (`src/features/*`, navigation, shared modules, `firebase/`, `functions/`)
- Firebase config bootstrap file using `EXPO_PUBLIC_*` variables
- ESLint and Jest (with `jest-expo`) setup

Deferred on purpose (not in Milestone 0):
- Lock-in mode implementation
- Points / streaks
- Notifications
- Suggestion flows

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

## Expo Dev Client workflow

Start Metro for dev client:

```bash
npm run start
```

Build/run the native dev client:

```bash
npm run android
npm run ios
```

## Scripts

```bash
npm run lint
npm run test
npm run check
```

### Package alignment note

If you update Expo-managed packages, prefer Expo commands so versions stay SDK-compatible:

```bash
npx expo install expo-dev-client react-native react-native-gesture-handler react-native-reanimated react-native-safe-area-context react-native-screens expo-status-bar
```

