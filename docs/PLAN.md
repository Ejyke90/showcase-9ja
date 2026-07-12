# Showcase Nigeria v2 — Architecture & Plan

## Overview
"Showcase Nigeria" is a fun, mobile-responsive React TypeScript quiz web app covering 6 Nigerian cultural categories. Supports solo play (with localStorage progress) and WebSocket-powered multiplayer rooms. Single deployable unit — the Node.js server serves both the API/WebSocket and the compiled React frontend static files.

---

## Project Structure

```
v2/                        ← root = the server
├── src/                   ← Node.js backend source
│   ├── types/             ← room.ts, events.ts
│   ├── routes/            ← questions.ts, leaderboard.ts
│   └── socket/            ← roomManager.ts, handlers.ts
│   └── app.ts             ← Express app factory
│   └── index.ts           ← HTTP server entry point (port 3001)
├── data/                  ← 120 Nigerian quiz questions (6 × 20 JSON)
├── docs/                  ← This file + additional docs
├── client/                ← React TypeScript frontend (Vite)
│   ├── src/
│   │   ├── types/         ← quiz.ts, multiplayer.ts, progress.ts
│   │   ├── data/          ← local question JSONs (same as /data/)
│   │   ├── context/       ← GameContext.tsx, SocketContext.tsx
│   │   ├── hooks/         ← useLocalStorage, useProgress, useTimer, useRoom
│   │   ├── components/
│   │   │   ├── ui/        ← BottomNav, CategoryCard, ProgressRing, ConfettiBlast, NaijaLoader
│   │   │   ├── quiz/      ← QuestionCard, AnswerButton, TimerBar, ScoreDisplay, ResultsScreen
│   │   │   └── multiplayer/ ← RoomLobby, PlayerList, RoomCodeDisplay, LiveScoreboard
│   │   └── pages/         ← Home, Categories, QuizPlay, MultiplayerHub, Leaderboard, Profile
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts     ← build outDir: ../dist/client; dev proxy → :3001
│   └── tsconfig.json
├── package.json           ← server deps + workspace scripts
├── tsconfig.json          ← backend TypeScript config
└── Dockerfile             ← multi-stage build → single image
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend build | Vite 8 + @vitejs/plugin-react |
| Styling | Tailwind CSS v4 (`@import "tailwindcss"`) |
| Animation | Framer Motion 12 |
| Icons | Lucide React |
| WebSocket client | socket.io-client |
| Backend runtime | Node.js 20 + Express |
| WebSocket server | socket.io |
| Language | TypeScript throughout |

**Brand colors:** Nigerian Green `#008751` · Festive Gold `#F4B400`

---

## Data Strategy

120 curated Nigerian quiz questions (20 per category) stored as JSON in `/data/`. Live scraping of jeopardylabs.com is not used — CORS blocks it and scraping is fragile. Questions align with Nigerian topics browseable at that URL.

**Categories:** food · music · culture · sports · geography · nollywood

---

## WebSocket Event Protocol

```
Client → Server:
  create_room    { username, categoryId }
  join_room      { roomCode, username }
  start_game     { roomCode }              ← host only
  submit_answer  { roomCode, questionId, optionId }
  leave_room     { roomCode }

Server → Client:
  room_joined    { room }
  room_updated   { room }
  game_countdown { startsIn: number }
  new_question   { question, index, total, deadline }
  answer_result  { correct, correctOptionId, pointsEarned, newScore }
  player_answered { username, answeredCount, totalPlayers }
  round_end      { scores[], nextQuestionIn: number }
  game_over      { finalScores[], winner }
  player_left    { username, room }
  error          { message }
```

**Speed bonus scoring:** `points = round(basePoints × (remainingMs/30000) / 10) × 10`, minimum 10 pts for correct answer.

---

## Modes

### Solo Mode (primary)
- User picks category → answers 10 timed questions (30s each)
- No account needed, fully offline-capable once loaded
- Progress saved to `localStorage` key `showcase_nigeria_v2`

### Multiplayer Mode (optional)
- Player A creates room → gets 6-char code
- Players B, C... join via code
- Host starts game → all see same question simultaneously
- Server owns timing (30s/question), broadcasts scores in real-time
- Reconnect: frontend checks `localStorage` for pending room on socket reconnect

---

## Deployment Strategy

`npm run build` in client outputs to `../dist/client/`. Express serves this as static files in production. **One Docker image, one port, one deployment.**

```dockerfile
# Multi-stage: build client → build server → combine into final image
FROM node:20-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build           # → /app/dist/client/

FROM node:20-alpine AS server-build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY src/ ./src/
COPY tsconfig.json ./
RUN npm run build           # → /app/dist/

FROM node:20-alpine
WORKDIR /app
COPY --from=server-build /app/dist ./dist
COPY --from=client-build /app/dist/client ./dist/client
COPY package*.json ./
COPY data/ ./data/
RUN npm ci --omit=dev
ENV NODE_ENV=production PORT=3001
EXPOSE 3001
CMD ["node", "dist/index.js"]
```

---

## LocalStorage Schema

```json
{
  "username": "Chukwuemeka",
  "totalScore": 4200,
  "currentStreak": 3,
  "longestStreak": 7,
  "lastActivityDate": "2026-07-12",
  "totalGamesPlayed": 18,
  "badges": ["food_master", "first_win", "streak_5"],
  "categories": {
    "food": { "completed": true, "highScore": 850, "totalPlays": 4, "lastPlayedAt": 1752278400000 },
    "music": { "completed": false, "highScore": 0, "totalPlays": 0, "lastPlayedAt": null }
  }
}
```

---

## Dark Mode

Dark mode uses a class-based approach compatible with Tailwind CSS v4.

### Implementation

**CSS** (`client/src/index.css`):
```css
@variant dark (&:where(.dark, .dark *));
```
Tailwind's `dark:` prefix applies when the `.dark` class is present on `<html>`.

**Hook** (`client/src/hooks/useDarkMode.ts`):
- Reads initial theme from `localStorage` key `snv2_theme`, falls back to `prefers-color-scheme`
- Toggles `.dark` on `document.documentElement`
- Persists selection to `localStorage`

**Context** (`client/src/App.tsx`):
```typescript
export const DarkModeContext = createContext<{ isDark: boolean; toggle: () => void }>(...);
export const useDark = () => useContext(DarkModeContext);
```

**Toggle button:** Lives in the Profile page header (top-right corner) — Sun/Moon icon from Lucide React, switches on tap.

### Color Mapping

| Light | Dark |
|---|---|
| `bg-gray-50` (app shell) | `dark:bg-gray-950` |
| `bg-white` (cards) | `dark:bg-gray-800` |
| `border-gray-100` | `dark:border-gray-700` |
| `text-gray-900` (headings) | `dark:text-white` |
| `text-gray-400/500` (muted) | `dark:text-gray-500` |
| `bg-gray-50` (inputs) | `dark:bg-gray-800` |
| `bg-white` (nav) | `dark:bg-gray-900` |

Brand colors (`nigerian-green`, `festive-gold`) remain unchanged in dark mode — they already work on dark backgrounds.

---

## Dev Commands

```bash
# From v2/ root:
npm run dev:server    # ts-node-dev src/index.ts → :3001
npm run dev:client    # cd client && vite → :5173 (proxies to :3001)

# Build for production:
npm run build         # builds client then server
npm start             # node dist/index.js (serves everything on :3001)
```
