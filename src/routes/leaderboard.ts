import { Router } from 'express';
import { sql } from '../db.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const rows = await sql`
      SELECT username, score, category, timestamp
      FROM leaderboard
      ORDER BY score DESC
      LIMIT 50
    `;
    res.json({ leaderboard: rows });
  } catch (err) {
    console.error('[leaderboard GET]', err);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

router.post('/', async (req, res) => {
  const { username, score, category } = req.body as {
    username: string;
    score: number;
    category: string;
  };
  if (!username || typeof score !== 'number' || !category) {
    res.status(400).json({ error: 'username, score, and category are required' });
    return;
  }
  try {
    const timestamp = Date.now();
    const [entry] = await sql`
      INSERT INTO leaderboard (username, score, category, timestamp)
      VALUES (${username.slice(0, 20)}, ${score}, ${category}, ${timestamp})
      RETURNING username, score, category, timestamp
    `;
    res.json({ ok: true, entry });
  } catch (err) {
    console.error('[leaderboard POST]', err);
    res.status(500).json({ error: 'Failed to save score' });
  }
});

export default router;
