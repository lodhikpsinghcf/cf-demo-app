# CF Demo App — Project Guide

A production-ready React Native (Expo) demo app showcasing ContentFlow SDK integration. Used as a reference implementation for vendors and for SDK testing.

## Quick Start

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start with tunnel (works across networks)
npx expo start --tunnel --clear

# Or start locally (same WiFi required)
npx expo start --clear
```

Scan QR code with Expo Go app on iOS/Android.

## Architecture

**Stack:** Expo SDK 57, React Native 0.86.3, React 19.2.3, TypeScript, expo-router

**Key Files:**
- `providers/ContentFlowProvider.tsx` — SDK integration (identify, events, consent, sync)
- `components/CFSlot.tsx` — Dynamic content slot component
- `components/ConsentModal.tsx` — Privacy & permissions consent popup
- `app/index.tsx` — Welcome/onboarding screen
- `app/(auth)/sign-in.tsx` — Sign in screen
- `app/(auth)/sign-up.tsx` — Sign up screen with consent flow
- `app/(tabs)/*.tsx` — Screen implementations (Home, Wallet, Travel, Food, Settings)
- `app/_layout.tsx` — Root layout with ContentFlowProvider wrapper

## Authentication Flow

1. **Welcome Screen** (`app/index.tsx`)
   - Shows on first launch
   - Features overview
   - "Get Started" → Consent Modal → Sign Up
   - "Sign In" → Sign In screen
   - "Continue as Guest" → Main app

2. **Consent Modal** (`components/ConsentModal.tsx`)
   - Privacy & permissions popup
   - Toggles: Marketing, Push, Location, Email, SMS
   - Accept All / Accept Selected / Decline All

3. **Sign Up** (`app/(auth)/sign-up.tsx`)
   - Name, Email, Phone (optional), Password
   - Terms & Conditions checkbox
   - Shows consent modal after signup

4. **Sign In** (`app/(auth)/sign-in.tsx`)
   - Email & Password login
   - Social login placeholders (Google, Apple)
   - "Forgot Password" link

## SDK Configuration

Environment variables in `.env`:
```
EXPO_PUBLIC_CF_BASE_URL=https://api.contentflow.click
EXPO_PUBLIC_CF_TENANT_ID=ws_7d0194ac4b94287a59342f21
EXPO_PUBLIC_CF_SDK_KEY=ws_7d0194ac4b94287a59342f21_test
EXPO_PUBLIC_CF_WRITE_KEY=ws_7d0194ac4b94287a59342f21_write
EXPO_PUBLIC_CF_READ_KEY=ws_7d0194ac4b94287a59342f21_read
```

## SDK Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/sdk/v1/identify` | POST | Register device, set userId, update traits |
| `/sdk/v1/events` | POST | Track events (impressions, taps, custom) |
| `/sdk/v1/consent` | POST | Update granular consent (push/sms/email/location) |
| `/sdk/v1/sync` | GET | Fetch dynamic content for slots |
| `/sdk/v1/register-push` | POST | Register FCM/APNs push token |

## Dynamic Content Slots (28 total)

| Screen | Slot IDs |
|--------|----------|
| Home (10) | `home-stories`, `home-hero`, `home-inline-1`, `home-inline-2`, `home-promo`, `home-countdown`, `home-featured`, `home-services-promo`, `home-carousel`, `home-fullwidth`, `home-bottom` |
| Wallet (8) | `wallet-promo`, `wallet-upgrade`, `wallet-card-offers`, `wallet-insights`, `wallet-rewards`, `wallet-cashback`, `wallet-goals`, `wallet-bottom` |
| Travel (8) | `travel-flash`, `travel-hero`, `travel-spotlight`, `travel-promo`, `travel-lastminute`, `travel-hotels`, `travel-miles`, `travel-bottom` |
| Food (7) | `food-flash`, `food-hero`, `food-promo`, `food-recommended`, `food-cuisines`, `food-cuisine-grid`, `food-rewards`, `food-bottom` |

### Supported Block Types

| Type | Description | Key Properties |
|------|-------------|----------------|
| `banner` / `hero` | Full-width promotional banner | `title`, `subtitle`, `imageUrl`, `backgroundColor`, `gradientEnd`, `badge`, `cta` |
| `card` | Horizontal card with image | `title`, `description`, `imageUrl`, `cta` |
| `promo` / `inline` | Compact promotional strip | `title`, `subtitle`, `icon`, `imageUrl`, `backgroundColor`, `cta` |
| `reward` | Points/rewards display | `title`, `value`, `icon`, `cta` |
| `carousel` | Horizontal scrolling cards | `items[]` with `title`, `subtitle`, `imageUrl`, `url` |
| `story` | Instagram-style circles | `items[]` with `title`, `imageUrl`, `icon`, `hasNew`, `url` |
| `grid` | 2x2 or 3x3 tile grid | `items[]`, `columns` (default: 2) |
| `countdown` | Time-limited offer with timer | `title`, `subtitle`, `hours`, `minutes`, `seconds` |
| `fullwidth` | Edge-to-edge large banner | `title`, `subtitle`, `imageUrl`, `badge`, `cta` |
| `spotlight` | Featured item with side image | `title`, `description`, `imageUrl`, `badge`, `cta` |

Slots show placeholders until content is configured in ContentFlow dashboard → Dynamic Blocks.

## useContentFlow() Hook API

```typescript
const {
  // State
  isReady,        // boolean - SDK initialized
  isInitializing, // boolean - SDK currently initializing
  isOnline,       // boolean - network connectivity status
  deviceId,       // string | null - unique device ID
  userId,         // string | null - logged-in user ID
  consent,        // ConsentOptions - {marketing, push, sms, email, locationTracking}
  content,        // Record<string, BlockContent> - synced content by slot
  config,         // SDK configuration from env
  error,          // string | null - last error
  liveStatus,     // LiveStatus - {isOnline, queueSize, lastSyncTime, pendingEvents}
  
  // Methods
  identify,       // (userId?, traits?) => Promise<void>
  setUserId,      // (id) => Promise<void>
  setConsent,     // (options) => Promise<void>
  trackEvent,     // (type, data?) => void - queued with offline support
  trackSignUp,    // (userId, traits?) => void
  trackSignIn,    // (userId) => void
  sync,           // () => Promise<void>
  registerPush,   // (token) => Promise<void>
  getSlotContent, // (slotId) => BlockContent | null
  reset,          // () => Promise<void> - clear all SDK data
  flushEvents,    // () => Promise<void> - manually flush event queue
  getQueueSize,   // () => number - get pending events count
} = useContentFlow();
```

### Production SDK Features

| Feature | Default | Description |
|---------|---------|-------------|
| Offline Queue | Enabled | Events queued when offline, auto-flushed on reconnect |
| Max Queue Size | 100 | Oldest events dropped when queue is full |
| Event Batching | 10 events | Events batched before sending |
| Flush Interval | 15 seconds | Auto-flush timer for pending events |
| Rate Limiting | 10/second | Token bucket rate limiter |
| Retry Attempts | 3 | Exponential backoff retries |
| Industry Config | banking | Passed to all SDK endpoints |

## Testing the SDK

### Manual Testing (Settings Tab)
1. Check "SDK Status" shows ✅ Connected
2. Tap "Send Test Event" → should show success
3. Tap "Force Sync Content" → should complete
4. Toggle consent switches → updates sent to API
5. Set User ID → persists across app restarts

### Verify in ContentFlow Dashboard
1. https://app.contentflow.click → Analytics → check events appear
2. Audience → People → verify device registered

### API Testing
```bash
# Test identify
curl -X POST https://api.contentflow.click/sdk/v1/identify \
  -H "Content-Type: application/json" \
  -H "X-CF-Key: ws_7d0194ac4b94287a59342f21_test" \
  -d '{"deviceId": "test-123", "platform": "ios"}'

# Test events
curl -X POST https://api.contentflow.click/sdk/v1/events \
  -H "Content-Type: application/json" \
  -H "X-CF-Key: ws_7d0194ac4b94287a59342f21_test" \
  -d '{"deviceId": "test-123", "events": [{"type": "test_event"}]}'
```

## Events Tracked by the App

| Event | Screen | Trigger |
|-------|--------|---------|
| `onboarding_consent_completed` | Welcome | User completes consent modal |
| `onboarding_skipped` | Welcome | User taps "Continue as Guest" |
| `sign_up_completed` | Sign Up | Successful account creation |
| `sign_up_attempt` | Sign Up | Social sign up button tap |
| `sign_in_completed` | Sign In | Successful login |
| `sign_in_attempt` | Sign In | Social sign in button tap |
| `quick_action` | Home | Tap Send/Request/Travel/Food buttons |
| `wallet_action` | Wallet | Tap Add Money/Send/Withdraw |
| `flight_search` | Travel | Tap Search Flights |
| `restaurant_tap` | Food | Tap any restaurant |
| `impression` | All | When a CFSlot renders content |
| `tap` | All | When user taps a CFSlot |
| `test_event` | Settings | Tap "Send Test Event" |

## Known Issues / Gotchas

1. **Web CORS** — Running `--web` mode blocks API calls due to CORS. Use native (Expo Go) for full testing.
2. **Legacy peer deps** — Always use `npm install --legacy-peer-deps` due to React 19 peer conflicts.
3. **Tunnel mode** — Use `--tunnel` if phone is on different WiFi than dev machine.
4. **Cache issues** — If weird errors, run `npx expo start --clear` or delete `node_modules/.cache`.

## Improvement Ideas

- [ ] Add unit tests with Jest + React Native Testing Library
- [ ] Add E2E tests with Detox or Maestro
- [ ] Implement push notification handling (currently only registers token)
- [ ] Add deep linking support for campaign URLs
- [x] Add offline mode / queue events when offline ✅
- [ ] Add A/B test variant tracking
- [ ] Implement real images instead of emoji placeholders
- [x] Add pull-to-refresh for content sync ✅
- [x] Add skeleton loaders while syncing ✅
- [x] Expand dynamic content slots (16 → 28) ✅
- [x] Add new block types (carousel, story, grid, countdown, fullwidth, spotlight) ✅

## Related Repositories

- **ContentFlow Platform**: `lodhikpsinghcf/contentflow-render` — Backend services + WebApp
- **ContentFlow SDK (TypeScript)**: `contentflow-render/contentflow-sdk/` — Core SDK source

## Deployment

For production builds:
```bash
# Build for iOS
eas build --platform ios

# Build for Android  
eas build --platform android
```

Requires EAS CLI (`npm install -g eas-cli`) and Expo account.
