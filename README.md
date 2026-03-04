# CricTalk 🏏

A cricket-focused social mobile application built with **React Native (Expo)** and **Appwrite**, where fans can discuss matches, join live match rooms, and compete on a community leaderboard.

---

## Features

- **Posts Feed** – Browse, search, and create cricket discussion posts. Pull-to-refresh, infinite scroll, and view tracking included.
- **Match Rooms** – Join or create rooms tied to cricket matches. Filter rooms by status: *All*, *Live*, *Upcoming*, or *Finished*.
- **Comments** – Engage in threaded discussions on any post.
- **Leaderboard** – See the top contributors ranked by message count, with a podium view for the top 3.
- **Notifications** – Push notification support via Expo Notifications.
- **Profile & Settings** – Manage your account, login/security preferences, and app preferences.
- **Authentication** – Email/password sign-up and login powered by Appwrite Auth.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Expo](https://expo.dev) (React Native) |
| Language | TypeScript |
| Navigation | [Expo Router](https://expo.github.io/router) (file-based) |
| Styling | [NativeWind](https://www.nativewind.dev) (Tailwind CSS) |
| State Management | [Zustand](https://zustand-demo.pmnd.rs) |
| Validation | [Zod](https://zod.dev) |
| Backend | [Appwrite](https://appwrite.io) (Auth, Database, Functions) |
| List Performance | [@legendapp/list](https://github.com/LegendApp/legend-list) |

---

## Project Structure

```
cric-talk/
├── app/
│   ├── (auth)/          # Login & Signup screens
│   ├── (tabs)/          # Bottom tab screens: Home, Rooms, Leaderboard
│   ├── (posts)/         # Post detail screen
│   ├── (rooms)/         # Room detail & management screens
│   ├── (profile)/       # Profile, Settings, Account screens
│   ├── (notifications)/ # Notifications screen
│   └── components/      # Shared UI components
├── services/            # Appwrite service calls (posts, rooms, auth, etc.)
├── store/               # Zustand global state stores
├── hooks/               # Custom React hooks
├── interfaces/          # TypeScript interfaces
├── schemas/             # Zod validation schemas
├── libs/                # Appwrite client & utility helpers
├── utils/               # Miscellaneous utilities
└── assets/              # Images, fonts, icons
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) (v18+)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- An [Appwrite](https://appwrite.io) project with the required collections and functions (see `.env.example`)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/swapnasahoo/cric-talk.git
cd cric-talk

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
# Edit .env.local and fill in your Appwrite credentials
```

### Environment Variables

Copy `.env.example` to `.env.local` and provide the following values:

| Variable | Description |
|---|---|
| `EXPO_PUBLIC_APPWRITE_API_ENDPOINT` | Your Appwrite API endpoint |
| `EXPO_PUBLIC_APPWRITE_PROJECT_ID` | Your Appwrite project ID |
| `EXPO_PUBLIC_APPWRITE_CRIC_TALK_DATABASE_ID` | Database ID |
| `EXPO_PUBLIC_APPWRITE_POSTS_TABLE_ID` | Posts collection ID |
| `EXPO_PUBLIC_APPWRITE_POSTS_GUARD_FUNCTION_ID` | Posts guard function ID |
| `EXPO_PUBLIC_APPWRITE_COMMENTS_TABLE_ID` | Comments collection ID |
| `EXPO_PUBLIC_APPWRITE_COMMENTS_GUARD_FUNCTION_ID` | Comments guard function ID |
| `EXPO_PUBLIC_APPWRITE_ROOMS_TABLE_ID` | Rooms collection ID |
| `EXPO_PUBLIC_APPWRITE_ROOMS_GUARD_FUNCTION_ID` | Rooms guard function ID |
| `EXPO_PUBLIC_APPWRITE_ROOM_MESSAGE_TABLE_ID` | Room messages collection ID |
| `EXPO_PUBLIC_APPWRITE_ROOM_MESSAGE_GUARD_FUNCTION_ID` | Room messages guard function ID |
| `EXPO_PUBLIC_APPWRITE_USERS_TABLE_ID` | Users collection ID |
| `EXPO_PUBLIC_APPWRITE_USER_PUSH_TOKEN_GUARD_FUNCTION_ID` | Push token guard function ID |
| `EXPO_PUBLIC_APPWRITE_LEADERBOARD_GUARD_FUNCTION_ID` | Leaderboard guard function ID |
| `EXPO_PUBLIC_NOTIFICATIONS_GUARD_FUNCTION_ID` | Notifications guard function ID |

### Running the App

```bash
# Start the Expo development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on Web
npm run web
```

### Linting

```bash
npm run lint
```

---

## Building for Production

This project uses [EAS Build](https://docs.expo.dev/build/introduction/) for production builds. See `eas.json` for build profiles.

```bash
# Install EAS CLI
npm install -g eas-cli

# Build for Android
eas build --platform android --profile production

# Build for iOS
eas build --platform ios --profile production
```

---
