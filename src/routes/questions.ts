import { Router } from 'express';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const router = Router();

const CATEGORIES = ['food', 'music', 'culture', 'sports', 'geography', 'nollywood', 'history', 'fashion', 'linguistics'] as const;

function loadCategory(categoryId: string) {
  const filePath = join(__dirname, '../../data', `${categoryId}.json`);
  return JSON.parse(readFileSync(filePath, 'utf-8'));
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

router.get('/', (_req, res) => {
  const all = CATEGORIES.flatMap(cat => loadCategory(cat));
  res.json({ questions: shuffle(all).slice(0, 10) });
});

router.get('/:categoryId', (req, res) => {
  const { categoryId } = req.params;
  if (!CATEGORIES.includes(categoryId as typeof CATEGORIES[number])) {
    res.status(404).json({ error: 'Category not found' });
    return;
  }
  const questions = shuffle(loadCategory(categoryId)).slice(0, 10);
  res.json({ questions });
});

router.get('/:categoryId/all', (req, res) => {
  const { categoryId } = req.params;
  if (!CATEGORIES.includes(categoryId as typeof CATEGORIES[number])) {
    res.status(404).json({ error: 'Category not found' });
    return;
  }
  res.json({ questions: loadCategory(categoryId) });
});

export default router;
