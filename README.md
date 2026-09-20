# ContentFlow Demo App

A demo mobile app showcasing ContentFlow SDK integration for wallet, travel, and food categories.

## Features

- **Home** - Dashboard with SDK status, quick actions, and content slots
- **Wallet** - Balance, cards, transactions with promo slots
- **Travel** - Flight booking, destinations, trip tracking
- **Food** - Restaurant discovery, ordering with promotional content
- **Settings** - SDK configuration, consent management, debugging

## SDK Integration

The app demonstrates:
- Device identification (`/sdk/v1/identify`)
- Content sync (`/sdk/v1/sync`)
- Event tracking (`/sdk/v1/events`)
- Consent management (`/sdk/v1/consent`)
- Dynamic content slots (`CFSlot` component)

## Quick Start

```bash
# Install dependencies
npm install

# Start Expo
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## Configuration

Edit `app.json` to set your SDK key:

```json
{
  "expo": {
    "extra": {
      "contentflowApiKey": "pk_live_YOUR_KEY_HERE",
      "contentflowBaseUrl": "https://api.contentflow.click"
    }
  }
}
```

## Content Slots

The app includes these slot IDs for dynamic content:

| Screen | Slot ID | Type |
|--------|---------|------|
| Home | `home-hero` | Banner |
| Home | `home-promo` | Promo |
| Home | `home-bottom` | Card |
| Wallet | `wallet-promo` | Promo |
| Wallet | `wallet-bottom` | Card |
| Travel | `travel-hero` | Banner |
| Travel | `travel-promo` | Promo |
| Travel | `travel-bottom` | Card |
| Food | `food-hero` | Banner |
| Food | `food-promo` | Promo |
| Food | `food-bottom` | Card |

## Testing on Real Device

1. Install Expo Go on your phone
2. Run `npm start`
3. Scan the QR code with Expo Go

## Building for Production

```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

## SDK Events Tracked

- `impression` - When a content slot is viewed
- `tap` - When a content slot is tapped
- `wallet_action` - Wallet interactions (add money, send)
- `flight_search` - Travel search actions
- `restaurant_tap` - Food restaurant selections
- `test_event` - Manual test from settings

## Project Structure

```
cf-demo-app/
├── app/
│   ├── _layout.tsx          # Root layout with SDK provider
│   └── (tabs)/
│       ├── _layout.tsx      # Tab navigation
│       ├── index.tsx        # Home screen
│       ├── wallet.tsx       # Wallet screen
│       ├── travel.tsx       # Travel screen
│       ├── food.tsx         # Food screen
│       └── settings.tsx     # Settings screen
├── components/
│   └── CFSlot.tsx           # Dynamic content slot
├── providers/
│   └── ContentFlowProvider.tsx  # SDK context provider
├── app.json                 # Expo config
└── package.json
```
