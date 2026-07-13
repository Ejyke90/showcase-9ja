import type { CategoryId } from './quiz';

export interface CategoryProgress {
  categoryId: CategoryId;
  completed: boolean;
  highScore: number;
  totalPlays: number;
  lastPlayedAt: number | null;
}

export interface UserProgress {
  username: string;
  totalScore: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  totalGamesPlayed: number;
  categories: Record<CategoryId, CategoryProgress>;
  badges: string[];
}

export interface Badge {
  id: string;
  label: string;
  description: string;
  emoji: string;
  condition: (progress: UserProgress) => boolean;
}

export const BADGES: Badge[] = [
  {
    id: 'first_win',
    label: 'First Win',
    description: 'Complete your first quiz',
    emoji: '🏆',
    condition: p => p.totalGamesPlayed >= 1,
  },
  {
    id: 'food_master',
    label: 'Food Lover',
    description: 'Score 80%+ in Nigerian Food',
    emoji: '🍲',
    condition: p => (p.categories.food?.highScore ?? 0) >= 800,
  },
  {
    id: 'music_maestro',
    label: 'Music Maestro',
    description: 'Score 80%+ in Music & Dance',
    emoji: '🎵',
    condition: p => (p.categories.music?.highScore ?? 0) >= 800,
  },
  {
    id: 'culture_keeper',
    label: 'Culture Keeper',
    description: 'Score 80%+ in Culture & Traditions',
    emoji: '🎭',
    condition: p => (p.categories.culture?.highScore ?? 0) >= 800,
  },
  {
    id: 'sports_fan',
    label: 'Sports Fan',
    description: 'Score 80%+ in Sports',
    emoji: '⚽',
    condition: p => (p.categories.sports?.highScore ?? 0) >= 800,
  },
  {
    id: 'geo_wizard',
    label: 'Geo Wizard',
    description: 'Score 80%+ in Geography',
    emoji: '🗺️',
    condition: p => (p.categories.geography?.highScore ?? 0) >= 800,
  },
  {
    id: 'nolly_star',
    label: 'Nolly Star',
    description: 'Score 80%+ in Nollywood',
    emoji: '🎬',
    condition: p => (p.categories.nollywood?.highScore ?? 0) >= 800,
  },
  {
    id: 'all_rounder',
    label: 'All Rounder',
    description: 'Complete all 6 categories',
    emoji: '🌟',
    condition: p =>
      Object.values(p.categories).filter(c => c.completed).length >= 6,
  },
  {
    id: 'streak_3',
    label: '3-Day Streak',
    description: 'Play 3 days in a row',
    emoji: '🔥',
    condition: p => p.longestStreak >= 3,
  },
  {
    id: 'streak_7',
    label: '7-Day Streak',
    description: 'Play 7 days in a row',
    emoji: '⚡',
    condition: p => p.longestStreak >= 7,
  },
  {
    id: 'naija_guru',
    label: 'Naija Guru',
    description: 'Play 20+ games total',
    emoji: '🦅',
    condition: p => p.totalGamesPlayed >= 20,
  },
];

export const DEFAULT_PROGRESS: UserProgress = {
  username: '',
  totalScore: 0,
  currentStreak: 1,
  longestStreak: 1,
  lastActivityDate: new Date().toISOString().split('T')[0],
  totalGamesPlayed: 0,
  categories: {
    food: { categoryId: 'food', completed: false, highScore: 0, totalPlays: 0, lastPlayedAt: null },
    music: { categoryId: 'music', completed: false, highScore: 0, totalPlays: 0, lastPlayedAt: null },
    culture: { categoryId: 'culture', completed: false, highScore: 0, totalPlays: 0, lastPlayedAt: null },
    sports: { categoryId: 'sports', completed: false, highScore: 0, totalPlays: 0, lastPlayedAt: null },
    geography: { categoryId: 'geography', completed: false, highScore: 0, totalPlays: 0, lastPlayedAt: null },
    nollywood: { categoryId: 'nollywood', completed: false, highScore: 0, totalPlays: 0, lastPlayedAt: null },
    history: { categoryId: 'history', completed: false, highScore: 0, totalPlays: 0, lastPlayedAt: null },
    fashion: { categoryId: 'fashion', completed: false, highScore: 0, totalPlays: 0, lastPlayedAt: null },
    linguistics: { categoryId: 'linguistics', completed: false, highScore: 0, totalPlays: 0, lastPlayedAt: null },
  },
  badges: [],
};
