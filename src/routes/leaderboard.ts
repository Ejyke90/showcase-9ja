import { Router } from 'express';

const router = Router();

// In-memory leaderboard — resets on server restart
// In production, replace with a database
const entries: { username: string; score: number; category: string; timestamp: number }[] = [];

router.get('/', (_req, res) => {
  const sorted = [...entries]
    .sort((a, b) => b.score - a.score)
    .slice(0, 50);
  res.json({ leaderboard: sorted });
});

router.post('/', (req, res) => {
  const { username, score, category } = req.body as {
    username: string;
    score: number;
    category: string;
  };
  if (!username || typeof score !== 'number' || !category) {
    res.status(400).json({ error: 'username, score, and category are required' });
    return;
  }
  const entry = { username: username.slice(0, 20), score, category, timestamp: Date.now() };
  entries.push(entry);
  res.json({ ok: true, entry });
});

export default router;
