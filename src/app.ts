import express from 'express';
import cors from 'cors';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import questionsRouter from './routes/questions.js';
import leaderboardRouter from './routes/leaderboard.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export function createApp() {
  const app = express();

  app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173' }));
  app.use(express.json());

  app.use('/api/questions', questionsRouter);
  app.use('/api/leaderboard', leaderboardRouter);

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, timestamp: new Date().toISOString() });
  });

  // Serve built client assets when dist/client exists (production build)
  const clientPath = resolve(__dirname, 'client');
  if (existsSync(clientPath)) {
    app.use(express.static(clientPath));
    app.get('*', (_req, res) => {
      res.sendFile(join(clientPath, 'index.html'));
    });
  }

  return app;
}
