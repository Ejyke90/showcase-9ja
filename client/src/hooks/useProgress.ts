import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { DEFAULT_PROGRESS, BADGES, type UserProgress } from '../types/progress';
import type { CategoryId, QuizResult } from '../types/quiz';

const STORAGE_KEY = 'showcase_nigeria_v2';

function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

function updateStreak(progress: UserProgress): UserProgress {
  const today = todayStr();
  if (progress.lastActivityDate === today) return progress;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const newStreak =
    progress.lastActivityDate === yesterdayStr ? progress.currentStreak + 1 : 1;
  const longestStreak = Math.max(progress.longestStreak, newStreak);

  return { ...progress, currentStreak: newStreak, longestStreak, lastActivityDate: today };
}

function checkBadges(progress: UserProgress): string[] {
  const earned = BADGES.filter(b => b.condition(progress)).map(b => b.id);
  const existing = new Set(progress.badges);
  const newBadges = earned.filter(id => !existing.has(id));
  return newBadges.length > 0 ? [...progress.badges, ...newBadges] : progress.badges;
}

export function useProgress() {
  const [progress, setProgress] = useLocalStorage<UserProgress>(STORAGE_KEY, DEFAULT_PROGRESS);

  const setUsername = useCallback(
    (username: string) => {
      setProgress(p => ({ ...p, username }));
    },
    [setProgress]
  );

  const recordResult = useCallback(
    (result: QuizResult) => {
      setProgress(prev => {
        const streaked = updateStreak(prev);
        const catPrev = streaked.categories[result.categoryId];
        const newHighScore = Math.max(catPrev?.highScore ?? 0, result.score);
        const completed = result.correctCount / result.totalQuestions >= 0.6;

        const updated: UserProgress = {
          ...streaked,
          totalScore: streaked.totalScore + result.score,
          totalGamesPlayed: streaked.totalGamesPlayed + 1,
          categories: {
            ...streaked.categories,
            [result.categoryId]: {
              categoryId: result.categoryId as CategoryId,
              completed: catPrev?.completed || completed,
              highScore: newHighScore,
              totalPlays: (catPrev?.totalPlays ?? 0) + 1,
              lastPlayedAt: result.completedAt,
            },
          },
        };

        return { ...updated, badges: checkBadges(updated) };
      });
    },
    [setProgress]
  );

  const getNewBadges = useCallback(
    (before: string[], after: string[]): string[] => {
      const set = new Set(before);
      return after.filter(id => !set.has(id));
    },
    []
  );

  return { progress, setProgress, setUsername, recordResult, getNewBadges };
}
