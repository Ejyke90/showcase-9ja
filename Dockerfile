# ─── Stage 1: Build React client ─────────────────────────────────────────────
FROM node:20-alpine AS client-build
WORKDIR /app/client

COPY client/package*.json ./
RUN npm ci

COPY client/ ./
# Build outputs to ./dist (resolved as /app/client/dist)
RUN npm run build

# ─── Stage 2: Build Node server ───────────────────────────────────────────────
FROM node:20-alpine AS server-build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY src/ ./src/
COPY tsconfig.json ./
# tsc compiles src/ → dist/
RUN npm run build:server

# ─── Stage 3: Production image ────────────────────────────────────────────────
FROM node:20-alpine
WORKDIR /app

# Server compiled JS
COPY --from=server-build /app/dist ./dist

# Client static files built into /app/client/dist by Vite
COPY --from=client-build /app/client/dist ./client/dist

# Question data
COPY data/ ./data/

# Production deps only
COPY package*.json ./
RUN npm ci --omit=dev

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD wget -qO- http://localhost:3001/api/health || exit 1

CMD ["node", "dist/index.js"]
