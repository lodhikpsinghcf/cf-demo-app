# ContentFlow SDK Demo App

A production-ready React Native demo application showcasing the ContentFlow SDK integration. This app serves as both a reference implementation and testing tool for SDK features.

## Features

- **Device Identification** - Automatic device registration and user identification
- **Event Tracking** - Sign-up, sign-in, and custom event tracking
- **Granular Consent** - Per-channel consent management (push, SMS, email, location)
- **Dynamic Content** - Real-time content delivery via slots
- **Push Notifications** - FCM/APNs token registration

## Quick Start

### Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator / Android Emulator or physical device
- ContentFlow workspace with SDK keys

### Installation

```bash
# Clone the repository
git clone https://github.com/lodhikpsinghcf/cf-demo-app.git
cd cf-demo-app

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

### Configuration

Edit `.env` with your ContentFlow credentials:

```env
# ContentFlow SDK Configuration
EXPO_PUBLIC_CF_BASE_URL=https://api.contentflow.click
EXPO_PUBLIC_CF_TENANT_ID=your_workspace_id
EXPO_PUBLIC_CF_SDK_KEY=your_sdk_key
CF_WRITE_KEY=your_write_key
EXPO_PUBLIC_CF_READ_KEY=your_read_key

# App Configuration
EXPO_PUBLIC_APP_NAME=My App
EXPO_PUBLIC_APP_VERSION=1.0.0
```

### Running

```bash
# Start Expo development server
npx expo start

# Run on iOS Simulator
npx expo run:ios

# Run on Android Emulator
npx expo run:android
```

---

## SDK Integration Guide

### 1. Provider Setup

Wrap your app with `ContentFlowProvider`:

```tsx
// App.tsx or _layout.tsx
import { ContentFlowProvider } from './providers/ContentFlowProvider';

export default function App() {
  return (
    <ContentFlowProvider>
      <YourApp />
    </ContentFlowProvider>
  );
}
```

### 2. Using the SDK Hook

```tsx
import { useContentFlow } from './providers/ContentFlowProvider';

function MyComponent() {
  const {
    isReady,           // SDK initialized
    deviceId,          // Unique device identifier
    userId,            // Current user ID (if set)
    consent,           // Consent preferences
    content,           // Dynamic content by slot
    
    // Methods
    identify,          // Identify device/user with traits
    setUserId,         // Set user ID
    setConsent,        // Update consent preferences
    trackEvent,        // Track custom event
    trackSignUp,       // Track sign-up event
    trackSignIn,       // Track sign-in event
    sync,              // Sync content from server
    registerPush,      // Register push token
    getSlotContent,    // Get content for a slot
    reset,             // Clear all SDK data
  } = useContentFlow();
  
  // Your component logic
}
```

### 3. User Identification

```tsx
// Identify anonymous user with traits
await identify(undefined, {
  tier: 'gold',
  region: 'riyadh'
});

// Identify logged-in user
await setUserId('user_12345');

// Identify with user ID and traits
await identify('user_12345', {
  tier: 'platinum',
  totalSpend: 5000
});
```

### 4. Event Tracking

```tsx
// Track sign-up
trackSignUp('user_12345', { referrer: 'email_campaign' });

// Track sign-in
trackSignIn('user_12345');

// Track custom events
trackEvent('purchase_completed', {
  orderId: 'ORD-123',
  amount: 299.99,
  currency: 'SAR'
});

trackEvent('product_viewed', {
  productId: 'SKU-456',
  category: 'electronics'
});
```

### 5. Consent Management

```tsx
// Set granular consent
await setConsent({
  marketing: true,
  push: true,
  sms: false,
  email: true,
  locationTracking: false
});

// Check consent status
if (consent.push) {
  // User has opted in to push notifications
}
```

### 6. Dynamic Content Slots

```tsx
import { CFSlot } from './components/CFSlot';

// Render content for a slot
<CFSlot 
  slotId="home-hero"
  fallback={<DefaultBanner />}
/>

// Or access content directly
const heroContent = getSlotContent('home-hero');
if (heroContent) {
  return <Banner {...heroContent} />;
}
```

### 7. Push Notification Registration

```tsx
import * as Notifications from 'expo-notifications';

