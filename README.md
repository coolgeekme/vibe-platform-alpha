# Vibe Platform Alpha

A visual design + AI agent coding platform that integrates a live preview canvas with Claude Code and OpenAI Codex agents.

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
```

## Prerequisites

- Node.js 18+ (recommended: 20 LTS)
- npm 9+
- (Optional) Claude Code CLI or OpenAI Codex CLI installed globally

## Quick Start

### 1. Install dependencies

```bash
# Frontend dependencies
npm install

# Backend dependencies
cd server && npm install && cd ..
```

### 2. Configure environment (optional)

Create a `server/.env` file for AI agent API keys:

```bash
CLAUDE_API_KEY=your_claude_key
OPENAI_API_KEY=your_openai_key
PORT=4000
```

### 3. Run the application

**Option A: Run both frontend and backend together**

```bash
npm run dev:all
```

**Option B: Run separately (recommended for development)**

```bash
# Terminal 1 - Next.js frontend (http://localhost:3000)
npm run dev

# Terminal 2 - Node.js backend (http://localhost:4000)
npm run server
```

### 4. Production build

```bash
# Build the Next.js frontend
npm run build

# Start production server
npm start

# Start backend
cd server && npm start
```

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS, Lucide React, Socket.io Client
- **Backend**: Express.js, Socket.io
- **AI Agents**: Claude Code CLI, OpenAI Codex CLI (pluggable)
- **Styling**: Dark-mode cyberpunk minimalist

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
│   │   └── useSocket.ts     # Socket.io React hook
│   └── lib/                  # Shared utilities
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

## License

MIT
