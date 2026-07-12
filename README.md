# Showcase Nigeria 🇳🇬

A stylish Nigerian culture quiz app with solo play, multiplayer rooms, and progress tracking.

**Categories:** Food · Music · Culture · Sports · Geography · Nollywood

---

## Requirements

- Node.js 20+
- npm 9+

---

## Setup

```bash
# 1. Clone / navigate to this folder
cd v2

# 2. Install server dependencies
npm install

# 3. Install client dependencies
cd client && npm install && cd ..

# 4. Copy env file and configure
cp .env.example .env
```

Edit `.env` — at minimum set `PORT`:

```env
PORT=4000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173

VITE_APP_NAME=Showcase Nigeria
VITE_API_BASE=/api
```

---

## Development

Run server and client in **separate terminals**:

```bash
# Terminal 1 — backend (hot reload)
npm run dev:server

# Terminal 2 — frontend (Vite HMR)
npm run dev:client
```

Open **http://localhost:5173**

> The Vite dev server proxies `/api` and `/socket.io` to the backend port defined in `.env`.

---

## Production Build

```bash
# Build client into dist/client/ then compile server TS
npm run build

# Start the server (serves frontend + API + WebSocket on one port)
npm start
```

Open **http://localhost:PORT** (e.g. http://localhost:4000)

---

## Docker

```bash
# Build image
docker build -t showcase-nigeria .

# Run container
docker run -p 4000:3001 --env-file .env showcase-nigeria
```

Open **http://localhost:4000**

---

## Project Structure

```
v2/
├── src/          Node.js + Express + socket.io backend
├── data/         120 Nigerian quiz questions (6 × 20 JSON)
├── client/       React + TypeScript frontend (Vite)
├── docs/         Architecture plan
├── dist/         Production build output (gitignored)
├── .env          Environment variables (gitignored)
├── .env.example  Template — copy to .env
└── Dockerfile    Multi-stage production image
```

---

## Multiplayer

1. Open the app → tap **Multiplayer**
2. Create a room, pick a category
3. Share the 6-character room code with friends
4. Host taps **Start** when everyone has joined
5. All players answer the same question simultaneously — speed earns bonus points

---

## Solo Play

Tap **Play** → pick a category → answer 10 questions in 30 seconds each.  
Progress, high scores, streaks, and badges saved to `localStorage`.
