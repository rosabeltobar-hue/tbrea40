# Copilot instructions — tbrea40

## Quick context
**T-Break** is a React + TypeScript PWA with Capacitor for mobile (Android). It's a mental health/wellness app supporting offline-first architecture with Firebase backend.
- Entry: `src/index.tsx` → `src/App.tsx` (router)
- Pages: `src/pages/*` (e.g. `Dashboard.tsx`, `Profile.tsx`, `Donations.tsx`)
- Services: `src/services/*` (API/network layer, Firebase wrappers)
- Contexts: `src/context/*` (global state via React Context)
- Types: `src/types.ts` (shared TypeScript interfaces)

## Architecture patterns

### State management
- **UserContext** (`src/context/UserContext.tsx`): Provides `authUser` (Firebase Auth), `profile` (Firestore user doc), and legacy `user` field. Access via `useUser()` hook.
- **OfflineContext** (`src/context/OfflineContext.tsx`): Tracks `isOnline`, `pendingChangesCount`, `isSyncing`. Access via `useOfflineContext()`.
- **SubscriptionContext** and **ThemeContext** also available in `src/context/`.
- Pattern: Create contexts under `src/context/`, export provider component + custom hook.

### Offline-first architecture
- IndexedDB stores daily entries locally (`src/services/offline.ts` has full API: `saveDailyEntryOffline`, `getDailyEntryOffline`, `queueOfflineChange`).
- Service Worker (`public/service-worker.js`) handles caching (cache-first for assets, network-first for API calls) and background sync.
- Pending changes queued in IndexedDB `pending-changes` store, synced when online via `syncPendingChanges()`.
- **Critical**: When adding network calls, always check `checkNetworkStatus()` and queue offline changes via `queueOfflineChange()` (see `src/services/donations.ts` for pattern).

### Authentication & routing
- Firebase Auth initialized in `src/firebase.ts` (exports `auth`, `db`).
- Auth state managed by `UserContext` via `listenToAuthChanges()` from `src/services/auth.ts`.
- Protected routes use `RequireAuth` component in `src/App.tsx` (wraps children, redirects to `/login` if not authenticated).
- Router uses `react-router-dom` v7 with basename handling for production (`/tbrea40`) vs dev (`/`).

### Services layer
All `src/services/*.ts` files export named functions. Key services:
- `auth.ts`: `signUp()`, `signIn()`, `logout()`, `listenToAuthChanges()`
- `user.ts`: User CRUD operations (some placeholder implementations)
- `offline.ts`: IndexedDB wrappers for offline support
- `donations.ts`: Stripe/RevenueCat integration (queues if offline)
- `notifications.ts`: FCM push notification handling
- `firestore.ts`: Firestore helper wrappers

## Build & deployment workflows

### Web development
```bash
npm start              # Dev server (port 3000, react-scripts)
npm run build          # Production build → build/
npm test               # Jest tests via react-scripts
```

### Mobile (Android via Capacitor)
```bash
npm run build          # Build web assets first
npx cap copy android   # Copy to android/app/src/main/assets/
npx cap sync android   # Sync plugins and dependencies
cd android && ./gradlew bundleRelease  # Build AAB for Play Store
```
- Capacitor config: `capacitor.config.json` (appId: `com.tbreak.app`, webDir: `build`)
- Android project lives in `android/` (Gradle-based, requires Android Studio)
- See `ANDROID-BUILD-GUIDE.md` for release signing setup (keystore, gradle.properties)
- Firebase Cloud Messaging configured via `@capacitor-firebase/messaging` plugin
- **iOS not currently configured** — project supports Android only at this time

### Deployment shortcuts
```bash
./deploy.sh web        # Deploy web app to Firebase Hosting
./deploy.sh functions  # Deploy Cloud Functions only
./deploy.sh rules      # Deploy Firestore/Storage security rules
./deploy.sh android    # Build Android AAB for Play Store
./deploy.sh all        # Deploy web + functions + rules
```

### Firebase hosting & functions
```bash
firebase deploy --only hosting    # Deploy web app to tbreakapp.web.app
firebase deploy --only functions  # Deploy Cloud Functions (RevenueCat webhooks)
cd functions && npm run build     # Compile TypeScript functions
```
- Config: `firebase.json` (hosting from `build/`, functions from `functions/`)
- Functions handle RevenueCat webhooks for subscription management (see `functions/README.md`)
- Firestore rules: `firestore.rules`, Storage rules: `storage.rules`

## Critical conventions

### TypeScript types
- All interfaces defined in `src/types.ts` (User, DailyEntry, Subscription, NotificationPreferences, etc.)
- User model includes subscription tiers (`plan: "free" | "0.99" | "3" | "10"`), usage tracking, gamification fields
- **Always** import types from `src/types` rather than redefining inline

