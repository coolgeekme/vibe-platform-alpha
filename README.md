# Vibe Platform Alpha

A visual design + AI agent coding platform that integrates a live preview canvas with Claude Code and OpenAI Codex agents — now with mobile (Expo) support.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Next.js Frontend (port 3000)                           │
│  ┌──────────┐  ┌────────────────────┐  ┌────────────┐  │
│  │ Sidebar  │  │  Visual Editor     │  │            │  │
│  │ - Files  │  │  (iframe canvas)   │  │            │  │
│  │ - Agent  │  │                    │  │            │  │
│  │   Toggle │  └────────────────────┘  │            │  │
│  │          │  ┌────────────────────┐  │            │  │
│  │          │  │  Agent Terminal    │  │            │  │
│  │          │  │  (WebSocket I/O)   │  │            │  │
│  └──────────┘  └────────────────────┘  └────────────┘  │
└───────────────────────────┬─────────────────────────────┘
                            │ WebSocket
                            ▼
┌─────────────────────────────────────────────────────────┐
│  Express/Socket.io Server (port 4000)                    │
│  - spawns `claude` or `codex` CLI processes              │
│  - streams stdout/stderr back over WebSocket             │
└─────────────────────────────────────────────────────────┘
                            │ HTTP / WebSocket
                            ▼
┌─────────────────────────────────────────────────────────┐
│  Expo Mobile App (iOS / Android / Web)                   │
│  - Dashboard, Agent runner, Explore tabs                 │
│  - NativeWind (Tailwind) — same design tokens as web     │
│  - Expo Router (file-based routing)                      │
└─────────────────────────────────────────────────────────┘
```

## Prerequisites

- Node.js 18+ (recommended: 20 LTS)
- npm 9+
- (Optional) Claude Code CLI or OpenAI Codex CLI installed globally
- (Mobile) Expo Go app on your iOS/Android device, **or** an iOS/Android simulator

## Quick Start

### 1. Install dependencies

```bash
# Frontend dependencies
npm install

# Backend dependencies
cd server && npm install && cd ..

# Mobile dependencies
cd mobile && npm install && cd ..
```

### 2. Configure environment (optional)

Create a `server/.env` file for AI agent API keys:

```bash
CLAUDE_API_KEY=your_claude_key
OPENAI_API_KEY=your_openai_key
PORT=4000
```

### 3. Run the application

**Option A: Run web frontend + backend together**

```bash
npm run dev:all
```

**Option B: Run each service separately (recommended for development)**

```bash
# Terminal 1 — Next.js frontend (http://localhost:3000)
npm run dev

# Terminal 2 — Node.js backend (http://localhost:4000)
npm run server

# Terminal 3 — Expo mobile dev server
npm run mobile
```

**Option C: Run all three at once**

```bash
npm run dev:mobile
```

### 4. Open the mobile app

After `npx expo start` launches:

| Target | How to open |
|--------|-------------|
| **Physical device** | Scan the QR code with the **Expo Go** app |
| **iOS Simulator** | Press `i` in the Expo terminal |
| **Android Emulator** | Press `a` in the Expo terminal |
| **Web browser** | Press `w` in the Expo terminal |

### 5. Production build

```bash
# Build the Next.js frontend
npm run build

# Start Next.js production server
npm start

# Start backend
cd server && npm start

# Build Expo for production (requires EAS CLI)
cd mobile && npx eas build
```

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS, Lucide React, Socket.io Client
- **Backend**: Express.js, Socket.io
- **Mobile**: Expo ~51, Expo Router ~3.5, React Native 0.74, NativeWind ^4 (Tailwind for RN)
- **AI Agents**: Claude Code CLI, OpenAI Codex CLI (pluggable)
- **Styling**: Dark-mode cyberpunk minimalist (shared color tokens across web + mobile)

## Project Structure

```
vibe-platform-alpha/
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Main entry
│   │   └── globals.css       # Tailwind + custom styles
│   ├── components/
│   │   ├── Dashboard.tsx     # Main layout orchestrator
│   │   ├── Sidebar.tsx       # File explorer + agent toggle
│   │   ├── VisualEditor.tsx  # iframe preview canvas
│   │   └── AgentTerminal.tsx # WebSocket terminal
│   ├── hooks/
│   │   └── useSocket.ts      # Socket.io React hook
│   └── lib/                  # Shared utilities
├── mobile/                   # ← Expo React Native app
│   ├── app/
│   │   ├── _layout.tsx       # Root layout (fonts, splash)
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx   # Tab bar configuration
│   │   │   ├── index.tsx     # Dashboard tab
│   │   │   ├── agents.tsx    # Agent runner tab
│   │   │   └── explore.tsx   # Docs & links tab
│   │   └── +not-found.tsx    # 404 screen
│   ├── components/
│   │   ├── ThemedView.tsx    # Vibe-styled View wrapper
│   │   └── ThemedText.tsx    # Vibe-styled Text wrapper
│   ├── constants/
│   │   └── Colors.ts         # Raw color values (mirrors Tailwind tokens)
│   ├── app.json              # Expo config (name, slug, icons)
│   ├── babel.config.js       # Babel + NativeWind plugin
│   ├── metro.config.js       # Metro bundler + NativeWind
│   ├── tailwind.config.js    # Tailwind with vibe-* tokens
│   ├── global.css            # @tailwind directives entry
│   ├── tsconfig.json         # TypeScript config
│   └── package.json          # Mobile-specific deps
├── server/
│   ├── index.js              # Express + Socket.io server
│   ├── agents.js             # Agent spawner (claude/codex)
│   └── package.json
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
└── postcss.config.js
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server (port 3000) |
| `npm run build` | Build Next.js for production |
| `npm start` | Start Next.js production server |
| `npm run server` | Start Express/Socket.io backend (port 4000) |
| `npm run dev:all` | Run frontend + backend concurrently |
| `npm run mobile` | Start Expo mobile dev server |
| `npm run dev:mobile` | Run frontend + backend + mobile concurrently |

## NativeWind (Tailwind in React Native)

The mobile app uses **NativeWind v4** so you can write familiar Tailwind utility classes directly in React Native components:

```tsx
// Same vibe-* design tokens from the web app
<View className="bg-vibe-bg flex-1 px-4">
  <Text className="text-vibe-accent font-bold text-xl">
    Vibe Platform
  </Text>
</View>
```

All `vibe-*` color tokens (`vibe-bg`, `vibe-accent`, `vibe-surface`, etc.) are shared between `tailwind.config.ts` (web) and `mobile/tailwind.config.js` (mobile), keeping the design system consistent.

## License

MIT