async function registerForPush() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return;
  
  const token = await Notifications.getExpoPushTokenAsync();
  await registerPush(token.data);
}
```

---

## Content Slots

The app includes **16 slot IDs** for comprehensive dynamic content testing:

| Screen | Slot ID | Placement | Best For |
|--------|---------|-----------|----------|
| Home | `home-hero` | Top hero area | Hero banners, campaigns |
| Home | `home-inline-1` | After quick actions | Inline promos, tips |
| Home | `home-promo` | Mid-page | Offers, promotions |
| Home | `home-featured` | After transactions | Featured cards, upsells |
| Home | `home-bottom` | Page bottom | Announcements |
| Wallet | `wallet-promo` | After balance | Card upgrades, offers |
| Wallet | `wallet-card-offers` | After cards | Card-specific deals |
| Wallet | `wallet-rewards` | Before transactions | Rewards, points |
| Wallet | `wallet-bottom` | Page bottom | Insights, tips |
| Travel | `travel-hero` | After search form | Flight deals |
| Travel | `travel-promo` | After destinations | Weekend specials |
| Travel | `travel-hotels` | After trips | Hotel recommendations |
| Travel | `travel-bottom` | Page bottom | Travel guides |
| Food | `food-hero` | After categories | Delivery promos |
| Food | `food-promo` | After featured | Discount codes |
| Food | `food-cuisines` | After restaurants | Cuisine discovery |
| Food | `food-bottom` | Page bottom | Loyalty perks |

---

## API Reference

### ContentFlowProvider Props

| Prop | Type | Description |
|------|------|-------------|
| children | ReactNode | Child components |

### useContentFlow() Return Values

| Property | Type | Description |
|----------|------|-------------|
| isReady | boolean | SDK initialized and ready |
| isInitializing | boolean | SDK is currently initializing |
| deviceId | string \| null | Unique device identifier |
| userId | string \| null | Current user ID |
| consent | ConsentOptions | Current consent preferences |
| content | Record<string, BlockContent> | Content indexed by slot/key |
| config | ContentFlowConfig | Current SDK configuration |
| error | string \| null | Last error message |

### Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| identify | (userId?: string, traits?: UserTraits) => Promise<void> | Identify user with optional traits |
| setUserId | (id: string) => Promise<void> | Set user ID |
| updateTraits | (traits: UserTraits) => Promise<void> | Update user traits |
| setConsent | (options: ConsentOptions) => Promise<void> | Update consent preferences |
| trackEvent | (type: string, data?: object) => void | Track custom event |
| trackSignUp | (userId: string, traits?: UserTraits) => void | Track sign-up event |
| trackSignIn | (userId: string) => void | Track sign-in event |
| sync | () => Promise<void> | Sync content from server |
| registerPush | (token: string) => Promise<void> | Register push token |
| getSlotContent | (slotId: string) => BlockContent \| null | Get content for slot |
| reset | () => Promise<void> | Clear all SDK data |

### Types

```typescript
interface ConsentOptions {
  marketing?: boolean;
  push?: boolean;
  sms?: boolean;
  email?: boolean;
  locationTracking?: boolean;
}

interface UserTraits {
  [key: string]: string | number | boolean | undefined;
}

interface BlockContent {
  key: string;
  type: string;
  slotId?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  cta?: { label: string; url: string };
  [key: string]: any;
}
```

---

## SDK Events Tracked

- `impression` - When a content slot is viewed
- `tap` - When a content slot is tapped
- `sign_up` - User registration
- `sign_in` - User login
- `wallet_action` - Wallet interactions (add money, send)
- `flight_search` - Travel search actions
- `restaurant_tap` - Food restaurant selections
- `test_event` - Manual test from settings

---

## Project Structure

```
cf-demo-app/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx      # Home screen
│   │   ├── wallet.tsx     # Wallet category
│   │   ├── travel.tsx     # Travel category
│   │   ├── food.tsx       # Food category
│   │   └── settings.tsx   # Settings & SDK controls
│   └── _layout.tsx        # Root layout with provider
├── components/
│   └── CFSlot.tsx         # Dynamic content slot component
├── providers/
│   └── ContentFlowProvider.tsx  # SDK integration
├── .env.example           # Environment template
└── README.md              # This file
```

---

## Building for Production

```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

---

## Troubleshooting

### SDK not connecting

1. Verify `.env` values match your ContentFlow workspace
2. Check API endpoint is reachable
3. Ensure SDK key format is correct (`workspace_id_test` or `_live`)

### Content not loading

1. Call `sync()` after user identification
2. Check slot IDs match your ContentFlow configuration
3. Verify dynamic blocks are published and scheduled

### Events not tracking

1. Check consent is granted for marketing
2. Verify device is identified (`isReady === true`)
3. Check network connectivity

---

## Support

- Documentation: https://docs.contentflow.click
- API Reference: https://api.contentflow.click/docs
- Issues: https://github.com/lodhikpsinghcf/cf-demo-app/issues

---

Built with [Expo](https://expo.dev) and [ContentFlow](https://contentflow.click)