### Firebase integration
- Config via env vars: `REACT_APP_FIREBASE_API_KEY`, `REACT_APP_FIREBASE_AUTH_DOMAIN`, etc.
- **Never** hardcode Firebase config in code — use `process.env.REACT_APP_FIREBASE_*`
- Firestore operations should go through `src/services/` wrappers, not directly in components
- Auth state: `UserContext` automatically syncs Firestore user doc with auth changes
- See `.env.example` for complete list of required environment variables

### Testing
- Test infrastructure configured via `react-scripts test` (Jest)
- **35 unit tests implemented** — 100% passing (35/35)
- Test files in `src/**/*.test.{ts,tsx}` and `src/__tests__/integration/`
- Coverage: Context layer 87%, Auth services 100%, overall baseline 9%
- Test breakdown:
  - UserContext: 11 tests (auth state, profile sync, loading states)
  - OfflineContext: 4 tests (network status, pending changes, provider validation)
  - Auth services: 7 tests (signUp, signIn, logout, auth listener)
  - Offline services: 3 tests (IndexedDB CRUD, pending changes queue)
  - Donations: 5 tests (Stripe/RevenueCat integration, offline queueing)
  - Integration: 11 tests (full offline-first sync workflow)
- For Firebase/offline testing, mock `src/services/*` functions
- Run tests: `npm test` or `npm test -- --coverage` for coverage report
- Android build validation: `./test-android-build.sh`
- **Note**: Page component tests (`*.test.tsx.skip`) disabled due to react-router-dom v7 Jest compatibility issues. Tests exist as reference templates for future use when Jest ESM support improves.

### Service Worker & PWA
- Service worker registered in `public/service-worker.js` (not generated by CRA)
- Manifest: `public/manifest.json` (PWA configuration)
- Background sync via `registration.sync.register("sync-offline-data")` when coming online
- **Do not** use Workbox in components; use IndexedDB via `offline.ts` service

## Common tasks

### Add a new page
1. Create `src/pages/NewPage.tsx` (default export component)
2. Add route in `src/App.tsx`: `<Route path="/new" element={<NewPage />} />`
3. Wrap with `<RequireAuth>` if auth required
4. Use `useNavigate()` or `<Link>` from `react-router-dom` for navigation

### Add an API call with offline support
1. Create/update service file (e.g. `src/services/example.ts`)
2. Check network: `const isOnline = await checkNetworkStatus();`
3. If offline, queue: `await queueOfflineChange("/api/endpoint", "POST", data);`
4. If online, use `fetch()` or Firebase SDK directly
5. Return appropriate response/error (see `donations.ts` for pattern)

### Update global state
1. Create/modify context in `src/context/` (e.g. `ExampleContext.tsx`)
2. Export provider component and custom hook (`useExample`)
3. Wrap `<App>` in provider (in `src/index.tsx` or `src/App.tsx`)
4. Consume via hook in pages/components

### Work with RevenueCat subscriptions
- Cloud Functions in `functions/` handle webhooks
- Frontend calls functions via `src/services/donations.ts`
- Configure secrets: `firebase functions:config:set revenuecat.api_key=...`
- User subscription synced to `users/{uid}` Firestore doc (`.plan`, `.planExpiresAt`)

## Integration points

### External services
- **Firebase**: Auth, Firestore, Cloud Functions, Hosting, Cloud Messaging
- **RevenueCat**: Subscription management (iOS/Android in-app purchases)
- **Stripe**: Web-based donations (handled by Cloud Functions)
- Environment-based URLs: `REACT_APP_DONATION_FUNCTION_URL` defaults to `https://us-central1-proj2aaf5898.cloudfunctions.net/donations`

### Cross-cutting concerns
- Notifications: `useNotifications(userId)` hook initializes FCM, stores token in Firestore
- Offline status: `<OfflineBanner>` component shows connection state (rendered in `App.tsx`)
- Theme: `ThemeContext` (if used, check `src/context/ThemeContext.tsx`)

## Where to look first
- `src/App.tsx` — routing, auth flow, context providers
- `src/context/UserContext.tsx` — auth state + Firestore user sync
- `src/services/offline.ts` — offline architecture implementation
- `src/types.ts` — data models
- `capacitor.config.json` + `android/` — mobile app config
- `firebase.json` + `functions/` — backend deployment config
- `ANDROID-BUILD-GUIDE.md` — release build instructions

## AI agent behavior expectations
- **Offline-first**: Always consider offline scenarios for network operations
- **Type safety**: Use existing types from `src/types.ts`, avoid `any`
- **Service layer**: Network code belongs in `src/services/`, not components
- **Minimal changes**: Update smallest set of files needed
- **Ask first**: For external API shapes, auth tokens, or unclear requirements
- **Environment vars**: Use `process.env.REACT_APP_*`, document required vars
- **Mobile considerations**: Changes affecting mobile require `npx cap sync android`

---
*Last updated: Auto-generated AI instructions for T-Break (tbrea40) codebase*
