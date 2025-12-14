# Hacker News App

A mobile application to browse Hacker News articles, built with React Native (Expo) and TypeScript.

## Features
- **Data Fetching**: Fetches articles related to "mobile" from Algolia HN API.
- **Offline Access**: Persists articles for offline viewing using `react-native-mmkv` and `zustand`.
- **Swipe to Delete**: Remove articles from the feed.
- **Favorites**: Save interesting articles.
- **Deleted View**: Restore deleted articles.
- **Notifications**: Background fetch for new articles matching user preferences.
- **Deep Linking**: Opens articles directly.

## Prerequisites
- Node.js > 18
- Yarn
- Expo Go app on device or Simulator

## Setup
1. Install dependencies:
   ```bash
   yarn install
   ```

2. Run the app:
   ```bash
   yarn start
   ```

3. Press `i` for iOS Simulator, `a` for Android Emulator, or scan QR code with Expo Go.

## Testing
To run unit tests:
```bash
yarn test
```

## Structure
- `app/services/api`: API integration (Algolia).
- `app/store`: State management (Zustand).
- `app/screens`: UI screens (Home, Detail, Favorites, Deleted, Preferences).
- `app/services/notifications`: Background fetch and notifications.
