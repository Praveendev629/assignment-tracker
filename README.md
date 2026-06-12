# Assignment Tracker v2 — Fixed

## What was fixed in this version

### Fix 1 — App crash on launch (MAIN FIX)
- `package.json` had `"main": "expo-router/entry"` but the app uses `App.tsx` with React Navigation
- Changed to `"main": "node_modules/expo/AppEntry.js"` — the correct entry for standard Expo apps

### Fix 2 — Firebase initialization crash
- Firebase now uses `getApps().length === 0` check to prevent duplicate initialization on hot reload
- All env vars fall back to empty strings instead of `undefined` to prevent crashes

### Fix 3 — Google Sign-In error handling
- Added proper `statusCodes` handling (cancelled, in progress, play services unavailable)
- Added `signOut()` before `signIn()` to clear stale cached accounts
- Removed `expo-router` dependency (was not used, caused entry point conflict)

### Fix 4 — App-level Error Boundary
- Added React `ErrorBoundary` class component wrapping the entire app
- If anything crashes, shows a readable error screen instead of crashing silently

---

## Quick Start

### Backend
```bash
cd backend
cp .env.example .env   # fill in your values
npm install
npm run dev
```

### Frontend
```bash
cd frontend
cp .env.example .env   # fill in your values
npm install
eas login
eas build:configure
eas build --platform android --profile preview
```

### eas.json profile for APK
```json
{
  "build": {
    "preview": {
      "android": { "buildType": "apk" },
      "distribution": "internal"
    },
    "production": {
      "android": { "buildType": "app-bundle" }
    }
  }
}
```

Place your logo at: `frontend/assets/logo.png` (1024x1024 PNG recommended)
