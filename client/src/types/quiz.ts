export type CategoryId = 'food' | 'music' | 'culture' | 'sports' | 'geography' | 'nollywood' | 'history' | 'fashion' | 'linguistics';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type QuizMode = 'solo' | 'multiplayer';

export interface QuizOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  categoryId: CategoryId;
  question: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
  difficulty: Difficulty;
  pointValue: number;
}

export interface Category {
  id: CategoryId;
  label: string;
  emoji: string;
  imageUrl: string;
  description: string;
  color: string;
  bgGradient: string;
}

export interface QuizSession {
  mode: QuizMode;
  categoryId: CategoryId;
  questions: Question[];
  currentIndex: number;
  answers: Record<string, string | null>;
  startedAt: number;
  finishedAt: number | null;
}

export interface QuizResult {
  categoryId: CategoryId;
  score: number;
  totalPossible: number;
  correctCount: number;
  totalQuestions: number;
  timeTaken: number;
  completedAt: number;
}

import foodImg from '../assets/food.png';
import musicImg from '../assets/music.jpg';
import cultureImg from '../assets/culture.jpg';
import sportsImg from '../assets/sports.png';
import geographyImg from '../assets/geography.jpg';
import nollywoodImg from '../assets/nollywood.png';

export const CATEGORIES: Category[] = [
  {
    id: 'food',
    label: 'Nigerian Food',
    emoji: '🍲',
    imageUrl: foodImg,
    description: 'Jollof, Egusi, Suya & beyond',
    color: 'bg-orange-500',
    bgGradient: 'from-orange-600 to-red-600',
  },
  {
    id: 'music',
    label: 'Music & Dance',
    emoji: '🎵',
    imageUrl: musicImg,
    description: 'Afrobeats, Jùjú & legends',
    color: 'bg-purple-600',
    bgGradient: 'from-purple-600 to-pink-600',
  },
  {
    id: 'culture',
    label: 'Culture & Traditions',
    emoji: '🎭',
    imageUrl: cultureImg,
    description: 'Festivals, customs & slang',
    color: 'bg-emerald-600',
    bgGradient: 'from-emerald-600 to-teal-600',
  },
  {
    id: 'sports',
    label: 'Sports',
    emoji: '⚽',
    imageUrl: sportsImg,
    description: 'Super Eagles, athletes & glory',
    color: 'bg-blue-600',
    bgGradient: 'from-blue-600 to-indigo-600',
  },
  {
    id: 'geography',
    label: 'Geography',
    emoji: '🗺️',
    imageUrl: geographyImg,
    description: 'States, rivers & landmarks',
    color: 'bg-green-600',
    bgGradient: 'from-green-700 to-emerald-500',
  },
  {
    id: 'nollywood',
    label: 'Nollywood',
    emoji: '🎬',
    imageUrl: nollywoodImg,
    description: 'Films, actors & the industry',
    color: 'bg-red-600',
    bgGradient: 'from-red-600 to-rose-600',
  },
  {
    id: 'history',
    label: 'History',
    emoji: '📜',
    imageUrl: cultureImg,
    description: 'Independence, empires & presidents',
    color: 'bg-amber-700',
    bgGradient: 'from-amber-700 to-yellow-600',
  },
  {
    id: 'fashion',
    label: 'Fashion',
    emoji: '👗',
    imageUrl: cultureImg,
    description: 'Ankara, Agbada, Gele & designers',
    color: 'bg-pink-600',
    bgGradient: 'from-pink-600 to-fuchsia-600',
  },
  {
    id: 'linguistics',
    label: 'Languages',
    emoji: '🗣️',
    imageUrl: geographyImg,
    description: 'Naija Pidgin, slang & 521 languages',
    color: 'bg-cyan-600',
    bgGradient: 'from-cyan-600 to-teal-500',
  },
];
